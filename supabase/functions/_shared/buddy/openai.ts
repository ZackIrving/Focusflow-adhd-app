export async function generateTextWithOpenAI(prompt: string) {
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
      input: prompt,
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

  return {
    status: response.status,
    outputText,
    raw: data,
  }
}