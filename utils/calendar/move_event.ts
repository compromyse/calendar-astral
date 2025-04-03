export async function moveEvent(supabase, user_id, event_id, new_date) {
  let { error } = await supabase
    .from('events')
    .update({
      date: new_date
    })
    .eq('id', event_id)
    .eq('user_id', user_id);

  return { error };
}
