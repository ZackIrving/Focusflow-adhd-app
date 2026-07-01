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
  momentum: number
}

export interface BuddyContext {
  userId: string

  snapshot: BuddySnapshot

  tasks: BuddyTask[]

  habits: BuddyHabit[]
}