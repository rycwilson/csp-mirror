class StoriesController < ApplicationController

  include StoriesHelper

  before_action :set_company, only: [:index, :show, :create, :approval]
  before_action :set_public_story_or_redirect, only: :show
  before_action :set_story, only: [:edit, :approval]
  before_action :set_contributors, only: [:show, :approval]
  before_action :user_authorized?, only: :edit
  before_action :set_s3_direct_post, only: :edit

  def index
    @is_curator = company_curator? @company.id
    # select box options (filtered by role) ...
    @category_select_options = @is_curator ?
                    @company.category_select_options_all.unshift(["All", 0]) :
                    @company.category_select_options_filtered  # public reader
    @product_select_options = @is_curator ?
                  @company.product_select_options_all.unshift(["All", 0]) :
                  @company.product_select_options_filtered  # public reader
    # if there's a query string, the option will be pre-selected, otherwise no pre-selects
    @category_pre_selected_options = []
    @product_pre_selected_options = []
    # async requests ...
    if params[:filter]
      @story_tiles = @company.filter_stories_by_tag params[:filter], @is_curator
      respond_to do |format|
        format.json do
          render json: {
            filter_slug: get_filter_slug(params[:filter]),
            is_curator: @is_curator,
            story_tiles: @story_tiles.to_json(
                             include: { story: { only: [:id, :slug, :published] },
                            products: { only: :slug },
                            customer: { only: [:slug, :logo_url] } } )
          }
        end
      end
    # sync requests ...
    elsif valid_query_string? params
      @story_tiles = @company.filter_stories_by_tag get_filter_params_from_query(params), @is_curator
      @category_pre_selected_options = [StoryCategory.friendly.find(params[:category]).id] if params[:category]
      @product_pre_selected_options = [Product.friendly.find(params[:product]).id] if params[:product]
    elsif @is_curator
      @story_tiles = @company.all_stories
    else  # public reader
      @story_tiles = @company.stories_with_logo_published
    end
  end

  def show
  end

  def edit
    @company = current_user.company # company_id not in the stories#edit route
    @customer = @story.success.customer
    @contributions_pre_request = Contribution.pre_request @story.success_id
    @contributions_in_progress = Contribution.in_progress @story.success_id
    @contributions_next_steps = Contribution.next_steps @story.success_id
    @contributions_contributors = Contribution.contributors @story.success_id
    @contributions_connections = Contribution.connections @story.success_id
    @categories = @company.category_select_options_all
    @categories_pre_select = @story.success.story_categories
                                   .map { |category| category.id }
    @products = @company.product_select_options_all
    @products_pre_select = @story.success.products
                                 .map { |category| category.id }
    @referrer_select = @story.success.contributions
                             .map { |c| [ c.contributor.full_name, c.contributor.id ] }
                             .unshift( [""] )
    @results = @story.success.results
    @prompts = @story.success.prompts
    # this is needed for the Result delete button...
    @base_url = request.base_url
  end

  # Notice how nested hash keys are treated as strings in the params hash
  # -> due to the way form parameters are name-spaced
  def create
    new_story = params[:story]
    if new_customer new_story[:customer]
      customer = Customer.new name: new_story[:customer], company_id: @company.id
      unless customer.save
        @flash_mesg = "Customer field can't be blank"
        respond_to { |format| format.js { render action: 'create_error' } } and return
      end
    else
      customer = Customer.find new_story[:customer]
    end
    success = Success.create customer_id: customer.id, curator_id: current_user.id
    story = Story.new title: new_story[:title], success_id: success.id
    if story.save
      story.assign_tags new_story
      story.success.create_default_prompts
      flash[:success] = "Story created successfully"
      # prevent js response from killing flash message
      flash.keep(:success)
      @redirect = File.join request.base_url, edit_story_path(story.id)
      respond_to { |format| format.js { render action: 'create_success' } }
    else
      @flash_mesg = story.errors.full_messages.join(', ')
      respond_to { |format| format.js { render action: 'create_error' } }
    end
  end

  def update
    story = Story.find params[:id]
    if params[:story_tags]  # updated tags (this comes from a hidden field with value="")
      story.update_tags params[:story]
      respond_to { |format| format.js { render action: 'update_tags' } }
    elsif params[:customer_logo_url]
      story.success.customer.update logo_url: params[:customer_logo_url]
      respond_to { |format| format.json { render json: nil } }
    elsif params[:prompt]  # a prompt was edited
      Prompt.find(params[:prompt_id].to_i).update description: params[:prompt][:description]
      respond_to { |format| format.json { render json: nil } }
    # params[:story]* items must appear below, else error
    # (there is no params[:story] when params[:story_tags] or params[:result] are present)
    elsif params[:story][:content]
      story.update content: params[:story][:content]
      @new_content = story.content
      respond_to { |format| format.js { render action: 'update_content' } }
    elsif params[:story][:new_prompt]
      story.success.prompts << Prompt.create(description: params[:story][:new_prompt])
      @prompts = story.success.prompts
      @story_id = story.id
      @base_url = request.base_url  # needed for deleting a result
      respond_to { |format| format.js { render action: 'create_prompt_success' } }
    elsif params[:story][:embed_url]  # embedded video
      if params[:story][:embed_url].match(/youtube/)
        youtube_id = params[:story][:embed_url].match(/v=(?<id>.+)/)[:id]
        story.update embed_url: "https://www.youtube.com/embed/#{youtube_id}"
      elsif params[:story][:embed_url].match(/vimeo/)
        vimeo_id = params[:story][:embed_url].match(/\/(?<id>\d+)$/)[:id]
        story.update embed_url: "https://player.vimeo.com/video/#{vimeo_id}"
      end
      # respond with json because we need to update the video iframe
      # with the modified url ...
      respond_to do |format|
        format.json { render json: story.as_json(only: :embed_url) }
      end
    elsif params[:story][:published]
      update_publish_state story, params[:story]
      respond_to do |format|
        # respond with the (possibly modified over user selection) publish state,
        # so client js can make necessary adjustments
        format.json { render json: story,
                             only: [:published, :logo_published] }
      end
    else  # all other updates
      respond_to do |format|
        if story.update story_params
          # format.html { redirect_to(@story, :notice => 'Story was successfully updated.') }
          format.json { respond_with_bip(story) }
        else
          # format.html { render :action => "edit" }
          # format.json { respond_with_bip(story) }
        end
      end
    end
  end

  def destroy
    story = Story.find params[:id]
    story.destroy
    redirect_to company_path(current_user.company_id),
        flash: { info: "Story '#{story.title}' was deleted" }
  end

  def approval
    respond_to do |format|
      format.pdf do
        render pdf: "#{@company.subdomain}-customer-story-#{@story.success.customer.slug}",
               template: "stories/approval.pdf.erb",
               locals: { story: @story,
                         company: @company,
                         customer_name: @story.success.customer.name,
                         contributors: @contributors },
               footer: { right: '[page] of [topage]' }
        end
    end
  end

  private

  def story_params
    params.require(:story).permit(:title, :quote, :quote_attr, :embed_url, :situation,
        :challenge, :solution, :benefits, :published, :logo_published)
  end

  def set_story
    @story = Story.find params[:id]
  end

  # Why not just always look to the subdomain?
  # => lookup by id faster
  def set_company
    if params[:company_id]  # create story
      @company = Company.find params[:company_id]
    else  # index
      @company = Company.find_by subdomain: request.subdomain
    end
  end

  def set_contributors
    @contributors =
        User.joins(own_contributions: { success: {} })
            .where(contributions: { linkedin: true },
                       successes: { id: @story.success_id })
            .order("CASE contributions.role
                      WHEN 'customer' THEN '1'
                      WHEN 'partner' THEN '2'
                      WHEN 'sales' THEN '3'
                    END")
    # add the curator if he hasn't already been added ...
    @contributors << @story.success.curator unless @contributors.any? { |c| c.email == @story.success.curator.email }
  end

  # new customers can be created on new story creation
  # the customer field's value will be either a number (db id of existing customer),
  # or a string (new customer)
  # this method ensures that a number is treated as a number and a string is
  # treated as a string, e.g. "3M" is treated as a string
  def new_customer customer
    !Float(customer)  # if a number then customer already exists -> return false
    rescue ArgumentError  # if error then customer is a string -> return true
      true
  end

  # if we're here, it means the router allowed through a valid path:
  # /:customer/:product/:title OR /:customer/:title
  # (valid => these resources exist AND exist together)
  # => @story can't be nil
  #
  # method will set the public story if published or if curator,
  # else it will redirect to ...
  #   - the correct link if outdated slug is used
  #   - company's story index if not published or not curator
  def set_public_story_or_redirect
    @story = Story.friendly.find params[:title]
    if request.format == 'application/pdf'
      @story
    elsif request.path != @story.csp_story_path
      # old story title slug, redirect to current
      return redirect_to @story.csp_story_path, status: :moved_permanently
    elsif !@story.published? && !company_curator?(@company.id)
      return redirect_to root_url(subdomain:request.subdomain, host:request.domain)
    end
  end

  def user_authorized?
    if current_user.company_id == Story.find(params[:id]).success.customer.company.id
      true
    else
      render file: 'public/403', status: 403, layout: false
      false
    end
  end

  def update_publish_state story, story_params
    publish_story = story_params[:published] == '1' ? true : false
    publish_logo = story_params[:logo_published] == '1' ? true : false
    # only update if the value has changed ...
    if publish_story && !story.published?
      story.published = true
      story.publish_date = Time.now
    elsif !publish_story && story.published?
      story.published = false
      story.publish_date = nil
    elsif publish_logo && !story.logo_published?
      story.logo_published = true
      story.logo_publish_date = Time.now
    elsif !publish_logo && story.logo_published?
      story.logo_published = false
      story.logo_publish_date = nil
    end
    # prevent false state ...
    if (publish_story && !publish_logo) && story.published_changed?
      story.logo_published = true
      story.logo_publish_date = Time.now
    elsif (publish_story && !publish_logo) && story.logo_published_changed?
      story.published = false
      story.publish_date = nil
    end
    story.save
  end

  # async filter requests may contain either the tag's numeric id or its slug
  # if id, look up the slug and return.  if slug, just return
  def get_filter_slug filter_params
    if filter_params[:id] == '0'  # all -> query string to be removed, no slug needed
      return nil
    elsif filter_params[:id].to_i == 0  # params already contain slug (instead of numeric id)
      filter_params[:id]
    elsif filter_params[:tag] == 'category'
      StoryCategory.find(filter_params[:id]).slug
    elsif filter_params[:tag] == 'product'
      Product.find(filter_params[:id]).slug
    else
      # error
    end
  end

  # check validity of query string parameters
  # at this point, only category or product are acceptable
  def valid_query_string? params
    return false if request.query_string.blank?
    company = Company.find_by subdomain: request.subdomain
    query_hash = Rack::Utils.parse_nested_query request.query_string
    valid_category = params.try(:[], :category) &&
                StoryCategory.joins(successes: { customer: {} })
                             .where(slug: params[:category],
                                    customers: { company_id: company.id } )
                             .present?
    valid_product = params.try(:[], :product) &&
                      Product.joins(successes: { customer: {} })
                             .where(slug: params[:product],
                                    customers: { company_id: company.id } )
                             .present?
    if query_hash.length === 1 && (valid_category || valid_product)
      true
    else
      redirect_to(root_path, flash: { warning: "That page doesn't exist" }) and return false
    end
  end

  # since we've already passed valid_query_string? method,
  # we know params and data are legit
  def get_filter_params_from_query params
    filter = {}
    if params[:category]
      filter[:tag] = 'category'
      filter[:id] = StoryCategory.friendly.find(params[:category]).id
    elsif params[:product]
      filter[:tag] = 'product'
      filter[:id] = Product.friendly.find(params[:product]).id
    else
      # error - should only be in this method if there was
      # a query string with category= or product=
    end
    filter
  end

end
