import { SupabaseClient } from '@supabase/supabase-js';
import { TablesInsert } from '@/database.types';

type EventInsert = TablesInsert<'events'>;

export async function insertNewEvent(
  supabase: SupabaseClient,
  event: EventInsert
): Promise<{ data: EventInsert[] | null; error: string | null }> {
  if (!event.subject_id || !event.user_id || !event.title || !event.date) {
    return { data: null, error: 'Missing required event fields' };
  }

  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select();

  if (error) {
    console.error('Insert Error:', error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
