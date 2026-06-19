import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const body = await req.json()

  console.log('Send push request:', body)

  return new Response(
    JSON.stringify({
      message: 'send-push function is working',
      received: body,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
})