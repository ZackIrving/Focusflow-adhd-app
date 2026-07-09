import type {
  BuddyContext,
  BuddyTask,
  BuddyHabit,
} from './types.ts'

import { calculateWorkload } from './workload.ts'
import { estimateFocusMinutes } from './focusEstimator.ts'
import { calculateMomentum } from './momentum.ts'
import { buildTimeContext } from './timeContext.ts'

export async function buildBuddyContext(
  supabase: any,
  userId: string
): Promise<BuddyContext> {
  const [
    tasksResult,
    habitsResult,
    progressResult,
    pomodorosResult,
    streakResult,
  ] = await Promise.all([
    supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId),

    supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId),

    supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(),

    supabase
      .from('pomodoro_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true),

    supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(),
  ])

  const typedTasks = (tasksResult.data || []) as BuddyTask[]
  const typedHabits = (habitsResult.data || []) as BuddyHabit[]

  const activeTasks = typedTasks.filter(
    (task) => !task.done
  )

  const completedTasks = typedTasks.filter(
    (task) => task.done
  )

  const remainingHabits = typedHabits.filter(
    (habit) => !habit.completed_today
  )

  const workload = calculateWorkload(
    activeTasks.length
  )

  const momentum = calculateMomentum({
  completedTasks: completedTasks.length,
  remainingTasks: activeTasks.length,
  completedHabits:
    typedHabits.filter((habit) => habit.completed_today).length,
  completedPomodoros:
    pomodorosResult.data?.length ?? 0,
  currentStreak:
    streakResult.data?.current_streak ?? 0,
})

const timeContext = buildTimeContext()

  return {
    userId,

    snapshot: {
      activeTasks: activeTasks.length,
      completedTasks: completedTasks.length,
      habitsRemaining: remainingHabits.length,
      xp: progressResult.data?.xp ?? 0,
      level: progressResult.data?.level ?? 1,
      completedPomodoros:
        pomodorosResult.data?.length ?? 0,
      momentum,
    },

    timeContext,

    previousDay: {
      completedTasks: 0,
      completedHabits: 0,
      completedPomodoros: 0,
    },

    currentDay: {
      activeTasks: activeTasks.length,
      remainingHabits: remainingHabits.length,
      estimatedFocusMinutes:
        estimateFocusMinutes(activeTasks),
    },

    userProgress: {
      xp: progressResult.data?.xp ?? 0,
      level: progressResult.data?.level ?? 1,
      currentStreak:
        streakResult.data?.current_streak ?? 0,
    },

    workload,

    tasks: typedTasks,

    habits: typedHabits,
  }
}