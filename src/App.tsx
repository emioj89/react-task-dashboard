import { useMemo, useState } from 'react'
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
  const visibleTasks = useMemo(() => {
    const text = query.trim().toLowerCase()
    return tasks.filter((task) => (filter === 'All' || task.status === filter.toLowerCase()) && (priority === 'All' || task.priority === priority) && (!text || `${task.title} ${task.description}`.toLowerCase().includes(text)))
  }, [filter, priority, query, tasks])
  const openCreate = () => { setEditingTask(null); setIsFormOpen(true) }
  const submit = (draft: TaskDraft) => { if (editingTask) updateTask(editingTask.id, draft); else addTask(draft); setIsFormOpen(false); setEditingTask(null) }
  return <main className="app-shell"><header className="topbar"><a className="brand" href="#dashboard"><span className="brand-mark">✓</span>TaskFlow</a><button className="button primary" onClick={openCreate}>+ New task</button></header><section className="dashboard" id="dashboard"><div className="page-heading"><div><p className="eyebrow">Your workspace</p><h1>Stay on top of your work.</h1><p className="subtitle">Plan your priorities, move work forward, and keep your day in focus.</p><button className="button primary mobile-create" onClick={openCreate}>+ New task</button></div></div><TaskSummary tasks={tasks} /><section className="task-section"><div className="section-heading"><div><h2>My tasks</h2><p>{visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'} shown</p></div><div className="filters">{filters.map((item) => <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)}>{item}</button>)}</div></div><div className="toolbar"><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks" /></label><label className="priority">Priority<select value={priority} onChange={(event) => setPriority(event.target.value as Priority | 'All')}><option value="All">All priorities</option><option>High</option><option>Medium</option><option>Low</option></select></label></div><TaskList tasks={visibleTasks} onToggle={toggleTask} onEdit={(task) => { setEditingTask(task); setIsFormOpen(true) }} onDelete={deleteTask} onCreate={openCreate} /></section></section>{isFormOpen && <TaskForm task={editingTask} onClose={() => { setIsFormOpen(false); setEditingTask(null) }} onSubmit={submit} />}</main>
}
export default App
