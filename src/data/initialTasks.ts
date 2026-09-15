import type { Task } from '../types/task'
export const initialTasks: Task[] = [
  { id: 'task-1', title: 'Prepare project proposal', description: 'Outline goals, scope, and delivery milestones for the client.', status: 'pending', priority: 'High', createdAt: '2026-09-15T09:00:00.000Z' },
  { id: 'task-2', title: 'Review design feedback', description: 'Consolidate comments from the latest product review.', status: 'pending', priority: 'Medium', createdAt: '2026-09-14T09:00:00.000Z' },
  { id: 'task-3', title: 'Schedule team check-in', description: '', status: 'completed', priority: 'Low', createdAt: '2026-09-12T09:00:00.000Z' },
]
