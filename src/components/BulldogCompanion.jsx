import { useMemo, useState } from 'react'

export default function BulldogCompanion({ level, xp }) {
    const [isExcited, setIsExcited] = useState(false)
    const [message, setMessage] = useState('Tap me when you need a tiny boost.')

    const encouragements = [
        'One tiny step counts.',
        'You are building momentum.',
        'Nice work showing up today.',
        'Small wins still count.',
        'Let’s do the next easy thing.',
    ]

    const growthStage = useMemo(() => {
        if (xp >= 800) return 'Adult Bulldog'
        if (xp >= 500) return 'Young Adult Bulldog'
        if (xp >= 250) return 'Teen Bulldog'
        if (xp >= 100) return 'Curious Puppy'
        return 'Tiny Puppy'
    }, [xp])

    function handleBulldogClick() {
        const randomMessage =
            encouragements[Math.floor(Math.random() * encouragements.length)]

        setMessage(randomMessage)
        setIsExcited(true)

        setTimeout(() => {
            setIsExcited(false)
        }, 700)
    }

    return (
        <section className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-100 p-5 shadow-lg sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                    type="button"
                    onClick={handleBulldogClick}
                    className={`relative flex h-32 w-32 shrink-0 items-center justify-center rounded-[2rem] bg-white shadow-inner transition hover:scale-105 ${isExcited ? 'animate-bounce' : 'animate-pulse'
                        }`}
                    aria-label="Interact with bulldog companion"
                >
                    <div className="relative">
                        <div className="text-6xl">🐶</div>
                        <div className="absolute -right-2 top-2 h-3 w-3 animate-ping rounded-full bg-amber-400" />
                    </div>
                </button>

                <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-700">
                        FocusFlow Companion
                    </p>

                    <h2 className="text-2xl font-bold text-amber-950">
                        English Bulldog
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-amber-800">
                        Growth Stage: {growthStage}
                    </p>

                    <p className="mt-3 rounded-2xl bg-white p-3 text-sm font-medium text-amber-800 shadow-sm">
                        “{message}”
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