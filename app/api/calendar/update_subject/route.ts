"use server";

import { createClient } from '@/utils/supabase/server';
import { authenticateRequest } from '@/utils/auth';
import { updateSubject } from '@/utils/calendar/subjects/update_subject';

import { TablesUpdate } from "@/lib/database.types";

export async function POST(request: Request): Promise<Response> {
  const supabase = await createClient();
  const { user, error, status } = await authenticateRequest(request, supabase);

  if (error) {
    return Response.json({ error }, { status });
  } else if (!user) {
    throw new Error("User is null");
  }

  let body;
  try {
    body = await request.json();
  } catch (parseError) {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    !body.subject_id ||
    !body.title ||
    !body.numberOfLessons ||
    !body.selectedDays
  ) {
    return Response.json(
      { error: "Missing required fields: subject_id, title, numberOfLessons, selectedDays" },
      { status: 400 }
    );
  }

  const newSubject: TablesUpdate<"subjects"> = {
    id: body.subject_id,
    title: body.title,
    lessons: body.numberOfLessons,
    days: body.selectedDays
  };

  const { error: updateError } = await updateSubject(supabase, user.id, newSubject);

  if (updateError) {
    return Response.json({ error: updateError }, { status: 500 });
  }

  return Response.json({ message: "Subject updated successfully" }, { status: 200 });
}
