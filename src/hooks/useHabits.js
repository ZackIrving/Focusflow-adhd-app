import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export function useHabits(user) {
  const [habits, setHabits] = useState([])
  const [habitName, setHabitName] = useState('')
  const [habitStatus, setHabitStatus] = useState('')

  useEffect(() => {
    if (user) {
      loadHabits()
    } else {
      setHabits([])
    }
  }, [user])

  async function loadHabits() {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error loading habits:', error)

      const cachedHabits = localStorage.getItem('focusflow_habits')

      if (cachedHabits) {
        setHabits(JSON.parse(cachedHabits))
        setHabitStatus('Offline mode: showing last saved habits.')
      } else {
        setHabitStatus('Could not load habits.')
      }

      return
    }

    const today = new Date().toISOString().split('T')[0]

    const resetHabits = (data || []).map((habit) => ({
      ...habit,
      completed_today:
        habit.last_completed_date === today ? habit.completed_today : false,
    }))

    setHabits(resetHabits)
    localStorage.setItem('focusflow_habits', JSON.stringify(resetHabits))
  }

  async function addHabit(event) {
    event.preventDefault()

    if (!habitName.trim()) {
      setHabitStatus('Enter a habit name first.')
      return
    }

    const { data, error } = await supabase
      .from('habits')
      .insert([
        {
          user_id: user.id,
          name: habitName.trim(),
          frequency: 'daily',
          completed_today: false,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error adding habit:', error)
      setHabitStatus('Could not add habit.')
      return
    }

    setHabits((current) => [...current, data])
    setHabitName('')
    setHabitStatus('Habit added.')
  }

  async function toggleHabit(habit) {
    const updatedStatus = !habit.completed_today

    setHabits((current) =>
      current.map((item) =>
        item.id === habit.id
          ? { ...item, completed_today: updatedStatus }
          : item
      )
    )

    const { error } = await supabase
      .from('habits')
      .update({
        completed_today: updatedStatus,
        last_completed_date: updatedStatus
          ? new Date().toISOString().split('T')[0]
          : null,
      })
      .eq('id', habit.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error updating habit:', error)
      setHabitStatus('Could not update habit.')
      return
    }

    setHabitStatus(updatedStatus ? 'Habit completed.' : 'Habit unchecked.')
  }

  async function deleteHabit(habit) {
    const confirmed = window.confirm(`Delete this habit?\n\n${habit.name}`)
    if (!confirmed) return

    setHabits((current) => current.filter((item) => item.id !== habit.id))

    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habit.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting habit:', error)
      setHabitStatus('Could not delete habit.')
      return
    }

    setHabitStatus('Habit deleted.')
  }

  return {
    habits,
    habitName,
    setHabitName,
    habitStatus,
    addHabit,
    toggleHabit,
    deleteHabit,
  }
}