import { SupabaseClient } from '@supabase/supabase-js';

export async function moveEvent(
  supabase: SupabaseClient,
  user_id: string,
  event_id: string,
  new_date: string
): Promise<{ error: string | null }> {
  const { data, error } = await supabase
    .from('events')
    .select('subject_id')
    .eq('id', event_id)
    .eq('user_id', user_id);

  if (error || !data || data.length === 0) {
    return { error || 'Event not found' };
  }

  if (data[0].subject_id) {
    return { error: 'Cannot move a subject event' };
  }

  const { error: updateError } = await supabase
    .from('events')
    .update({ date: new_date })
    .eq('id', event_id)
    .eq('user_id', user_id);

  return { error: updateError };
}
