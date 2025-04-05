import { Tables } from "@/lib/database.types";

type Event = Tables<"events">;
type Subject = Tables<"subjects">;

interface CalendarDay {
  dateKey: string;
  date: string;
  title: string;
  events: Pick<Event, 'id' | 'title' | 'date'>[];
}

export type { Event, CalendarDay, Subject  }
