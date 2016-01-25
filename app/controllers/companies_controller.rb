class CompaniesController < ApplicationController

  # aws docs suggest first four actions, currently only need last one
  before_action :set_s3_direct_post, only: [:new, :edit, :create, :update, :show]
  before_action :set_company, only: :update

  # GET /companies/new
  def new
    @company = Company.new
    render :show
  end

  # GET /companies/:id
  def show
    # TODO: what's the best balance of eager vs. lazy loading?
    # e.g. we're not eager loading products here...
    @company = Company.includes(:customers, :successes, :stories, :visitors).find params[:id]
    @customers = @company.customers_select
    @product_categories = @company.product_categories_select # multiple select
    @product_cats_pre_select = @company.product_categories.map { |category| category.id }
    @products = @company.products_select # single select (for now)
    @products_pre_select = @company.products.map { |product| product.id }
    @industries = @company.industries_select # multiple select
    @industries_pre_select = @company.industry_categories.map { |category| category.id }
  end

  def edit
  end

  def create
    @company = Company.new company_params
    if @company.save
      @company.users << current_user
      @company.create_tags(params[:tags]) if params[:tags]
      @company.create_email_templates
      redirect_to company_path(@company), flash: { success: "Registered company ok" }
    else
      # validation(s): presence / uniqueness of name
      flash.now[:danger] = "#{@company.errors.full_messages}"
      # default industry categories
      @industries = INDUSTRIES
      render :show
    end

  end

  def update
    @company.update_tags(params[:company_tags]) if params[:company_tags]
    if @company.update company_params
      redirect_to company_path(@company), flash: { success: "Changes saved" }
    else
      # can't render because we need to load select boxes
      redirect_to company_path(@company), flash: { danger: "Error saving changes"}
    end
  end

  private

  def company_params
    params.require(:company).permit(:name, :logo_url)
  end

  def set_company
    @company = Company.find params[:id]
  end

  def set_s3_direct_post
    @s3_direct_post = S3_BUCKET.presigned_post(key: "uploads/#{SecureRandom.uuid}/${filename}", success_action_status: '201', acl: 'public-read')
  end

end
