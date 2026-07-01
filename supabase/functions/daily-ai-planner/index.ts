import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { buildBuddyContext } from '../_shared/buddy/contextBuilder.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    })
  }

  const { userId, intensity = 'Balanced' } = await req.json()

  if (!userId) {
    return new Response(
      JSON.stringify({ error: 'Missing userId' }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const today = new Date().toISOString().slice(0, 10)

  const { data: existingPlan } = await supabase
    .from('daily_ai_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('plan_date', today)
    .eq('intensity', intensity)
    .maybeSingle()

  if (existingPlan) {
    return new Response(
      JSON.stringify({
        source: 'cache',
        plan: existingPlan,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }

  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select(
      'title, category, energy, time, reward, done, recurring, recurrence, created_at'
    )
    .eq('user_id', userId)

  const { data: habits, error: habitsError } = await supabase
    .from('habits')
    .select('name, completed_today, created_at')
    .eq('user_id', userId)

  const { data: progress, error: progressError } = await supabase
    .from('user_progress')
    .select('xp, level')
    .eq('user_id', userId)
    .maybeSingle()

  const { data: pomodoros, error: pomodorosError } = await supabase
    .from('pomodoro_sessions')
    .select('duration, completed, created_at')
    .eq('user_id', userId)
    .eq('completed', true)

  if (tasksError || habitsError || progressError || pomodorosError) {
    return new Response(
      JSON.stringify({
        success: false,
        tasksError,
        habitsError,
        progressError,
        pomodorosError,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }

  const activeTasks = tasks?.filter((task) => !task.done) || []
  const completedTasks = tasks?.filter((task) => task.done) || []
  const remainingHabits =
    habits?.filter((habit) => !habit.completed_today) || []

  const context = {
    date: today,
    intensity,
    snapshot: {
      activeTaskCount: activeTasks.length,
      completedTaskCount: completedTasks.length,
      habitsRemaining: remainingHabits.length,
      xp: progress?.xp || 0,
      level: progress?.level || 1,
      completedPomodoros: pomodoros?.length || 0,
    },
    activeTasks: activeTasks.slice(0, 10),
    habits: habits?.slice(0, 10) || [],
  }

  return new Response(
    JSON.stringify({
      source: 'new',
      message: 'Planner context built successfully.',
      context,
    }),
    {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  )
})