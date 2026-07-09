import type { BuddyMomentum } from './types.ts'

interface MomentumInput {
  completedTasks: number
  remainingTasks: number
  completedHabits: number
  completedPomodoros: number
  currentStreak: number
}

export function calculateMomentum(
  input: MomentumInput
): BuddyMomentum {
  let score = 0

  score += input.completedTasks * 10
  score += input.completedHabits * 5
  score += input.completedPomodoros * 5

  score += Math.min(input.currentStreak, 10)

  score -= input.remainingTasks * 2

  score = Math.max(0, Math.min(100, score))

  let state: BuddyMomentum['state']

  if (score >= 80) {
    state = 'excellent'
  } else if (score >= 60) {
    state = 'strong'
  } else if (score >= 30) {
    state = 'building'
  } else {
    state = 'low'
  }

  return {
    score,
    state,
  }
}