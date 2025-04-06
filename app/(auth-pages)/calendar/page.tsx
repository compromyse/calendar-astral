"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import Calendar component with SSR disabled
const Calendar = dynamic(() => import("@/components/calendar/Calendar"), {
  ssr: false,
  loading: () => <div className="w-full h-96 flex items-center justify-center">Loading calendar...</div>
});

// Import components
import SubjectForm from "@/components/subject-form/SubjectForm";
import EventForm from "@/components/event-form/EventForm";
import EditSubjectForm from "@/components/subject-form/EditSubjectForm";

import { makeAuthenticatedRequest } from "@/utils/api";
import { groupIntoDays } from "@/utils/calendar/group_into_days";

import { CalendarDay } from '@/utils/calendar/interfaces'

export default function CalendarPage() {
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [forceRender, setForceRender] = useState(0);

  const getLastMonday = (date = new Date()) => {
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Adjust for Sunday being 0
    const lastMonday = new Date(date);
    lastMonday.setDate(lastMonday.getDate() + diff);
    return lastMonday;
  };

  const [weekStart, setWeekStart] = useState(getLastMonday());

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await makeAuthenticatedRequest(`/api/calendar/fetch_week?weekStart=${weekStart.toISOString().split('T')[0]}`);
      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      setCalendarData(groupIntoDays(result.data, weekStart) || []);
      setForceRender((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [weekStart]); // Re-fetch when weekStart changes

  const handlePrevious = () => {
    const previousWeek = new Date(weekStart);
    previousWeek.setDate(previousWeek.getDate() - 7);
    const newWeekStart = previousWeek;
    setWeekStart(newWeekStart);
  };

  const handleNext = () => {
    const nextWeek = new Date(weekStart);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const newWeekStart = nextWeek;
    setWeekStart(newWeekStart);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 gap-4">
        <SubjectForm title="Add Subject" refreshData={fetchData} />
        <EditSubjectForm title="Edit Subject" refreshData={fetchData} />
        <EventForm title="Add One Off Event" refreshData={fetchData} />
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="w-full h-96 flex items-center justify-center">Loading...</div>
        ) : (
          <Calendar
            key={forceRender}
            calendarDays={calendarData}
            onPrevious={handlePrevious}
            onNext={handleNext}
            refreshData={fetchData}
            title="Calendar"
          />
        )}
      </div>
    </div>
  );
}
