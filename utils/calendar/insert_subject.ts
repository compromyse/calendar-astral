import { SupabaseClient } from '@supabase/supabase-js';
import { generateSubjectEvents } from '@/utils/calendar/generate_subject_events';

interface Subject {
  id: number;
  user_id: string;
  title: string;
  lessons: number;
  days: number[];
  starting_date: string; // Format: YYYY-MM-DD
}

interface Event {
  subject_id: string;
  user_id: string;
  title: string;
  date: string; // Format: YYYY-MM-DD
}

export async function insertNewSubject(
  supabase: SupabaseClient,
  user_id: string,
  title: string,
  lessons: number,
  days: number[]
): Promise<{ data: Subject | null; error: any }> {
  const startingDate = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('subjects')
    .insert([
      {
        user_id,
        title,
        lessons,
        days,
        starting_date: startingDate,
      },
    ])
    .select();

  if (error || !data || data.length === 0) {
    return { data: null, error };
  }

  const subject: Subject = data[0];
  const events: Event[] = generateSubjectEvents(subject);

  const { error: eventError } = await supabase.from('events').insert(events);

  return { data, error: eventError };
}
