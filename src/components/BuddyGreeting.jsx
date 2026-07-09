function getMoodEmoji(mood) {
    if (mood === 'motivated') return '💪'
    if (mood === 'focused') return '🎯'
    if (mood === 'celebrating') return '🎉'
    return '🌤'
}

export default function BuddyGreeting({
    greeting,
    summary,
    mood = 'calm',
}) {
    return (
        <div>
            <h1 className="text-3xl font-bold">
                {getMoodEmoji(mood)} {greeting || 'Good morning!'}
            </h1>

            <p className="mt-3 text-gray-700 leading-relaxed">
                {summary || "Let's make today count."}
            </p>
        </div>
    )
}