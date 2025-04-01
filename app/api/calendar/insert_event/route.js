"use server";

import { createClient } from '@/utils/supabase/server';
import { authenticateRequest } from '@/utils/auth';
import { insertNewEvent } from '@/utils/calendar/insert';

export async function POST(request) {
  const supabase = await createClient();
  let { user, error, status } = await authenticateRequest(request, supabase);
  if (error) {
    return Response.json({ error }, { status });
  }

  const body = await request.json();

  let { data, err } = await insertNewEvent(supabase, {
    user_id: user.id,
    title: body.title,
    date: body.date
  });

  if (err) {
    return Response.json({ error: err }, { status: 500 });
  }

  return Response.json({ data });
}
