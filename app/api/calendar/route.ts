"use server";

import { authenticateRequest } from '@/utils/auth';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request): Promise<Response> {
  const supabase = await createClient();
  const { user, error, status } = await authenticateRequest(request, supabase);

  if (error) {
    return Response.json({ error }, { status });
  } else if (!user) {
    throw new Error("User is null");
  }

  return Response.json({ message: 'Authenticated!', user });
}
