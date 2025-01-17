# http://stackoverflow.com/questions/6234045/how-do-you-access-devise-controllers

class Users::RegistrationsController < Devise::RegistrationsController
  IMITABLE_USERS = [
    'Dan acme-test',
    'Dan Lindblom',
    'Dan Demo',
    'Ryan Wilson',
    'Ryan Palo',
    'Bill Lee',
    'Carlos Ramon',
    'Kevin Turner',
    'Heather Annesley',
    'Haley Fraser',
    'Rachelle Benson'
  ]

  layout('landing')
  respond_to :html, :js

  before_action(:configure_sign_in_params, only: [:create])
  before_action(:configure_account_update_params, only: [:update])
  before_action(:set_preserved_form_data, only: [:new])

  # GET /resource/sign_up
  def new
    super
  end

  # POST /resource
  def create
    # super
    build_resource(sign_up_params)

    resource.save
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        set_flash_message! :notice, :signed_up
        sign_up(resource_name, resource)
        respond_with resource, location: after_sign_up_path_for(resource)
      else
        set_flash_message! :notice, :"signed_up_but_#{resource.inactive_message}"
        expire_data_after_sign_in!
        respond_with resource, location: after_inactive_sign_up_path_for(resource)
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      # respond_with resource
      session[:sign_up_email] = resource.email
      session[:sign_up_first_name] = resource.first_name
      session[:sign_up_last_name] = resource.last_name
      redirect_back(
        fallback_location: { action: 'new' }, 
        flash: {
          alert: resource.errors.full_messages.map do |mesg|
            case mesg
            when 'Sign up code is not included in the list'
              'Invalid sign up code'
            else
              mesg
            end
          end
        }
      )
    end
  end

  # GET /user-profile
  def edit
    # if a request is received at the default devise route, redirect to the custom route
    redirect_to(edit_user_path) && return if request.path == edit_user_registration_path
    @is_admin = current_user.admin? || true_user.admin?
    if @is_admin
      @imitable_users = IMITABLE_USERS.flat_map do |name|
        User
          .where.not(company_id: nil)
          .where(first_name: name.split(' ').first, last_name: name.split(' ').last)
          # .map { |user| { id: user.id, email: user.email, name: "#{user.full_name} (#{user.company.name})" } }
      end
    end
    if flash[:notice]
      @toast = { type: 'success', message: 'Profile updated successfully' }
    end
    render(layout: 'application')
  end

  # PUT /resource
  def update
    # TODO: for errors, handle conflict between devise and turbo outlined here: https://discuss.hotwired.dev/t/forms-without-redirect/1606
    # => workaround is to ensure client-side validation
    super
  end

  # DELETE /resource
  def destroy
    super
  end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  def cancel
    super
  end

  protected

  # user, @user, resource are all the same thing
  def update_resource user, params
    user.send(params[:password].present? ? :update_with_password : :update_without_password, params)
    # if params[:password]
      # @password_update = true
      # resource.update_with_password(params)
    # else
      # @password_update = false
      # resource.update_without_password(params)
    # end
    # if @user.errors.present?
    #   @flash_mesg = @user.errors.full_messages.join(', ')
    #   @status = 'danger'
    # else
    #   @status = 'success'
    # end
  end

  def after_update_path_for user
    edit_user_path
  end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_up_params
  #   devise_parameter_sanitizer.for(:sign_up) << :attribute
  # end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.for(:account_update) << :attribute
  # end

  # The path used after sign up.
  def after_sign_up_path_for user
    # a page to direct them to check their email
    new_company_path
  end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end

  private

  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name, :sign_up_code, :admin_access_code])
  end

  def configure_account_update_params
    devise_parameter_sanitizer.permit(:account_update, keys: [:email, :first_name, :last_name, :photo_url, :title, :phone, :password, :password_confirmation, :current_password])
  end

  def set_preserved_form_data
    @sign_up_email = session[:sign_up_email]
    @sign_up_first_name = session[:sign_up_first_name]
    @sign_up_last_name = session[:sign_up_last_name]
    session.delete(:sign_up_email)
    session.delete(:sign_up_first_name)
    session.delete(:sign_up_last_name)
  end
end
