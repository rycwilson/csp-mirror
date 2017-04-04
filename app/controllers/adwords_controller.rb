class AdwordsController < ApplicationController

  require 'adwords_api'
  before_action { @company = Company.find_by(subdomain: request.subdomain) }

  def index
    topic_campaign = get_campaign(@company, 'topic')
    retarget_campaign = get_campaign(@company, 'retarget')
    respond_to do |format|
      format.json do
        render({
          json: {

          }
        })
      end
    end
  end

  private

  def get_api_version()
    return :v201702
  end

  def get_campaign(company, campaign_type)
    api = get_adwords_api()
    service = api.service(:CampaignService, get_api_version())
    selector = {
      :fields => ['Id', 'Name', 'Status', 'Labels'],
      :ordering => [{:field => 'Id', :sort_order => 'ASCENDING'}],
      :paging => {:start_index => 0, :number_results => 50}
    }
    result = nil
    begin
      result = service.get(selector)
    rescue AdwordsApi::Errors::ApiException => e
      logger.fatal("Exception occurred: %s\n%s" % [e.to_s, e.message])
      flash.now[:alert] =
          'API request failed with an error, see logs for details'
    end
    result[:entries].find do |campaign|
      campaign[:labels].any? { |label| label[:name] == company.subdomain } &&
      campaign[:labels].any? { |label| label[:name] == campaign_type }
    end
  end

  def get_adwords_api()
    @api ||= create_adwords_api()
  end

  # Creates an instance of AdWords API class. Uses a configuration file and
  # Rails config directory.
  def create_adwords_api()
    config_file = File.join(Rails.root, 'config', 'adwords_api.yml')
    @api = AdwordsApi::Api.new(config_file)
  end

end


