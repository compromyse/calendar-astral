"use server";

import { createClient } from '@/utils/supabase/server';
import { authenticateRequest } from '@/utils/auth';
import { insertNewEvent } from '@/utils/calendar/insert';
import { fetchEvents } from '@/utils/calendar/fetch';

export async function GET(request) {
  const supabase = await createClient();

  let { user, error, status } = await authenticateRequest(request, supabase);
  
  if (error) {
    return Response.json({ error }, { status });
  }

  // let { data, err } = await insertNewEvent(supabase, {
  //   user_id: user.id,
  //   title: 'New Event',
  //   date: '2025-04-01'
  // });
  let { data, err } = await fetchEvents(supabase);

  return Response.json({ data });
}
