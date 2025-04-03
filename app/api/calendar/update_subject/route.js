"use server";

import { createClient } from '@/utils/supabase/server';
import { authenticateRequest } from '@/utils/auth';
import { updateSubject } from '@/utils/calendar/update_subject';

export async function POST(request) {
  const supabase = await createClient();
  let { user, error, status } = await authenticateRequest(request, supabase);
  if (error) {
    return Response.json({ error }, { status });
  }

  const body = await request.json();

  let { data, err } = await updateSubject(supabase, user.id, {
    id: body.subject_id,
    title: body.title,
    lessons: body.numberOfLessons,
    days: body.selectedDays
  });

  if (err) {
    return Response.json({ error: err }, { status: 500 });
  }

  return Response.json({ data });
}
