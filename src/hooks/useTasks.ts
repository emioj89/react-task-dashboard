import { useEffect, useState } from 'react'
import { initialTasks } from '../data/initialTasks'
import type { Task, TaskDraft } from '../types/task'
const storageKey = 'taskflow-tasks'
const loadTasks = (): Task[] => { try { const stored = localStorage.getItem(storageKey); return stored ? JSON.parse(stored) as Task[] : initialTasks } catch { return initialTasks } }
export function useTasks() { const [tasks, setTasks] = useState<Task[]>(loadTasks); useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(tasks)) }, [tasks]); return { tasks, addTask: (draft: TaskDraft) => setTasks((current) => [{ ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...current]), updateTask: (id: string, draft: TaskDraft) => setTasks((current) => current.map((task) => task.id === id ? { ...task, ...draft } : task)), deleteTask: (id: string) => setTasks((current) => current.filter((task) => task.id !== id)), toggleTask: (id: string) => setTasks((current) => current.map((task) => task.id === id ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' } : task)) } }
