class WidgetsController < ApplicationController

  skip_before_action :verify_authenticity_token, only: [:script, :data]

  def script
    respond_to do |format|
      format.js { render action: 'cs' }
      # format.html - might use this at some point
    end
  end

  def data
    html = widget_html params
    respond_to do |format|
      format.js do
        # Build a JSON object containing our HTML
        json = { html: html }.to_json
        # Get the name of the JSONP callback created by jQuery
        callback = params[:callback]
        # Wrap the JSON object with a call to the JSONP callback
        jsonp = callback + "(" + json + ")"
        # Send result to the browser
        render text: jsonp, content_type: "text/javascript"
      end
    end
  end

  protected

  def widget_html params
    company_subdomain = params[:company]
    tab_color = params[:tabColor]
    font_color = params[:fontColor]
    stories_index_url = stories_url(host: company_subdomain + '.' + request.domain)
    stories_links =
         Company.find_by(subdomain: company_subdomain)
                .successes_with_logo_published
                .map do |success|
                  story = success.story
                  { logo: success.customer.logo_url,
                    link: story.published ?
                            URI.join(root_url(host: company_subdomain + '.' + request.domain),
                                     story.csp_story_path)
                            : stories_index_url }
                end
    html = "<section class='drawer' style='visibility:hidden'>
              <header class='clickme'
                style='background-color:#{tab_color};color:#{font_color}'>
                Customer Success Stories
              </header>
              <div class='drawer-content' style='border-top-color:#{tab_color}'>
                <div class='drawer-items'>
                  <div class='row row-horizon'>"

    stories_links.each do |story|
      html <<       "<div class='col-xs-4 col-sm-3 col-md-2'>
                       <a href='#{story[:link]}' class='thumbnail' target='_blank'>
                         <img src='#{story[:logo]}' alt=''>
                       </a>
                     </div>"
    end

    html <<      "</div>
                </div>
              </div>
            </section>"
  end

end