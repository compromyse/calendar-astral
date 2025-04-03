import { SupabaseClient } from '@supabase/supabase-js';
import { generateSubjectEvents } from '@/utils/calendar/generate_subject_events';

export async function deleteEvent(supabase: SupabaseClient, event_id: string, date: string): Promise<boolean | { error: any }> {
  let { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', event_id);

  if (error || !data || data.length === 0) {
    return { error: error || 'Event not found' };
  }

  const event = data[0];

  if (event.subject_id === null) {
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', event_id);

    if (deleteError) {
      return { error: deleteError };
    }

    return true;
  }

  ({ data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', event.subject_id));

  if (error || !data || data.length === 0) {
    return { error: error || 'Subject not found' };
  }

  const subject = data[0];

  ({ data, error } = await supabase
    .from('subjects')
    .update({
      skipped_days: [...subject.skipped_days, date]
    })
    .eq('id', event.subject_id)
    .select());

  if (error) {
    return { error: error || 'Failed to update subject' };
  }

  const events = generateSubjectEvents(data[0]);

  const { error: deleteSubjectEventsError } = await supabase
    .from('events')
    .delete()
    .eq('subject_id', data[0].id)
    .gte('date', new Date().toISOString().split('T')[0]);

  if (deleteSubjectEventsError) {
    return { error: deleteSubjectEventsError };
  }

  ({ error } = await supabase
    .from('events')
    .insert(events));

  if (error) {
    return { error };
  }

  return true;
}
