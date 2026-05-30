export default function PanicPanel({ nextTinyStep, addTinyTask }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
      <h2 className="text-2xl font-bold">Panic Button</h2>
      <p className="mt-2 text-slate-500">For executive dysfunction moments.</p>

      <div className="mt-5 rounded-2xl bg-red-50 p-4">
        <p className="text-sm font-semibold text-red-700">Next tiny step</p>
        <h3 className="mt-2 text-lg font-bold">{nextTinyStep}</h3>
      </div>

      <div className="mt-5 space-y-3">
        <button className="w-full rounded-2xl bg-red-500 py-4 font-semibold text-white shadow-lg transition hover:bg-red-600">
          I’m Avoiding Everything
        </button>

        <button
          onClick={addTinyTask}
          className="w-full rounded-2xl bg-orange-500 py-4 font-semibold text-white shadow-lg transition hover:bg-orange-600"
        >
          Give Me A Tiny Task
        </button>

        <button className="w-full rounded-2xl bg-emerald-500 py-4 font-semibold text-white shadow-lg transition hover:bg-emerald-600">
          Rebuild Momentum
        </button>
      </div>
    </section>
  )
}