import { SupabaseClient, User } from '@supabase/supabase-js';

type AuthResponse = {
  user: User | null;
  error: string | null;
  status: number;
};

export async function authenticateRequest(
  request: Request,
  supabase: SupabaseClient
): Promise<AuthResponse> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return { user: null, error: 'Missing authorization header', status: 401 };
  }

  const token = authHeader.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return { user: null, error: 'Unauthorized', status: 401 };
  }

  return { user: data.user, error: null, status: 200 };
}
