export default function AuthScreen({
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authStatus,
  isAuthSubmitting,
  signIn,
  signUp,
  requestPasswordReset,
}) {
  function handlePasswordKeyDown(event) {
    if (event.key === 'Enter' && !isAuthSubmitting) {
      signIn()
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto flex min-h-[90vh] max-w-xl items-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <p className="mb-3 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
            Private ADHD Productivity App
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            FocusFlow Login
          </h1>

          <p className="mt-3 text-slate-600">
            Sign in to sync your tasks, XP, brain dumps, and progress
            across your computer and phone.
          </p>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Email
              </span>

              <input
                type="email"
                value={authEmail}
                onChange={(event) => setAuthEmail(event.target.value)}
                autoComplete="email"
                disabled={isAuthSubmitting}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-4 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Password
              </span>

              <input
                type="password"
                value={authPassword}
                onChange={(event) => setAuthPassword(event.target.value)}
                onKeyDown={handlePasswordKeyDown}
                autoComplete="current-password"
                disabled={isAuthSubmitting}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-4 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                placeholder="Use at least 6 characters"
              />
            </label>

            <div className="text-right">
              <button
                type="button"
                onClick={requestPasswordReset}
                disabled={isAuthSubmitting}
                className="text-sm font-semibold text-indigo-700 transition hover:text-indigo-900 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={signIn}
              disabled={isAuthSubmitting}
              className="rounded-2xl bg-indigo-600 px-5 py-4 font-semibold text-white shadow-lg transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAuthSubmitting ? 'Please wait...' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={signUp}
              disabled={isAuthSubmitting}
              className="rounded-2xl bg-slate-900 px-5 py-4 font-semibold text-white shadow-lg transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Create Account
            </button>
          </div>

          <p
            aria-live="polite"
            className="mt-5 rounded-2xl bg-slate-100 p-4 text-sm font-medium text-slate-700"
          >
            {authStatus}
          </p>
        </div>
      </div>
    </div>
  )
}