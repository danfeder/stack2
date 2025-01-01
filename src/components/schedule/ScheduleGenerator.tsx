import React, { useState } from 'react';
import { CalendarRange, Loader2 } from 'lucide-react';
import { ScheduleConstraints } from './ScheduleConstraints';
import { SchedulePreview } from './SchedulePreview';
import { useScheduleStore } from '../../store/scheduleStore';
import { generateSchedule } from '../../utils/scheduling';

export function ScheduleGenerator() {
  const { classes, teacherSchedule, periodsPerDay, setCurrentSchedule } = useScheduleStore();
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSchedule = async () => {
    try {
      setError(null);
      setIsGenerating(true);
      const schedule = await generateSchedule(
        classes,
        teacherSchedule.constraints,
        periodsPerDay
      );
      setCurrentSchedule(schedule);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate schedule');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-3">
        <CalendarRange className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Generate Schedule</h2>
      </div>

      <ScheduleConstraints />
      
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleGenerateSchedule}
          disabled={isGenerating}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Schedule'
          )}
        </button>
      </div>

      <SchedulePreview />
    </div>
  );
}