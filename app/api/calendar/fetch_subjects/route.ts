"use server";

import { createClient } from '@/utils/supabase/server';
import { authenticateRequest } from '@/utils/auth';
import { fetchSubjects } from '@/utils/calendar/fetch_subjects';

export async function GET(request: Request): Promise<Response> {
  const supabase = await createClient();

  const { user, error, status } = await authenticateRequest(request, supabase);
  
  if (error) {
    return Response.json({ error }, { status });
  }

  const { data, error: fetchError } = await fetchSubjects(supabase, user.id);

  if (fetchError) {
    return Response.json({ error: fetchError }, { status: 500 });
  }

  return Response.json({ data });
}
