import { useMemo, useRef, useState } from 'react'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { TaskSummary } from './components/TaskSummary'
import { useTasks } from './hooks/useTasks'
import type { Filter, Priority, Task, TaskDraft } from './types/task'
import './App.css'

const filters: Filter[] = ['All', 'Pending', 'Completed']

function App() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useTasks()
  const [filter, setFilter] = useState<Filter>('All')
  const [query, setQuery] = useState('')
  const [priority, setPriority] = useState<Priority | 'All'>('All')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  const visibleTasks = useMemo(() => {
    const text = query.trim().toLowerCase()
    return tasks.filter((task) => {
      const matchesStatus = filter === 'All' || task.status === filter.toLowerCase()
      const matchesPriority = priority === 'All' || task.priority === priority
      const matchesText = !text || `${task.title} ${task.description}`.toLowerCase().includes(text)
      return matchesStatus && matchesPriority && matchesText
    })
  }, [filter, priority, query, tasks])

  const rememberOpener = () => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
  }

  const openCreate = () => { rememberOpener(); setEditingTask(null); setIsFormOpen(true) }
  const openEdit = (task: Task) => { rememberOpener(); setEditingTask(task); setIsFormOpen(true) }
  const closeForm = () => { setIsFormOpen(false); setEditingTask(null); requestAnimationFrame(() => openerRef.current?.focus()) }

  const submit = (draft: TaskDraft) => {
    if (editingTask) updateTask(editingTask.id, draft)
    else addTask(draft)
    closeForm()
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#dashboard" aria-label="TaskFlow dashboard"><span className="brand-mark" aria-hidden="true">✓</span>TaskFlow</a>
        <button className="button primary" type="button" onClick={openCreate}>+ New task</button>
      </header>
      <section className="dashboard" id="dashboard">
        <div className="page-heading"><div><p className="eyebrow">Your workspace</p><h1>Stay on top of your work.</h1><p className="subtitle">Plan your priorities, move work forward, and keep your day in focus.</p><button className="button primary mobile-create" type="button" onClick={openCreate}>+ New task</button></div></div>
        <TaskSummary tasks={tasks} />
        <section className="task-section" aria-labelledby="tasks-heading">
          <div className="section-heading"><div><h2 id="tasks-heading">My tasks</h2><p>{visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'} shown</p></div><div className="filters" role="group" aria-label="Filter tasks by status">{filters.map((item) => <button key={item} className={filter === item ? 'filter active' : 'filter'} type="button" onClick={() => setFilter(item)}>{item}</button>)}</div></div>
          <div className="toolbar"><label className="search"><span aria-hidden="true">⌕</span><span className="sr-only">Search tasks</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks" aria-label="Search tasks" /></label><label className="priority">Priority<select value={priority} onChange={(event) => setPriority(event.target.value as Priority | 'All')} aria-label="Filter tasks by priority"><option value="All">All priorities</option><option>High</option><option>Medium</option><option>Low</option></select></label></div>
          <TaskList tasks={visibleTasks} onToggle={toggleTask} onEdit={openEdit} onDelete={deleteTask} onCreate={openCreate} />
        </section>
      </section>
      {isFormOpen && <TaskForm task={editingTask} onClose={closeForm} onSubmit={submit} />}
    </main>
  )
}

export default App
