import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export function useProgress(user) {
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [progressStatus, setProgressStatus] = useState('')

  useEffect(() => {
    if (user) {
      loadProgress()
    } else {
      setXp(0)
      setLevel(1)
    }
  }, [user])

  function calculateLevel(totalXp) {
    if (totalXp >= 1200) return 6
    if (totalXp >= 800) return 5
    if (totalXp >= 500) return 4
    if (totalXp >= 250) return 3
    if (totalXp >= 100) return 2
    return 1
  }

  async function loadProgress() {
    if (!user) return

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Error loading progress:', error)
      return
    }

    if (!data) {
      const { data: newProgress, error: insertError } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          xp: 0,
          level: 1,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating progress:', insertError)
        return
      }

      setXp(newProgress.xp)
      setLevel(newProgress.level)
      return
    }

    setXp(data.xp)
    setLevel(data.level)
  }

  async function addXp(amount, reason = 'Progress earned') {
    if (!user || amount <= 0) return

    const newXp = xp + amount
    const newLevel = calculateLevel(newXp)

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        xp: newXp,
        level: newLevel,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error updating XP:', error)
      setProgressStatus('Could not update XP.')
      return
    }

    const { error: eventError } = await supabase
      .from('xp_events')
      .insert({
        user_id: user.id,
        amount,
        reason,
      })

    if (eventError) {
      console.error('Error saving XP event:', eventError)
    }

    setXp(newXp)
    setLevel(newLevel)

    if (newLevel > level) {
      setProgressStatus(`Level up! You reached Level ${newLevel}.`)
    } else {
      setProgressStatus(`+${amount} XP — ${reason}`)
    }
  }

  function getLevelProgress() {
    const levels = [
      { level: 1, xpRequired: 0 },
      { level: 2, xpRequired: 100 },
      { level: 3, xpRequired: 250 },
      { level: 4, xpRequired: 500 },
      { level: 5, xpRequired: 800 },
      { level: 6, xpRequired: 1200 },
    ]

    const currentLevelData = levels.find((item) => item.level === level)
    const nextLevelData = levels.find((item) => item.level === level + 1)

    if (!nextLevelData) {
      return {
        currentLevelXp: xp,
        nextLevelXp: xp,
        xpIntoLevel: xp,
        xpNeededForNextLevel: 0,
        progressPercent: 100,
        isMaxLevel: true,
      }
    }

    const currentLevelXp = currentLevelData.xpRequired
    const nextLevelXp = nextLevelData.xpRequired
    const xpIntoLevel = xp - currentLevelXp
    const xpNeededForNextLevel = nextLevelXp - currentLevelXp
    const progressPercent = Math.min(
      100,
      Math.round((xpIntoLevel / xpNeededForNextLevel) * 100)
    )

    return {
      currentLevelXp,
      nextLevelXp,
      xpIntoLevel,
      xpNeededForNextLevel,
      progressPercent,
      isMaxLevel: false,
    }
  }

  return {
    xp,
    level,
    progressStatus,
    addXp,
    calculateLevel,
    getLevelProgress,
    loadProgress,
  }
}