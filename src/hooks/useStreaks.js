import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export function useStreaks(user) {
    const [currentStreak, setCurrentStreak] = useState(0)
    const [longestStreak, setLongestStreak] = useState(0)
    const [lastCompletedDate, setLastCompletedDate] = useState(null)

    useEffect(() => {
        if (user) {
            loadStats()
        }
    }, [user])

    async function loadStats() {
        const { data } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (data) {
            setCurrentStreak(data.current_streak || 0)
            setLongestStreak(data.longest_streak || 0)
            setLastCompletedDate(data.last_completed_date)
            return
        }

        await supabase.from('user_stats').insert({
            user_id: user.id,
            current_streak: 0,
            longest_streak: 0,
            last_completed_date: null,
        })
    }

    async function updateStreak() {
        if (!user) return

        const today = new Date().toISOString().split('T')[0]

        const { data: stats, error: fetchError } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (fetchError) {
            console.error('Error fetching streak stats:', fetchError)
            return
        }

        if (stats?.last_completed_date === today) return

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayString = yesterday.toISOString().split('T')[0]

        const previousStreak = stats?.current_streak || 0
        const previousLongest = stats?.longest_streak || 0

        const newCurrentStreak =
            stats?.last_completed_date === yesterdayString ? previousStreak + 1 : 1

        const newLongestStreak = Math.max(previousLongest, newCurrentStreak)

        const { error: updateError } = await supabase
            .from('user_stats')
            .update({
                current_streak: newCurrentStreak,
                longest_streak: newLongestStreak,
                last_completed_date: today,
            })
            .eq('user_id', user.id)

        if (updateError) {
            console.error('Error updating streak:', updateError)
            return
        }

        setCurrentStreak(newCurrentStreak)
        setLongestStreak(newLongestStreak)
        setLastCompletedDate(today)
    }

    return {
        currentStreak,
        longestStreak,
        lastCompletedDate,
        updateStreak,
    }
}