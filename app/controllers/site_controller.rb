class SiteController < ApplicationController

  skip_before_action :verify_authenticity_token, only: :esp_notifications
  before_action only: [:index, :store_front] { set_gon }

  def index
  end

  def strip_subdomain
    if request.query_string.present?
      redirect_to request.protocol + request.domain + request.path + '?' + request.query_string
    else
      redirect_to request.protocol + request.domain + request.path
    end
  end

  def valid_subdomain_bad_path
    redirect_to root_url(host: request.host), flash: { warning: "Page doesn't exist" }
  end

  def invalid_subdomain
    redirect_to root_url(host: request.domain)
  end

  def store_front
    case request.path
    when /\/(product)(.html)?/
      render :product
    when /\/(plans)(.html)?/
      render :plans
    when /\/(our-company)(.html)?/
      render :our_company
    when /\/(team)(.html)?/
      render :team
    when /\/(tos)(.html)?/
      render :tos
    when /\/(privacy)(.html)?/
      render :privacy
    when /\/(our-story)(.html)?/
      render :our_story
    else
      redirect_to root_path
    end
  end

  def sitemap
    @published_companies = Company.joins(successes: { story: {} })
                                  .where(stories: { published: true })
                                  .where.not("subdomain IN ('csp', 'acme-test')")
                                  .distinct
                                  .map do |company|
                                    { id: company.id,
                                      subdomain: company.subdomain }
                                  end
    @published_companies.each do |published_company|
      published_company[:stories] =
                        Story.joins(success: { customer: { company: {} }})
                             .where(published: true,
                                    companies: { id: published_company[:id] })
                             .map do |story|
                               { url: story.csp_story_url,
                                 last_modified: story.updated_at }
                             end
    end
    respond_to do |format|
      format.xml { render layout: false }
    end
  end

  def google_verify
    render params[:google], layout: false
  end

  def esp_notifications
    # contribution_id was tagged onto the email via X-SMTPAPI header
    #   (requests and reminders only, hence check for contribution below)
    # TODO: why do incoming params include both params[:_json] and params[:site][:_json]?
    contribution = Contribution.find_by id: params[:_json][0][:contribution_id]
    if contribution
      case params[:_json][0][:event]
      when 'open'
        contribution.update(request_received_at: Time.now)
      when 'click'
        # how to keep track of a clicked on but unsubmitted contribution form?
        # eg params[:_json][:url] = http://cisco.lvh.me:3000/contributions/1262f1939a25c209949bd183e630ca79/contribution
      else
      end
    end
    # response required or sendgrid will continue sending
    head :ok
  end

end
