export function generateSubjectEvents(subject) {
  const today = new Date();
  let currentDate = new Date(subject.starting_date);

  if (currentDate < today) {
    currentDate = new Date(today);
  }

  const skippedDays = new Set(subject.skipped_days);
  const events = [];
  let lessonCount = 0;

  while (lessonCount < subject.lessons) {
    const formattedDate = currentDate.toISOString().split("T")[0];
    const dayOfWeek = currentDate.getDay() - 1;

    if (
      dayOfWeek >= 0 && dayOfWeek < 5 &&
      subject.days[dayOfWeek] === 1 &&
      !skippedDays.has(formattedDate)
    ) {
      events.push({
        subject_id: subject.id,
        user_id: subject.user_id,
        title: `${subject.title} - ${lessonCount + 1}`,
        date: formattedDate
      });

      lessonCount++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return events;
}
