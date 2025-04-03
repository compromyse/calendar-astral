export async function updateSubject(supabase, user_id, subject) {
  const { data, error } = await supabase
    .from('subjects')
    .update(subject)
    .eq('id', subject.id)
    .eq('user_id', user_id)
    .select();

  return { success: !error, error };
}
