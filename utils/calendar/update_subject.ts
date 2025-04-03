import { generateSubjectEvents } from '@/utils/calendar/generate_subject_events';

export async function updateSubject(supabase, user_id, subject) {
  let { data, error } = await supabase
    .from('subjects')
    .update(subject)
    .eq('id', subject.id)
    .eq('user_id', user_id)
    .select();

  ({ error } = await supabase
    .from('events')
    .delete()
    .eq('subject_id', subject.id)
    .eq('user_id', user_id)
    .gte('date', new Date().toISOString().split('T')[0]));

  const events = generateSubjectEvents(data[0]);

  ({ data, error } = await supabase
    .from('events')
    .insert(events)
    .select());

  return { error };
}
