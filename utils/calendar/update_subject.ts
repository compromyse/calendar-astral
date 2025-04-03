import { SupabaseClient } from '@supabase/supabase-js';
import { generateSubjectEvents } from '@/utils/calendar/generate_subject_events';

interface Subject {
  id: number;
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
  const { data: originalData, error: fetchError } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', subject.id);

  if (fetchError || !originalData || originalData.length === 0) {
    return { error: fetchError ? fetchError.message || 'Subject not found' };
  }

  const originalDays = originalData[0].days;

  const { data: updatedData, error: updateError } = await supabase
    .from('subjects')
    .update(subject)
    .eq('id', subject.id)
    .eq('user_id', user_id)
    .select();

  if (updateError || !updatedData || updatedData.length === 0) {
    return { error: updateError };
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

  const events: Event[] = generateSubjectEvents(updatedData[0], originalDays);

  const { error: insertError } = await supabase.from('events').insert(events);

  return { error: insertError };
}
