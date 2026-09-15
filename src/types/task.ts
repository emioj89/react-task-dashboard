export type TaskStatus = 'pending' | 'completed'
export type Priority = 'Low' | 'Medium' | 'High'
export type Filter = 'All' | 'Pending' | 'Completed'
export interface Task { id: string; title: string; description: string; status: TaskStatus; priority: Priority; createdAt: string }
export interface TaskDraft { title: string; description: string; priority: Priority; status: TaskStatus }
