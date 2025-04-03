import { SupabaseClient } from '@supabase/supabase-js';

interface Event {
  subject_id: string;
  user_id: string;
  title: string;
  date: string;
}

export async function insertNewEvent(
  supabase: SupabaseClient,
  event: Event
): Promise<{ data: any[] | null; error: any }> {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select();

  return { data, error };
}
