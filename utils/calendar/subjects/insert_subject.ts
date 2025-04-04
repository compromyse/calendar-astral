import { SupabaseClient } from '@supabase/supabase-js';
import { generateSubjectEvents } from '@/utils/calendar/generate_subject_events';
import { TablesInsert, Tables } from '@/lib/database.types';

type SubjectInsert = TablesInsert<'subjects'>;
type EventInsert = TablesInsert<'events'>;

export async function insertNewSubject(
  supabase: SupabaseClient,
  user_id: string,
  title: string,
  lessons: number,
  days: number[]
): Promise<{ data: Tables<'subjects'> | null; error: any }> {
  const startingDate = new Date().toDateString();

  const newSubject: SubjectInsert = {
    user_id,
    title,
    lessons,
    days,
    starting_date: startingDate,
  };

  const { data, error } = await supabase
    .from('subjects')
    .insert([newSubject])
    .select();

  if (error || !data || data.length === 0) {
    return { data: null, error };
  }

  const subject = data[0];
  const events: EventInsert[] = generateSubjectEvents(subject);

  const { error: eventError } = await supabase.from('events').insert(events);

  return { data: subject, error: eventError };
}
