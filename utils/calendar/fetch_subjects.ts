export async function fetchSubjects(supabase, user_id) {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('user_id', user_id);

  return { data, error };
}
