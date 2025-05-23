"use server";

import { createClient } from '@/utils/supabase/server';
import { authenticateRequest } from '@/utils/auth';
import { fetchEvents } from '@/utils/calendar/events/fetch_events';

export async function GET(request: Request): Promise<Response> {
  const supabase = await createClient();

  const { user, error, status } = await authenticateRequest(request, supabase);

  if (error) {
    return Response.json({ error }, { status });
  } else if (!user) {
    throw new Error("User is null");
  }

  const url = new URL(request.url);
  const weekStart = url.searchParams.get('weekStart');

  if (!weekStart)
    return Response.json({ error: 'Fetching events requires a date' }, { status: 500 });

  const { data, error: fetchError } = await fetchEvents(supabase, user.id, weekStart);

  if (fetchError) {
    return Response.json({ error: fetchError }, { status: 500 });
  }

  return Response.json({ data });
}
