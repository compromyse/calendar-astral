"use server";

import { createClient } from '@/utils/supabase/server';
import { authenticateRequest } from '@/utils/auth';
import { fetchEvents } from '@/utils/calendar/fetch';

export async function GET(request) {
  const supabase = await createClient();

  let { user, error, status } = await authenticateRequest(request, supabase);
  
  if (error) {
    return Response.json({ error }, { status });
  }

  const url = new URL(request.url);
  const weekStartParam = url.searchParams.get('weekStart');

  const weekStart = weekStartParam ? new Date(weekStartParam) : new Date();

  let { data, err } = await fetchEvents(supabase, user.id, weekStart);

  return Response.json({ data });
}
