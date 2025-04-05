import { SupabaseClient } from '@supabase/supabase-js';
import { Tables } from '@/lib/database.types';

export async function moveEvent(
  supabase: SupabaseClient,
  user_id: string,
  event_id: string,
  date: string,
  order_index: number
): Promise<{ error: string | null }> {
  if (date < new Date())
    return { error: 'Cannot move an event to a date that has already passed' };

  const { data, error } = await supabase
    .from('events')
    .select('subject_id')
    .eq('id', event_id)
    .eq('user_id', user_id)
    .single();

  if (error || !data) {
    return { error: error ? error.message : 'Event not found' };
  }

  if (data.date < new Date())
    return { error: 'Cannot move an event that has already occured' };

  const { error: updateError } = await supabase
    .from('events')
    .update({ date: date, order_index: order_index })
    .eq('id', event_id)
    .eq('user_id', user_id);

  return { error: updateError ? updateError.message : null };
}
