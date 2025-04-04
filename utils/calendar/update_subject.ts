import { SupabaseClient } from '@supabase/supabase-js';
import { generateSubjectEvents } from '@/utils/calendar/generate_subject_events';
import { TablesUpdate, Tables } from '@/database.types';

interface Subject {
  id: string;
  user_id: string;
  title: string;
  lessons: number;
  days: number[];
  starting_date: string;
}

interface Event {
  subject_id: string;
  user_id: string;
  title: string;
  date: string;
}

export async function updateSubject(
  supabase: SupabaseClient,
  user_id: string,
  subject: Subject
): Promise<{ error: string | null }> {
  const updatedSubject: Partial<TablesUpdate<'subjects'>> = {
    title: subject.title,
    lessons: subject.lessons,
    days: subject.days,
    starting_date: subject.starting_date,
  };

  const { data: updatedData, error: updateError } = await supabase
    .from('subjects')
    .update(updatedSubject)
    .eq('id', subject.id)
    .eq('user_id', user_id)
    .select()
    .single();

  if (updateError || !updatedData) {
    return { error: updateError ? updateError.message : 'Failed to update subject' };
  }

  const { data: pastEvents, error: fetchPastError } = await supabase
    .from('events')
    .select('id, date')
    .eq('subject_id', subject.id)
    .eq('user_id', user_id)
    .lt('date', new Date().toISOString().split('T')[0]);

  if (fetchPastError) {
    return { error: fetchPastError.message };
  }

  const updates = pastEvents.map((event, index) => ({
    id: event.id,
    title: `${subject.title} - ${index + 1}`,
  }));

  const { error: updatePastError } = await supabase
    .from("events")
    .upsert(updates, {
      onConflict: ["id"]
    });

  if (updatePastError) {
    return { error: updatePastError.message };
  }

  const { error: deleteError } = await supabase
    .from('events')
    .delete()
    .eq('subject_id', subject.id)
    .eq('user_id', user_id)
    .gte('date', new Date().toISOString().split('T')[0]);

  if (deleteError) {
    return { error: deleteError.message };
  }

  const events: Event[] = generateSubjectEvents(updatedData, pastEvents.length);

  const { error: insertError } = await supabase
    .from('events')
    .insert(events);

  return { error: insertError ? insertError.message : null };
}
