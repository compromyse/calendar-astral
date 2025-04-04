import { SupabaseClient } from "@supabase/supabase-js";
import { generateSubjectEvents } from "@/utils/calendar/generate_subject_events";
import { Tables, TablesUpdate } from "@/lib/database.types";

export async function deleteEvent(
  supabase: SupabaseClient,
  user_id: string,
  event_id: string
): Promise<{ error: string | null }> {
  let { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", event_id)
    .eq("user_id", user_id)
    .single();

  if (eventError || !eventData) {
    return { error: eventError ? eventError.message : "Event not found" };
  }

  const event: Tables<"events"> = eventData;

  if (!event.subject_id) {
    const { error: deleteError } = await supabase
      .from("events")
      .delete()
      .eq("id", event_id);

    return { error: deleteError? deleteError.message : null } ;
  }

  let { data: subjectData, error: subjectError } = await supabase
    .from("subjects")
    .select("*")
    .eq("id", event.subject_id)
    .single();

  if (subjectError || !subjectData) {
    return { error: subjectError ? subjectError.message : "Subject not found" };
  }

  let subject: Tables<"subjects"> = subjectData;

  let updatedSubject: TablesUpdate<"subjects"> = {
    skipped_days: [...(subject.skipped_days || []), event.date as string],
  };

  let { data: updatedData, error: updateError } = await supabase
    .from("subjects")
    .update(updatedSubject)
    .eq("id", event.subject_id)
    .select()
    .single();

  if (updateError) {
    return { error: updateError.message };
  }

  const newEvents = generateSubjectEvents(updatedData);

  const { error: deleteSubjectEventsError } = await supabase
    .from("events")
    .delete()
    .eq("subject_id", updatedData.id)
    .gte("date", new Date().toDateString());

  if (deleteSubjectEventsError) {
    return { error: deleteSubjectEventsError.message };
  }

  const { error: insertError } = await supabase.from("events").insert(newEvents);

  return { error: insertError ? insertError.message : null };
}
