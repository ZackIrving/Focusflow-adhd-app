import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

serve(async () => {
  return new Response(
    JSON.stringify({
      openaiConfigured: Boolean(
        Deno.env.get('OPENAI_API_KEY')
      ),
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
})