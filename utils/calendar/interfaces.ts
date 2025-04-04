interface Event {
  id: string;
  title: string;
  subject_id: string;
  date: string;
}

interface GroupedDay {
  dateKey: string;
  date: string;
  events: Pick<Event, 'id' | 'title' | 'subject_id'>[];
}

