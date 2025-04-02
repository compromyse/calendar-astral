import { generateSubjectEvents } from '@/utils/calendar/generate_subject_events';

export async function insertNewSubject(supabase, user_id, title, lessons, days) {
  const startingDate = new Date();

  const { data, error } = await supabase
    .from('subjects')
    .insert([{
      user_id: user_id,
      title: title,
      lessons: lessons,
      days: days,
      starting_date: startingDate
    }])
    .select();

  const subject = data[0];
  const events = generateSubjectEvents(subject);

  const { dat, err } = await supabase
    .from('events')
    .insert(events)
    .select();

  return { data, error };
}
