import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export function useBadges(user) {
  const [earnedBadges, setEarnedBadges] = useState([])
  const [badgeStatus, setBadgeStatus] = useState('')

  useEffect(() => {
    if (user) {
      loadEarnedBadges()
    } else {
      setEarnedBadges([])
    }
  }, [user])

  async function loadEarnedBadges() {
    if (!user) return

    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        id,
        earned_at,
        badges (
          id,
          name,
          description,
          badge_key
        )
      `)
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false })

    if (error) {
      console.error('Error loading badges:', error)
      return
    }

    setEarnedBadges(data || [])
  }

  async function awardBadge(badgeKey) {
    if (!user) return

    const alreadyEarned = earnedBadges.some(
      (item) => item.badges?.badge_key === badgeKey
    )

    if (alreadyEarned) return

    const { data: badge, error: badgeError } = await supabase
      .from('badges')
      .select('*')
      .eq('badge_key', badgeKey)
      .single()

    if (badgeError) {
      console.error('Error finding badge:', badgeError)
      return
    }

    const { error: awardError } = await supabase
      .from('user_badges')
      .insert({
        user_id: user.id,
        badge_id: badge.id,
      })

    if (awardError) {
      console.error('Error awarding badge:', awardError)
      return
    }

    setBadgeStatus(`Badge unlocked: ${badge.name}`)
    await loadEarnedBadges()
  }

  return {
    earnedBadges,
    badgeStatus,
    awardBadge,
    loadEarnedBadges,
  }
}