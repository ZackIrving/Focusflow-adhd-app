export default function AICoachPage({
    coachInput,
    setCoachInput,
    coachResponse,
    coachStatus,
    getCoachResponse,
}) {
    return (
        <main className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-8">
            <p className="mb-3 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                GPT-5 Mini Coach
            </p>

            <h2 className="text-3xl font-bold">AI Task Coach</h2>

            <p className="mt-2 text-slate-500">
                Dump what feels overwhelming. FocusFlow will turn it into three tiny next steps.
            </p>

            <form onSubmit={getCoachResponse} className="mt-6 space-y-4">
                <textarea
                    value={coachInput}
                    onChange={(event) => setCoachInput(event.target.value)}
                    rows={6}
                    placeholder="Example: I need to study, clean my room, apply for jobs, and I feel overwhelmed."
                    className="w-full rounded-3xl border border-slate-300 p-4 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                />

                <button
                    type="submit"
                    className="rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
                >
                    Break It Down
                </button>
            </form>

            {coachStatus && (
                <p className="mt-4 rounded-2xl bg-slate-100 p-3 text-sm font-semibold text-slate-700">
                    {coachStatus}
                </p>
            )}

            {coachResponse && (
                <section className="mt-6 whitespace-pre-wrap rounded-3xl bg-indigo-50 p-5 text-lg font-semibold text-indigo-950">
                    {coachResponse}
                </section>
            )}
        </main>
    )
}