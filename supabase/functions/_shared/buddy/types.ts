import type { BuddyTimeContext } from './timeContext.ts'

export interface BuddyTask {
  title: string
  category: string | null
  energy: string | null
  time: string | null
  reward: number | null
  done: boolean
  recurring: boolean
  recurrence: string | null
  created_at: string
}

export interface BuddyHabit {
  name: string
  completed_today: boolean
  created_at: string
}

export interface BuddySnapshot {
  activeTasks: number
  completedTasks: number
  habitsRemaining: number
  xp: number
  level: number
  completedPomodoros: number
  momentum: BuddyMomentum
}

export interface BuddyMomentum {
  score: number
  state: 'low' | 'building' | 'strong' | 'excellent'
}

export interface BuddyContext {
  userId: string

  snapshot: BuddySnapshot

  timeContext: BuddyTimeContext

  previousDay: {
    completedTasks: number
    completedHabits: number
    completedPomodoros: number
  }

  currentDay: {
    activeTasks: number
    remainingHabits: number
    estimatedFocusMinutes: number
  }

  userProgress: {
    xp: number
    level: number
    currentStreak: number
  }

  workload: 'light' | 'medium' | 'heavy'

  tasks: BuddyTask[]

  habits: BuddyHabit[]
}