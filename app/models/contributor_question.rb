class ContributorQuestion < ActiveRecord::Base

  belongs_to :company
  has_many :templates_questions, dependent: :destroy
  has_many :crowdsourcing_templates, through: :templates_questions

end
