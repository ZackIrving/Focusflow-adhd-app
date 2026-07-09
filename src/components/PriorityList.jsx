import PriorityCard from './PriorityCard'

export default function PriorityList({ priorities = [] }) {
    return (
        <div className="mt-8">

            <h2 className="mb-4 text-xl font-bold">
                Today's Priorities
            </h2>

            {priorities.map((priority, index) => (
                <PriorityCard
                    key={index}
                    number={index + 1}
                    priority={priority}
                />
            ))}

        </div>
    )
}