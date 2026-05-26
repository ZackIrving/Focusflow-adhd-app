import { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabaseClient'

const starterTasks = [
  {
    title: 'Complete 1 A+ practice quiz',
    category: 'A+ Study',
    energy: 'Medium',
    time: '20 min',
    reward: 20,
    done: false,
  },
  {
    title: 'Update GitHub homelab README',
    category: 'Homelab',
    energy: 'Low',
    time: '15 min',
    reward: 15,
    done: false,
  },
  {
    title: 'Apply to 1 remote help desk job',
    category: 'Career',
    energy: 'Medium',
    time: '25 min',
    reward: 25,
    done: false,
  },
  {
    title: 'Write 3 TikTok hooks for recovery brand',
    category: 'Shopify Brand',
    energy: 'Creative',
    time: '15 min',
    reward: 20,
    done: false,
  },
]

const appModes = ['Today', 'Brain Dump', 'Focus Timer', 'Progress']

const emptyTaskForm = {
  title: '',
  category: 'Personal',
  energy: 'Low',
  time: '15 min',
  reward: 10,
  done: false,
}

export default function ADHDProductivityApp() {
  const [tasks, setTasks] = useState([])
  const [activeMode, setActiveMode] = useState('Today')
  const [brainDump, setBrainDump] = useState('')
  const [timerMinutes, setTimerMinutes] = useState(25)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [syncStatus, setSyncStatus] = useState('Loading your tasks...')
  const [taskForm, setTaskForm] = useState(emptyTaskForm)
  const [showTaskForm, setShowTaskForm] = useState(false)

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    if (!isRunning || timerSeconds <= 0) return

    const interval = setInterval(() => {
      setTimerSeconds((current) => {
        if (current <= 1) {
          setIsRunning(false)
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timerSeconds])

  async function loadTasks() {
    setIsLoading(true)
    setSyncStatus('Loading your tasks...')

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error loading tasks:', error)
      setSyncStatus('Could not load Supabase tasks. Using starter tasks for now.')
      setTasks(starterTasks)
      setIsLoading(false)
      return
    }

    if (!data || data.length === 0) {
      const { data: insertedTasks, error: insertError } = await supabase
        .from('tasks')
        .insert(starterTasks)
        .select()

      if (insertError) {
        console.error('Error creating starter tasks:', insertError)
        setTasks(starterTasks)
        setSyncStatus('Starter tasks loaded locally. Supabase insert failed.')
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

    if (error) {
      console.error('Error updating task:', error)
      setSyncStatus('Save failed. Refresh to reload from Supabase.')
      return
    }

    setSyncStatus('Synced with Supabase')
  }

  async function addTask(task) {
    setSyncStatus('Saving...')

    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
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

  async function deleteTask(taskToDelete) {
    const confirmed = window.confirm(`Delete this task?\n\n${taskToDelete.title}`)
    if (!confirmed) return

    setTasks((current) => current.filter((task) => task.id !== taskToDelete.id))
    setSyncStatus('Deleting...')

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskToDelete.id)

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

    const simplified = [
      {
        title: 'Pick the easiest starting point',
        category: 'Brain Dump',
        energy: 'Low',
        time: '5 min',
        reward: 10,
        done: false,
      },
      {
        title: 'Turn one thought into one task',
        category: 'Brain Dump',
        energy: 'Low',
        time: '10 min',
        reward: 15,
        done: false,
      },
      {
        title: 'Schedule the next action only',
        category: 'Planning',
        energy: 'Low',
        time: '5 min',
        reward: 10,
        done: false,
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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                Web App + Mobile PWA
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                FocusFlow ADHD Productivity
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
                One productivity system that syncs across your computer and phone. Start a task on desktop, continue on mobile, and keep your momentum visible everywhere.
              </p>
              <p className="mt-3 text-sm font-semibold text-indigo-700">{syncStatus}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-indigo-100 p-4 text-center">
                <p className="text-xs font-semibold text-indigo-700 sm:text-sm">Focus</p>
                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{focusScore}%</h2>
              </div>
              <div className="rounded-2xl bg-emerald-100 p-4 text-center">
                <p className="text-xs font-semibold text-emerald-700 sm:text-sm">XP</p>
                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{totalXP}</h2>
              </div>
              <div className="rounded-2xl bg-amber-100 p-4 text-center">
                <p className="text-xs font-semibold text-amber-700 sm:text-sm">Tasks</p>
                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{completedTasks.length}/{tasks.length}</h2>
              </div>
            </div>
          </div>
        </header>

        <nav className="sticky top-0 z-10 my-4 rounded-3xl border border-slate-200 bg-white/90 p-2 shadow-lg backdrop-blur">
          <div className="grid grid-cols-4 gap-2">
            {appModes.map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveMode(mode)}
                className={`rounded-2xl px-3 py-3 text-sm font-semibold transition sm:text-base ${
                  activeMode === mode
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </nav>

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
                  <form onSubmit={handleCreateCustomTask} className="mt-6 rounded-3xl border border-indigo-100 bg-indigo-50 p-5">
                    <h3 className="text-xl font-bold">Create a custom task</h3>
                    <p className="mt-1 text-sm text-slate-600">Make the task specific, small, and easy to start.</p>

                    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <label className="md:col-span-2">
                        <span className="text-sm font-semibold text-slate-700">Task title</span>
                        <input
                          value={taskForm.title}
                          onChange={(event) => updateTaskForm('title', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                          placeholder="Example: Study A+ networking for 20 minutes"
                        />
                      </label>

                      <label>
                        <span className="text-sm font-semibold text-slate-700">Category</span>
                        <input
                          value={taskForm.category}
                          onChange={(event) => updateTaskForm('category', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                          placeholder="A+ Study, Homelab, Career, Shopify"
                        />
                      </label>

                      <label>
                        <span className="text-sm font-semibold text-slate-700">Energy</span>
                        <select
                          value={taskForm.energy}
                          onChange={(event) => updateTaskForm('energy', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                        >
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                          <option>Creative</option>
                        </select>
                      </label>

                      <label>
                        <span className="text-sm font-semibold text-slate-700">Time estimate</span>
                        <select
                          value={taskForm.time}
                          onChange={(event) => updateTaskForm('time', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                        >
                          <option>5 min</option>
                          <option>10 min</option>
                          <option>15 min</option>
                          <option>20 min</option>
                          <option>25 min</option>
                          <option>45 min</option>
                          <option>60 min</option>
                        </select>
                      </label>

                      <label>
                        <span className="text-sm font-semibold text-slate-700">XP reward</span>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={taskForm.reward}
                          onChange={(event) => updateTaskForm('reward', event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white p-3 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                        />
                      </label>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="submit"
                        className="rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
                      >
                        Save Task
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTaskForm(emptyTaskForm)
                          setShowTaskForm(false)
                        }}
                        className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold transition hover:bg-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="mt-6 space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id || task.title}
                      className={`rounded-2xl border p-4 transition sm:p-5 ${
                        task.done
                          ? 'border-emerald-200 bg-emerald-50'
                          : 'border-slate-200 bg-white hover:shadow-md'
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="mb-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              {task.category}
                            </span>
                            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                              {task.energy} Energy
                            </span>
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                              {task.time}
                            </span>
                          </div>
                          <h3 className={`text-lg font-semibold ${task.done ? 'line-through text-slate-400' : ''}`}>
                            {task.title}
                          </h3>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <button
                            onClick={() => toggleTask(task)}
                            className={`rounded-xl px-4 py-2 font-semibold transition ${
                              task.done
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-900 text-white hover:bg-slate-700'
                            }`}
                          >
                            {task.done ? 'Done' : `Start +${task.reward} XP`}
                          </button>
                          <button
                            onClick={() => deleteTask(task)}
                            className="rounded-xl bg-red-100 px-4 py-2 font-semibold text-red-700 transition hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
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

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
                <h2 className="text-2xl font-bold">Cross-Device Sync</h2>
                <div className="mt-5 space-y-3">
                  {[
                    'Custom tasks save to Supabase',
                    'Delete removes tasks everywhere',
                    'XP updates from completed tasks',
                    'Computer and phone share the same data',
                    'Login can be added next',
                  ].map((item) => (
                    <div key={item} className="rounded-2xl bg-slate-100 p-4 font-medium">
                      {item}
                    </div>
                  ))}
                </div>
              </section>
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


