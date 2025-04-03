"use server";

import { createClient } from '@/utils/supabase/server';
import { authenticateRequest } from '@/utils/auth';
import { moveEvent } from '@/utils/calendar/move_event';

export async function POST(request: Request): Promise<Response> {
  const supabase = await createClient();
  const { user, error, status } = await authenticateRequest(request, supabase);

  if (error) {
    return Response.json({ error }, { status });
  }

  try {
    const body = await request.json();

    if (!body.event_id || !body.new_date) {
      return Response.json(
        { error: "Missing required fields: event_id, new_date" },
        { status: 400 }
      );
    }

    const { error: moveError } = await moveEvent(supabase, user.id, body.event_id, body.new_date);

    if (moveError) {
      return Response.json({ error: moveError }, { status: 500 });
    }

    return Response.json({ message: "Event moved successfully" }, { status: 200 });
  } catch (parseError) {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
