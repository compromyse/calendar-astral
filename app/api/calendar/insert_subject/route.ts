"use server";

import { createClient } from '@/utils/supabase/server';
import { authenticateRequest } from '@/utils/auth';
import { insertNewSubject } from '@/utils/calendar/subjects/insert_subject';

export async function POST(request: Request): Promise<Response> {
  const supabase = await createClient();
  const { user, error, status } = await authenticateRequest(request, supabase);

  if (error) {
    return Response.json({ error }, { status });
  }

  try {
    const body = await request.json();

    if (
      !body.title ||
      !body.numberOfLessons ||
      !Array.isArray(body.weeklySchedule)
    ) {
      return Response.json({ error: "Missing or invalid required fields: title, numberOfLessons, weeklySchedule" }, { status: 400 });
    }

    const { data, error: insertError } = await insertNewSubject(
      supabase,
      user.id,
      body.title,
      body.numberOfLessons,
      body.weeklySchedule
    );

    if (insertError) {
      return Response.json({ error: insertError }, { status: 500 });
    }

    return Response.json({ data });
  } catch (parseError) {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
