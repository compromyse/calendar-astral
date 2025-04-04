"use server";

import { createClient } from '@/utils/supabase/server';
import { authenticateRequest } from '@/utils/auth';
import { insertNewEvent } from '@/utils/calendar/events/insert_event';

export async function POST(request: Request): Promise<Response> {
  const supabase = await createClient();
  const { user, error, status } = await authenticateRequest(request, supabase);

  if (error) {
    return Response.json({ error }, { status });
  }

  try {
    const body = await request.json();

    if (!body.title || !body.date) {
      return Response.json({ error: "Missing required fields: title, date" }, { status: 400 });
    }

    const { data, error: insertError } = await insertNewEvent(supabase, {
      user_id: user.id,
      title: body.title,
      date: body.date
    });

    if (insertError) {
      return Response.json({ error: insertError }, { status: 500 });
    }

    return Response.json({ data });
  } catch (parseError) {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
