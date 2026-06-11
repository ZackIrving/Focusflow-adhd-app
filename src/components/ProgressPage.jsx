import BadgeCollection from './BadgeCollection'

export default function ProgressPage({
  focusScore,
  totalXP,
  tasks,
  completedTasks,
  activeTasks,
  habits,
  currentStreak,
  longestStreak,
  earnedBadges,
}) {
  const completedHabits = habits.filter((habit) => habit.completed_today)

  const statCards = [
    { label: 'Current Streak', value: currentStreak },
    { label: 'Longest Streak', value: longestStreak },
    { label: 'Tasks Completed', value: completedTasks.length },
    { label: 'Active Tasks', value: activeTasks.length },
    { label: 'Habit Count', value: habits.length },
    { label: 'Completed Habits', value: completedHabits.length },
    { label: 'Focus Score', value: `${focusScore}%` },
    { label: 'Total XP', value: totalXP },
  ]

  const taskCompletionRate =
    tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0

  const habitCompletionRate =
    habits.length > 0 ? Math.round((completedHabits.length / habits.length) * 100) : 0

  const activeTaskRate =
    tasks.length > 0 ? Math.round((activeTasks.length / tasks.length) * 100) : 0

  const chartItems = [
    { label: 'Tasks Completed', value: taskCompletionRate },
    { label: 'Habits Completed', value: habitCompletionRate },
    { label: 'Active Tasks Remaining', value: activeTaskRate },
    { label: 'Focus Score', value: focusScore },
  ]

  return (
    <main className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
        <p className="mt-2 text-slate-500">
          Track your focus, tasks, habits, XP, and streak progress.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg"
          >
            <p className="text-sm font-semibold text-slate-500">{item.label}</p>
            <h3 className="mt-2 text-4xl font-bold">{item.value}</h3>
          </div>
        ))}
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold">Progress Charts</h2>
        <p className="mt-2 text-slate-500">
          Visual breakdown of your current productivity momentum.
        </p>

        <div className="mt-6 space-y-5">
          {chartItems.map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex justify-between">
                <p className="font-semibold">{item.label}</p>
                <p className="font-semibold text-slate-500">{item.value}%</p>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${Math.min(item.value, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <BadgeCollection earnedBadges={earnedBadges} />
    </main>
  )
}