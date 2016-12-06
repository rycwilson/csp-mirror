class VisitorSession < ActiveRecord::Base

  belongs_to :visitor
  has_many :visitor_actions, dependent: :destroy
  has_many :successes, through: :visitor_actions

  @last_session = self.all.sort_by { |session| session.clicky_session_id }.last

  # capture the last session to have been downloaded, for use in
  # parsing response to rake clicky:download
  class << self
    attr_accessor :last_session
  end

end
