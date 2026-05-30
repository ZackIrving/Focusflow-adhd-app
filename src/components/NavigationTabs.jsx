export default function NavigationTabs({ appModes, activeMode, setActiveMode }) {
  return (
    <nav className="sticky top-0 z-10 my-4 rounded-3xl border border-slate-200 bg-white/90 p-2 shadow-lg backdrop-blur">
      <div className="grid grid-cols-4 gap-2">
        {appModes.map((mode) => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            className={`rounded-2xl px-3 py-3 text-sm font-semibold transition sm:text-base ${
              activeMode === mode
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </nav>
  )
}