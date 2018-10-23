module SuccessesAndContributions

  # zaps may have a full name in the first_name field;
  # for multiple words, treat the last one as last name and all others as first name
  def split_full_name (user_params)
    if user_params[:first_name].split(' ').length > 1
      user_params[:last_name] = user_params[:first_name].split(' ').pop
      user_params[:first_name] = user_params[:first_name]
                                    .split(' ')
                                    .slice(0, user_params[:first_name].split(' ').length - 1)
                                    .join(' ')
    else
      user_params[:last_name] = 'not provided'
    end
    user_params
  end

  def find_dup_customer (customer_params, is_zap, current_user)
    return {} if customer_params.blank?
    if is_zap || !is_zap  # works for either
      if (customer = Customer.where(name: customer_params.try(:[], :name), company_id: current_user.company_id).take)
        # puts existing customer
        customer_params[:id] = customer.id
        customer_params.delete_if { |k, v| k != 'id' }
      else
        # puts 'new customer'
        customer_params[:company_id] = current_user.company_id
        customer_params
      end
    else
    end
  end

  def find_dup_user_and_split_full_name (user_params, is_zap)
    # puts 'find_dup_user_and_split_full_name'
    return {} if user_params.blank?
    if is_zap || !is_zap  # works for either
      if (user = User.find_by_email(user_params.try(:[], :email)))
        user_params[:id] = user.id
        user_params.delete_if { |k, v| !['id', 'title', 'phone'].include?(k) }
      else
        user_params = split_full_name(user_params) if (is_zap && user_params[:last_name].blank?)
        user_params
      end
    end
  end

end