class ProfileController < ApplicationController

  before_action :set_company, only: :edit
  before_action only: [:edit] { set_gon(@company) }  # @company may be nil -> ok
  before_action :set_s3_direct_post, only: [:linkedin_callback, :edit]

  def linkedin_callback
    if user_signed_in?  # company admin or curator
      # always want to update the linkedin_url field,
      # but the others only update conditionally (i.e. only if nil)
      current_user.linkedin_url = auth_hash[:info][:urls][:public_profile]
      current_user.phone ||= auth_hash[:info][:phone]
      current_user.title ||= auth_hash[:info][:description]
      if current_user.save
        # TODO: log the auth_hash
        if current_user.company_id.present?
          flash[:success] = 'Account setup complete'
          redirect_to company_path(current_user.company_id)
        else
          flash[:info] = 'Connected to LinkedIn'
          redirect_to edit_profile_no_company_path
        end
      else
        # flash.now[:danger] = "Problem updating linkedin_url field for #{}"
      end
    else # contributor
      contribution = Contribution.find(request.env["omniauth.params"]["contribution"])
      contribution.contributor.update linkedin_url: auth_hash[:info][:urls][:public_profile]
      redirect_to confirm_contribution_path(request.env["omniauth.params"]["contribution"], linkedin_oauth_connect: true)
    end
  end

  def edit
    @user = current_user
  end

  def update
  end

  def destroy
  end

  protected

  def auth_hash
    request.env['omniauth.auth']
  end

  private

  def set_company
    @company = current_user.company
  end

end
