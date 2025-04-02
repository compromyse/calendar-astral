export async function insertNewSubject(supabase, user_id, title, lessons, days) {
  const { data, error } = await supabase
    .from('subjects')
    .insert([{
      user_id: user_id,
      title: title,
      lessons: lessons,
      days: days
    }])
    .select();

  return { data, error };
}
