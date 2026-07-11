import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { buildBuddyContext } from '../_shared/buddy/contextBuilder.ts'
import { buildCoachPrompt } from '../_shared/buddy/coachPrompt.ts'
import { generateTextWithOpenAI } from '../_shared/buddy/openai.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    })
  }

  try {
    const { input, userId } = await req.json()

    if (!input?.trim()) {
      return new Response(
        JSON.stringify({
          error: 'Missing input',
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: 'Missing userId',
        }),
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

    const context = await buildBuddyContext(
      supabase,
      userId
    )

    const prompt = buildCoachPrompt(
      input.trim(),
      context
    )

    const aiResult =
      await generateTextWithOpenAI(prompt)

    console.log(
      'AI Coach OpenAI Status:',
      aiResult.status
    )

    console.log(
      'AI Coach Buddy Context:',
      JSON.stringify(context, null, 2)
    )

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

    try {
      JSON.parse(aiResult.outputText)
    } catch (parseError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Invalid AI Coach JSON: ${String(parseError)}`,
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

    return new Response(
      JSON.stringify({
        status: aiResult.status,
        result: aiResult.outputText,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('AI Coach Edge Function error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: String(error),
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
})