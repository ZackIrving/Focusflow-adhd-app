export default function CustomTaskForm({
  taskForm,
  updateTaskForm,
  handleCreateCustomTask,
  setTaskForm,
  setShowTaskForm,
  emptyTaskForm,
}) {
  return (
    <form
      onSubmit={handleCreateCustomTask}
      className="mt-6 rounded-3xl border border-indigo-100 bg-indigo-50 p-5"
    >
      <h3 className="text-xl font-bold">Create a custom task</h3>
      <p className="mt-1 text-sm text-slate-600">
        Make the task specific, small, and easy to start.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Task title</span>
          <input
            value={taskForm.title}
            onChange={(event) => updateTaskForm('title', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            placeholder="Example: Study A+ networking for 20 minutes"
          />
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Category</span>
          <input
            value={taskForm.category}
            onChange={(event) => updateTaskForm('category', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            placeholder="A+ Study, Homelab, Career, Shopify"
          />
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Energy</span>
          <select
            value={taskForm.energy}
            onChange={(event) => updateTaskForm('energy', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3 focus:outline-none focus:ring-4 focus:ring-indigo-200"
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
            value={taskForm.time}
            onChange={(event) => updateTaskForm('time', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3 focus:outline-none focus:ring-4 focus:ring-indigo-200"
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
            value={taskForm.reward}
            onChange={(event) => updateTaskForm('reward', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3 focus:outline-none focus:ring-4 focus:ring-indigo-200"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
        >
          Save Task
        </button>

        <button
          type="button"
          onClick={() => {
            setTaskForm(emptyTaskForm)
            setShowTaskForm(false)
          }}
          className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold transition hover:bg-slate-300"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}