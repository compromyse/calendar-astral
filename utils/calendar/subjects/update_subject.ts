import { SupabaseClient } from '@supabase/supabase-js';
import { generateSubjectEvents } from '@/utils/calendar/generate_subject_events';
import { TablesUpdate } from '@/lib/database.types';

import { Event } from '@/utils/calendar/interfaces'

export async function updateSubject(
  supabase: SupabaseClient,
  user_id: string,
  subject: TablesUpdate<'subjects'>
): Promise<{ error: string | null }> {
  const updatedSubject: TablesUpdate<'subjects'> = {
    title: subject.title,
    lessons: subject.lessons,
    days: subject.days,
    starting_date: subject.starting_date,
  };

  /* Update the subject */
  const { data: updatedData, error: updateError } = await supabase
    .from('subjects')
    .update(updatedSubject)
    .eq('id', subject.id)
    .eq('user_id', user_id)
    .select()
    .single();

  if (updateError)
    return { error: updateError ? updateError.message : 'Failed to update subject' };

  /* Fetch past events */
  const { data: pastEvents, error: fetchPastError } = await supabase
    .from('events')
    .select('id, date')
    .eq('subject_id', subject.id)
    .eq('user_id', user_id)
    .lt('date', new Date().toDateString());

  if (fetchPastError)
    return { error: fetchPastError.message };

  /* Update past events */
  for (let i = 0; i < pastEvents.length; i++) {
    const pastEventId = pastEvents[i].id;
    const numberedTitle = `${subject.title} - ${i + 1}`;

    const { error: updatePastError } = await supabase
      .from('events')
      .update({ title: numberedTitle })
      .eq('id', pastEventId);

    if (updatePastError) {
      return { error: updatePastError.message };
    }
  }

  /* Delete upcoming events */
  const { error: deleteError } = await supabase
    .from('events')
    .delete()
    .eq('subject_id', subject.id)
    .eq('user_id', user_id)
    .gte('date', new Date().toDateString());

  if (deleteError)
    return { error: deleteError.message };

  /* Insert new updated events */
  const events: Event[] = generateSubjectEvents(updatedData, pastEvents.length).map(event => ({
    ...event,
    user_id
  }));

  const { error: insertError } = await supabase.from('events').insert(events);

  return { error: insertError ? insertError.message : null };
}
