Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # for viewing via mobile on local network:
  # get localhost IP from system preferences => network (here it's 192.168.1.3)
  # point mobile browser to [subdomain].192.168.1.3.xip.io:3000  
  # config.action_dispatch.tld_length = 5

  # this ensures subdomans work properly in dev environment (was originally in session_store.rb)
  # ref http://stackoverflow.com/questions/10402777
  config.session_store(:cookie_store, key: '_csp_session', domain: 'lvh.me', tld_length: 2)

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # Enable/disable caching. By default caching is disabled.
  # Run rails dev:cache to toggle caching.
  if Rails.root.join('tmp', 'caching-dev.txt').exist?
    config.action_controller.perform_caching = true

    # Rails 4:
    # config.cache_store = dalli_store,
    #                      'localhost:11211',
    #                      {
    #                         :failover => true,
    #                         :socket_timeout => 1.5,
    #                         :socket_failure_delay => 0.2,
    #                         :down_retry_delay => 60,
    #                         :pool_size => 5  # server threads/concurrency
    # 

    # config.cache_store = :memory_store
    config.cache_store = :mem_cache_store
    config.public_file_server.headers = {
      'Cache-Control' => "public, max-age=#{2.days.to_i}"
    }
  else
    config.action_controller.perform_caching = false
    config.cache_store = :null_store
  end

  # Store uploaded files on the local file system (see config/storage.yml for options)
  config.active_storage.service = :local

  # by default, emails won't send in development environment
  # change this:
  config.action_mailer.perform_deliveries = true
  config.action_mailer.perform_caching = false
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.default_url_options = { host: ENV['HOST_NAME'] }
  ActionMailer::Base.smtp_settings = {
    :address        => 'smtp.sendgrid.net',
    :port           => '587',
    :authentication => :plain,
    :user_name      => ENV['SENDGRID_USERNAME'],
    :password       => ENV['SENDGRID_PASSWORD'],
    :enable_starttls_auto => true
  }

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Suppress logger output for asset requests.
  config.assets.quiet = true

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true

  # Use an evented file watcher to asynchronously detect changes in source code,
  # routes, locales, etc. This feature depends on the listen gem.
  # config.file_watcher = ActiveSupport::EventedFileUpdateChecker
end
