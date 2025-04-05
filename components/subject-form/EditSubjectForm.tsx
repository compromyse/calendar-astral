import React, { useState, useEffect } from 'react';

import { Subject } from '@/utils/calendar/interfaces'
import { makeAuthenticatedRequest } from "@/utils/api";

interface EditSubjectFormProps {
  title: string;
  refreshData: () => void;
}

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Mon' },
  { id: 'tuesday', label: 'Tue' },
  { id: 'wednesday', label: 'Wed' },
  { id: 'thursday', label: 'Thu' },
  { id: 'friday', label: 'Fri' },
];

export default function EditSubjectForm({ title, refreshData }: EditSubjectFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [subjectTitle, setSubjectTitle] = useState('');
  const [numberOfLessons, setNumberOfLessons] = useState(1);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<Partial<Subject>[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showForm) {
      const fetchSubjects = async () => {
        setIsLoading(true);

        try {
          const response = await makeAuthenticatedRequest('/api/calendar/fetch_subjects');
          const data = await response.json();

          if (data.error) throw new Error(data.error);

          setSubjects(data.data || []);
        } catch (error) {
          console.error("Error fetching subjects:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSubjects();
    }
  }, [showForm]);

  const handleDayToggle = (dayId: string) => {
    setSelectedDays(prev =>
      prev.includes(dayId)
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    );
  };

  const handleSubjectSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subjectId = e.target.value;
    setSelectedSubjectId(subjectId);

    if (subjectId) {
      const subject = subjects.find(s => s.id === subjectId);
      if (subject) {
        setSubjectTitle(subject.title ?? subject.id ?? "");
        setNumberOfLessons(subject.lessons ?? 0);

        const dayMapping = ["monday", "tuesday", "wednesday", "thursday", "friday"];
        const selectedDaysArray = (subject.days ?? [])
          .map((val: number, index: number) => (val === 1 ? dayMapping[index] : null))
          .filter(Boolean) as string[];

        setSelectedDays(selectedDaysArray);
      }
    } else {
      setSubjectTitle('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const DAYS_MAPPING = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const formattedDays = DAYS_MAPPING.map(day => selectedDays.includes(day) ? 1 : 0);

    try {
      const response = await makeAuthenticatedRequest("/api/calendar/update_subject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subject_id: selectedSubjectId,
          title: subjectTitle,
          numberOfLessons,
          selectedDays: formattedDays
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to update subject");

      refreshData();
    } catch (error) {
      console.error("Error updating subject:", error);
    }

    setShowForm(false);
  };

  if (!showForm) {
    return (
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setShowForm(true)}
      >
        <div className="flex items-center justify-center py-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <button 
          onClick={() => setShowForm(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>

      <div className={`absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg z-10 ${isLoading ? 'block' : 'hidden'}`}>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="subject-selection" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Subject to Edit
          </label>
          <select
            id="subject-selection"
            value={selectedSubjectId}
            onChange={handleSubjectSelection}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          >
            <option value="">Select a subject</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.title}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="subject-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subject Title
          </label>
          <input
            id="subject-title"
            type="text"
            value={subjectTitle}
            onChange={(e) => setSubjectTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter subject title"
            required
          />
        </div>
        
        <div>
          <label htmlFor="number-of-lessons" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Number of Lessons
          </label>
          <input
            id="number-of-lessons"
            type="number"
            min="1"
            value={numberOfLessons}
            onChange={(e) => setNumberOfLessons(parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        
        <div>
          <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Days of Week
          </p>
          <div className="flex space-x-4">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleDayToggle(day.id)}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                    ${selectedDays.includes(day.id) 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}
                  `}
                >
                  {day.label}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <button 
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Update Subject
          </button>
        </div>
      </form>
    </div>
  );
}
