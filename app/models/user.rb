# TODO: check validations - client and server side
# use Bootstrap Validator on client side if necessary
class User < ActiveRecord::Base

  belongs_to :company
  has_many :contributions # contributor, no (dependent: :destroy)
  has_many :successes # curator, no (dependent: :destroy)

  # Adding signup code for beta control
  attr_accessor :sign_up_code
  validates :sign_up_code,
    on: :create,
    presence: true,
    inclusion: { in: ["csp_beta"] }

  # Include default devise modules. Others available are:
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :lockable#, :confirmable

  def full_name
    self.first_name + " " + self.last_name
  end

  def is_admin?
    self.role == 1
  end

  # This is for users signing up via Oauth
  # Not presently using this, but may in the future
  # def self.create_from_omniauth auth
  #   create! do |user|
  #     user.provider = auth["provider"]
  #     user.uid = auth["uid"]
  #     # user.name = auth["info"]["nickname"]
  #   end
  # end

end
