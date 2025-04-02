"use server";

import { createClient } from '@/utils/supabase/server';
import { authenticateRequest } from '@/utils/auth';
import { insertNewSubject } from '@/utils/calendar/insert_subject';

export async function POST(request) {
  const supabase = await createClient();
  let { user, error, status } = await authenticateRequest(request, supabase);
  if (error) {
    return Response.json({ error }, { status });
  }

  const body = await request.json();

  let { data, err } = await insertNewSubject(supabase, user.id, body.title, 3, [ 1, 0, 0, 0, 0, 1, 0]);

  if (err) {
    return Response.json({ error: err }, { status: 500 });
  }

  return Response.json({ data });
}
