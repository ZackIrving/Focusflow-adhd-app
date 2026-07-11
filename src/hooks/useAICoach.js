import { useState } from 'react'
import { supabase } from '../supabaseClient'

export function useAICoach(user, tasks, habits, totalXP) {
    const [coachInput, setCoachInput] = useState('')
    const [coachResponse, setCoachResponse] = useState(null)
    const [coachStatus, setCoachStatus] = useState('')
    const [coachTasksAdded, setCoachTasksAdded] = useState(false)

    async function getCoachResponse(event) {
        event.preventDefault()

        if (!coachInput.trim()) {
            setCoachStatus('Type what feels overwhelming first.')
            return
        }

        setCoachStatus('Coach is thinking...')
        setCoachTasksAdded(false)

        const { data, error } = await supabase.functions.invoke('ai-task-coach', {
            body: {
                input: coachInput,
                userId: user?.id,
            },
        })

        if (error) {
            console.error('AI Coach error:', error)
            setCoachStatus('Could not reach AI Coach.')
            return
        }

        try {
            const parsedResponse = JSON.parse(data.result)
            setCoachResponse(parsedResponse)
        } catch (parseError) {
            console.error('AI Coach parse error:', parseError)
            setCoachResponse({
                summary: data.result,
                tasks: [],
                startHere: '',
                encouragement: '',
            })
        }
        setCoachStatus('Coach response ready.')
    }

    return {
        coachInput,
        setCoachInput,
        coachResponse,
        coachStatus,
        coachTasksAdded,
        setCoachTasksAdded,
        getCoachResponse,
    }
}