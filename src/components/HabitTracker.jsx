export default function HabitTracker({
  habits,
  habitName,
  setHabitName,
  habitStatus,
  habitStats,
  addHabit,
  toggleHabit,
  deleteHabit,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
      <h2 className="text-2xl font-bold">Habit Tracker</h2>
      <p className="mt-2 text-slate-500">Build small daily habits that support your focus.</p>

      <form onSubmit={addHabit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={habitName}
          onChange={(event) => setHabitName(event.target.value)}
          className="flex-1 rounded-2xl border border-slate-300 p-3 focus:outline-none focus:ring-4 focus:ring-indigo-200"
          placeholder="Example: Study A+ for 20 minutes"
        />

        <button
          type="submit"
          className="rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg hover:bg-indigo-700"
        >
          Add Habit
        </button>
      </form>

      {habitStatus && (
        <p className="mt-3 rounded-2xl bg-slate-100 p-3 text-sm font-medium text-slate-700">
          {habitStatus}
        </p>
      )}

      <div className="mt-5 space-y-3">
        {habits.length === 0 ? (
          <p className="rounded-2xl bg-slate-100 p-4 text-slate-500">
            No habits yet. Add one small daily habit to start.
          </p>
        ) : (
          habits.map((habit) => (
            <div
              key={habit.id}
              className={`rounded-2xl border p-4 ${habit.completed_today
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-slate-200 bg-white'
                }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3
                    className={`font-semibold ${habit.completed_today ? 'line-through text-slate-400' : ''
                      }`}
                  >
                    {habit.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Frequency: {habit.frequency}
                  </p>

                  {habit.last_completed_date && (
                    <p className="text-sm text-slate-500">
                      Last completed: {habit.last_completed_date}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700">
                      Current streak: {habitStats?.[habit.id]?.currentStreak || 0}
                    </span>

                    <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
                      Best: {habitStats?.[habit.id]?.longestStreak || 0}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                      Total: {habitStats?.[habit.id]?.totalCompletions || 0}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleHabit(habit)}
                    className={`rounded-xl px-4 py-2 font-semibold ${habit.completed_today
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-white'
                      }`}
                  >
                    {habit.completed_today ? 'Done' : 'Mark Done'}
                  </button>

                  <button
                    onClick={() => deleteHabit(habit)}
                    className="rounded-xl bg-red-100 px-4 py-2 font-semibold text-red-700 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}