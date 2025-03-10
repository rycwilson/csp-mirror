class DeviseMailerPreview < ActionMailer::Preview
  # Preview this email at http://localhost:3000/rails/mailers/devise_mailer/confirmation_instructions
  def confirmation_instructions
    user = User.find_by_email params['email']
    Devise::Mailer.confirmation_instructions(user, user.confirmation_token)
  end

  def reset_password_instructions
    user = User.find_by_email params['email']
    Devise::Mailer.reset_password_instructions(user, user.reset_password_token)
  end
end