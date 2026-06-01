export default function FocusTimerPage({
  requestNotificationPermission,
  notificationPermission,
  timerSeconds,
  formatTimer,
  selectTimer,
  isRunning,
  setIsRunning,
  resetTimer,
}) {
  return (
    <main className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-lg sm:p-8">
      <h2 className="text-3xl font-bold">Hyperfocus Timer</h2>

      <p className="mt-2 text-slate-500">
        Choose a sprint that matches your current energy.
      </p>

      <div className="mt-5">
        <button
          onClick={requestNotificationPermission}
          className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-slate-700"
        >
          Enable Timer Notifications
        </button>

        <p className="mt-2 text-sm text-slate-500">
          Notification status: {notificationPermission}
        </p>
      </div>

      <div className="mx-auto mt-8 flex h-60 w-60 items-center justify-center rounded-full border-[16px] border-indigo-500 shadow-inner sm:h-72 sm:w-72">
        <div>
          <p className="text-slate-500">Focus Sprint</p>
          <h3 className="mt-2 text-6xl font-bold">{formatTimer(timerSeconds)}</h3>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
        {[10, 25, 45].map((minutes) => (
          <button
            key={minutes}
            onClick={() => selectTimer(minutes)}
            className="rounded-2xl bg-slate-100 py-4 font-semibold transition hover:bg-slate-200"
          >
            {minutes} Min
          </button>
        ))}
      </div>

      <div className="mt-5 flex justify-center gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="rounded-2xl bg-indigo-600 px-6 py-4 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
        >
          {isRunning ? 'Pause Session' : 'Start Session'}
        </button>

        <button
          onClick={resetTimer}
          className="rounded-2xl bg-slate-200 px-6 py-4 font-semibold transition hover:bg-slate-300"
        >
          Reset
        </button>
      </div>
    </main>
  )
}