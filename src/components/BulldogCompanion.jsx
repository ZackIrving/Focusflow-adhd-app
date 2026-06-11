export default function BulldogCompanion({ level, xp }) {
    return (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-lg sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-100 to-orange-200 shadow-inner">
                    <div className="text-center">
                        <div className="text-5xl">🐾</div>
                        <p className="mt-1 text-xs font-bold text-amber-900">Bulldog</p>
                    </div>
                </div>

                <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-700">
                        FocusFlow Companion
                    </p>

                    <h2 className="text-2xl font-bold text-amber-950">
                        English Bulldog Puppy
                    </h2>

                    <p className="mt-2 text-amber-800">
                        Your puppy grows as you complete tasks, habits, and Pomodoro sessions.
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-white p-3">
                            <p className="text-xs font-semibold text-amber-700">
                                Bond Level
                            </p>
                            <p className="text-xl font-bold text-amber-950">
                                Level {level}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white p-3">
                            <p className="text-xs font-semibold text-amber-700">
                                Growth XP
                            </p>
                            <p className="text-xl font-bold text-amber-950">
                                {xp} XP
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}