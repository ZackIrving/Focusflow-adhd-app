import type {
  BuddyContext,
  BuddyTask,
  BuddyHabit,
} from './types.ts'

export async function buildBuddyContext(
  supabase: any,
  userId: string
): Promise<BuddyContext> {

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)

  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)

  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  const { data: pomodoros } = await supabase
    .from('pomodoro_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', true)

  const typedTasks = (tasks || []) as BuddyTask[]
  const typedHabits = (habits || []) as BuddyHabit[]

  return {
    userId,

    snapshot: {
      activeTasks: typedTasks.filter(t => !t.done).length,
      completedTasks: typedTasks.filter(t => t.done).length,
      habitsRemaining: typedHabits.filter(h => !h.completed_today).length,
      xp: progress?.xp ?? 0,
      level: progress?.level ?? 1,
      completedPomodoros: pomodoros?.length ?? 0,
      momentum: 0, // We'll calculate this next.
    },

    tasks: typedTasks,

    habits: typedHabits,
  }
}