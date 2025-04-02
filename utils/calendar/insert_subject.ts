export async function insertNewSubject(supabase, user_id, lessons, days) {
  const { data, error } = await supabase
    .from('events')
    .insert([{
      user_id: user_id,
      lessons: lessons,
      days: days,
      subject: true
    }])
    .select();

  debugger

  return { data, error };
}
