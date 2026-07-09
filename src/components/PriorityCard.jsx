export default function PriorityCard({
    number,
    priority,
}) {
    return (
        <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">

            <p className="font-semibold">
                {number}. {priority.task}
            </p>

            <p className="mt-2 text-gray-500">
                {priority.reason}
            </p>

            <p className="mt-3 text-sm font-medium text-blue-600">
                ⏱ {priority.estimatedMinutes} min
            </p>

        </div>
    )
}