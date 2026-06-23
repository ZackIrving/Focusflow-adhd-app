import { useState } from 'react'
import { supabase } from '../supabaseClient'

export function useAICoach() {
    const [coachInput, setCoachInput] = useState('')
    const [coachResponse, setCoachResponse] = useState('')
    const [coachStatus, setCoachStatus] = useState('')

    async function getCoachResponse(event) {
        event.preventDefault()

        if (!coachInput.trim()) {
            setCoachStatus('Type what feels overwhelming first.')
            return
        }

        setCoachStatus('Coach is thinking...')

        const { data, error } = await supabase.functions.invoke('ai-task-coach', {
            body: {
                input: coachInput,
            },
        })

        if (error) {
            console.error('AI Coach error:', error)
            setCoachStatus('Could not reach AI Coach.')
            return
        }

        setCoachResponse(data.result)
        setCoachStatus('Coach response ready.')
    }

    return {
        coachInput,
        setCoachInput,
        coachResponse,
        coachStatus,
        getCoachResponse,
    }
}