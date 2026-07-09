import BuddyGreeting from './BuddyGreeting'
import PriorityList from './PriorityList'

export default function MorningBriefCard({
    plan,
    plannerLoading,
    plannerStatus,
    onRefresh,
    onBuildMyDay,
}) {
    if (plannerLoading) {
        return (
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold">
                    🐶 Buddy is planning your day...
                </h2>

                <p className="mt-2 text-gray-500">
                    {plannerStatus}
                </p>
            </div>
        )
    }

    if (!plan) {
        return (
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold">
                    🐶 Morning Brief
                </h2>

                <p className="mt-2 text-gray-500">
                    No plan available yet.
                </p>

                <button
                    onClick={onRefresh}
                    className="mt-5 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white"
                >
                    Generate Plan
                </button>
            </div>
        )
    }

    return (
        <div className="rounded-3xl border bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg">

            <BuddyGreeting
                greeting={plan.greeting}
                summary={plan.summary}
                mood={plan.mood}
            />

            <PriorityList
                priorities={plan.priorities}
            />

            <div className="mt-6 flex gap-3">

                <button
                    onClick={onBuildMyDay}
                    className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
                >
                    Build My Day
                </button>

                <button
                    onClick={onRefresh}
                    className="rounded-xl border px-5 py-3 transition hover:bg-white"
                >
                    Refresh Plan
                </button>

            </div>

        </div>
    )
}