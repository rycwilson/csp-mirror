class Company < ActiveRecord::Base

  CSP = self.find(5)

  before_validation :smart_add_url_protocol

  validates :name, presence: true, uniqueness: true
  validates :subdomain, presence: true, uniqueness: true
  validates :website, presence: true, uniqueness: true, website: true
  validates_length_of :subdomain, maximum: 32, message: "must be 32 characters or less"
  validates_format_of :subdomain, with: /\A[a-z0-9-]*\z/, on: [:create, :update], message: "may only contain lowercase alphanumerics or hyphens"
  validates_exclusion_of :subdomain, in: ['www', 'mail', 'ftp'], message: "is not available"

  has_many :users  # no dependent: :destroy users, handle more gracefully

  has_many :customers, dependent: :destroy do
    def select_options
      self.map do |customer|
        [ customer.name, customer.id ]
      end
      .unshift( [""] )  # empty option makes placeholder possible (only needed for single select)
    end
  end
  has_many :successes, through: :customers
  has_many :stories, through: :successes do
    def select_options
      self.select { |story| story.published? }
          .map { |story| [ story.title, story.id ] }
          .unshift( ['All', 0] )
    end
    def published
      self.select { |story| story.published? }
    end
  end
  has_many :visitor_actions
  has_many :page_views, class_name: "PageView"
  has_many :story_shares, class_name: "StoryShare"
  has_many :cta_clicks, class_name: "CtaClick"
  has_many :profile_clicks, class_name: "ProfileClick"
  has_many :logo_clicks, class_name: "LogoClick"
  # include the select clause with extra fields,
  # because these models have a default search order on those fields,
  # so must be included in the select clause
  has_many :visitor_sessions, -> { select('visitor_sessions.*, visitor_sessions.clicky_session_id, visitor_actions.timestamp').distinct }, through: :visitor_actions
  has_many :visitors, -> { select('visitors.*, visitor_sessions.clicky_session_id, visitor_actions.timestamp').distinct }, through: :visitor_sessions

  has_many :story_categories, dependent: :destroy do
    def select_options
      self.map do |category|
        [ category.name, category.id, { data: { slug: category.slug } } ]
      end.sort
    end
    def public_select_options
      self.joins(:stories)
          .where(stories: { logo_published: true })
          .distinct
          .map do |category|
            [ category.name, category.id, { data: { slug: category.slug } } ]
          end.sort.unshift ['All', 0]
    end
  end
  has_many :products, dependent: :destroy do
    def select_options
      self.map do |product|
        [ product.name, product.id, { data: { slug: product.slug } } ]
      end.sort
    end
    def public_select_options
      self.joins(:stories)
        .where(stories: { logo_published: true })
        .distinct
        .map do |product|
          [ product.name, product.id, { data: { slug: product.slug } } ]
        end
        .sort
        .unshift ['All', 0]
    end
  end
  has_many :email_templates, dependent: :destroy
  has_one :cta_button, dependent: :destroy
  has_many :outbound_actions, dependent: :destroy

  has_many :call_to_actions, dependent: :destroy
  # alias and methods
  has_many :ctas, foreign_key: 'company_id', class_name: 'CallToAction' do
    def primary
      where(company_primary: true).take
    end
    def secondary
      where(company_primary: false)
    end
    def select_options
      grouped_options =
        [ [ 'Links', ['none available'] ], [ 'Web Forms', ['none available'] ] ]
      self.secondary.each do |cta|
        case cta.type
        when 'CTALink'
          if grouped_options[0][1][0] == 'none available'
            grouped_options[0][1][0] = [ cta.description, cta.id ]
          else
            grouped_options[0][1] << [ cta.description, cta.id ]
          end
        when 'CTAForm'
          if grouped_options[1][1][0] == 'none available'
            grouped_options[1][1][0] = [ cta.description, cta.id ]
          else
            grouped_options[1][1] << [ cta.description, cta.id ]
          end
        end
      end
      grouped_options
    end
  end
  has_one :widget, dependent: :destroy
  has_many :adwords_images, dependent: :destroy

  # presently uploading direct to S3, paperclip not used
  # paperclip
  has_attached_file :logo, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "companies/:style/missing_logo.png"
  validates_attachment_content_type :logo, content_type: /\Aimage\/.*\Z/

  after_commit on: :create do
    self.create_widget
  end

  after_commit :expire_fragment_cache, on: :update,
    if: Proc.new { |company|
      (company.previous_changes.keys & ['header_color_1', 'header_text_color']).any?
    }

  def header_style
    "background:linear-gradient(45deg, #{self.header_color_1} 0%, #{self.header_color_2} 100%);color:#{self.header_text_color};"
  end

  def all_stories
    Rails.cache.fetch("#{self.subdomain}/all_stories") do
      Story.order(Story.company_all(self.id)).pluck(:id)
    end
  end

  def all_stories_filter_category category_id
    Story.order(Story.company_all_filter_category(self.id, category_id)).pluck(:id)
  end

  def all_stories_filter_product product_id
    Story.order(Story.company_all_filter_product(self.id, product_id)).pluck(:id)
  end

  def published_stories
    Story.order(Story.company_published(self.id)).pluck(:id)
  end

  def published_stories_filter_category category_id
    Story.order(Story.company_published_filter_category(self.id, category_id)).pluck(:id)
  end

  def published_stories_filter_product product_id
    Story.order(Story.company_published_filter_product(self.id, product_id)).pluck(:id)
  end

  def public_stories
    Story.order(Story.company_public(self.id)).pluck(:id)
  end

  def public_stories_filter_category category_id
    Story.order(Story.company_public_filter_category(self.id, category_id)).pluck(:id)
  end

  def public_stories_filter_product product_id
    Story.order(Story.company_public_filter_product(self.id, product_id)).pluck(:id)
  end

  # TODO: faster? http://stackoverflow.com/questions/20014292
  def filter_stories_by_tag filter_params, is_curator
    if filter_params[:id] == '0'  # all stories
      story_ids = is_curator ? story_ids = self.all_stories : self.public_stories
    else
      case filter_params[:tag]  # all || category || product
        when 'all'
          story_ids = is_curator ? self.all_stories : self.public_stories
        when 'category'
          # use the slug to look up the category id,
          # unless filter_params[:id] already represents the id
          category_id = (StoryCategory
                           .friendly
                           .find(filter_params[:id]) # will find whether id or slug
                           .id unless filter_params[:id].to_i != 0).try(:to_i) ||
                        filter_params[:id].to_i
          story_ids = is_curator ? self.all_stories_filter_category(category_id) :
                                   self.public_stories_filter_category(category_id)
        when 'product'
          # use the slug to look up the product id,
          # unless filter_params[:id] already represents the id
          product_id = (Product
                          .friendly
                          .find(filter_params[:id])
                          .id unless filter_params[:id].to_i != 0).try(:to_i) ||
                       filter_params[:id].to_i
          story_ids = is_curator ? self.all_stories_filter_product(product_id) :
                                   self.public_stories_filter_product(product_id)
        else
      end
    end
    Story.find(story_ids)
         .sort_by { |story| story_ids.index(story.id) }
  end

  # all_stories_json returns data included in the client via the gon object
  def all_stories_json
    Rails.cache.fetch("#{self.subdomain}/all_stories_json") do
      JSON.parse(
        Story.order(Story.company_all(self.id))
        .to_json({
          only: [:id, :title, :summary, :quote, :quote_attr_name, :quote_attr_title, :published, :logo_published, :preview_published, :publish_date, :updated_at],
          methods: [:csp_story_path, :published_contributors, :preview_contributor],
          include: {
            success: {
              only: [],
              include: {
                customer: { only: [:name, :logo_url] },
                story_categories: { only: [:id, :name, :slug] },
                products: { only: [:id, :name, :slug] } }}}
        })
      )
    end
  end

  # all_stories_json contains a bunch of association data;
  # all_stories is just an array of ids
  def expire_all_stories_cache json_only
    if json_only
      Rails.cache.delete("#{self.subdomain}/all_stories_json")
    else
      Rails.cache.delete("#{self.subdomain}/all_stories_json")
      Rails.cache.delete("#{self.subdomain}/all_stories")
    end
  end

  def curator? current_user=nil
    return false if current_user.nil?
    current_user.company_id == self.id
  end

  def update_tags new_category_tags, new_product_tags
    # remove deleted category tags ...
    self.story_categories.each do |category|
      unless new_category_tags.include?(category.id.to_s)
        tag_instances =
          StoryCategoriesSuccess.where(story_category_id: category.id)
        # expire filter select fragment cache
        self.expire_filter_select_fragments_on_tag_destroy('category', tag_instances)
        # untag stories
        tag_instances.destroy_all
        category.destroy
      end
    end
    # add new category tags ...
    new_category_tags.each do |category_id|
      if category_id.to_i == 0   # new (custom or default) tag
        self.story_categories.create(name: category_id)
        # expire filter select fragment cache
        self.increment_curator_category_select_fragments_memcache_iterator
      else
        # do nothing
      end
    end
    # remove deleted product tags ...
    self.products.each do |product|
      unless new_product_tags.include?(product.id.to_s)
        tag_instances = ProductsSuccess.where(product_id: product.id)
        # expire filter select fragment cache
        self.expire_filter_select_fragments_on_tag_destroy('product', tag_instances)
        # untag stories
        tag_instances.destroy_all
        product.destroy
      end
    end
    # add new product tags ...
    new_product_tags.each do |product_id|
      if product_id.to_i == 0 # new tag
        self.products.create(name: product_id)
        # expire cache
        self.increment_curator_product_select_fragments_memcache_iterator
      else
        # do nothing
      end
    end
  end

  def create_email_templates
    self.email_templates.destroy_all
    # CSP.email_templates.each do |template|
    Company.find_by(name:'CSP').email_templates.each do |template|
      self.email_templates << template.dup
    end
  end

  def templates_select
    self.email_templates.map do |template|
      [template.name, template.id]
    end
    .sort
    .unshift( [""] )
  end

  #
  # when destroying a tag,
  # 1 - expire all curator filter select fragments
  # 2 - expire public filter select fragments that are affected
  #
  def expire_filter_select_fragments_on_tag_destroy tag, tag_instances
    if tag == 'category'
      self.increment_curator_category_select_fragments_memcache_iterator
    elsif tag == 'product'
      self.increment_curator_product_select_fragments_memcache_iterator
    end
    # check for tagged stories -> expire public filter select fragments
    tag_instances.each do |tag_instance|
      if tag_instance.success.story.logo_published?
        if tag == 'category'
          self.increment_public_category_select_fragments_memcache_iterator
        elsif tag == 'product'
          self.increment_public_product_select_fragments_memcache_iterator
        end
      end
    end
  end

  # this is used for validating the company's website address
  # see lib/website_validator.rb
  def smart_add_url_protocol
    unless self.website[/\Ahttp:\/\//] || self.website[/\Ahttps:\/\//]
      self.website = "http://#{self.website}"
    end
  end

  def missing_info
    missing = []
    missing << "logo" unless self.logo_url.present?
    missing << "story_categories" unless self.story_categories.present?
    missing << "products" unless self.products.present?
    missing
  end

  def products_jsonld
    self.products.map do |product|
                    { "@type" => "Product",
                      "name" => product.name }
                  end
  end

  def latest_story_publish_date
    self.stories.where(published: true).order(:publish_date).take.try(:publish_date)
  end

  def latest_story_modified_date
    self.stories.where(logo_published: true).order(logo_publish_date: :desc).take.try(:logo_publish_date)
  end

  # changes to company colors expires all gallery fragments
  def expire_fragment_cache
    self.increment_curator_stories_index_fragments_memcache_iterator
    self.increment_public_stories_index_fragments_memcache_iterator
    self.increment_story_tile_fragments_memcache_iterator
  end

  def expire_curate_table_fragment_cache
    self.expire_fragment("#{self.subdomain}/curate-table")
  end

  # invalidation of any story tile fragment will invalidate
  # - curator stories index (all stories)
  # - curator stories index (filters in which the tile appears)
  def curator_stories_index_fragments_memcache_iterator
    Rails.cache.fetch("#{self.subdomain}/curator-stories-index-fragments-memcache-iterator") { rand(10) }
  end

  def increment_curator_stories_index_fragments_memcache_iterator
    Rails.cache.write(
      "#{self.subdomain}/curator-stories-index-fragments-memcache-iterator",
      self.curator_stories_index_fragments_memcache_iterator + 1)
  end

  # expiration of a story tile fragment with logo published
  # expires all public stories index fragments
  def public_stories_index_fragments_memcache_iterator
    Rails.cache.fetch("#{self.subdomain}/public-stories-index-fragments-memcache-iterator") { rand(10) }
  end

  def increment_public_stories_index_fragments_memcache_iterator
    Rails.cache.write(
      "#{self.subdomain}/public-stories-index-fragments-memcache-iterator",
      self.public_stories_index_fragments_memcache_iterator + 1)
  end

  # all story fragments must be expired if these attributes change: header_color_1, header_text_color
  def story_tile_fragments_memcache_iterator
    Rails.cache.fetch("#{self.subdomain}/stories-tile-fragments-memcache-iterator") { rand(10) }
  end

  def increment_story_tile_fragments_memcache_iterator
    Rails.cache.write(
      "#{self.subdomain}/stories-tile-fragments-memcache-iterator",
      self.story_tile_fragments_memcache_iterator + 1)
  end

  #
  # curator category select fragments (all and pre-selected) invalidated by:
  # -> create/delete company tags (see story_category.rb)
  #
  def curator_category_select_fragments_memcache_iterator
    Rails.cache.fetch(
      "#{self.subdomain}/curator-category-select-fragments-memcache-iterator") { rand(10) }
  end

  def increment_curator_category_select_fragments_memcache_iterator
    Rails.cache.write(
      "#{self.subdomain}/curator-category-select-fragments-memcache-iterator",
      self.curator_category_select_fragments_memcache_iterator + 1)
  end

  def curator_product_select_fragments_memcache_iterator
    Rails.cache.fetch(
      "#{self.subdomain}/curator-product-select-fragments-memcache-iterator") { rand(10) }
  end

  def increment_curator_product_select_fragments_memcache_iterator
    Rails.cache.write(
      "#{self.subdomain}/curator-product-select-fragments-memcache-iterator",
      self.curator_product_select_fragments_memcache_iterator + 1)
  end

  #
  # public category/product select fragments (all and pre-selected) invalidated by:
  # -> attach/detach tags IF the story has logo published
  # -> story publish state IF story is tagged
  #
  def public_category_select_fragments_memcache_iterator
    Rails.cache.fetch(
      "#{self.subdomain}/public-category-select-fragments-memcache-iterator") { rand(10) }
  end

  def increment_public_category_select_fragments_memcache_iterator
    Rails.cache.write(
      "#{self.subdomain}/public-category-select-fragments-memcache-iterator",
      self.public_category_select_fragments_memcache_iterator + 1)
  end

  def public_product_select_fragments_memcache_iterator
    Rails.cache.fetch(
      "#{self.subdomain}/public-product-select-fragments-memcache-iterator") { rand(10) }
  end

  def increment_public_product_select_fragments_memcache_iterator
    Rails.cache.write(
      "#{self.subdomain}/public-product-select-fragments-memcache-iterator",
      self.public_product_select_fragments_memcache_iterator + 1)
  end

  def recent_activity days_offset  # today = 0
    # story_shares = self.story_shares(days_offset)
    groups = [
      { label: 'Story views',
        story_views: self.story_views_activity(7) },
      { label: 'Stories published',
        stories_published: self.stories_published_activity(days_offset) },
      { label: 'Contributions submitted',
        contributions_submitted: self.contribution_submissions_activity(days_offset) },
      { label: 'Contribution requests received',
        contribution_requests_received: self.contribution_requests_received_activity(days_offset) },
      { label: 'Logos published',
        stories_logo_published: self.stories_logo_published_activity(days_offset) },
      { label: 'Stories created',
        stories_created: self.stories_created_activity(days_offset) }
    ]
    # move any groups with no entries to the end of the array
    groups.length.times do
      if groups.any? { |group| group.values[1].length == 0 }
        groups.insert(groups.length - 1, groups.delete_at(groups.find_index { |group| group.values[1].length == 0 }))
      end
    end
    groups
  end

  def stories_created_activity days_offset
    Story
      .company_all_created_since(self.id, days_offset)
      .order(created_at: :desc)
      .map do |story|
        { type: 'Stories created',
          story: JSON.parse(
                    story.to_json({
                      only: [:title],
                      methods: [:csp_edit_story_path],
                      include: {
                        success: {
                          only: [],
                          include: { customer: { only: [:name] },
                                     curator: { only: [], methods: :full_name } }}}
                    })),
          timestamp: story.created_at.to_s }
      end
  end

  def stories_logo_published_activity days_offset
    Story
      .company_public_since(self.id, days_offset)
      .order(logo_publish_date: :desc)
      .map do |story|
        { type: 'Logos published',
          story: JSON.parse(
                    story.to_json({
                      only: [:title, :published],
                      methods: [:csp_edit_story_path],
                      include: {
                        success: {
                          only: [],
                          include: { customer: { only: [:name] },
                                     curator: { methods: :full_name } }}}
                    })),
          timestamp: story.logo_publish_date.to_s }
      end
      .delete_if { |story| story[:story]['published'] }
  end

  def contribution_requests_received_activity days_offset
    Contribution
      .company_requests_received_since(self.id, days_offset)
      .order(request_received_at: :desc)
      .map do |contribution|
        { type: 'Contribution requests received',
          contribution: JSON.parse(
                    contribution.to_json({
                       only: [:status, :request_received_at],
                       include: {
                         contributor: { only: [], # only need full name
                                        methods: :full_name },
                         success: {
                           only: [], # only need story and customer
                           include: {
                             story: { only: :title, methods: :csp_edit_story_path },
                             customer: { only: [:name] } }}}
                    })),
          timestamp: contribution.request_received_at.to_s }
      end
      .delete_if { |event| event[:contribution]['status'] == 'contribution' }
  end

  def contribution_submissions_activity days_offset
    Contribution
      .company_submissions_since(self.id, days_offset)
      .order(submitted_at: :desc)
      .map do |contribution|
        { type: 'Contributions submitted',
          contribution: JSON.parse(
                    contribution.to_json({
                      only: [:status, :contribution, :feedback, :submitted_at],
                      include: {
                      contributor: { only: [], # only need full name
                                     methods: :full_name },
                      success: { only: [], # only need story and customer
                                include: { story: { only: :title,
                                                    methods: :csp_edit_story_path },
                                           customer: { only: [:name] } }}}
                    })),
          timestamp: contribution.submitted_at.to_s }
      end
  end

  def stories_published_activity days_offset
    Story
      .company_published_since(self.id, days_offset)
      .order(publish_date: :desc)
      .map do |story|
        { type: 'Stories published',
          story: JSON.parse(
                   story.to_json({
                     only: [:title],
                     methods: [:csp_story_path],
                     include: {
                       success: {
                         only: [],
                         include: { customer: { only: [:name] },
                                    curator: { methods: :full_name } }}}
                   })),
          timestamp: story.publish_date.to_s }
      end
  end


  def story_views_activity days_offset
    PageView
      .joins(:visitor_session)
      .company_story_views_since(self.id, days_offset)
      .order('visitor_sessions.timestamp desc')
      .map do |story_view|
        { type: 'Story views',
          story_view: JSON.parse(
                        story_view.to_json({
                          only: [],
                          include: {
                            success: {
                              only: [],
                              include: {
                                story: {
                                  only: [:title],
                                  methods: [:csp_story_path] },
                                customer: {
                                  only: [:name] }}},
                            visitor_session: {
                              only: [:organization, :location, :referrer_type] }}
                        })),
          timestamp: story_view.visitor_session.timestamp.to_s }
      end
  end

  def story_shares_activity days_offset
  end

  def stories_table_json
    company_page_views = self.page_views.count
    # timestamp must be included since there's a default scope that orders on timestamp
    # note that it doesn't actually appear in the output
    logo_page_visitors = PageView.joins(:visitor)
                           .where(company_id: self.id, success_id: nil)
                           .group('visitor_actions.timestamp, visitors.id').count
    logo_page =
      [ '', 'Logo Page', '', logo_page_visitors.length,
        ((PageView.company_index_views(self.id).count.to_f / company_page_views.to_f) * 100).round(1).to_s + '%' ]
    PageView.distinct
      .joins(:story, :visitor, success: { customer: {} })
      .where(company_id: self.id, stories: { published: true })
      .group('visitor_actions.timestamp, stories.title', 'stories.publish_date', 'visitors.id', 'customers.name')
      .count
      .group_by { |story_visitor_timestamp, visits| story_visitor_timestamp[0] }
      .to_a.map do |story|
        visitors = Set.new
        publish_date = nil
        customer = nil
        story[1].each do |visitor|
          visitors << visitor[0][2]
          publish_date ||= visitor[0][1]
          customer ||= visitor[0][3]
        end
        [ customer, story[0], publish_date.strftime('%-m/%-d/%y'), visitors.count,
          ((Story.find_by(title: story[0]).page_views.count.to_f / company_page_views.to_f) * 100).round(1).to_s + '%' ]
      end
      .push(logo_page)
      .sort_by { |story| story[3] || 0 }.reverse
  end

  def visitors_chart_json story = nil, start_date = 30.days.ago.to_date, end_date = Date.today
    if story.nil?
      visitor_actions_conditions = { company_id: self.id }
    else
      visitor_actions_conditions = { company_id: self.id, success_id: story.success.id }
    end
    num_days = (start_date..end_date).count
    if num_days < 21
      visitors = VisitorSession.distinct
        .includes(:visitor)
        .joins(:visitor_actions)
        .where(visitor_actions: visitor_actions_conditions)
        .where('visitor_sessions.timestamp > ? AND visitor_sessions.timestamp < ?',
               start_date.beginning_of_day, end_date.end_of_day)
        .group_by { |session| session.timestamp.to_date }
        .sort_by { |date, sessions| date }.to_h
        .map do |date, sessions|
          [ date.strftime('%-m/%-d/%y'), sessions.map { |session| session.visitor }.uniq.count ]
        end
        if start_date == end_date || visitors.empty?
          visitors
        else
          visitors = fill_daily_gaps(visitors, start_date, end_date)
        end
    elsif num_days < 120
      # TODO: Perform the count without actually loading any objects
      visitors = VisitorSession.distinct
        .includes(:visitor)
        .joins(:visitor_actions)
        .where(visitor_actions: visitor_actions_conditions)
        .where('visitor_sessions.timestamp > ? AND visitor_sessions.timestamp < ?',
               start_date.beginning_of_week.beginning_of_day, end_date.end_of_week.end_of_day)
        .group_by { |session| session.timestamp.to_date.beginning_of_week }
        .sort_by { |date, sessions| date }.to_h
        .map do |date, sessions|
          [ date.strftime('%-m/%-d/%y'),
            sessions.map { |session| session.visitor }.uniq.count ]
        end
      if visitors.empty?
        visitors
      else
        visitors = fill_weekly_gaps(visitors, start_date, end_date)
      end
    else
      visitors = VisitorSession.distinct
        .includes(:visitor)
        .joins(:visitor_actions)
        .where(visitor_actions: visitor_actions_conditions)
        .where('visitor_sessions.timestamp >= ? AND visitor_sessions.timestamp <= ?',
               start_date.beginning_of_month.beginning_of_day, end_date.end_of_month.end_of_day)
        .group_by { |session| session.timestamp.to_date.beginning_of_month }
        .sort_by { |date, sessions| date }.to_h
        .map do |date, sessions|
          [ date.strftime('%-m/%y'),
            sessions.map { |session| session.visitor }.uniq.count ]
        end
      visitors
      # if visitors.empty?
      #   visitors
      # else
      #   visitors = fill_monthly_gaps(visitors, start_date, end_date)
      # end
    end
  end

  def visitors_table_json story = nil, start_date = 30.days.ago.to_date, end_date = Date.today
    if story.nil?
      visitor_actions_conditions = { company_id: self.id }
    else
      visitor_actions_conditions = { company_id: self.id, success_id: story.success.id }
    end
    # keep track of stories viewed by a given org, to be used for looking up story titles
    success_list = Set.new
    # note that visitor_sessions.timestamp and visitor_actions.timestamp must appear
    # in the group clause because of the default scope (order) on these tables
    # by including these in a single string argument,
    # only the organization, visitors.id, and visitor_actions.success_id are returned
    visitors = VisitorSession.distinct.joins(:visitor, :visitor_actions)
      .where('visitor_sessions.timestamp >= ? AND visitor_sessions.timestamp <= ?',
              start_date.beginning_of_day, end_date.end_of_day)
      .where(visitor_actions: visitor_actions_conditions)
      .group('visitor_sessions.clicky_session_id, visitor_actions.timestamp, organization', 'visitors.id', 'visitor_actions.success_id')
      .count
      .group_by { |org_visitor_success, count| org_visitor_success[0] }
      .to_a.map do |org|
        org_visitors = Set.new
        org_successes = []  # => [ [ success_id, unique visitors = [] ] ]
        org[1].each do |org_visitor_success|
          visitor_id = org_visitor_success[0][1]
          success_id = org_visitor_success[0][2]
          org_visitors << visitor_id
          if (index = org_successes.find_index { |success| success[0] == success_id })
            org_successes[index][1] << visitor_id
          else
            success_list << success_id
            org_successes << [ success_id, [ visitor_id ] ]
          end
        end
        org_successes.map! { |success| [ success[0], success[1].count ] }
        [ '', org[0] || '', org_visitors.count, org_successes ]
      end
      .sort_by { |org| org[1] }  # sort by org name
      # create a lookup table { success_id: story title }
      success_list.delete_if { |success_id| success_id.nil? }
      success_story_titles =
        Success.find(success_list.to_a).map { |success| [ success.id, success.story.title ] }.to_h
      visitors.each do |org|
        org[3].map! { |success| [ success_story_titles[success[0]] || 'Logo Page', success[1] ] }
              .sort_by! { |story| story[1] }.reverse!
      end
  end

  def referrer_types_chart_json story = nil, start_date = 30.days.ago.to_date, end_date = Date.today
    if story.nil?
      visitor_actions_conditions = { company_id: self.id }
    else
      visitor_actions_conditions = { company_id: self.id, success_id: story.success.id }
    end
    VisitorSession
      .select(:referrer_type)
      .joins(:visitor_actions)
      .where(visitor_actions: visitor_actions_conditions)
      .where('visitor_sessions.timestamp > ? AND visitor_sessions.timestamp < ?',
             start_date.beginning_of_day, end_date.end_of_day)
      .group_by { |session| session.referrer_type }
      .map { |type, records| [type, records.count] }
  end

  def actions_table_json story = nil, start_date = 30.days.ago.to_date, end_date = Date.today
    if story.nil?
      visitor_actions_conditions = { company_id: self.id }
    else
      visitor_actions_conditions = { company_id: self.id, success_id: story.success.id }
    end
    VisitorAction.distinct
      .joins(:visitor_session, :visitor)
      .where(visitor_actions_conditions)
      .where('visitor_actions.timestamp > ? AND visitor_actions.timestamp < ?',
             start_date.beginning_of_day, end_date.end_of_day)
      .group_by('visitor_actions.timestamp, visitor_actions.description', 'visitors.id' )
      .count
  end

  # when scheduling, make sure this doesn't collide with clicky:update
  # possible to check on run status of rake task?
  def send_analytics_update
    visitors = Rails.cache.fetch("#{self.subdomain}/visitors-chart-default") do
                 self.visitors_chart_json
               end
    total_visitors = 0
    visitors.each { |group| total_visitors += group[1] }
    # columns as days or weeks?
    # xDelta is the difference in days between adjacent columns
    if visitors.length == 1  # 1 day
      xDelta = 0;
    elsif visitors.length > 1
      xDelta = (visitors[1][0].to_date - visitors[0][0].to_date).to_i
      xDelta += 365 if xDelta < 0  # account for ranges that span new year
    end
    if xDelta <= 1
      axesLabels = ['Day', 'Visitors']
    elsif xDelta === 7
      axesLabels = ['Week starting', 'Visitors'];
    else
      axesLabels = ['Month', 'Visitors'];
    end
    # don't bother applying axes labels if there is no data ...
    # visitors.unshift(axesLabels) if visitors.length > 0

    # referrer_types = Rails.cache.fetch("#{self.subdomain}/referrer-types-default") do
    #                    self.visitors_chart_json
    #                  end
    {
      visitors: Gchart.bar({
                  data: visitors
                  # title: "Unique Visitors - #{total_visitors}"
                  # hAxis: { title: axesLabels[0] }
                  # vAxis: { title: axesLabels[1], minValue: 0 }
                  # legend: { position: 'none' }
                }),
      referrer_types: nil
    }

  end

  private

  def fill_daily_gaps visitors, start_date, end_date
    all_dates = []
    if visitors.empty?
      (end_date - start_date).to_i.times do |i|
        all_dates << [(start_date + i).strftime("%-m/%-d"), 0]
      end
      return all_dates
    end
    first_dates = []
    (Date.strptime(visitors[0][0], "%m/%d/%y") - start_date).to_i.times do |index|
      first_dates << [(start_date + index).strftime("%-m/%-d/%y"), 0]
    end
    # check for gaps in the middle of the list, but only if at least two are present
    if visitors.length >= 2
      all_dates = first_dates +
        visitors.each_cons(2).each_with_index.flat_map do |(prev_date, next_date), index|
          prev_datep = Date.strptime(prev_date[0], '%m/%d/%y')
          next_datep = Date.strptime(next_date[0], '%m/%d/%y')
          return_arr = [prev_date]
          delta = (next_datep - prev_datep).to_i
          if delta > 1
            (delta - 1).times do |i|
              return_arr.insert(1, [(next_datep - (i + 1)).strftime("%-m/%-d"), 0])
            end
          end
          if (index == visitors.length - 2)
            return_arr << next_date
          else
            return_arr
          end
        end
    else
      all_dates = first_dates + visitors
    end
    end_delta = (end_date - Date.strptime(all_dates.last[0], "%m/%d/%y")).to_i
    end_delta.times do
      all_dates << [(Date.strptime(all_dates.last[0], "%m/%d/%y") + 1).strftime("%-m/%-d/%y"), 0]
    end
    # get rid of the year
    all_dates.map { |date| [date[0].sub!(/\/\d+$/, ''), date[1]] }
  end

  def fill_weekly_gaps visitors, start_date, end_date
    first_weeks = []
    ((Date.strptime(visitors[0][0], "%m/%d/%y") -
        start_date.beginning_of_week).to_i / 7).times do |index|
      first_weeks << [(start_date.beginning_of_week + index*7).strftime("%-m/%-d/%y"), 0]
    end
    # check for gaps in the middle of the list, but only if at least two are present
    if visitors.length >= 2
      all_weeks = first_weeks +
        visitors.each_cons(2).each_with_index.flat_map do |(prev_week, next_week), index|
          prev_weekp = Date.strptime(prev_week[0], '%m/%d/%y')
          next_weekp = Date.strptime(next_week[0], '%m/%d/%y')
          return_arr = [prev_week]
          delta = (next_weekp - prev_weekp).to_i
          delta /= 7
          if delta > 1
            (delta - 1).times do |i|
              return_arr.insert(1, [(next_weekp - ((i + 1)*7)).strftime("%-m/%-d/%y"), 0])
            end
          end
          if (index == visitors.length - 2)
            return_arr << next_week
          else
            return_arr
          end
        end
    else
      all_weeks = first_weeks + visitors
    end
    end_delta = (end_date.beginning_of_week -
                 Date.strptime(all_weeks.last[0], "%m/%d/%y")).to_i
    end_delta /=7
    end_delta.times do
      all_weeks << [(Date.strptime(all_weeks.last[0], "%m/%d/%y") + 1.week).strftime("%-m/%-d/%y"), 0]
    end
    # get rid of the year
    all_weeks.map { |week| [week[0].sub!(/\/\d+$/, ''), week[1]] }
  end


end
