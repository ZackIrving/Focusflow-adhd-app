import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export function useDailyPlanner(user) {
  const [plan, setPlan] = useState(null)
  const [plannerStatus, setPlannerStatus] = useState('')
  const [plannerLoading, setPlannerLoading] = useState(false)

  async function loadDailyPlan(intensity = 'Balanced', forceRefresh = false) {
    if (!user) return

    setPlannerLoading(true)
    setPlannerStatus(
      forceRefresh
        ? 'Buddy is rebuilding your plan...'
        : 'Buddy is checking your day...'
    )

    const { data, error } = await supabase.functions.invoke(
      'daily-ai-planner',
      {
        body: {
          userId: user.id,
          intensity,
          forceRefresh,
        },
      }
    )

    if (error) {
      console.error('Daily planner error:', error)

      if (error?.context) {
        const text = await error.context.text()
        console.error('Edge Function Response:', text)
      }

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

    loadDailyPlan('Balanced', false)
  }, [user])

  return {
    plan,
    plannerStatus,
    plannerLoading,
    loadDailyPlan,
  }
}