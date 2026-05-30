export default function DailyStats({
  completedToday,
  totalXP,
  activeTasks,
  estimatedFocusMinutes,
  nextTask,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
      <h2 className="text-2xl font-bold">Today's Stats</h2>

      <p className="mt-2 text-slate-500">
        Quick progress feedback for momentum.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-emerald-100 p-4">
          <p className="text-sm font-semibold text-emerald-700">
            Completed
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {completedToday}
          </h3>
        </div>

        <div className="rounded-2xl bg-indigo-100 p-4">
          <p className="text-sm font-semibold text-indigo-700">
            XP Earned
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {totalXP}
          </h3>
        </div>

        <div className="rounded-2xl bg-amber-100 p-4">
          <p className="text-sm font-semibold text-amber-700">
            Active Tasks
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {activeTasks.length}
          </h3>
        </div>

        <div className="rounded-2xl bg-slate-100 p-4">
          <p className="text-sm font-semibold text-slate-700">
            Focus Minutes
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {estimatedFocusMinutes}
          </h3>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-100 p-4">
        <p className="text-sm font-semibold text-slate-600">
          Next Recommended Task
        </p>

        <h3 className="mt-2 text-lg font-bold">
          {nextTask}
        </h3>
      </div>
    </section>
  )
}