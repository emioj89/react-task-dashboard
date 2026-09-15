import { useEffect, useState } from 'react'
import { initialTasks } from '../data/initialTasks'
import type { Priority, Task, TaskDraft, TaskStatus } from '../types/task'

const storageKey = 'taskflow-tasks'
const priorities: Priority[] = ['Low', 'Medium', 'High']
const statuses: TaskStatus[] = ['pending', 'completed']

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null
const isTask = (value: unknown): value is Task => isRecord(value) && typeof value.id === 'string' && typeof value.title === 'string' && typeof value.description === 'string' && statuses.includes(value.status as TaskStatus) && priorities.includes(value.priority as Priority) && typeof value.createdAt === 'string' && !Number.isNaN(Date.parse(value.createdAt))
const fallbackTasks = () => initialTasks.map((task) => ({ ...task }))

const loadTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(storageKey)
    if (!stored) return fallbackTasks()
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) && parsed.every(isTask) ? parsed : fallbackTasks()
  } catch {
    return fallbackTasks()
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(tasks)) } catch { /* Storage may be unavailable. */ }
  }, [tasks])

  const addTask = (draft: TaskDraft) => setTasks((current) => [{ ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...current])
  const updateTask = (id: string, draft: TaskDraft) => setTasks((current) => current.map((task) => task.id === id ? { ...task, ...draft } : task))
  const deleteTask = (id: string) => setTasks((current) => current.filter((task) => task.id !== id))
  const toggleTask = (id: string) => setTasks((current) => current.map((task) => task.id === id ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' } : task))

  return { tasks, addTask, updateTask, deleteTask, toggleTask }
}
