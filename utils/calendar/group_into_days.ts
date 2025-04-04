import { * } from '@/utils/calendar/interfaces'

export function groupIntoDays(events: Event[], weekStart: Date): GroupedDay[] {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const dateArray: Date[] = [];
  let currentDate = new Date(weekStart);

  while (currentDate <= weekEnd) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const grouped: Record<string, GroupedDay> = {};

  events.forEach((event) => {
    const eventDate = new Date(event.date);
    const eventDateKey = eventDate.toDateString();

    if (!grouped[eventDateKey]) {
      grouped[eventDateKey] = {
        dateKey: eventDateKey,
        date: eventDateKey,
        events: [],
      };
    }

    grouped[eventDateKey].events.push({
      id: event.id,
      title: event.title,
      subject_id: event.subject_id,
    });
  });

  return dateArray.map((date) => {
    const dateKey = date.toDateString();

    return grouped[dateKey] || {
      dateKey,
      date: dateKey,
      events: [],
    };
  });
}
