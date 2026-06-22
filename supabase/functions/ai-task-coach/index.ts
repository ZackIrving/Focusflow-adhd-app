import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { input } = await req.json()

  if (!input) {
    return new Response(
      JSON.stringify({ error: 'Missing input' }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
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
          'You are FocusFlow, an ADHD-friendly productivity coach. Return only plain text. Keep the response under 120 words. Do not repeat yourself. Give 3 tiny next steps, then one encouraging sentence.',
    },
    {
      role: 'user',
      content: `Break this down into 3 tiny next steps: ${input}`,
    },
  ],
}),
  })

 const data = await response.json()

console.log('OPENAI STATUS:', response.status)
console.log('OPENAI DATA:', data)

const outputText =
  data.output_text ||
  data.output
    ?.flatMap((item) => item.content || [])
    ?.map((content) => content.text || content.output_text)
    ?.filter(Boolean)
    ?.join('\n\n') ||
  data.error?.message ||
  'I could not generate a response. Try again.'

return new Response(
  JSON.stringify({
    status: response.status,
    result: outputText,
    raw: data,
  }),
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
)
})