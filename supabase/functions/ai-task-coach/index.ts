const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { tasks = [], habits = [], brainDump = '' } = await req.json()

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing OPENAI_API_KEY secret.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const prompt = `
You are an ADHD productivity coach.

Use the user's current tasks, habits, and optional brain dump to recommend:
1. The best next task
2. A 5-minute starting step
3. A suggested focus sprint length
4. A short encouragement message

Keep the response practical, direct, and not overly motivational.

Tasks:
${JSON.stringify(tasks, null, 2)}

Habits:
${JSON.stringify(habits, null, 2)}

Brain Dump:
${brainDump}
`

    const openaiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: prompt,
      }),
    })

    const result = await openaiResponse.json()

    if (!openaiResponse.ok) {
      return new Response(JSON.stringify({ error: result }), {
        status: openaiResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(
      JSON.stringify({
        recommendation:
          result.output_text || 'No recommendation generated.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})