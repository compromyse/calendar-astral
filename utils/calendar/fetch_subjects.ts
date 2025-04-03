import { SupabaseClient } from '@supabase/supabase-js';

export async function fetchSubjects(
  supabase: SupabaseClient,
  user_id: string
): Promise<{ data: any[] | null; error: any }> {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', user_id);

  return { data, error };
}
