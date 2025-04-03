"use server";

import { createClient } from '@/utils/supabase/server';
import { authenticateRequest } from '@/utils/auth';
import { fetchSubjects } from '@/utils/calendar/fetch_subjects';

export async function GET(request) {
  const supabase = await createClient();

  let { user, error, status } = await authenticateRequest(request, supabase);
  
  if (error) {
    return Response.json({ error }, { status });
  }

  const url = new URL(request.url);
  let { data, err } = await fetchSubjects(supabase, user.id);

  if (err) {
    return Response.json({ err }, { status: 500 });
  }

  return Response.json({ data });
}
