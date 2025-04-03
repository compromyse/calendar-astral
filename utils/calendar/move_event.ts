export async function moveEvent(supabase, user_id, event_id, new_date) {
  let { data, error } = await supabase
    .from('events')
    .select('subject_id')
    .eq('id', event_id)
    .eq('user_id', user_id);

  if (data[0].subject_id)
    return { error: 'Cannot move a subject event' };

  ({ error } = await supabase
    .from('events')
    .update({
      date: new_date
    })
    .eq('id', event_id)
    .eq('user_id', user_id));

  return { error };
}
