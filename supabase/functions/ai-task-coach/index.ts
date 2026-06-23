import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

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

  const { input } = await req.json()

  if (!input) {
    return new Response(
      JSON.stringify({ error: 'Missing input' }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-mini',
      reasoning: {
        effort: 'low',
      },
      text: {
        verbosity: 'low',
      },
      input: [
        {
          role: 'system',
          content:
            'You are FocusFlow, an ADHD-friendly productivity coach. Return only plain text. Keep the response under 140 words. Do not repeat yourself. Use a calm, practical tone. Format every response exactly like this: Tiny next steps: 1) ... 2) ... 3) ... Start here: ... Encouragement: ... Make each step specific, visible, and doable in under 10 minutes.',
        },
        {
          role: 'user',
          content: `The user feels overwhelmed by this: ${input}. Break it into 3 tiny next steps, choose the easiest starting point, and give one encouraging sentence.`,
        },
      ],
    }),
  })

  const data = await response.json()

  const outputText =
    data.output_text ||
    data.output
      ?.flatMap((item: any) => item.content || [])
      ?.map((content: any) => content.text || content.output_text)
      ?.filter(Boolean)
      ?.join('\n\n') ||
    data.error?.message ||
    'I could not generate a response. Try again.'

  return new Response(
    JSON.stringify({
      status: response.status,
      result: outputText,
    }),
    {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  )
})