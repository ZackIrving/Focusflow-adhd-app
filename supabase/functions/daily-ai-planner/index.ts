import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { buildBuddyContext } from '../_shared/buddy/contextBuilder.ts'
import { buildPlannerPrompt } from '../_shared/buddy/plannerPrompt.ts'
import { generateTextWithOpenAI } from '../_shared/buddy/openai.ts'

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

  const { userId, intensity = 'Balanced', forceRefresh = false } =
    await req.json()

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing userId' }), {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
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

  if (existingPlan && !forceRefresh) {
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

  if (existingPlan && forceRefresh) {
    const { error: deleteError } = await supabase
      .from('daily_ai_plans')
      .delete()
      .eq('user_id', userId)
      .eq('plan_date', today)
      .eq('intensity', intensity)

    if (deleteError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: deleteError,
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
  }

  const context = await buildBuddyContext(supabase, userId)
  const prompt = buildPlannerPrompt(context, intensity)
  const aiResult = await generateTextWithOpenAI(prompt)

  console.log('OpenAI Status:', aiResult.status)
  console.log('OpenAI Output Text:', aiResult.outputText)

  if (aiResult.status !== 200) {
    return new Response(
      JSON.stringify({
        success: false,
        openai: aiResult.raw,
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

  let plan

  try {
    plan = JSON.parse(aiResult.outputText)
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: String(error),
        outputText: aiResult.outputText,
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

  const momentumScore = Number(
  context.snapshot.momentum.score
)

if (!Number.isInteger(momentumScore)) {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Momentum score must be an integer',
      receivedMomentum: context.snapshot.momentum,
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

  const { data: savedPlan, error: saveError } = await supabase
    .from('daily_ai_plans')
    .insert({
      user_id: userId,
      plan_date: today,
      intensity,
      greeting: plan.greeting,
      summary: plan.summary,
      mood: plan.mood,
      workload: plan.workload,
      priorities: plan.priorities,
      timeline: plan.timeline,
      bulldog_message: plan.bulldogMessage,
      momentum_snapshot: momentumScore,
      context_hash: 'v1',
    })
    .select()
    .single()

  if (saveError) {
    return new Response(
      JSON.stringify({
        success: false,
        error: saveError,
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

  return new Response(
    JSON.stringify({
      source: 'new',
      plan: savedPlan,
    }),
    {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  )
})