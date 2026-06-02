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

    const lines = brainDump
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const tasksFromBrainDump = lines.map((line) => ({
      title: line,
      category: 'Brain Dump',
      energy: 'Low',
      time: '10 min',
      reward: 10,
      done: false,
      user_id: user.id,
    }))

    setSyncStatus('Turning brain dump into tasks...')

    const { data, error } = await supabase
      .from('tasks')
      .insert(tasksFromBrainDump)
      .select()

    if (error) {
      console.error('Error saving brain dump tasks:', error)
      setSyncStatus('Brain dump tasks could not save to Supabase.')
      return
    }

    setTasks((current) => [...data, ...current])
    setBrainDump('')
    setActiveMode('Today')
    setSyncStatus('Brain dump tasks saved.')
  }

  return {
    brainDump,
    setBrainDump,
    createBreakdown,
  }
}