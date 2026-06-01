import { useEffect, useState } from 'react'

export function useFocusTimer(setReminderBanner) {
  const [timerSeconds, setTimerSeconds] = useState(1500)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimerSeconds((current) => {
        if (current <= 1) {
          setIsRunning(false)

          setReminderBanner(
            'Focus session complete. Take a short break.'
          )

          if (
            'Notification' in window &&
            Notification.permission === 'granted'
          ) {
            new Notification('FocusFlow', {
              body: 'Focus session complete. Take a short break.',
              icon: '/icon-192.png',
            })
          }

          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, setReminderBanner])

  function selectTimer(minutes) {
    setTimerSeconds(minutes * 60)
    setIsRunning(false)
  }

  function resetTimer() {
    setTimerSeconds(1500)
    setIsRunning(false)
  }

  function formatTimer(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
  }

  return {
    timerSeconds,
    isRunning,
    setIsRunning,
    selectTimer,
    resetTimer,
    formatTimer,
  }
}