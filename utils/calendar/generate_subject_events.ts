import { Tables } from "@/lib/database.types";

type Subject = Tables<"subjects">;
type Event = Tables<"events">;

function isValidLessonDay(
  date: Date,
  subject: Subject,
  days: number[] = subject.days
): boolean {
  const formattedDate = date.toISOString().split("T")[0];
  const dayOfWeek = date.getDay() - 1;
  const skippedDays = new Set(subject.skipped_days || []);

  return (
    dayOfWeek >= 0 &&
    dayOfWeek < 5 &&
    days[dayOfWeek] === 1 &&
    !skippedDays.has(formattedDate)
  );
}

export function generateSubjectEvents(
  subject: Subject,
  originalDays: number[] = subject.days
): Event[] {
  const today = new Date();
  const startDate = new Date(subject.starting_date);
  let lessonCount = 0;

  // Count past lessons
  if (startDate < today) {
    let checkDate = new Date(startDate);
    while (checkDate < today) {
      if (isValidLessonDay(checkDate, subject, originalDays)) {
        lessonCount++;
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }
  }

  const events: Event[] = [];
  let currentDate = new Date(today);

  while (lessonCount < (subject.lessons || 0)) {
    if (isValidLessonDay(currentDate, subject)) {
      events.push({
        subject_id: subject.id,
        user_id: subject.user_id,
        title: `${subject.title} - ${lessonCount + 1}`,
        date: currentDate.toISOString().split("T")[0],
      });
      lessonCount++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return events;
}
