class UserMailer < ApplicationMailer

  default from: 'noreply@customerstories.net'

  def cron_email body
    @body = body
    mail to: '***REMOVED***', subject: 'testing cron emailer'
  end

  # TODO: How to handle errors/exceptions for sending email?
  def request_contribution contribution, contributor
    curator = contribution.success.curator
    company = curator.company
    template_name = contribution.role + "_request"
    template = company.contribution_emails.where(name:template_name).take
    contribution_url = "http://#{ENV['HOST_NAME']}/contributions/#{contribution.id}/contribution"
    feedback_url = "http://#{ENV['HOST_NAME']}/contributions/#{contribution.id}/feedback"
    opt_out_url = "http://#{ENV['HOST_NAME']}/contributions/#{contribution.id}/opt_out"

    subject = template.subject
                  .sub("[customer_name]", contribution.success.customer.name)
                  .sub("[company_name]", company.name)

    @body = template.body
                  .sub("[contributor_first_name]", contributor.first_name)
                  .sub("[curator_first_name]", curator.first_name)
                  .sub("[contribution_url]", contribution_url)
                  .sub("[feedback_url]", feedback_url)
                  .sub("[curator_full_name]", curator.full_name)
                  .sub("[curator_company]", company.name)
                  .sub("[curator_email]", curator.email)
                  .sub("[curator_phone]", "123-456-7890")
                  .sub("[opt_out_url]", opt_out_url)
                  .html_safe

    mail to: contributor.email, subject: subject

  end

end


