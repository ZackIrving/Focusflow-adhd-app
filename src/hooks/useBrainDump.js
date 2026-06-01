import { useState } from 'react'
import { supabase } from '../supabaseClient'

export function useBrainDump(user, setTasks, setSyncStatus, setActiveMode) {
  const [brainDump, setBrainDump] = useState('')

  async function createBreakdown() {
    if (!brainDump.trim()) return

    if (!user) {
      setSyncStatus('Sign in before saving brain dump tasks.')
      return
    }

    const simplified = [
      {
        title: 'Pick the easiest starting point',
        category: 'Brain Dump',
        energy: 'Low',
        time: '5 min',
        reward: 10,
        done: false,
        user_id: user.id,
      },
      {
        title: 'Turn one thought into one task',
        category: 'Brain Dump',
        energy: 'Low',
        time: '10 min',
        reward: 15,
        done: false,
        user_id: user.id,
      },
      {
        title: 'Schedule the next action only',
        category: 'Planning',
        energy: 'Low',
        time: '5 min',
        reward: 10,
        done: false,
        user_id: user.id,
      },
    ]

    setSyncStatus('Saving brain dump tasks...')

    const { data, error } = await supabase
      .from('tasks')
      .insert(simplified)
      .select()

    if (error) {
      console.error('Error saving brain dump tasks:', error)
      setSyncStatus('Brain dump tasks could not save to Supabase.')
      return
    }

    setTasks((current) => [...data, ...current])
    setBrainDump('')
    setActiveMode('Today')
    setSyncStatus('Synced with Supabase')
  }

  return {
    brainDump,
    setBrainDump,
    createBreakdown,
  }
}