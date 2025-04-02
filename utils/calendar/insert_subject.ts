export async function insertNewSubject(supabase, user_id, title, lessons, days) {
  const { data, error } = await supabase
    .from('events')
    .insert([{
      user_id: user_id,
      title: title,
      lessons: lessons,
      days: days,
      subject: true
    }])
    .select();

  debugger

  return { data, error };
}
