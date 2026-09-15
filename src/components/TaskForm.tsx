import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Task, TaskDraft } from '../types/task'

interface Props { task: Task | null; onSubmit: (draft: TaskDraft) => void; onClose: () => void }
const focusableSelector = 'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]'

export function TaskForm({ task, onSubmit, onClose }: Props) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<TaskDraft['priority']>(task?.priority ?? 'Medium')
  const [status, setStatus] = useState<TaskDraft['status']>(task?.status ?? 'pending')
  const modalRef = useRef<HTMLElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleInputRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { onClose(); return }
      if (event.key !== 'Tab' || !modalRef.current) return
      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>(focusableSelector))
      const first = focusable[0]
      const last = focusable.at(-1)
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (title.trim()) onSubmit({ title: title.trim(), description: description.trim(), priority, status })
  }

  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="task-form-title" aria-describedby="task-form-description"><div className="modal-heading"><div><h2 id="task-form-title">{task ? 'Edit task' : 'Create a new task'}</h2><p id="task-form-description">{task ? 'Update the details of your task.' : 'Add the details to keep your work organized.'}</p></div><button className="close-button" type="button" onClick={onClose} aria-label="Close form">×</button></div><form className="task-form" onSubmit={submit}><label className="field">Task title<input ref={titleInputRef} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Send project update" required /></label><label className="field">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add more context (optional)" /></label><div className="form-row"><label className="field">Priority<select value={priority} onChange={(event) => setPriority(event.target.value as TaskDraft['priority'])}><option>Low</option><option>Medium</option><option>High</option></select></label><label className="field">Status<select value={status} onChange={(event) => setStatus(event.target.value as TaskDraft['status'])}><option value="pending">Pending</option><option value="completed">Completed</option></select></label></div><div className="form-actions"><button className="button secondary" type="button" onClick={onClose}>Cancel</button><button className="button primary" type="submit">{task ? 'Save changes' : 'Create task'}</button></div></form></section></div>
}
