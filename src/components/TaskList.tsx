import type { Task } from '../types/task'

interface Props { tasks: Task[]; onToggle: (id: string) => void; onEdit: (task: Task) => void; onDelete: (id: string) => void; onCreate: () => void }
const formatDate = (date: string) => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(date))

export function TaskList({ tasks, onToggle, onEdit, onDelete, onCreate }: Props) {
  if (!tasks.length) return <div className="empty-state"><div><span className="empty-icon" aria-hidden="true">✓</span><h3>No tasks found</h3><p>Try adjusting your filters, or create a task to get your work moving.</p><button className="button primary" type="button" onClick={onCreate}>+ New task</button></div></div>
  return <div className="task-list">{tasks.map((task) => <article className={`task-card ${task.status === 'completed' ? 'completed' : ''}`} key={task.id}><button className={`status-toggle ${task.status === 'completed' ? 'done' : ''}`} type="button" aria-label={`Mark ${task.title} as ${task.status === 'completed' ? 'pending' : 'completed'}`} onClick={() => onToggle(task.id)}>{task.status === 'completed' ? '✓' : ''}</button><div className="task-content"><h3 className="task-title">{task.title}</h3>{task.description && <p className="task-description">{task.description}</p>}<div className="task-meta"><span className={`priority-badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span><span>Created {formatDate(task.createdAt)}</span></div></div><div className="actions"><button className="icon-button" type="button" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}>✎</button><button className="icon-button delete" type="button" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task.id)}>×</button></div></article>)}</div>
}
