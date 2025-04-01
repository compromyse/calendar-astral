import { createClient } from '@/utils/supabase/client'

export const makeAuthenticatedRequest = async (url: String, options = {}) => {
  const supabase = createClient();

  const { data } = await supabase.auth.getSession();
  
  const accessToken = data.session.access_token;
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  return fetch(url, {
    ...options,
    headers
  });
};
