import { createClient } from '@/utils/supabase/client'

export const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const supabase = createClient();

  const { data } = await supabase.auth.getSession();
  
  if (!data.session) {
    throw new Error('No active session found.');
  }

  const accessToken: string = data.session.access_token;
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
