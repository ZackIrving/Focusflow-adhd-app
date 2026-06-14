import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export function useWeeklyReview(user) {
    const [weeklyReview, setWeeklyReview] = useState({
        tasksCompleted: 0,
        habitsCompleted: 0,
        pomodorosCompleted: 0,
        focusMinutes: 0,
        xpEarned: 0,
    })

    const [weeklyReviewStatus, setWeeklyReviewStatus] = useState('')

    useEffect(() => {
        if (user) {
            loadWeeklyReview()
        }
    }, [user])

    async function loadWeeklyReview() {
        if (!user) return

        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const since = sevenDaysAgo.toISOString()

        const { data: tasks } = await supabase
            .from('tasks')
            .select('id')
            .eq('user_id', user.id)
            .eq('done', true)
            .gte('created_at', since)

        const { data: habitLogs } = await supabase
            .from('habit_logs')
            .select('id')
            .eq('user_id', user.id)
            .gte('completed_date', since.split('T')[0])

        const { data: pomodoros } = await supabase
            .from('pomodoro_sessions')
            .select('duration')
            .eq('user_id', user.id)
            .eq('completed', true)
            .gte('created_at', since)

        const { data: xpEvents } = await supabase
            .from('xp_events')
            .select('amount')
            .eq('user_id', user.id)
            .gte('created_at', since)

        setWeeklyReview({
            tasksCompleted: tasks?.length || 0,
            habitsCompleted: habitLogs?.length || 0,
            pomodorosCompleted: pomodoros?.length || 0,
            focusMinutes:
                pomodoros?.reduce((total, session) => total + session.duration, 0) || 0,
            xpEarned:
                xpEvents?.reduce((total, event) => total + event.amount, 0) || 0,
        })

        setWeeklyReviewStatus('Weekly review updated.')
    }

    return {
        weeklyReview,
        weeklyReviewStatus,
        loadWeeklyReview,
    }
}