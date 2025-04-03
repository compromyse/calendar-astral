"use server";

import { createClient } from '@/utils/supabase/server';
import { authenticateRequest } from '@/utils/auth';
import { moveEvent } from '@/utils/calendar/move_event';

export async function POST(request) {
  const supabase = await createClient();
  let { user, error, status } = await authenticateRequest(request, supabase);
  if (error) {
    return Response.json({ error }, { status });
  }

  const body = await request.json();

  ({ error } = await moveEvent(supabase, user.id, body.event_id, body.new_date));

  if (error) {
    return Response.json({ error: error }, { status: 500 });
  }

  return Response.json({}, { status: 200 });
}
