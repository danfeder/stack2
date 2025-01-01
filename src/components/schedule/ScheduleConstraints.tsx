import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useScheduleStore } from '../../store/scheduleStore';

const constraintsSchema = z.object({
  startDate: z.string(),
  allowConsecutivePeriods: z.boolean(),
  maxPeriodsPerDay: z.number().min(1).max(8),
  maxPeriodsPerWeek: z.number().min(1).max(40),
});

type ConstraintsForm = z.infer<typeof constraintsSchema>;

export function ScheduleConstraints() {
  const { periodsPerDay, setScheduleConstraints } = useScheduleStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm<ConstraintsForm>({
    resolver: zodResolver(constraintsSchema),
    defaultValues: {
      startDate: new Date().toISOString().split('T')[0],
      allowConsecutivePeriods: false,
      maxPeriodsPerDay: 4,
      maxPeriodsPerWeek: 15,
    },
  });

  const onSubmit = (data: ConstraintsForm) => {
    setScheduleConstraints(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
            <input
              type="date"
              {...register('startDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Maximum Periods Per Day
            <input
              type="number"
              min={1}
              max={periodsPerDay}
              {...register('maxPeriodsPerDay', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
          {errors.maxPeriodsPerDay && (
            <p className="mt-1 text-sm text-red-600">{errors.maxPeriodsPerDay.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Maximum Periods Per Week
            <input
              type="number"
              min={1}
              max={periodsPerDay * 5}
              {...register('maxPeriodsPerWeek', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
          {errors.maxPeriodsPerWeek && (
            <p className="mt-1 text-sm text-red-600">{errors.maxPeriodsPerWeek.message}</p>
          )}
        </div>

        <div className="flex items-center">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              {...register('allowConsecutivePeriods')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Allow Consecutive Periods</span>
          </label>
        </div>
      </div>
    </form>
  );
}