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
  const { data: originalData, error: fetchError } = await supabase
    .from('subjects')
    .select('days')
    .eq('id', subject.id)
    .eq('user_id', user_id)
    .single();

  if (fetchError || !originalData) {
    return { error: fetchError?.message ?? 'Subject not found' };
  }

  const originalDays = originalData.days;

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
    return { error: updateError?.message ?? 'Failed to update subject' };
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

  const events: Event[] = generateSubjectEvents(updatedData, originalDays);

  const { error: insertError } = await supabase.from('events').insert(events);

  return { error: insertError?.message ?? null };
}
