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

export default function CalendarPage() {
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forceRender, setForceRender] = useState(0);

  const fetchData = async () => {
    try {
      const weekStart = new Date().toISOString().split('T')[0];
      const response = await makeAuthenticatedRequest(`/api/calendar/fetch_week?weekStart=${weekStart}`);
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
  }, []);

  const handlePrevious = () => {
    console.log("Navigate to previous week");
    // Add logic for fetching previous week's data
  };

  const handleNext = () => {
    console.log("Navigate to next week");
    // Add logic for fetching next week's data
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 gap-4">
        <SubjectForm title="Add Subject" />
        <EditSubjectForm title="Edit Subject" />
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
            title="Calendar"
          />
        )}
      </div>
    </div>
  );
}
