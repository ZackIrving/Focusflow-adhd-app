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

export default function ADHDProductivityApp() {
  const [user, setUser] = useState(null)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authStatus, setAuthStatus] = useState('Sign in or create an account to use FocusFlow.')
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const [tasks, setTasks] = useState([])
  const [activeMode, setActiveMode] = useState('Today')
  const [brainDump, setBrainDump] = useState('')
  const [timerMinutes, setTimerMinutes] = useState(25)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [syncStatus, setSyncStatus] = useState('Waiting for login...')
  const [taskForm, setTaskForm] = useState(emptyTaskForm)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editForm, setEditForm] = useState(emptyTaskForm)

  const [reminderBanner, setReminderBanner] = useState('')
  const [notificationPermission, setNotificationPermission] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  )
  useEffect(() => {
    async function getCurrentSession() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Session error:', error)
        setAuthStatus('Could not check login status.')
      }

      setUser(data?.session?.user || null)
      setIsAuthLoading(false)
    }

    getCurrentSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (user) {
      loadTasks(user.id)
    } else {
      setTasks([])
      setSyncStatus('Waiting for login...')
    }
  }, [user])

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

  async function signUp() {
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthStatus('Enter an email and password first.')
      return
    }

    setAuthStatus('Creating account...')

    const { error } = await supabase.auth.signUp({
      email: authEmail.trim(),
      password: authPassword,
    })

    if (error) {
      console.error('Sign up error:', error)
      setAuthStatus(error.message)
      return
    }

    setAuthStatus('Account created. Check your email if Supabase asks for confirmation, then sign in.')
  }

  async function signIn() {
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthStatus('Enter an email and password first.')
      return
    }

    setAuthStatus('Signing in...')

    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail.trim(),
      password: authPassword,
    })

    if (error) {
      console.error('Sign in error:', error)
      setAuthStatus(error.message)
      return
    }

    setAuthEmail('')
    setAuthPassword('')
    setAuthStatus('Signed in.')
  }

  async function signOut() {
    await supabase.auth.signOut()
    setTasks([])
    setAuthStatus('Signed out.')
  }

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

  async function loadTasks(userId) {
    setIsLoading(true)
    setSyncStatus('Loading your tasks...')

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error loading tasks:', error)
      setSyncStatus('Could not load your Supabase tasks.')
      setIsLoading(false)
      return
    }

    if (!data || data.length === 0) {
      const tasksWithUser = starterTasks.map((task) => ({
        ...task,
        user_id: userId,
      }))

      const { data: insertedTasks, error: insertError } = await supabase
        .from('tasks')
        .insert(tasksWithUser)
        .select()

      if (insertError) {
        console.error('Error creating starter tasks:', insertError)
        setTasks([])
        setSyncStatus('Starter tasks could not save to Supabase.')
      } else {
        setTasks(insertedTasks)
        setSyncStatus('Synced with Supabase')
      }
    } else {
      setTasks(data)
      setSyncStatus('Synced with Supabase')
    }

    setIsLoading(false)
  }

  const completedTasks = tasks.filter((task) => task.done)
  const totalXP = completedTasks.reduce((sum, task) => sum + Number(task.reward || 0), 0)
  const focusScore = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0
  const activeTasks = tasks.filter((task) => !task.done)
  const completedToday = completedTasks.length
  const nextTask = activeTasks[0]?.title || 'No active tasks. Nice work.'
  const estimatedFocusMinutes = completedTasks.reduce((sum, task) => {
    const minutes = parseInt(task.time)
    return sum + (isNaN(minutes) ? 0 : minutes)
  }, 0)

  const nextTinyStep = useMemo(() => {
    const unfinished = tasks.find((task) => !task.done)
    if (!unfinished) return 'Celebrate. You cleared your main queue.'
    return `Start with: ${unfinished.title}`
  }, [tasks])

  function formatTimer(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  function selectTimer(minutes) {
    setTimerMinutes(minutes)
    setTimerSeconds(minutes * 60)
    setIsRunning(false)
  }

  function resetTimer() {
    setTimerSeconds(timerMinutes * 60)
    setIsRunning(false)
  }

  function updateTaskForm(field, value) {
    setTaskForm((current) => ({
      ...current,
      [field]: field === 'reward' ? Number(value) : value,
    }))
  }

  function updateEditForm(field, value) {
    setEditForm((current) => ({
      ...current,
      [field]: field === 'reward' ? Number(value) : value,
    }))
  }

  function startEditingTask(task) {
    setEditingTaskId(task.id)
    setEditForm({
      title: task.title || '',
      category: task.category || 'Personal',
      energy: task.energy || 'Low',
      time: task.time || '15 min',
      reward: Number(task.reward || 10),
      done: Boolean(task.done),
    })
  }

  function cancelEditingTask() {
    setEditingTaskId(null)
    setEditForm(emptyTaskForm)
  }

  async function handleCreateCustomTask(event) {
    event.preventDefault()

    if (!taskForm.title.trim()) {
      setSyncStatus('Add a task title first.')
      return
    }

    await addTask({
      title: taskForm.title.trim(),
      category: taskForm.category,
      energy: taskForm.energy,
      time: taskForm.time,
      reward: Number(taskForm.reward || 10),
      done: false,
    })

    setTaskForm(emptyTaskForm)
    setShowTaskForm(false)
  }

  async function toggleTask(taskToUpdate) {
    const updatedDoneStatus = !taskToUpdate.done

    setTasks((current) =>
      current.map((task) =>
        task.id === taskToUpdate.id ? { ...task, done: updatedDoneStatus } : task
      )
    )

    setSyncStatus('Saving...')

    const { error } = await supabase
      .from('tasks')
      .update({ done: updatedDoneStatus })
      .eq('id', taskToUpdate.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error updating task:', error)
      setSyncStatus('Save failed. Refresh to reload from Supabase.')
      return
    }

    setSyncStatus('Synced with Supabase')
  }

  async function addTask(task) {
    if (!user) {
      return (
        <AuthScreen
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          authStatus={authStatus}
          signIn={signIn}
          signUp={signUp}
        />
      )
    }

    setSyncStatus('Saving...')

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...task, user_id: user.id }])
      .select()
      .single()

    if (error) {
      console.error('Error adding task:', error)
      setSyncStatus('Task could not save to Supabase.')
      return
    }

    setTasks((current) => [...current, data])
    setSyncStatus('Synced with Supabase')
  }

  async function saveEditedTask(taskToEdit) {
    if (!editForm.title.trim()) {
      setSyncStatus('Edited task needs a title.')
      return
    }

    const updatedTask = {
      title: editForm.title.trim(),
      category: editForm.category.trim() || 'Personal',
      energy: editForm.energy,
      time: editForm.time,
      reward: Number(editForm.reward || 10),
    }

    setTasks((current) =>
      current.map((task) =>
        task.id === taskToEdit.id ? { ...task, ...updatedTask } : task
      )
    )

    setSyncStatus('Saving edit...')

    const { error } = await supabase
      .from('tasks')
      .update(updatedTask)
      .eq('id', taskToEdit.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error editing task:', error)
      setSyncStatus('Edit failed. Refresh to reload from Supabase.')
      return
    }

    setEditingTaskId(null)
    setEditForm(emptyTaskForm)
    setSyncStatus('Synced with Supabase')
  }

  async function deleteTask(taskToDelete) {
    const confirmed = window.confirm(`Delete this task?\n\n${taskToDelete.title}`)
    if (!confirmed) return

    setTasks((current) => current.filter((task) => task.id !== taskToDelete.id))
    setSyncStatus('Deleting...')

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskToDelete.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting task:', error)
      setSyncStatus('Delete failed. Refresh to reload from Supabase.')
      return
    }

    setSyncStatus('Synced with Supabase')
  }

  function addTinyTask() {
    addTask({
      title: 'Do a 5-minute reset task',
      category: 'Momentum',
      energy: 'Low',
      time: '5 min',
      reward: 10,
      done: false,
    })
  }

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
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
                <h2 className="text-2xl font-bold">Panic Button</h2>
                <p className="mt-2 text-slate-500">For executive dysfunction moments.</p>

                <div className="mt-5 rounded-2xl bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">Next tiny step</p>
                  <h3 className="mt-2 text-lg font-bold">{nextTinyStep}</h3>
                </div>

                <div className="mt-5 space-y-3">
                  <button className="w-full rounded-2xl bg-red-500 py-4 font-semibold text-white shadow-lg transition hover:bg-red-600">
                    I’m Avoiding Everything
                  </button>
                  <button
                    onClick={addTinyTask}
                    className="w-full rounded-2xl bg-orange-500 py-4 font-semibold text-white shadow-lg transition hover:bg-orange-600"
                  >
                    Give Me A Tiny Task
                  </button>
                  <button className="w-full rounded-2xl bg-emerald-500 py-4 font-semibold text-white shadow-lg transition hover:bg-emerald-600">
                    Rebuild Momentum
                  </button>
                </div>
              </section>

              <DailyStats
                completedToday={completedToday}
                totalXP={totalXP}
                activeTasks={activeTasks}
                estimatedFocusMinutes={estimatedFocusMinutes}
                nextTask={nextTask}
              />
            </aside>
          </main>
        )}

        {!isLoading && activeMode === 'Brain Dump' && (
          <main className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-8">
            <h2 className="text-3xl font-bold">Brain Dump → Action Splitter</h2>
            <p className="mt-2 max-w-2xl text-slate-500">
              Dump the chaos here. The app turns it into small next actions and saves them to Supabase.
            </p>

            <textarea
              value={brainDump}
              onChange={(event) => setBrainDump(event.target.value)}
              className="mt-6 min-h-[220px] w-full rounded-2xl border border-slate-300 p-4 text-base focus:outline-none focus:ring-4 focus:ring-indigo-200"
              placeholder="Example: I need to study A+, update my homelab GitHub, work on my Shopify store, clean my room, apply for jobs, and I don’t know where to start..."
            />

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={createBreakdown}
                className="rounded-2xl bg-indigo-600 px-6 py-4 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
              >
                Break This Down + Save
              </button>
              <button
                onClick={() => setBrainDump('')}
                className="rounded-2xl bg-slate-200 px-6 py-4 font-semibold transition hover:bg-slate-300"
              >
                Clear
              </button>
            </div>
          </main>
        )}

        {!isLoading && activeMode === 'Focus Timer' && (
          <main className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-lg sm:p-8">
            <h2 className="text-3xl font-bold">Hyperfocus Timer</h2>
            <p className="mt-2 text-slate-500">Choose a sprint that matches your current energy.</p>

            <div className="mt-5">
              <button
                onClick={requestNotificationPermission}
                className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-slate-700"
              >
                Enable Timer Notifications
              </button>

              <p className="mt-2 text-sm text-slate-500">
                Notification status: {notificationPermission}
              </p>
            </div>

            <div className="mx-auto mt-8 flex h-60 w-60 items-center justify-center rounded-full border-[16px] border-indigo-500 shadow-inner sm:h-72 sm:w-72">
              <div>
                <p className="text-slate-500">Focus Sprint</p>
                <h3 className="mt-2 text-6xl font-bold">{formatTimer(timerSeconds)}</h3>
              </div>
            </div>

            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[10, 25, 45].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => selectTimer(minutes)}
                  className="rounded-2xl bg-slate-100 py-4 font-semibold transition hover:bg-slate-200"
                >
                  {minutes} Min
                </button>
              ))}
            </div>

            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="rounded-2xl bg-indigo-600 px-6 py-4 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
              >
                {isRunning ? 'Pause Session' : 'Start Session'}
              </button>
              <button
                onClick={resetTimer}
                className="rounded-2xl bg-slate-200 px-6 py-4 font-semibold transition hover:bg-slate-300"
              >
                Reset
              </button>
            </div>
          </main>
        )}

        {!isLoading && activeMode === 'Progress' && (
          <main className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[
              { label: 'Total Tasks Completed', progress: focusScore },
              { label: 'XP Earned', progress: Math.min(totalXP, 100) },
              { label: 'Brain Dump Progress', progress: tasks.filter((task) => task.category === 'Brain Dump' && task.done).length * 25 },
              { label: 'Momentum', progress: Math.min(completedTasks.length * 20, 100) },
            ].map((item) => (
              <section key={item.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="mb-3 flex justify-between">
                  <h3 className="text-xl font-bold">{item.label}</h3>
                  <span className="font-semibold text-slate-500">{item.progress}%</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.min(item.progress, 100)}%` }} />
                </div>
              </section>
            ))}
          </main>
        )}
      </div>
    </div>
  )
}




