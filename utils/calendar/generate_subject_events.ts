import { TablesInsert } from '@/lib/database.types';
import { Subject, Event } from '@/utils/calendar/interfaces'

function isValidLessonDay(
  date: Date,
  subject: Subject,
): boolean {
  const formattedDate = date.toDateString();
  const dayOfWeek = date.getDay() - 1;
  const skippedDays = new Set(subject.skipped_days || []);

  return (
    dayOfWeek >= 0 &&
    dayOfWeek < 5 &&
    subject.days[dayOfWeek] === 1 &&
    !skippedDays.has(formattedDate)
  );
}

export function generateSubjectEvents(
  subject: Subject,
  pastEventsCount: number = 0,
): Event[] {
  let lessonCount = pastEventsCount;

  const events: Event[] = [];
  let currentDate = new Date();

  while (lessonCount < (subject.lessons || 0)) {
    if (isValidLessonDay(currentDate, subject)) {
      let event: TablesInsert<'events'> = {
        subject_id: subject.id,
        user_id: subject.user_id,
        title: `${subject.title} - ${lessonCount + 1}`,
        date: currentDate.toDateString()
      };

      events.push(event as Event);
      lessonCount++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return events;
}
