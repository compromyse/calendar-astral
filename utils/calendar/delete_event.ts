import { generateSubjectEvents } from '@/utils/calendar/generate_subject_events';

export async function deleteEvent(supabase, event_id, date) {
  let { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', event_id);
  
  const event = data[0];

  if (event.subject_id === null) {
    const { err } = await supabase
      .from('events')
      .delete()
      .eq('id', event_id);

    if (error) {
      return { error };
    }

    return true;
  }

  ({ data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', event.subject_id));

  ({ data, error } = await supabase
    .from('subjects')
    .update({
      skipped_days: data[0].skipped_days.concat(date)
    })
    .eq('id', event.subject_id)
    .select());

  const events = generateSubjectEvents(data[0]);

  const { err } = await supabase
    .from('events')
    .delete()
    .eq('subject_id', data[0].id)
    .gte('date', new Date().toISOString().split('T')[0]);

  ({ data, error } = await supabase
    .from('events')
    .insert(events)
    .select());

  console.log('deleted');

  return true;
}
