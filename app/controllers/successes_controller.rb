
class SuccessesController < ApplicationController

  # respond_to(:html, :js, :json)

  before_action(except: [:index, :create, :import]) { @success = Success.find(params[:id]) }
  skip_before_action(
    :verify_authenticity_token,
    only: [:create],
    if: -> { params[:zap].present? }
  )

  def index
    company = Company.find_by(subdomain: request.subdomain)
    # data = Rails.cache.fetch("#{company.subdomain}/dt-successes") do
    data = company.successes.to_json({
        only: [:id, :name, :description],
        methods: [:display_status, :referrer, :contact, :timestamp],
        include: {
          curator: { only: [:id], methods: [:full_name] },
          customer: { only: [:id, :name, :slug] },
          story: { only: [:id, :title, :slug] }
        }
      })
    # end
    respond_to { |format| format.json { render({ json: data }) } }
  end

  def create
    @company = Company.find_by(subdomain: request.subdomain) || current_user.company
    unless params[:zap].present? && ignore_zap?(params[:success])
      # use customer name and user emails to find id attributes
      find_existing_customer(params[:success][:customer_attributes], params[:zap].present?)
      find_existing_users(
        params[:success][:contributions_attributes]['0'][:referrer_attributes],
        params[:success][:contributions_attributes]['1'][:contributor_attributes],
        params[:zap].present?
      )
      @success = Success.new(success_params)
      if @success.save
      else
        pp @success.errors.full_messages
      end
    end
    if params[:zap].present?
      respond_to do |format|
        format.any do
          render({
            json: {
              status: @success && @success.persisted? ? "success" : "error"
            }
          })
        end
      end
    else
      respond_to { |format| format.js {} }
    end
  end

  def import
    @company = Company.find(params[:id])
    @successes = []
    success_lookup = {}   # { name: { id: 1, customer_id: 1 } }
    customer_lookup = {}  # { name: id }
    user_lookup = {}      # { email: id }
    template_lookup = {}  # { name: id }

    params[:imported_successes].each do |success_index, imported_success|

      if customer_id = dup_customer?(imported_success, customer_lookup)
        imported_success[:customer_id] = customer_id
        imported_success.except!(:customer_attributes)
      end

      referrer_email = contact_email = ''
      referrer_template = contact_template = ''
      ['referrer', 'contributor'].each do |contact_type|
        # if a referrer/contact, look for id in user_lookup
        if (email = dig_contact_email(success, contact_type))
          contact_type == 'referrer' ? referrer_email = email : contact_email = email
        end
        if (template = dig_contact_template(success, contact_type))
          contact_type == 'referrer' ? referrer_template = template : contact_template = template
        end
      end

      imported_success = add_dup_data(imported_success, user_lookup, template_lookup)

      if (imported_success_id = dup_success?(imported_success, success_lookup))
        imported_success[:contributions_attributes].each do |index, contribution_attrs|
          Contribution.create(
            contribution_attrs.merge({ success_id: imported_success_id })
          )
        end
      else
        params[:success] = imported_success
        success = Success.new(success_params)
        success.save(validate: false)  # no validate makes for faster execution
        @successes << success
      end

      # reload to capture any additional contributions
      @successes.each { |s| s.reload }

      # add entries to the lookup tables
      success_lookup[success.try(:name)] ||= success.try(:id)
      customer_lookup[customer_name] ||= success.customer_id
      [referrer_email, contact_email].each_with_index do |email, index|
        if email.present? && !user_lookup.has_key?(email)
          user_lookup[email] = (index == 0 ? success.referrer[:id] : success.contact[:id])
        end
      end
      [referrer_template, contact_template].each do |template|
        if template.present? && !template_lookup.has_key?(template)
          template_lookup[template] = CrowdsourcingTemplate.where(name: template, company_id: @company.id).take.id
        end
      end
    end
    respond_to { |format| format.js { render({ action: 'import' }) } }
  end

  def update
    @success.update(success_params)
    respond_to { |format| format.js {} }
  end

  def destroy
    @success.destroy
    respond_to do |format|
      format.json { render({ json: @success.to_json({ only: [:id] }) }) }
    end
  end

  private

  # status will be present in case of csv upload
  def success_params
    params.require(:success).permit(
      :name, :description, :customer_id, :curator_id,
      customer_attributes: [:id, :name, :company_id],
      contributions_attributes: [
        :referrer_id, :contributor_id, :crowdsourcing_template_id, :success_contact,
        crowdsourcing_template_attributes: [:name, :company_id],
        referrer_attributes: [
          :id, :email, :first_name, :last_name, :title, :phone, :sign_up_code, :password
        ],
        contributor_attributes: [
          :id, :email, :first_name, :last_name, :title, :phone, :sign_up_code, :password
        ]
      ]
    )
  end

  # for activerecord-import ...
  # 2exp2 signatures for an imported success (each requires its own .import statement)
  # Success.import(import_signature_1(params[:imported_successes]), on_duplicate_key_updatevalidate: false)
  # Success.import(import_signature_2(params[:imported_successes]), validate: false)
  # Success.import(import_signature_3(params[:imported_successes]), validate: false)
  # Success.import(import_signature_4(params[:imported_successes]), validate: false)
  #
  # both new
  def import_signature_1 (imported_successes)
    successes = []
    imported_successes.to_a.map { |s| s[1] }.keep_if do |s|
      s[:contributions_attributes]['0'][:referrer_attributes].has_key?(:password) &&
      s[:contributions_attributes]['1'][:contributor_attributes].has_key?(:password)
    end
      .each do |success|
        # params[:success] = success
        successes << Success.create(success)
      end
    # binding.remote_pry
    successes
  end

  # one existing, one new
  def import_signature_2 (imported_successes)
    successes = []
    imported_successes.to_a.map { |s| s[1] }.keep_if do |s|
      !s[:contributions_attributes]['0'][:referrer_attributes].has_key?(:password) &&
      s[:contributions_attributes]['1'][:contributor_attributes].has_key?(:password)
    end
      .each do |success|
        # params[:success] = success
        successes << Success.create(success)
      end
    # binding.remote_pry
    successes
  end

  # one new, one existing
  def import_signature_3 (imported_successes)
    successes = []
    imported_successes.to_a.map { |s| s[1] }.keep_if do |s|
      s[:contributions_attributes]['0'][:referrer_attributes].has_key?(:password) &&
      !s[:contributions_attributes]['1'][:contributor_attributes].has_key?(:password)
    end
      .each do |success|
        # params[:success] = success
        successes << Success.create(success)
      end
    # binding.remote_pry
    successes
  end

  # both existing
  def import_signature_4 (imported_successes)
    successes = []
    imported_successes.to_a.map { |s| s[1] }.keep_if do |s|
      !s[:contributions_attributes]['0'][:referrer_attributes].has_key?(:password) &&
      !s[:contributions_attributes]['1'][:contributor_attributes].has_key?(:password)
    end
      .each do |success|
        # params[:success] = success
        successes << Success.create(success)
      end
    successes
  end

  # method receives params[:success][:customer_attributes] and either
  # - finds customer, or
  # - provides company_id for the new customer
  def find_existing_customer (customer_params, is_zap)
    if is_zap || !is_zap  # works for either
      if (customer = Customer.where(name: customer_params[:name], company_id: current_user.company_id).take)
        customer_params[:id] = customer.id
        customer_params.delete_if { |k, v| k != 'id' }
      else
        customer_params[:company_id] = current_user.company_id
      end
    else
    end
  end

  def find_existing_users (referrer_params, contributor_params, is_zap)
    if is_zap || !is_zap  # works for either
      if (referrer = User.find_by_email(referrer_params[:email]))
        referrer_params[:id] = referrer.id
        # allow certain attribute updates
        referrer_params.delete_if { |k, v| !['id', 'title', 'phone'].include?(k) }
      end
      if (contributor = User.find_by_email(contributor_params[:email]))
        contributor_params[:id] = contributor.id
        contributor_params.delete_if { |k, v| !['id', 'title', 'phone'].include?(k) }
      end
    end
  end

  # find a success previously created in this import and return id
  def dup_success (success, success_lookup)
    success[:customer_id].present? &&
    success[:customer_id] == success_lookup.dig(success[:name], :customer_id) &&
    success_lookup[success[:name]][:id]  # return the id
  end

  # find a customer previously created in this import and return id
  def dup_customer (success, customer_lookup)
    success.dig(:customer_attributes, :name) && customer_lookup[customer_name]
  end

  # fill in the id of an existing user, and removes the referrer/contributor_attributes hash
  def add_dup_contact (success, contact_type, user_id)
    contribution_index = success[:contributions_attributes].select do |index, contribution|
      contribution.has_key?("#{contact_type}_attributes")
    end.keys[0]
    success[:contributions_attributes][contribution_index]["#{contact_type}_id"] = user_id
    success[:contributions_attributes][contribution_index].except!("#{contact_type}_attributes")
    success
  end

  # fill in the id of an existing template, and remove crowdsourcing_template_attributes hash
  def add_dup_template (success, contact_type, template_id)
    contribution_index = success[:contributions_attributes].select do |index, contribution|
      contribution.has_key?("#{contact_type}_attributes")
    end.keys[0]
    success[:contributions_attributes][contribution_index][:crowdsourcing_template_id] = template_id
    success[:contributions_attributes][contribution_index].except!([:crowdsourcing_template_attributes])
    success
  end

  def add_dup_data (success, user_lookup, template_lookup, referrer_email, contact_email, referrer_template, contact_template)
    ['referrer', 'contributor'].each do |contact_type|
      email = contact_type == 'referrer' ? referrer_email : contact_email
      template = contact_type == 'referrer' ? referrer_template : contact_template
      if (user_id = user_lookup[email])
        success = add_dup_contact(success, contact_type, user_id)
      end
      if (template_id = template_lookup[template])
        success = add_dup_template(success, contact_type, template_id)
      end
    end
    success
  end

  # takes an imported success and extracts referrer/contributor email (if it exists)
  def dig_contact_email (success, contact_type)
    success.dig(:contributions_attributes, '0', "#{contact_type}_attributes", :email) ||
    success.dig(:contributions_attributes, '1', "#{contact_type}_attributes", :email)
  end

  def dig_contact_template (success, contact_type)
    contribution_index = success[:contributions_attributes].select do |index, contribution|
      contribution.has_key?("#{contact_type}_id") ||
      contribution.has_key?("#{contact_type}_attributes")
    end.keys[0]
    success.dig(
      :contributions_attributes,
      contribution_index,
      :crowdsourcing_template_attributes,
      :name
    )
  end

  def ignore_zap? (success)
    # dup success (name) and customer combination
    # (customer_id is available since this runs after find_existing_customer_from_zap
    if Success.joins(:customer)
              .where(name: success[:name])
              .where(customers: { id: success[:customer_id] })
              .present?
      true
    else
      false
    end
  end

end