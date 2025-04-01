export async function authenticateRequest(request, supabase) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return { error: 'Missing authorization header', status: 401 };
  }
  
  const token = authHeader.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);
  
  if (error || !data.user) {
    return { error: 'Unauthorized', status: 401 };
  }

  return { user: data.user };
}
