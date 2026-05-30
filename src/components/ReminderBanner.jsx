export default function ReminderBanner({ reminderBanner, setReminderBanner }) {
  if (!reminderBanner) return null

  return (
    <div className="my-4 rounded-3xl border border-indigo-200 bg-indigo-50 p-4 shadow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-indigo-800">{reminderBanner}</p>

        <button
          onClick={() => setReminderBanner('')}
          className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}