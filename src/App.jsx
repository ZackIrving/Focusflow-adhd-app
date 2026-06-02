import { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabaseClient'
import { appModes, emptyTaskForm, starterTasks } from './constants/appData'
import AuthScreen from './components/AuthScreen'
import ReminderBanner from './components/ReminderBanner'
import Header from './components/Header'
import NavigationTabs from './components/NavigationTabs'
import DailyStats from './components/DailyStats'
import CustomTaskForm from './components/CustomTaskForm'
import TaskCard from './components/TaskCard'
import PanicPanel from './components/PanicPanel'
import BrainDumpPage from './components/BrainDumpPage'
import FocusTimerPage from './components/FocusTimerPage'
import ProgressPage from './components/ProgressPage'
import { useFocusTimer } from './hooks/useFocusTimer'
import { useAuth } from './hooks/useAuth'
import { useTasks } from './hooks/useTasks'
import { useBrainDump } from './hooks/useBrainDump'
import { useStreaks } from './hooks/useStreaks'
import { useHabits } from './hooks/useHabits'
import HabitTracker from './components/HabitTracker'

export default function ADHDProductivityApp() {
  const {
    user,
    authEmail,
    setAuthEmail,
    authPassword,
    setAuthPassword,
    authStatus,
    isAuthLoading,
    signUp,
    signIn,
    signOut,
  } = useAuth()
  const [activeMode, setActiveMode] = useState('Today')
  const [reminderBanner, setReminderBanner] = useState('')
  const [notificationPermission, setNotificationPermission] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  )
  const {
    currentStreak,
    longestStreak,
    updateStreak,
  } = useStreaks(user)
  const [timerMinutes, setTimerMinutes] = useState(25)
  const {
    timerSeconds,
    isRunning,
    setIsRunning,
    selectTimer,
    resetTimer,
    formatTimer,
  } = useFocusTimer(setReminderBanner)
  const {
    tasks,
    isLoading,
    syncStatus,
    taskForm,
    setTaskForm,
    showTaskForm,
    setShowTaskForm,
    editingTaskId,
    editForm,
    completedTasks,
    activeTasks,
    totalXP,
    focusScore,
    completedToday,
    nextTask,
    estimatedFocusMinutes,
    nextTinyStep,
    updateTaskForm,
    updateEditForm,
    startEditingTask,
    cancelEditingTask,
    handleCreateCustomTask,
    toggleTask,
    addTask,
    addTinyTask,
    saveEditedTask,
    deleteTask,
    setSyncStatus,
    setTasks,
  } = useTasks(user, updateStreak)
  const {
    habits,
    habitName,
    setHabitName,
    habitStatus,
    addHabit,
    toggleHabit,
    deleteHabit,
  } = useHabits(user)
  const {
    brainDump,
    setBrainDump,
    createBreakdown,
  } = useBrainDump(user, setTasks, setSyncStatus, setActiveMode)

  useEffect(() => {
    if (!isRunning || timerSeconds <= 0) return

    const interval = setInterval(() => {
      setTimerSeconds((current) => {
        if (current <= 1) {
          setIsRunning(false)
          setReminderBanner('Focus session complete. Take a short break.')

          if ('Notification' in window && Notification.permission === 'granted') {
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
  }, [isRunning, timerSeconds])

  async function requestNotificationPermission() {
    if (!('Notification' in window)) {
      setReminderBanner('Browser notifications are not supported on this device.')
      return
    }

    const permission = await Notification.requestPermission()

    setNotificationPermission(permission)

    if (permission === 'granted') {
      setReminderBanner(
        'Notifications enabled. FocusFlow can now notify you when sessions end.'
      )
    } else {
      setReminderBanner('Notifications were not enabled.')
    }
  }

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6 text-slate-900">
        <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-3xl font-bold">FocusFlow</h1>
          <p className="mt-2 text-slate-500">Checking login status...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
        <div className="mx-auto flex min-h-[90vh] max-w-xl items-center">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
            <p className="mb-3 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
              Private ADHD Productivity App
            </p>
            <h1 className="text-4xl font-bold tracking-tight">FocusFlow Login</h1>
            <p className="mt-3 text-slate-600">
              Sign in to sync your tasks, XP, brain dumps, and progress across your computer and phone.
            </p>

            <div className="mt-6 space-y-4">
              <label>
                <span className="text-sm font-semibold text-slate-700">Email</span>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(event) => setAuthEmail(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-4 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                  placeholder="you@example.com"
                />
              </label>

              <label>
                <span className="text-sm font-semibold text-slate-700">Password</span>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(event) => setAuthPassword(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-4 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                  placeholder="Use at least 6 characters"
                />
              </label>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={signIn}
                className="rounded-2xl bg-indigo-600 px-5 py-4 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
              >
                Sign In
              </button>
              <button
                onClick={signUp}
                className="rounded-2xl bg-slate-900 px-5 py-4 font-semibold text-white shadow-lg transition hover:bg-slate-700"
              >
                Create Account
              </button>
            </div>

            <p className="mt-5 rounded-2xl bg-slate-100 p-4 text-sm font-medium text-slate-700">
              {authStatus}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
        <Header
          user={user}
          signOut={signOut}
          syncStatus={syncStatus}
          focusScore={focusScore}
          totalXP={totalXP}
          completedTasks={completedTasks}
          tasks={tasks}
        />
        <ReminderBanner
          reminderBanner={reminderBanner}
          setReminderBanner={setReminderBanner}
        />

        <NavigationTabs
          appModes={appModes}
          activeMode={activeMode}
          setActiveMode={setActiveMode}
        />

        {isLoading && (
          <main className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
            <h2 className="text-2xl font-bold">Loading your FocusFlow tasks...</h2>
            <p className="mt-2 text-slate-500">Connecting to Supabase.</p>
          </main>
        )}

        {!isLoading && activeMode === 'Today' && (
          <main className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <section className="space-y-6 xl:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Today’s Dopamine Queue</h2>
                    <p className="mt-1 text-slate-500">Small tasks, visible progress, fast wins.</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => setShowTaskForm(!showTaskForm)}
                      className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-slate-700"
                    >
                      {showTaskForm ? 'Close Form' : '+ Custom Task'}
                    </button>
                    <button
                      onClick={addTinyTask}
                      className="rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
                    >
                      + Tiny Task
                    </button>
                  </div>
                </div>

                {showTaskForm && (
                  <CustomTaskForm
                    taskForm={taskForm}
                    updateTaskForm={updateTaskForm}
                    handleCreateCustomTask={handleCreateCustomTask}
                    setTaskForm={setTaskForm}
                    setShowTaskForm={setShowTaskForm}
                    emptyTaskForm={emptyTaskForm}
                  />
                )}

                <div className="mt-6 space-y-4">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id || task.title}
                      task={task}
                      editingTaskId={editingTaskId}
                      editForm={editForm}
                      updateEditForm={updateEditForm}
                      saveEditedTask={saveEditedTask}
                      cancelEditingTask={cancelEditingTask}
                      toggleTask={toggleTask}
                      startEditingTask={startEditingTask}
                      deleteTask={deleteTask}
                    />
                  ))}
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <PanicPanel
                nextTinyStep={nextTinyStep}
                addTinyTask={addTinyTask}
              />

              <DailyStats
                completedToday={completedToday}
                totalXP={totalXP}
                activeTasks={activeTasks}
                estimatedFocusMinutes={estimatedFocusMinutes}
                nextTask={nextTask}
              />

              <HabitTracker
                habits={habits}
                habitName={habitName}
                setHabitName={setHabitName}
                habitStatus={habitStatus}
                addHabit={addHabit}
                toggleHabit={toggleHabit}
                deleteHabit={deleteHabit}
              />
            </aside>
          </main>
        )}

        {!isLoading && activeMode === 'Brain Dump' && (
          <BrainDumpPage
            brainDump={brainDump}
            setBrainDump={setBrainDump}
            createBreakdown={createBreakdown}
          />
        )}

        {!isLoading && activeMode === 'Focus Timer' && (
          <FocusTimerPage
            requestNotificationPermission={requestNotificationPermission}
            notificationPermission={notificationPermission}
            timerSeconds={timerSeconds}
            formatTimer={formatTimer}
            selectTimer={selectTimer}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            resetTimer={resetTimer}
          />
        )}

        {!isLoading && activeMode === 'Progress' && (
          <ProgressPage
            focusScore={focusScore}
            totalXP={totalXP}
            tasks={tasks}
            completedTasks={completedTasks}
          />
        )}
      </div>
    </div>
  )
}




