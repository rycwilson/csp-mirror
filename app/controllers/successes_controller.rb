require 'successes_and_contributions'
class SuccessesController < ApplicationController
  include SuccessesAndContributions

  respond_to(:html, :js, :json)

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
        only: [:id, :name],
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

  def show
    # binding.remote_pry
    success = Success.find(params[:id])
    data = {
      success: {
        id: success.id,
        win_story: success.description
      }
    }
    # binding.remote_pry
    respond_to { |format| format.json { render({ json: data }) } }

    # The win story rendering will be done in the client, because we don't want to request
    # this template every time an edit is made
    # render(:win_story, layout: false)
  end

  def create
    # puts 'successes#create'
    @company = Company.find_by(subdomain: request.subdomain) || current_user.company

    params[:success][:customer_attributes] = find_dup_customer(
      success_params.to_h.dig(:customer_attributes),
      params[:zap].present?,
      current_user
    )

    if params[:success].dig(:contributions_attributes, '0', :referrer_attributes).present?
      params[:success][:contributions_attributes]['0'][:referrer_attributes] = find_dup_user_and_split_full_name(
          success_params.to_h.dig(:contributions_attributes, '0', :referrer_attributes),
          params[:zap].present?
        )
      params[:success][:contributions_attributes].except!('0') if params[:success][:contributions_attributes]['0'][:referrer_attributes].blank?
    end

    if params[:success].dig(:contributions_attributes, '1', :contributor_attributes).present?
      params[:success][:contributions_attributes]['1'][:contributor_attributes] = find_dup_user_and_split_full_name(
          success_params.to_h.dig(:contributions_attributes, '1', :contributor_attributes),
          params[:zap].present?
        )
      params[:success][:contributions_attributes].except!('1') if params[:success][:contributions_attributes]['1'][:contributor_attributes].blank?
    end

    # pp success_params.to_h

    if params[:zap].present? && (@success = Success.find_by_id(find_dup_success(success_params.to_h)))
      # a new success entails two contributions, one for the contact and one for the referrer;
      # a duplicate success means a new contributor, i.e. one contribution only;
      # referrers only get a contribution when they refer the original customer contact
      @success = consolidate_contributions(@success)
      zap_status = 'success' if @success.update(success_params)
    else
      @success = Success.new(success_params)
      if @success.save
      else
        pp @success.errors.full_messages
      end
    end
    # end
    if params[:zap].present?
      respond_to do |format|
        format.any do
          render({
            json: {
              status: (@success && @success.persisted?) || zap_status == 'success' ? 'success' : 'error'
            }
          })
        end
      end
    else
      respond_to { |format| format.js {} }
    end
  end

  def import
    @company = Company.find(params[:company_id])
    @successes = []
    success_lookup = {}   # { name: { id: 1, customer_id: 1 } }
    customer_lookup = {}  # { name: id }
    user_lookup = {}      # { email: id }
    template_lookup = {}  # { name: id }

    params[:imported_successes].each do |success_index, imported_success|

      if (customer_id = find_dup_imported_customer(imported_success, customer_lookup))
        imported_success[:customer_id] = customer_id
        imported_success.except!(:customer_attributes)
      else
        imported_success.except!(:customer_id)
      end
      referrer_email = contact_email = ''
      referrer_template = contact_template = ''
      ['referrer', 'contributor'].each do |contact_type|
        # if a referrer/contact, look for id in user_lookup
        if (email = dig_contact_email(imported_success, contact_type))
          contact_type == 'referrer' ? referrer_email = email : contact_email = email
        end
        if (template = dig_contact_template(imported_success, contact_type))
          contact_type == 'referrer' ? referrer_template = template : contact_template = template
        end
      end

      imported_success = find_dup_imported_users_and_templates(
        imported_success, user_lookup, template_lookup, referrer_email, contact_email, referrer_template, contact_template
      )

      if (imported_success_id = find_dup_success(imported_success, success_lookup))
        new_contribution = build_contribution_from_import(imported_success, imported_success_id)
        # create a new contribution if a contributor is present (new or existing)
        if new_contribution[:contributor_attributes].present?
          params[:contribution] = new_contribution
          Contribution.create(contribution_params)
        else
          # ignore this imported success
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
      # if a success wasn't saved, that implies duplicate success/customer => no lookup addition necessary
      if success.present? && !success_lookup.has_key?(success.name)
        success_lookup[success.name] = { id: success.id, customer_id: success.customer_id }
        # this one needs to be conditional since possible this is dup customer
        customer_lookup[success.customer.name] ||= success.customer_id
      end

      [referrer_email, contact_email].each_with_index do |email, index|
        if success.present? && email.present?
          user_lookup[email] ||= (index == 0 ? success.referrer[:id] : success.contact[:id])
        elsif email.present?
          # binding.remote_pry
          user_lookup[email] ||= User.find_by_email(email).id
        end
      end

      [referrer_template, contact_template].each do |template|
        if template.present?
          # binding.remote_pry if imported_success[:name] == "Amazon Wins with Acme"
          template_lookup[template] ||= InvitationTemplate.where(name: template, company_id: @company.id).take.id
        end
      end
    end
    respond_to { |format| format.js { render({ action: 'import' }) } }
  end

  def update
    # binding.remote_pry
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
        :referrer_id, :contributor_id, :invitation_template_id, :success_contact,
        invitation_template_attributes: [:name, :company_id],
        referrer_attributes: [
          :id, :email, :first_name, :last_name, :title, :phone, :sign_up_code, :password
        ],
        contributor_attributes: [
          :id, :email, :first_name, :last_name, :title, :phone, :sign_up_code, :password
        ]
      ]
    )
  end

  def contribution_params
    params.require(:contribution).permit(
      :contributor_id, :referrer_id, :success_id, :invitation_template_id,
      :status, :contribution, :feedback, :publish_contributor, :success_contact,
      :request_subject, :request_body,
      :contributor_unpublished, :notes, :submitted_at,
      success_attributes: [
        :id, :name, :customer_id, :curator_id,
        customer_attributes: [:id, :name, :company_id]
      ],
      contributor_attributes: [
        :id, :email, :first_name, :last_name, :title, :phone, :linkedin_url, :sign_up_code, :password
      ],
      referrer_attributes: [
        :id, :email, :first_name, :last_name, :title, :phone, :sign_up_code, :password
      ]
    )
  end

  # method receives params[:success][:customer_attributes] and either
  # - finds customer, or
  # - provides company_id for the new customer
  # def self.find_dup_customer (customer_params, is_zap, current_user)
  #   if is_zap || !is_zap  # works for either
  #     if (customer = Customer.where(name: customer_params.try(:[], :name), company_id: current_user.company_id).take)
  #       customer_params[:id] = customer.id
  #       customer_params.delete_if { |k, v| k != 'id' }
  #     else
  #       customer_params[:company_id] = current_user.company_id
  #     end
  #   else
  #   end
  # end

  # def self.find_dup_users (referrer_params, contributor_params, is_zap)
  #   if is_zap || !is_zap  # works for either
  #     if (referrer = User.find_by_email(referrer_params.try(:[], :email)))
  #       referrer_params[:id] = referrer.id
  #       # allow certain attribute updates
  #       referrer_params.delete_if { |k, v| !['id', 'title', 'phone'].include?(k) }
  #     end
  #     if (contributor = User.find_by_email(contributor_params.try(:[], :email)))
  #       contributor_params[:id] = contributor.id
  #       contributor_params.delete_if { |k, v| !['id', 'title', 'phone'].include?(k) }
  #     end
  #   end
  # end

  # find a success previously created in this import (or in db) and return id
  def find_dup_success (success, success_lookup=nil)
    if success[:customer_id].present? &&
        success[:customer_id] == success_lookup.dig(success[:name], :customer_id)
      success_lookup[success[:name]][:id]
    elsif success_id = Success.where({
                                name: success[:name],
                                customer_id: success[:customer_id]
                              })
                              .take.try(:id)
      success_id
    else
      nil
    end
  end

  # find a customer previously created in this import and return id;
  # customers existing prior to the import are id'ed in the client
  def find_dup_imported_customer (success, customer_lookup)
    if success[:customer_id].present?  # dup customer id'ed in the client
      success[:customer_id]
    else
      success.dig(:customer_attributes, :name) &&
      customer_lookup[success.dig(:customer_attributes, :name)]
    end
  end

  # fill in the id of an existing user, and removes the referrer/contributor_attributes hash
  def add_dup_contact (success, contact_type, user_id)
    contribution_index = success[:contributions_attributes].select do |index, contribution|
      contribution.has_key?("#{contact_type}_id") ||
      contribution.has_key?("#{contact_type}_attributes")
    end.keys[0]
    success[:contributions_attributes][contribution_index]["#{contact_type}_id"] = user_id
    success[:contributions_attributes][contribution_index].except!("#{contact_type}_attributes")
    success
  end

  # fill in the id of an existing template, and remove invitation_template_attributes hash
  def add_dup_template (success, contact_type, template_id)
    contribution_index = success[:contributions_attributes].select do |index, contribution|
      contribution.has_key?("#{contact_type}_id") ||
      contribution.has_key?("#{contact_type}_attributes")
    end.keys[0]
    # binding.remote_pry if success[:name] == 'TestCo Win 7'
    success[:contributions_attributes][contribution_index][:invitation_template_id] = template_id
    success[:contributions_attributes][contribution_index].except!(:invitation_template_attributes)
    success
  end

  def find_dup_imported_users_and_templates (success, user_lookup, template_lookup, referrer_email, contact_email, referrer_template, contact_template)
    ['referrer', 'contributor'].each do |contact_type|
      email = contact_type == 'referrer' ? referrer_email : contact_email
      template = contact_type == 'referrer' ? referrer_template : contact_template
      if (user_id = (user_lookup[email] || User.find_by_email(email).try(:id)))
        success = add_dup_contact(success, contact_type, user_id)
      end
      if (template_id = (template_lookup[template] || InvitationTemplate.where({
                                                          name: template,
                                                          company_id: @company.id
                                                        }).take.try(:id) ))
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
    if success[:contributions_attributes].present?
      contribution_index = success[:contributions_attributes].select do |index, contribution|
        contribution.has_key?("#{contact_type}_id") ||
        contribution.has_key?("#{contact_type}_attributes")
      end.keys[0]
      success.dig(
        :contributions_attributes,
        contribution_index,
        :invitation_template_attributes,
        :name
      )
    else
      nil
    end
  end

  # duplicate successes are allowed for a zap; they will contain new contributors
  # but not allowed if also a dup contributor (dup referrer ok)
  # NOTE no id values will be available in a zap
  # def ignore_zap? (success)
  #   if existing_success = Success.includes(:contributions)
  #                                .joins(:customer)
  #                                .where({ name: success[:name] })
  #                                .where({
  #                                   customers: {
  #                                     name: success.dig(:customer_attributes, :name),
  #                                     company_id: current_user.company_id
  #                                   },
  #                                 })
  #                                .take
  #     # this is a dup success; check for new contributor
  #     contributor_email = success.dig(:contributions_attributes, '1', :contributor_attributes, :email)
  #     if (User.find_by_email(contributor_email) &&
  #         existing_success.contributions.any? { |c| c.contributor.email == contributor_email })
  #       true  # user already has a contribution for this success
  #     else
  #       false
  #     end
  #   else
  #     false
  #   end
  # end


  def build_contribution_from_import (success, success_id)
    contribution = {
      success_id: success_id,
      contributor_attributes: {},
      referrer_attributes: {},
      invitation_template_attributes: {}
    }

    contact_index = success[:contributions_attributes].select do |index, c|
      c.has_key?("contributor_id") || c.has_key?("contributor_attributes")
    end.keys[0]
    referrer_index = success[:contributions_attributes].select do |index, c|
      c.has_key?("referrer_id") || c.has_key?("referrer_attributes")
    end.keys[0]

    referrer_id = success.dig(:contributions_attributes, referrer_index, :referrer_id)
    referrer_attrs = success.dig(:contributions_attributes, referrer_index, :referrer_attributes)
    contributor_id = success.dig(:contributions_attributes, contact_index, :contributor_id)
    contributor_attrs = success.dig(:contributions_attributes, contact_index, :contributor_attributes)
    invitation_template_id = success.dig(:contributions_attributes, contact_index, :invitation_template_id)
    invitation_template_attrs = success.dig(:contributions_attributes, contact_index, :invitation_template_attributes)

    if referrer_id.present?
      contribution[:referrer_id] = referrer_id
      contribution.except!(:referrer_attributes)
    elsif referrer_attrs.present?
      contribution[:referrer_attributes].merge!(referrer_attrs)
    else
      contribution.except!(:referrer_attributes)
    end
    if contributor_id.present?
      contribution[:contributor_id] = contributor_id
      contribution.except!(:contributor_attributes)
    elsif contributor_attrs.present?
      contribution[:contributor_attributes].merge!(contributor_attrs)
    else
      contribution.except!(:contributor_attributes)
    end
    if invitation_template_id.present?
      contribution[:invitation_template_id] = invitation_template_id
      contribution.except!(:invitation_template_attributes)
    elsif invitation_template_attrs.present?
      contribution[:invitation_template_attributes].merge!(invitation_template_attrs)
    else
      contribution.except!(:invitation_template_attributes)
    end
    contribution
  end

  # method takes a success from a zap and combines data from each of two possible contributions
  # into a single contribution.
  def consolidate_contributions (success)
    success[:contributions_attributes]['1'][:success_contact] = false
    success[:contributions_attributes]['1'][:referrer_attributes] =
      success[:contributions_attributes]['0'][:referrer_attributes]
    success[:contributions_attributes].except!('0')
    success
  end

  # for activerecord-import ...
  # 2exp2 signatures for an imported success (each requires its own .import statement)
  # Success.import(import_signature_1(params[:imported_successes]), on_duplicate_key_updatevalidate: false)
  # Success.import(import_signature_2(params[:imported_successes]), validate: false)
  # Success.import(import_signature_3(params[:imported_successes]), validate: false)
  # Success.import(import_signature_4(params[:imported_successes]), validate: false)
  #
  # both new
  # def import_signature_1 (imported_successes)
  #   successes = []
  #   imported_successes.to_a.map { |s| s[1] }.keep_if do |s|
  #     s[:contributions_attributes]['0'][:referrer_attributes].has_key?(:password) &&
  #     s[:contributions_attributes]['1'][:contributor_attributes].has_key?(:password)
  #   end
  #     .each do |success|
  #       # params[:success] = success
  #       successes << Success.create(success)
  #     end
  #   successes
  # end

  # # one existing, one new
  # def import_signature_2 (imported_successes)
  #   successes = []
  #   imported_successes.to_a.map { |s| s[1] }.keep_if do |s|
  #     !s[:contributions_attributes]['0'][:referrer_attributes].has_key?(:password) &&
  #     s[:contributions_attributes]['1'][:contributor_attributes].has_key?(:password)
  #   end
  #     .each do |success|
  #       # params[:success] = success
  #       successes << Success.create(success)
  #     end
  #   successes
  # end

  # # one new, one existing
  # def import_signature_3 (imported_successes)
  #   successes = []
  #   imported_successes.to_a.map { |s| s[1] }.keep_if do |s|
  #     s[:contributions_attributes]['0'][:referrer_attributes].has_key?(:password) &&
  #     !s[:contributions_attributes]['1'][:contributor_attributes].has_key?(:password)
  #   end
  #     .each do |success|
  #       # params[:success] = success
  #       successes << Success.create(success)
  #     end
  #   successes
  # end

  # # both existing
  # def import_signature_4 (imported_successes)
  #   successes = []
  #   imported_successes.to_a.map { |s| s[1] }.keep_if do |s|
  #     !s[:contributions_attributes]['0'][:referrer_attributes].has_key?(:password) &&
  #     !s[:contributions_attributes]['1'][:contributor_attributes].has_key?(:password)
  #   end
  #     .each do |success|
  #       # params[:success] = success
  #       successes << Success.create(success)
  #     end
  #   successes
  # end

end