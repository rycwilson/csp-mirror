FactoryBot.define do
  factory :success do
    name { Faker::Lorem.sentence }
    customer 
    company
    association :curator, factory: :user

    factory :success_with_contributions do
      transient do
        contributions_count { 3 }
      end

      # after(:build) do |success, evaluator|
      #   build_list(:contribution, evaluator.contributions_count, success: success)
      # end

      contributions do
        Array.new(contributions_count) { association(:contribution) }
      end
    end

    factory :success_with_story_categories do
      after(:create) do |success, evaluator|
        create_list(:story_category, 3, company: success.company, successes: [success])
      end
    end

    trait :with_story do 
      association :story
    end
  end
end