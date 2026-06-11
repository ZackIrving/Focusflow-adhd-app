export default function BadgeCollection({ earnedBadges }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
      <h2 className="text-2xl font-bold">Achievement Badges</h2>
      <p className="mt-2 text-slate-500">
        Milestones you’ve unlocked through focus, habits, and progress.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {earnedBadges.length === 0 ? (
          <p className="rounded-2xl bg-slate-100 p-4 text-slate-500">
            No badges unlocked yet. Complete a task, habit, or Pomodoro to earn one.
          </p>
        ) : (
          earnedBadges.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-amber-200 bg-amber-50 p-4"
            >
              <p className="text-3xl">🏆</p>
              <h3 className="mt-2 font-bold text-amber-900">
                {item.badges?.name}
              </h3>
              <p className="mt-1 text-sm text-amber-800">
                {item.badges?.description}
              </p>
              <p className="mt-2 text-xs font-semibold text-amber-700">
                Earned: {new Date(item.earned_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}