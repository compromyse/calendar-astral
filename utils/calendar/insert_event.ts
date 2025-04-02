export async function insertNewEvent(supabase, event) {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select();

  return { data, error };
}
