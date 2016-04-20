Rails.application.routes.draw do

  devise_for :admins
  ## TODO!!!  Add route for devise Admin scope to the RailsAdmin page(s) /admin
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'

  # valid subdomains (company/subdomain exists, excludes www)
  constraints(Subdomain) do

    get '/', to: 'stories#index'

    # Stories - public access
    resources :stories, only: :index
    # see below for route to public story page

    # Company home / Story curation - authentication required
    authenticate :user do
      resources :companies, only: [:show, :edit, :update] do
        resources :stories, only: [:create]
      end
      resources :stories, only: [:edit, :update, :destroy] do
        resources :results, only: [:create, :update, :destroy]
      end

      # delete a Prompt
      delete '/prompts/:id', to: 'prompts#destroy'

      # user profile
      get   '/profile/edit', to: 'profile#edit', as: 'edit_profile'

    end

    # Email Templates
    resources :email_templates, only: [:show, :update]
    post   '/email_templates/:id/test', to: 'email_templates#test'


    # Contributions
    post  '/stories/:id/contributions', to: 'contributions#create',
                                        as: 'story_contributions'
    put   '/contributions/:id/request_contribution',
                    to: 'contributions#request_contribution',
                    as: 'request_contribution'
    get   '/contributions/:id/confirm', to: 'contributions#confirm',
                                        as: 'confirm_contribution'
    # type is: contribution, feedback, unsubscribe, opt_out
    get   '/contributions/:token/:type', to: 'contributions#edit',
                                         as: 'edit_contribution',
                    constraints: { type: /(contribution|feedback|unsubscribe|opt_out)/ }
    # this route returns json data for the contribution
    # presently only need this when removing a linkedin_url from a contribution
    get   '/contributions/:id', to: 'contributions#show'
    put   '/contributions/:token', to: 'contributions#update',
                                   as: 'contribution'

    # LinkedIn Oauth2 (omniauth gem)
    get '/auth/linkedin/callback', to: 'profile#linkedin_callback'

    # need to pick up on devise sign-in route here, without doing so explicitly
    # as that will conflict with devise routes declared below
    # 'method' instead of 'action' - latter is keyword with its own params entry
    devise_scope :user do
      get '/:devise/:method', to: 'users/sessions#new',
                     constraints: { devise: 'users', method: 'sign_in' }
    end


    # public story route moved down here so it doesn't hijack any other routes
    # don't call this route 'story' or it will leave the PUT and DELETE routes (above)
    # without an alias
    get '/:customer/:product/:title', to: 'stories#show', as: 'public_story'

    # broken links
    get '/*all', to: 'site#valid_subdomain_bad_path'

  end

  # all other subdomains
  get '/*all', to: 'site#strip_subdomain', constraints: { subdomain: 'www' }
  get '/', to: 'site#invalid_subdomain', constraints: { subdomain: /.+/ }
  get '/*all', to: 'site#invalid_subdomain', constraints: { subdomain: /.+/ }

  root 'site#index'

  # these will be without subdomain
  resources :companies, only: [:new, :create]

  # user profile - company not registered (Curator or Contributor)
  # (need to give the route a different alias to distinguish from the one
  #  under subdomains)
  get   '/profile/edit', to: 'profile#edit', as: 'edit_profile_no_company'

  # above comments about distinguishing the route apply to below as well
  #
  # this route is for the case of a Contributor being logged in (no subdomain)
  # and updating a Contribution by checking or unchecking a LinkedIn Profile box
  put   '/contributions/:token', to: 'contributions#update', as: 'contribution_no_company'

  # LinkedIn Oauth2 (omniauth gem)
  get '/auth/linkedin/callback', to: 'profile#linkedin_callback'

  # devise_for :admin

  devise_for :users, controllers: {
      sessions: 'users/sessions',
      registrations: 'users/registrations',
      passwords: 'users/passwords',
      confirmations: 'users/confirmations',
      unlocks_controller: 'users/unlocks',
      omniauth_callbacks_controller: 'users/omniauth_callbacks'
    }

  # Store Front
  get '/product', to: 'site#store_front'
  get '/plans', to: 'site#store_front'
  get '/our-company', to: 'site#store_front'
  get '/team', to: 'site#store_front'
  get '/tos', to: 'site#store_front', as: 'tos'
  get '/privacy', to: 'site#store_front'
  get '/our-story', to: 'site#store_front'

end
