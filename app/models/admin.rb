class Admin < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  attr_accessor :admin_access_code
  validates :admin_access_code,
    on: :create,
    presence: true,
    inclusion: { in: ["narrate_csp_admin"] }

end
