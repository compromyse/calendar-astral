export async function fetchEvents(supabase, user_id, weekStart) {
  let weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const formatDate = (date) => date.toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user_id)
    .gte('date', formatDate(weekStart))
    .lte('date', formatDate(weekEnd));

  return { data, error };
}
