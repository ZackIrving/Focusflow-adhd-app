import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export function useDailyPlanner(user) {
  const [plan, setPlan] = useState(null)
  const [plannerStatus, setPlannerStatus] = useState('')
  const [plannerLoading, setPlannerLoading] = useState(false)

  async function loadDailyPlan(intensity = 'Balanced') {
    if (!user) return

    setPlannerLoading(true)
    setPlannerStatus('Buddy is checking your day...')

    const { data, error } = await supabase.functions.invoke(
      'daily-ai-planner',
      {
        body: {
          userId: user.id,
          intensity,
        },
      }
    )

    if (error) {
      console.error('Daily planner error:', error)
      setPlannerStatus('Buddy could not load your plan right now.')
      setPlannerLoading(false)
      return
    }

    setPlan(data.plan)
    setPlannerStatus(
      data.source === 'cache'
        ? 'Loaded today’s plan.'
        : 'Built a fresh plan for today.'
    )
    setPlannerLoading(false)
  }

  useEffect(() => {
    if (!user) return

    loadDailyPlan()
  }, [user])

  return {
    plan,
    plannerStatus,
    plannerLoading,
    loadDailyPlan,
  }
}