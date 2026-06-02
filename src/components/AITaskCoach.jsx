export default function AITaskCoach({ tasks, habits }) {
  const unfinishedTasks = tasks.filter((task) => !task.done)
  const lowEnergyTask =
    unfinishedTasks.find((task) => task.energy === 'Low') || unfinishedTasks[0]

  const unfinishedHabits = habits.filter((habit) => !habit.completed_today)
  const nextHabit = unfinishedHabits[0]

  const recommendation = lowEnergyTask
    ? lowEnergyTask.title
    : nextHabit
      ? nextHabit.name
      : 'You are clear for now. Take a recovery break.'

  const startingStep = lowEnergyTask
    ? `Open this task and work on it for only 5 minutes: ${lowEnergyTask.title}`
    : nextHabit
      ? `Do the smallest version of this habit: ${nextHabit.name}`
      : 'Drink water, stretch, or plan tomorrow.'

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">AI Task Coach</h2>
          <p className="mt-2 text-slate-500">
            A simple recommendation engine for what to do next.
          </p>
        </div>

        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
          Starter AI
        </span>
      </div>

      <div className="mt-5 rounded-2xl bg-purple-50 p-4">
        <p className="text-sm font-semibold text-purple-700">
          Recommended Next Move
        </p>
        <h3 className="mt-2 text-xl font-bold">{recommendation}</h3>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-100 p-4">
        <p className="text-sm font-semibold text-slate-600">
          5-Minute Starting Step
        </p>
        <p className="mt-2 font-medium">{startingStep}</p>
      </div>

      <div className="mt-4 rounded-2xl bg-indigo-50 p-4">
        <p className="text-sm font-semibold text-indigo-700">
          Suggested Focus Sprint
        </p>
        <h3 className="mt-2 text-lg font-bold">
          {lowEnergyTask ? '10 minutes' : '5 minutes'}
        </h3>
      </div>
    </section>
  )
}