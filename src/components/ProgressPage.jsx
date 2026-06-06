export default function ProgressPage({
  focusScore,
  totalXP,
  tasks,
  completedTasks,
  activeTasks,
  habits,
  currentStreak,
  longestStreak,
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
    </main>
  )
}