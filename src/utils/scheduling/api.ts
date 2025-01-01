import type { Class, TimeSlot, RotationSchedule } from '../../types/schedule';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function generateSchedule(
  classes: Class[],
  teacherConstraints: TimeSlot[],
  periodsPerDay: number
): Promise<RotationSchedule> {
  try {
    const response = await fetch(`${API_URL}/api/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        classes,
        teacherConstraints,
        periodsPerDay,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to generate schedule');
    }

    return await response.json();
  } catch (error) {
    console.error('Schedule generation failed:', error);
    throw error;
  }
}