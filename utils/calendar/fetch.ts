export async function fetchEvents(supabase /*, week */) {
  const { data, error } = await supabase
    .from('events')
    .select('*');

  return { data, error };
}
