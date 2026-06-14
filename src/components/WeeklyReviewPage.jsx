export default function WeeklyReviewPage({
    weeklyReview,
    weeklyReviewStatus,
    loadWeeklyReview,
}) {
    const stats = [
        {
            label: 'Tasks Completed',
            value: weeklyReview.tasksCompleted,
            emoji: '✅',
        },
        {
            label: 'Habits Completed',
            value: weeklyReview.habitsCompleted,
            emoji: '🔥',
        },
        {
            label: 'Pomodoros Completed',
            value: weeklyReview.pomodorosCompleted,
            emoji: '🍅',
        },
        {
            label: 'Focus Minutes',
            value: weeklyReview.focusMinutes,
            emoji: '⏱️',
        },
        {
            label: 'XP Earned',
            value: weeklyReview.xpEarned,
            emoji: '✨',
        },
    ]

    const totalWins =
        weeklyReview.tasksCompleted +
        weeklyReview.habitsCompleted +
        weeklyReview.pomodorosCompleted

    const reviewMessage =
        totalWins === 0
            ? 'No pressure. This week can start with one tiny win.'
            : totalWins < 5
                ? 'You showed up this week. Small wins still count.'
                : totalWins < 15
                    ? 'You built real momentum this week.'
                    : 'Strong week. Your consistency is paying off.'

    return (
        <main className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Weekly Review</h2>
                    <p className="mt-2 text-slate-500">
                        A gentle look back at what you completed over the last 7 days.
                    </p>
                </div>

                <button
                    onClick={loadWeeklyReview}
                    className="rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
                >
                    Refresh Review
                </button>
            </div>

            {weeklyReviewStatus && (
                <p className="mt-4 rounded-2xl bg-indigo-50 p-3 text-sm font-semibold text-indigo-700">
                    {weeklyReviewStatus}
                </p>
            )}

            <div className="mt-5 rounded-3xl bg-indigo-50 p-5">
                <p className="text-sm font-semibold text-indigo-700">
                    Weekly Reflection
                </p>
                <p className="mt-2 text-lg font-bold text-indigo-950">
                    {reviewMessage}
                </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center"
                    >
                        <p className="text-3xl">{stat.emoji}</p>
                        <p className="mt-3 text-3xl font-bold">{stat.value}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-500">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
        </main>
    )
}