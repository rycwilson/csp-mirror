class AdwordsImage < ApplicationRecord

  attr_accessor :is_default_card  # for distinguishing default (static) image cards from dynamic

  belongs_to :company
  has_and_belongs_to_many :adwords_ads
  alias_attribute :ads, :adwords_ads
  has_many :stories, through: :adwords_ads

  scope :default, -> { where(default: true) }
  scope :marketing, -> { where(type: ['SquareImage', 'LandscapeImage']) }
  scope :logo, -> { where(type: ['SquareLogo', 'LandscapeLogo']) }
  scope :square, -> { where(type: ['SquareImage', 'SquareLogo']) }
  scope :landscape, -> { where(type: ['LandscapeImage', 'LandscapeLogo']) }

  validates_presence_of :company  # https://launchacademy.com/blog/validating-associations-in-rails
  # validates_presence_of :type, # SquareLogo, LandscapeLogo, SquareImage, LandscapeImage
  # validates_presence_of :image_url  # check for specific format (csp or maybe google)
  
  # upload to gads regardless of company.promote_tr
  # validates_presence_of :asset_id
  # before_validation :upload_to_google, on: :create

  # https://medium.com/appaloosa-store-engineering/caution-when-using-before-destroy-with-model-association-71600b8bfed2
  # before_destroy :update_ads, prepend: true, if: :promote_enabled?

  after_destroy_commit { S3Util::delete_object(S3_BUCKET, image_url) }

  private

  def promote_enabled?
    self.company.promote_tr?
  end

  def upload_to_google
    # GoogleAds::upload_image_asset(self)
  end

  def update_ads
    # only required images need to be replaced => SquareImage or LandscapeImage
    # don't just refer to self.ads here, or ads will be assigned by reference and will
    # empty once images have been disassociated
    ads.each do |ad|
      ad.images.delete(self)
      if ad.images.marketing.square.blank?
        ad.images << company.ad_images.default.marketing.square.take
      end
      if ad.images.marketing.landscape.blank?
        ad.images << company.ad_images.default.marketing.landscape.take
      end
    end
    # GoogleAds::update_ads(ads)
  end

end
