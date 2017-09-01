
class CrowdsourcingTemplatesController < ApplicationController

  before_action() { @company = Company.find(params[:company_id]) }
  before_action({ except: [:new, :create] }) do
    @template = params[:id] == '0' ? nil : CrowdsourcingTemplate.find(params[:id])
  end

  def new
    @template = CrowdsourcingTemplate.new
    render({
      partial: 'companies/settings/crowdsourcing_template_form',
      locals: { company: @company, template: @template, method: 'post',
                url: company_crowdsourcing_templates_path(@company) }
    })
  end

  def show
  end

  def edit
    @template.format_for_editor(current_user)
    render({
      partial: 'companies/settings/crowdsourcing_template_form',
      locals: { company: @company, template: @template, method: 'put',
                url: company_crowdsourcing_template_path(@company, @template) }
    })
  end

  def create
    binding.remote_pry
  end

  def update
    update_templates_questions(@template, template_params[:contributor_questions_attributes])
    if @template.update(template_params)
      @contributor_questions_grouped_select2_options =
        @company.contributor_questions.grouped_select2_options(@template)
    end
  end

  def destroy
  end

  private

  def template_params
    params.require(:crowdsourcing_template)
          .permit(:name, :request_subject, :request_body,
                  { contributor_questions_attributes: [:id, :company_id, :question, :_destroy] })
  end

  # def contributor_questions_grouped_options (company, template)

  # end

  # def contributor_questions_grouped_options_select2 (company, template)

  # end

  # method adds a new crowdsourcing_template.contributor_question association
  def update_templates_questions (template, question_params)
    question_params.each do |index, attrs|
      # new association
      if attrs[:id] && template.contributor_questions.find_by(id: attrs[:id]).nil?
        template.contributor_questions << ContributorQuestion.find(attrs[:id])
      end
    end
  end

end
