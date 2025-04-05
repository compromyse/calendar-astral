import { SupabaseClient } from '@supabase/supabase-js';
import { Event } from '@/utils/calendar/interfaces';

export async function moveEvent(
  supabase: SupabaseClient,
  user_id: string,
  event_id: string,
  date: string,
  order_index: number
): Promise<{ error: string | null }> {
  if (new Date(date) < new Date())
    return { error: 'Cannot move an event to a date that has already passed' };

  const { data: eventData, error } = await supabase
    .from('events')
    .select('subject_id')
    .eq('id', event_id)
    .eq('user_id', user_id)
    .single();

  const event: Event = eventData as Event;

  if (error || !event.date) {
    return { error: error ? error.message : 'Event not found' };
  }

  if (new Date(event.date) < new Date())
    return { error: 'Cannot move an event that has already occured' };

  const { error: updateError } = await supabase
    .from('events')
    .update({ date: date, order_index: order_index })
    .eq('id', event_id)
    .eq('user_id', user_id);

  return { error: updateError ? updateError.message : null };
}
