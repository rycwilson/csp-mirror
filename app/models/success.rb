class Success < ActiveRecord::Base

  belongs_to :customer
  has_one :story, dependent: :destroy
  has_many :visitors, dependent: :destroy
  has_many :products_successes, dependent: :destroy
  has_many :products, through: :products_successes
  has_many :product_cats_successes, dependent: :destroy
  has_many :product_categories, through: :product_cats_successes
  has_many :industries_successes, dependent: :destroy
  has_many :industry_categories, through: :industries_successes

end

