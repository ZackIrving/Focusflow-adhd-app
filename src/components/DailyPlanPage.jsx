export default function DailyPlanPage() {
  return (
    <main className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-8">
      <h2 className="text-3xl font-bold">Daily Plan</h2>
      <p className="mt-2 max-w-2xl text-slate-500">
        Organize your day into realistic priorities instead of one overwhelming list.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-3xl bg-indigo-50 p-5">
          <h3 className="text-xl font-bold text-indigo-800">Top 3 Priorities</h3>
          <textarea
            className="mt-4 min-h-[220px] w-full rounded-2xl border border-indigo-200 bg-white p-4 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            placeholder="1.&#10;2.&#10;3."
          />
        </section>

        <section className="rounded-3xl bg-emerald-50 p-5">
          <h3 className="text-xl font-bold text-emerald-800">Must Do</h3>
          <textarea
            className="mt-4 min-h-[220px] w-full rounded-2xl border border-emerald-200 bg-white p-4 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            placeholder="Things that actually need to happen today..."
          />
        </section>

        <section className="rounded-3xl bg-amber-50 p-5">
          <h3 className="text-xl font-bold text-amber-800">Should Do</h3>
          <textarea
            className="mt-4 min-h-[220px] w-full rounded-2xl border border-amber-200 bg-white p-4 focus:outline-none focus:ring-4 focus:ring-amber-200"
            placeholder="Helpful, but not urgent..."
          />
        </section>
      </div>

      <section className="mt-6 rounded-3xl bg-slate-100 p-5">
        <h3 className="text-xl font-bold">Could Do</h3>
        <textarea
          className="mt-4 min-h-[160px] w-full rounded-2xl border border-slate-300 bg-white p-4 focus:outline-none focus:ring-4 focus:ring-slate-200"
          placeholder="Bonus tasks if you have extra energy..."
        />
      </section>
    </main>
  )
}