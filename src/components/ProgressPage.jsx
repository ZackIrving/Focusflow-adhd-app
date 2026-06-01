export default function ProgressPage({
  focusScore,
  totalXP,
  tasks,
  completedTasks,
}) {
  const progressItems = [
    { label: 'Total Tasks Completed', progress: focusScore },
    { label: 'XP Earned', progress: Math.min(totalXP, 100) },
    {
      label: 'Brain Dump Progress',
      progress:
        tasks.filter((task) => task.category === 'Brain Dump' && task.done)
          .length * 25,
    },
    {
      label: 'Momentum',
      progress: Math.min(completedTasks.length * 20, 100),
    },
  ]

  return (
    <main className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {progressItems.map((item) => (
        <section
          key={item.label}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
        >
          <div className="mb-3 flex justify-between">
            <h3 className="text-xl font-bold">{item.label}</h3>
            <span className="font-semibold text-slate-500">
              {item.progress}%
            </span>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{ width: `${Math.min(item.progress, 100)}%` }}
            />
          </div>
        </section>
      ))}
    </main>
  )
}