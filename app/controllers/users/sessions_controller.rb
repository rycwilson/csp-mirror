# http://stackoverflow.com/questions/6234045/how-do-you-access-devise-controllers

class Users::SessionsController < Devise::SessionsController
  # before_filter :configure_sign_in_params, only: [:create]

  # if attempting to log in through a subdomain (in the url, not in the form),
  # validate that request.subdomain matches the user.company.subdomain
  # this callback assumes the user exists.
  before_action only: :create do
    if request.subdomain.present?
      validate_user_subdomain(request.subdomain, params[:user][:email])
    end
  end

  # GET /resource/sign_in
  def new
    super
  end

  # POST /resource/sign_in
  def create
    super
  end

  # DELETE /resource/sign_out
  def destroy
    super
  end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.for(:sign_in) << :attribute
  # end

  private

  def validate_user_subdomain subdomain, email
    if User.find_by(email: email).try(:company).try(:subdomain) == subdomain
      true
    else
      # kill session since user is already logged in at this point (not sure why!)
      request.reset_session
      redirect_to(root_url(host: request.domain), flash: { danger: "Not authorized"}) and return false
    end
  end

end
