class StoryCategory < ActiveRecord::Base

  include FriendlyId

  belongs_to :company

  has_many :story_categories_successes, dependent: :destroy
  has_many :successes, through: :story_categories_successes

  validates :name, presence: true
  validates_uniqueness_of :name, scope: :company_id

  friendly_id :name, use: [:slugged, :scoped], scope: :company_id

  def should_generate_new_friendly_id?
    new_record? || name_changed? || slug.blank?
  end

end
