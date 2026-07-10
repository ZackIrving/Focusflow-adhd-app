import type {
  BuddyWorkloadLevel,
  BuddyWorkloadPressure,
  BuddyWorkloadProfile,
} from './types.ts'

interface WorkloadProfileInput {
  activeTasks: number
  completedTasks: number
  estimatedFocusMinutes: number
}

export function calculateWorkload(
  activeTasks: number
): BuddyWorkloadLevel {
  if (activeTasks <= 3) return 'light'
  if (activeTasks <= 7) return 'medium'

  return 'heavy'
}

function calculatePressure(
  level: BuddyWorkloadLevel,
  estimatedFocusMinutes: number
): BuddyWorkloadPressure {
  if (level === 'heavy' || estimatedFocusMinutes >= 180) {
    return 'high'
  }

  if (level === 'medium' || estimatedFocusMinutes >= 90) {
    return 'moderate'
  }

  return 'low'
}

export function calculateWorkloadProfile(
  input: WorkloadProfileInput
): BuddyWorkloadProfile {
  const level = calculateWorkload(input.activeTasks)

  const averageTaskMinutes =
    input.activeTasks > 0
      ? Math.round(input.estimatedFocusMinutes / input.activeTasks)
      : 0

  return {
    level,
    pressure: calculatePressure(
      level,
      input.estimatedFocusMinutes
    ),
    activeTasks: input.activeTasks,
    completedTasks: input.completedTasks,
    estimatedFocusMinutes: input.estimatedFocusMinutes,
    averageTaskMinutes,
  }
}