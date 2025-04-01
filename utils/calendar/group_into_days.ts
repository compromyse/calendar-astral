export function groupIntoDays(events, weekStart) {
  let weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const dateArray = [];
  let currentDate = new Date(weekStart);

  while (currentDate <= weekEnd) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const grouped = {};

  events.forEach((event) => {
    const eventDate = new Date(event.date);
    const eventDateKey = eventDate.toISOString().split('T')[0];

    if (!grouped[eventDateKey]) {
      grouped[eventDateKey] = {
        dateKey: eventDateKey,
        date: eventDate.toISOString().split('T')[0],
        events: []
      };
    }

    grouped[eventDateKey].events.push({ id: event.id, title: event.title });
  });

  const result = dateArray.map((date) => {
    const dateKey = date.toISOString().split('T')[0];

    return grouped[dateKey] || {
      dateKey,
      date,
      events: []
    };
  });

  return result;
}
