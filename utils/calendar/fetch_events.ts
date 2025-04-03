import { SupabaseClient } from '@supabase/supabase-js';

export async function fetchEvents(
  supabase: SupabaseClient,
  user_id: string,
  weekStart: Date
): Promise<{ data: any[] | null; error: any }> {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const formatDate = (date: Date): string => date.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user_id)
    .gte('date', formatDate(weekStart))
    .lte('date', formatDate(weekEnd));

  return { data, error };
}
