import type { BuddyTask } from './types.ts'

export function estimateFocusMinutes(
  tasks: BuddyTask[]
): number {
  return tasks.reduce((total, task) => {
    const match = task.time?.match(/\d+/)
    const minutes = match
      ? Number(match[0])
      : 10

    return total + minutes
  }, 0)
}