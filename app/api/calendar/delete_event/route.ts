"use server";

import { createClient } from '@/utils/supabase/server';
import { authenticateRequest } from '@/utils/auth';
import { deleteEvent } from '@/utils/calendar/events/delete_event';

export async function POST(request: Request): Promise<Response> {
  const supabase = await createClient();
  const { user, error, status } = await authenticateRequest(request, supabase);

  if (error) {
    return Response.json({ error }, { status });
  } else if (!user) {
    throw new Error("User is null");
  }

  try {
    const body = await request.json();

    if (!body.event_id) {
      return Response.json(
        { error: "Missing required fields: event_id" },
        { status: 400 }
      );
    }

    const { error: deleteError } = await deleteEvent(
      supabase,
      user.id,
      body.event_id
    );

    if (deleteError) {
      return Response.json({ error: deleteError }, { status: 500 });
    }

    return Response.json({ message: "Event deleted successfully" }, { status: 200 });
  } catch (parseError) {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
