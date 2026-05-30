export default function TaskCard({
  task,
  editingTaskId,
  editForm,
  updateEditForm,
  saveEditedTask,
  cancelEditingTask,
  toggleTask,
  startEditingTask,
  deleteTask,
}) {
  return (
    <div
      className={`rounded-2xl border p-4 transition sm:p-5 ${
        task.done
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-slate-200 bg-white hover:shadow-md'
      }`}
    >
      {editingTaskId === task.id ? (
        <div className="rounded-2xl bg-blue-50 p-4">
          <h3 className="text-lg font-bold">Edit task</h3>
          <p className="mt-1 text-sm text-slate-600">
            Make changes, then save them to Supabase.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Task title</span>
              <input
                value={editForm.title}
                onChange={(event) => updateEditForm('title', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3 focus:outline-none focus:ring-4 focus:ring-blue-200"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-700">Category</span>
              <input
                value={editForm.category}
                onChange={(event) => updateEditForm('category', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3 focus:outline-none focus:ring-4 focus:ring-blue-200"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-700">Energy</span>
              <select
                value={editForm.energy}
                onChange={(event) => updateEditForm('energy', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Creative</option>
              </select>
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-700">Time estimate</span>
              <select
                value={editForm.time}
                onChange={(event) => updateEditForm('time', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                <option>5 min</option>
                <option>10 min</option>
                <option>15 min</option>
                <option>20 min</option>
                <option>25 min</option>
                <option>45 min</option>
                <option>60 min</option>
              </select>
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-700">XP reward</span>
              <input
                type="number"
                min="1"
                max="100"
                value={editForm.reward}
                onChange={(event) => updateEditForm('reward', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3 focus:outline-none focus:ring-4 focus:ring-blue-200"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => saveEditedTask(task)}
              className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
            >
              Save Edit
            </button>

            <button
              onClick={cancelEditingTask}
              className="rounded-xl bg-slate-200 px-4 py-2 font-semibold transition hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {task.category}
              </span>

              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                {task.energy} Energy
              </span>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                {task.time}
              </span>
            </div>

            <h3
              className={`text-lg font-semibold ${
                task.done ? 'line-through text-slate-400' : ''
              }`}
            >
              {task.title}
            </h3>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => toggleTask(task)}
              className={`rounded-xl px-4 py-2 font-semibold transition ${
                task.done
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-700'
              }`}
            >
              {task.done ? 'Done' : `Start +${task.reward} XP`}
            </button>

            <button
              onClick={() => startEditingTask(task)}
              className="rounded-xl bg-blue-100 px-4 py-2 font-semibold text-blue-700 transition hover:bg-blue-200"
            >
              Edit
            </button>

            <button
              onClick={() => deleteTask(task)}
              className="rounded-xl bg-red-100 px-4 py-2 font-semibold text-red-700 transition hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}