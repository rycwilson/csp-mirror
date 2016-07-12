module ApplicationHelper

  def admin_navbar_style
    company = @company || Company.find_by(name:'CSP')
    color1 = company.nav_color_1
    color2 = company.nav_color_2
    text_color = company.nav_text_color
    "background:linear-gradient(45deg, #{color1} 0%, #{color2} 100%);color:#{text_color};"
  end

  # method determines if title 'Customer Stories' should be displayed as plural
  def stories?
    (controller_name == 'companies' && action_name != 'new') ||
    (controller_name == 'stories' && action_name == 'index') ||
    (controller_name == 'profile' && current_user.company_id.present?)
  end

  def story?
    controller_name == 'stories' && ['show', 'edit'].include?(action_name)
  end

  def curator_with_logo?
    user_signed_in? && current_user.company.try(:logo_url).present?
  end

  def curator_without_logo?
    user_signed_in? && current_user.company_id.present? && current_user.company.logo_url.blank?
  end

  def registered_user_without_company?
    user_signed_in? && current_user.company_id.blank?
  end

  # method takes a url and strips out the subdomain (as defined by the current request)
  def strip_subdomain url
    if request.subdomain.present?
      url.sub(request.subdomain + '.', '')
    else
      url
    end
  end

  def title_helper controller, action, company=nil, story=nil
    if controller == 'stories' && action == 'show'
      story.title
    elsif controller == 'stories' && action == 'index' || controller == 'companies'
      company.name + ' Customer Stories'
    else
      'Customer Stories'
    end
  end

end
