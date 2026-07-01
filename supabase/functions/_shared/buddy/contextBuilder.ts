import type {
  BuddyContext,
  BuddyTask,
  BuddyHabit,
} from './types.ts'

export async function buildBuddyContext(
  supabase: any,
  userId: string
): Promise<BuddyContext> {

  const [
    tasksResult,
    habitsResult,
    progressResult,
    pomodorosResult,
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
  ])

  const typedTasks =
    (tasksResult.data || []) as BuddyTask[]

  const typedHabits =
    (habitsResult.data || []) as BuddyHabit[]

  return {
    userId,

    snapshot: {
      activeTasks:
        typedTasks.filter((t) => !t.done).length,

      completedTasks:
        typedTasks.filter((t) => t.done).length,

      habitsRemaining:
        typedHabits.filter(
          (h) => !h.completed_today
        ).length,

      xp: progressResult.data?.xp ?? 0,

      level:
        progressResult.data?.level ?? 1,

      completedPomodoros:
        pomodorosResult.data?.length ?? 0,

      momentum: 0,
    },

    tasks: typedTasks,

    habits: typedHabits,
  }
}