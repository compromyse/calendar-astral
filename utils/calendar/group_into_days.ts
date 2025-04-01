export function groupIntoDays(events) {
  const grouped = {};

  events.forEach((event) => {
    if (!grouped[event.date]) {
      grouped[event.date] = {
        dateKey: event.date,
        date: new Date(event.date),
        title: event.date,
        events: []
      };
    }
    grouped[event.date].events.push({ id: event.id, title: event.title });
  });

  return Object.values(grouped);
}
