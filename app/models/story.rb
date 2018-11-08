class Story < ApplicationRecord
  extend OrderAsSpecified
  include FriendlyId

  belongs_to :success
  has_one :company, through: :success
  has_one :customer, through: :success
  has_one :curator, through: :success, class_name: 'User'
  has_many :contributions, through: :success do
    def submissions
      where("contributions.contribution IS NOT NULL")
    end
  end
  has_many :contributors, through: :success
  has_many :visitor_actions, through: :success
  has_many :page_views, through: :success, class_name: 'PageView'
  has_many :visitors, -> { select('visitors.*, visitor_actions.timestamp, visitor_sessions.clicky_session_id').distinct }, through: :page_views
  has_many :category_tags, through: :success, source: :story_categories
  has_many :product_tags, through: :success, source: :products
  has_many :results, through: :success
  has_many :ctas, through: :success, source: :ctas do
    # for rendering modals
    def forms
      self.where(type: 'CTAForm')
    end
  end
  has_many :adwords_ads, dependent: :destroy do  # topic and retarget
    def enabled?
      self.all? { |ad| ad.status == 'ENABLED' }
    end
    def status
      self.first.status  # same for each ad
    end
    def long_headline
      self.first.long_headline  # same for each ad
    end
    def adwords_image
      self.first.adwords_image  # same for each ad
    end
    def adwords_image= (adwords_image)
      self.each { |ad| ad.adwords_image = adwords_image }
    end
  end
  alias_attribute :ads, :adwords_ads
  has_one :topic_ad, -> (story) {
    where(adwords_ad_group_id: story.company.campaigns.present? &&
                               story.company.campaigns.topic.ad_group.id)
  }, class_name: 'AdwordsAd'
  has_one :retarget_ad, -> (story) {
    where(adwords_ad_group_id: story.company.campaigns.present? &&
                               story.company.campaigns.retarget.ad_group.id)
  }, class_name: 'AdwordsAd'

  accepts_nested_attributes_for(:success)
  # virtual attribute for accepting a standard format video url
  attr_accessor :formatted_video_url

  # Note: no explicit association to friendly_id_slugs, but it's there
  # Story has many friendly_id_slugs -> captures history of slug changes

  # Story title should be unique, even across companies
  # This because friendly_id allows us to search based on the title slug
  validates :title, presence: true, uniqueness: true

  friendly_id :title, use: [:slugged, :finders, :history]

  scope :company_all, ->(company_id) {
    joins(success: { customer: {} })
    .where(customers: { company_id: company_id })
  }
  scope :company_all_filter_category, ->(company_id, category_id) {
    joins(success: { customer: {}, story_categories: {} })
    .where(customers: { company_id: company_id },
           story_categories: { id: category_id } )
  }
  scope :company_all_filter_product, ->(company_id, product_id) {
    joins(success: { customer: {}, products: {} })
    .where(customers: { company_id: company_id },
           products: { id: product_id } )
  }
  scope :company_all_created_since, ->(company_id, days_ago) {
    company_all(company_id)
    .where('stories.created_at >= ?', days_ago.days.ago)
  }
  scope :company_published, ->(company_id) {
    company_public(company_id).where(published: true)
  }
  scope :company_published_since, ->(company_id, days_ago) {
    company_published(company_id)
    .where('stories.publish_date >= ?', days_ago.days.ago)
  }
  scope :company_published_filter_category, ->(company_id, category_id) {
    joins(success: { customer: {}, story_categories: {} })
    .where(published: true,
           customers: { company_id: company_id },
           story_categories: { id: category_id })
  }
  scope :company_published_filter_product, ->(company_id, product_id) {
    joins(success: { customer: {}, products: {} })
    .where(published: true,
           customers: { company_id: company_id },
           products: { id: product_id })
  }
  scope :company_public, ->(company_id) {
    joins(:customer)
    .where(customers: { company_id: company_id })
    .where.not(customers: { logo_url: [nil, ''] })
    .where('logo_published IS TRUE OR preview_published IS TRUE')
  }
  scope :company_public_since, ->(company_id, days_ago) {
    company_public(company_id)
    .where('stories.logo_publish_date >= ?', days_ago.days.ago)
  }
  scope :company_public_filter_category, ->(company_id, category_id) {
    joins(:customer, :category_tags)
    .where(customers: { company_id: company_id }, story_categories: { id: category_id })
    .where.not(customers: { logo_url: [nil, ''] })
    .where('logo_published IS TRUE OR preview_published IS TRUE')
  }
  scope :company_public_filter_product, ->(company_id, product_id) {
    joins(:customer, :product_tags)
    .where(customers: { company_id: company_id }, products: { id: product_id })
    .where.not(customers: { logo_url: [nil, ''] })
    .where('logo_published IS TRUE OR preview_published IS TRUE')
  }

  # scrub user-supplied html input using whitelist
  before_update(:scrub_html_input, on: [:create, :update],
    if: Proc.new { self.narrative.present? && self.narrative_changed? })

  # update timestamps
  before_update(:update_publish_state, on: [:create, :update])

  after_commit(on: [:create, :destroy]) do
    self.company.expire_stories_json_cache
  end

  # note: the _changed? methods for attributes don't work in the
  # after_commit callback;
  # note: the & operator interestects the arrays, returning any values
  # that exist in both

  # on change of publish state
  after_commit(on: :update) do
    expire_story_card_fragment_cache
    expire_filter_select_fragment_cache
    self.company.increment_stories_gallery_fragments_memcache_iterator
    self.company.expire_stories_json_cache
  end if Proc.new { |story|
           ( story.previous_changes.keys &
             ['published', 'preview_published', 'logo_published'] ).any?
         }

  # for any published (title overlay) or preview-published (summary, quote) stories,
  # expire stories gallery cache on change of title/summary/quote data;
  # also json cache
  after_commit(on: :update) do
    expire_story_card_fragment_cache
    self.company.increment_stories_gallery_fragments_memcache_iterator
    self.company.expire_stories_json_cache
  end if Proc.new { |story|
           ( (story.published? || story.preview_published?) &&
             (story.previous_changes.keys & ['title', 'summary', 'quote']).any? )
         }

  after_commit(on: :update) do
    expire_story_video_info_cache
    expire_story_video_xs_fragment_cache
  end if Proc.new { |story| story.previous_changes.key?('video_url') }

  after_commit(on: :update) do
    expire_story_testimonial_fragment_cache
  end if Proc.new { |story|
            (story.previous_changes.keys &
            ['video_url', 'quote', 'quote_attr_name', 'quote_attr_title']).any?
          }

  after_commit(on: :update) do
    expire_csp_story_path_cache
    expire_story_narrative_fragment_cache
  end if Proc.new { |story| story.previous_changes.key?('title') }

  after_commit(on: :update) do
    expire_story_narrative_fragment_cache
  end if Proc.new { |story| (story.previous_changes.keys & ['title', 'narrative']).any? }

  before_destroy do
    expire_filter_select_fragment_cache
    self.company.increment_stories_gallery_fragments_memcache_iterator
    self.company.expire_stories_json_cache
  end

  # method takes an active record relation
  def self.default_order stories_relation
    stories_relation
      .order("stories.published DESC, stories.preview_published DESC, stories.updated_at DESC")
  end

  def should_generate_new_friendly_id?
    new_record? || title_changed? || slug.blank?
  end

  def status
    if self.published?
      'published'
    elsif self.preview_published?
      'preview-published'
    elsif self.logo_published?
      'logo-published'
    else
      'not-published'
    end
  end

  def scrub_html_input
    # white_list_sanitizer = Rails::Html::WhiteListSanitizer.new
    # self.narrative = white_list_sanitizer.sanitize(content, tags: %w(a p span div strong i u em section blockquote cite br pre font h1 h2 h3 h4 h5 h6 table tr td ol ul li hr img), attributes: %w(id class style face href src))
  end

  def assign_tags new_story
    if new_story[:category_tags]
      new_story[:category_tags].each do |selection|
        if selection.to_i == 0   # if it's a generic tag
          # create a new company category category based on the generic tag
          self.success.story_categories << StoryCategory.create(
              name: selection, company_id: current_user.company.id)
        else  # selection is the id of an existing company story category
          self.success.story_categories << StoryCategory.find(selection)
        end
      end
    end
    if new_story[:product_tags]
      new_story[:product_tags].each do |selection|
        self.success.products << Product.find(selection)
      end
    end
  end

  # method returns a friendly id path that either contains or omits a product
  def csp_story_path
    Rails.cache.fetch("#{self.company.subdomain}/csp-story-#{self.id}-path") do
      if self.product_tags.present?
        Rails.application.routes.url_helpers.public_story_path(
          self.customer.slug,
          self.product_tags.take.slug,
          self.slug,
          subdomain: company.subdomain
        )
      else
        Rails.application.routes.url_helpers.public_story_no_product_path(
          self.customer.slug,
          self.slug,
          subdomain: company.subdomain
        )
      end
    end
  end

  def expire_csp_story_path_cache
    Rails.cache.delete("#{self.company.subdomain}/csp-story-#{self.id}-path")
    self.expire_fragment_cache_on_path_change
    self.company.expire_stories_json_cache
  end

  # method returns a friendly id url that either contains or omits a product
  def csp_story_url
    if self.product_tags.present?
      Rails.application.routes.url_helpers.public_story_url(
        self.customer.slug,
        self.product_tags.take.slug,
        self.slug,
        subdomain: company.subdomain
      )
    else
      Rails.application.routes.url_helpers.public_story_no_product_url(
        self.customer.slug,
        self.slug,
        subdomain: company.subdomain
      )
    end
  end

  def csp_story_link (is_curator, is_plugin, is_external, plugin_type)
    if is_curator
      Rails.application.routes.url_helpers.edit_story_path(self.id)
    elsif self.published?
      is_external ? self.csp_story_url : self.csp_story_path
    elsif self.preview_published?
      if is_plugin && (plugin_type == 'gallery' || plugin_type == 'carousel')
        self.csp_story_url
      elsif is_plugin && plugin_type == 'tabbed_carousel'
        is_external ? Rails.application.routes.url_helpers.root_url(subdomain: self.company.subdomain) + "?preview=#{self.slug}" : "/?preview=#{self.slug}"
      else
        'javascript:;'
      end
    end
  end

  # defining this method makes it easy to include the edit_story_path helper
  # with activity feed response (contributions_submitted and contribution_requests_received)
  def csp_edit_story_path
    url_helpers = Rails.application.routes.url_helpers
    url_helpers.edit_story_path(self.id)
  end

  ##
  #  video_url looks like one of these ...
  #
  #  "https://www.youtube.com/embed/#{youtube_id}"
  #  "https://player.vimeo.com/video/#{vimeo_id}"
  #  "https://fast.wistia.com/embed/medias/#{wistia_id}.jsonp"
  #
  def video_info
    Rails.cache.fetch("#{self.company.subdomain}/story-#{self.id}-video-info") do
      return { provider: nil, id: nil } if self.video_url.blank?
      if self.video_url.include? "youtube"
        { provider: 'youtube',
          id: video_url.slice(video_url.rindex('/') + 1, video_url.length) }
      elsif self.video_url.include? "vimeo"
        { provider: 'vimeo',
          id: video_url.slice(video_url.rindex('/') + 1, video_url.length) }
      elsif self.video_url.include? "wistia"
        { provider: 'wistia',
          id: self.video_url.match(/\/(?<id>\w+)(\.\w+$)/)[:id] }
      else
        # error
      end
    end
  end

  # this method closely resembles the 'set_contributors' method in stories controller;
  # adds contributor linkedin data, which is necessary client-side for widgets
  # that fail to load
  def published_contributors
    # Rails.cache.fetch("#{self.company.subdomain}/story-#{self.id}-published-contributors") do
      contributors =
        User.joins(own_contributions: { success: {} })
            .where.not(linkedin_url:'')
            .where(successes: { id: self.success_id },
                   contributions: { publish_contributor: true })
            .order("CASE contributions.role
                      WHEN 'customer' THEN '1'
                      WHEN 'customer success' THEN '2'
                      WHEN 'sales' THEN '3'
                    END")
            .map do |contributor|
               { widget_loaded: false,
                 id: contributor.id,
                 first_name: contributor.first_name,
                 last_name: contributor.last_name,
                 linkedin_url: contributor.linkedin_url,
                 linkedin_photo_url: contributor.linkedin_photo_url,
                 linkedin_title: contributor.linkedin_title,
                 linkedin_company: contributor.linkedin_company,
                 linkedin_location: contributor.linkedin_location }
             end
      contributors.delete_if { |c| c[:id] == self.curator.id }
      # don't need the id anymore, don't want to send it to client ...
      contributors.map! { |c| c.except(:id) }
      if self.curator.linkedin_url.present?
        contributors.push({ widget_loaded: false }
                    .merge(self.curator.slice(
                      :first_name, :last_name, :linkedin_url, :linkedin_photo_url,
                      :linkedin_title, :linkedin_company, :linkedin_location )))
      end
      contributors
    # end
  end

  def expire_published_contributor_cache(contributor_id)
    Rails.cache.delete("#{self.company.subdomain}/story-#{self.id}-published-contributors")
    self.company.expire_stories_json_cache
    self.expire_fragment("#{self.company.subdomain}/story-#{self.id}-contributors")
    self.expire_fragment("#{self.company.subdomain}/story-#{self.id}-contributor-#{contributor_id}")
  end

  def expire_story_card_fragment_cache
    mi = self.company.story_card_fragments_memcache_iterator
    card_fragment = "#{company.subdomain}/story-card-#{self.id}-memcache-iterator-#{mi}"
    self.expire_fragment(card_fragment) if fragment_exist?(card_fragment)
  end

  def expire_filter_select_fragment_cache
    if self.category_tags.present?
      self.company.increment_category_select_fragments_memcache_iterator
    end
    if self.product_tags.present?
      self.company.increment_product_select_fragments_memcache_iterator
    end
  end

  def expire_fragment_cache_on_path_change
    if self.logo_published?
      self.expire_story_card_fragment_cache
      self.company.increment_stories_gallery_fragments_memcache_iterator
    end
  end

  def expire_story_testimonial_fragment_cache
    self.expire_fragment("#{self.company.subdomain}/stories/#{self.id}/testimonial")
    self.expire_fragment("#{self.company.subdomain}/stories/#{self.id}/cs-testimonial")
  end

  def expire_story_video_info_cache
    Rails.cache.delete("#{self.company.subdomain}/story-#{self.id}-video-info")
  end

  def expire_story_video_xs_fragment_cache
    self.expire_fragment("#{self.company.subdomain}/stories/#{self.id}/video-xs")
    self.expire_fragment("#{self.company.subdomain}/stories/#{self.id}/cs-video-xs")
  end

  def expire_story_narrative_fragment_cache
    self.expire_fragment("#{self.company.subdomain}/stories/#{self.id}/narrative")
    self.expire_fragment("#{self.company.subdomain}/stories/#{self.id}/cs-narrative")
  end

  def expire_results_fragment_cache
    self.expire_fragment("#{self.company.subdomain}/stories/#{self.id}/results")
    self.expire_fragment("#{self.company.subdomain}/stories/#{self.id}/cs-results")
  end

  def contributors_jsonld
    self.contributors.map do |contributor|
                                { "@type" => "Person",
                                  "name" => contributor.full_name }
                              end
  end

  def about_jsonld
    customer = self.success.customer
    [{ "@type" => "Corporation",
       "name" => customer.name,
       "logo" => { "@type" => "ImageObject",
       "url" => customer.logo_url }}] +
      self.success.products.map do |product|
                              { "@type" => "Product",
                                "name" => product.name }
                            end
  end

  # not currently used, maybe include with json api
  # def published_tags
  #   return nil unless self.published?
  #   { categories: self.success.story_categories.map { |c| { name: c.name, slug: c.slug } },
  #     products: self.success.products.map { |p| { name: p.name, slug: p.slug } }}
  # end

  # # not currently used, maybe include with json api
  # def published_content
  #   return nil unless self.published?
  #   { title: title,
  #     quote: quote,
  #     quote_attr: quote_attr,
  #     content: content }
  # end

  def preview_contributor
    self.contributions.find { |contribution| contribution.preview_contributor? }
        .try(:contributor)
        .try(:slice, :first_name, :last_name, :linkedin_url, :linkedin_photo_url, :linkedin_title, :linkedin_company, :linkedin_location)
        .to_json
    # self.contributors
    #     .take.try(:slice, :first_name, :last_name, :linkedin_url, :linkedin_photo_url, :linkedin_title, :linkedin_company, :linkedin_location).to_json
  end

  def related_stories
    related_stories = []
    same_product_stories = []
    same_category_stories = []
    success = self.success
    company = success.customer.company
    published_stories =
      company.published_stories.delete_if { |story_id| story_id == self.id }
    success.products.each do |product|
      same_product_stories += company.published_stories_filter_product(product.id)
                                     .delete_if { |story_id| story_id == self.id }
    end
    success.story_categories.each do |category|
      same_category_stories += company.published_stories_filter_category(category.id)
                                      .delete_if { |story_id| story_id == self.id }
    end
    same_tag_stories = (same_product_stories + same_category_stories).uniq
    if same_product_stories.length >= 2
      related_stories = same_product_stories.sample(2)
    elsif same_tag_stories.length >= 2
      related_stories = same_tag_stories.sample(2)
    elsif same_tag_stories.length == 0
      related_stories = published_stories.sample(2)
    else
      related_stories = same_tag_stories +
                        published_stories.delete_if do |story_id|
                          same_tag_stories.include?(story_id)
                        end.sample(2 - same_tag_stories.length)
    end
    Story.find(related_stories)
  end

  #
  # returns number of unique visitors
  #
  def unique_visitors_count
    unique_visitors = Set.new
    story_views = PageView.includes(:visitor).where(success_id: self.success_id)
    story_views.each do |story_view|
      unique_visitors << story_view.visitor.clicky_uid
    end
    unique_visitors.length
  end

  # TODO: (following four methods): the assoiation extensions don't work well with to_json,
  # so supplement with this for now and revisit later. Consider jbuilder or something similar
  # (these methods so far only used in stories#promoted)
  def ads_enabled?
    self.ads.all? { |ad| ad.status == 'ENABLED' }
  end

  def ads_status
    self.ads.first.status  # same for each ad
  end

  def ads_long_headline
    self.ads.first.long_headline  # same for each ad
  end

  def ads_image_url
    self.ads.first.adwords_image.try(:image_url)  # same for each ad
  end

  def update_publish_state
    if self.logo_published? && self.logo_published_was == false
      self.logo_publish_date = Time.now
    elsif !self.logo_published? && self.logo_published_was == true
      self.logo_publish_date = nil
    end
    if self.preview_published? && self.preview_published_was == false
      self.preview_publish_date = Time.now
    elsif !self.preview_published? && self.preview_published_was == true
      self.preview_publish_date = nil
    end
    if self.published? && self.published_was == false
      self.publish_date = Time.now
    elsif !self.published? && self.published_was == true
      self.publish_date = nil
    end
  end

end
