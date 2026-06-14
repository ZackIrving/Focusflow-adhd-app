import { useState } from 'react'

export default function DistractionBlockerPage() {
    const [blockedItems, setBlockedItems] = useState([
        'TikTok',
        'YouTube',
        'Instagram',
    ])
    const [newItem, setNewItem] = useState('')
    const [focusMode, setFocusMode] = useState(false)

    function addBlockedItem(event) {
        event.preventDefault()

        if (!newItem.trim()) return

        setBlockedItems((current) => [...current, newItem.trim()])
        setNewItem('')
    }

    function removeBlockedItem(itemToRemove) {
        setBlockedItems((current) =>
            current.filter((item) => item !== itemToRemove)
        )
    }

    return (
        <main className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Distraction Blocker</h2>
                    <p className="mt-2 text-slate-500">
                        A gentle focus mode for naming distractions before they pull you away.
                    </p>
                </div>

                <button
                    onClick={() => setFocusMode(!focusMode)}
                    className={`rounded-2xl px-5 py-3 font-semibold text-white shadow-lg transition ${focusMode
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-slate-900 hover:bg-slate-700'
                        }`}
                >
                    {focusMode ? 'Focus Mode On' : 'Start Focus Mode'}
                </button>
            </div>

            {focusMode && (
                <div className="mt-5 rounded-3xl bg-emerald-50 p-5 text-emerald-800">
                    <p className="font-bold">Focus Mode is active.</p>
                    <p className="mt-1 text-sm">
                        If you feel pulled toward a distraction, pause and choose one tiny next step first.
                    </p>
                </div>
            )}

            <form onSubmit={addBlockedItem} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                    value={newItem}
                    onChange={(event) => setNewItem(event.target.value)}
                    placeholder="Example: Reddit, TikTok, YouTube"
                    className="flex-1 rounded-2xl border border-slate-300 p-3 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                />

                <button
                    type="submit"
                    className="rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg hover:bg-indigo-700"
                >
                    Add Distraction
                </button>
            </form>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {blockedItems.map((item) => (
                    <div
                        key={item}
                        className="flex items-center justify-between rounded-2xl bg-slate-100 p-4"
                    >
                        <span className="font-semibold text-slate-700">{item}</span>

                        <button
                            onClick={() => removeBlockedItem(item)}
                            className="rounded-xl bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </main>
    )
}