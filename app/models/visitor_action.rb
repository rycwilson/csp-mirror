class VisitorAction < ApplicationRecord

  belongs_to :company
  belongs_to :success  # could be nil if index page view
  belongs_to :visitor_session
  has_one :visitor, through: :visitor_session
  has_one :story, through: :success

  default_scope { order(:timestamp) }

end
