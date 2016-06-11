class Success < ActiveRecord::Base

  belongs_to :company
  belongs_to :customer
  belongs_to :curator, class_name: 'User', foreign_key: 'curator_id'

  has_one :story, dependent: :destroy
  has_many :visitors, dependent: :destroy
  has_many :products_successes, dependent: :destroy
  has_many :products, through: :products_successes
  has_many :story_categories_successes, dependent: :destroy
  has_many :story_categories, through: :story_categories_successes
  has_many :contributions, dependent: :destroy
  has_many :results, dependent: :destroy
  has_many :prompts, dependent: :destroy
  # alias the association to user -> Success.find(id).contributors
  # note: contributor is an alias - see contribution.rb
  has_many :contributors, through: :contributions, source: :contributor

  def create_default_prompts
    self.prompts << Prompt.create(description: "What was the challenge?")
    self.prompts << Prompt.create(description: "What was the solution?")
    self.prompts << Prompt.create(description: "What are your estimated or measured results?")
  end

end

