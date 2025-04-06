"use server";

import { createClient } from '@/utils/supabase/server';
import { authenticateRequest } from '@/utils/auth';
import { moveEvent } from '@/utils/calendar/events/move_event';

export async function POST(request: Request): Promise<Response> {
  const supabase = await createClient();
  const { user, error, status } = await authenticateRequest(request, supabase);

  if (error)
    return Response.json({ error }, { status });
  else if (!user)
    throw new Error("User is null");

  let body;
  try {
    body = await request.json();
  } catch (parseError) {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.event_id || !body.date || !body.updated_events)
    return Response.json(
      { error: "Missing required fields: event_id, date, updated_events" },
      { status: 400 }
    );

  const { error: moveError } = await moveEvent(
    supabase,
    user.id,
    body.event_id,
    body.date,
    body.updated_events
  );

  if (moveError)
    return Response.json({ error: moveError }, { status: 500 });

  return Response.json({ message: "Event moved successfully" }, { status: 200 });
}
