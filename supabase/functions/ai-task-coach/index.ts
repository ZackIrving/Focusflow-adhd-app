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
          content: `
You are FocusFlow, an ADHD-friendly productivity coach.

Return ONLY valid JSON.

Use this exact structure:

{
  "summary": "short calming summary",
  "tasks": [
    {
      "title": "specific tiny task",
      "category": "AI Coach",
      "energy": "Low",
      "time": "10 min",
      "reward": 10
    }
  ],
  "startHere": "the easiest task to start with",
  "encouragement": "one encouraging sentence"
}

Rules:
- Create exactly 3 tasks.
- Each task must take 10 minutes or less.
- Keep task titles specific and visible.
- Energy must be Low, Medium, or Creative.
- Return JSON only.
`,
        },
        {
          role: 'user',
          content: `Turn this overwhelm into 3 tiny FocusFlow tasks: ${input}`,
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
    '{}'

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