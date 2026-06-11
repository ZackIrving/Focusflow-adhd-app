import puppyStage1 from '../assets/bulldog/puppy-stage-1.png'
import puppyStage2 from '../assets/bulldog/puppy-stage-2.png'
import teenBulldog from '../assets/bulldog/teen-bulldog.png'
import adultBulldog from '../assets/bulldog/adult-bulldog.png'

export default function BulldogAvatar({
    isExcited,
    growthStage,
}) {
    let bulldogImage = puppyStage1

    if (growthStage === 'Curious Puppy') {
        bulldogImage = puppyStage2
    }

    if (growthStage === 'Teen Bulldog') {
        bulldogImage = teenBulldog
    }

    if (
        growthStage === 'Young Adult Bulldog' ||
        growthStage === 'Adult Bulldog'
    ) {
        bulldogImage = adultBulldog
    }

    return (
        <div
            className={`transition duration-300 ${isExcited
                    ? 'scale-110 rotate-3'
                    : 'hover:scale-105'
                }`}
        >
            <img
                src={bulldogImage}
                alt={growthStage}
                className="h-40 w-40 object-contain drop-shadow-xl"
            />
        </div>
    )
}