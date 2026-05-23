import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { addTask, updateTask, deleteTask, updateProject } from '../store/slices/projectSlice.js'
import toast from 'react-hot-toast'

const STATUS_COLS = [
  { key: 'todo', label: 'To Do', color: '#6b7280', bg: '#f9fafb' },
  { key: 'in-progress', label: 'In Progress', color: '#0891b2', bg: '#ecfeff' },
  { key: 'done', label: 'Done', color: '#059669', bg: '#f0fdf4' },
]

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const project = useSelector(s => s.projects.list.find(p => p.id === id))
  const [addingTask, setAddingTask] = useState(null)
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '' })

  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>😕</div>
        <h2 style={{ marginBottom: 8 }}>Project not found</h2>
        <button className="btn-primary" onClick={() => navigate('/projects')}>Back to Projects</button>
      </div>
    )
  }

  const tasksByStatus = (status) => (project.tasks || []).filter(t => t.status === status)

  const handleAddTask = (status) => {
    if (!taskForm.title.trim()) return toast.error('Task title required')
    dispatch(addTask({ projectId: id, task: { ...taskForm, status } }))
    toast.success('Task added!')
    setTaskForm({ title: '', description: '', priority: 'medium', dueDate: '' })
    setAddingTask(null)
  }

  const handleStatusChange = (taskId, newStatus) => {
    dispatch(updateTask({ projectId: id, taskId, updates: { status: newStatus } }))
    toast.success('Task updated')
  }

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Delete this task?')) {
      dispatch(deleteTask({ projectId: id, taskId }))
      toast.success('Task deleted')
    }
  }

  const done = (project.tasks || []).filter(t => t.status === 'done').length
  const total = (project.tasks || []).length
  const pct = total ? Math.round((done / total) * 100) : 0
  const color = project.color || '#6366f1'

  return (
    <div className="fade-in">
      {/* Back */}
      <button onClick={() => navigate('/projects')} className="btn-ghost" style={{ marginBottom: 20, padding: '7px 14px', fontSize: 13 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Back to projects
      </button>

      {/* Header */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 12, height: 12, borderRadius: 99, background: color, marginTop: 6, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700 }}>{project.name}</h1>
              <span className={`badge ${project.status === 'done' ? 'badge-green' : project.status === 'in-progress' ? 'badge-cyan' : 'badge-gray'}`}>
                {project.status === 'in-progress' ? 'Active' : project.status === 'done' ? 'Done' : 'Todo'}
              </span>
            </div>
            {project.description && <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 12 }}>{project.description}</p>}
            <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
              <span>📋 {total} task{total !== 1 ? 's' : ''}</span>
              <span>✅ {done} done</span>
              {project.dueDate && <span>📅 Due {new Date(project.dueDate).toLocaleDateString('en-IN')}</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 6, background: '#f1f0fb', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.5s' }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color }}>{pct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mark project done */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem' }}>
        <button className="btn-ghost" style={{ fontSize: 13, padding: '7px 14px' }}
          onClick={() => {
            const next = project.status === 'done' ? 'in-progress' : 'done'
            dispatch(updateProject({ id, status: next }))
            toast.success(next === 'done' ? '🎉 Project marked as done!' : 'Project reactivated')
          }}
        >
          {project.status === 'done' ? '↩ Reactivate Project' : '🏁 Mark Project Done'}
        </button>
      </div>

      {/* Kanban */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {STATUS_COLS.map(col => (
          <div key={col.key} style={{ background: col.bg, borderRadius: 14, padding: 14, border: '1px solid var(--border)' }}>
            {/* Column header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 99, background: col.color }} />
                <span style={{ fontWeight: 700, fontSize: 13, color: col.color }}>{col.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: col.color, background: `${col.color}22`, padding: '1px 7px', borderRadius: 99 }}>
                  {tasksByStatus(col.key).length}
                </span>
              </div>
              <button onClick={() => setAddingTask(col.key)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: col.color, fontSize: 18, lineHeight: 1, padding: '0 2px' }} title="Add task">+</button>
            </div>

            {/* Tasks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tasksByStatus(col.key).map(task => (
                <div key={task.id} className="card" style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{task.title}</div>
                      {task.description && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{task.description}</div>}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span className={`badge ${task.priority === 'high' ? 'badge-red' : task.priority === 'low' ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: 11 }}>
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>📅 {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        )}
                      </div>
                      {/* Move buttons */}
                      <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                        {STATUS_COLS.filter(c => c.key !== col.key).map(c => (
                          <button key={c.key} onClick={() => handleStatusChange(task.id, c.key)}
                            style={{ fontSize: 10, padding: '3px 7px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            → {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteTask(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', flexShrink: 0, padding: 2 }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={e => e.currentTarget.style.color = '#d1d5db'}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                </div>
              ))}

              {/* Add task form */}
              {addingTask === col.key ? (
                <div className="card" style={{ padding: '12px 14px' }}>
                  <input className="input-field" style={{ marginBottom: 8, fontSize: 13 }} placeholder="Task title *" value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} autoFocus />
                  <input className="input-field" style={{ marginBottom: 8, fontSize: 13 }} placeholder="Description (optional)" value={taskForm.description} onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))} />
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    <select className="input-field" value={taskForm.priority} onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))} style={{ fontSize: 13 }}>
                      <option value="low">Low priority</option>
                      <option value="medium">Medium priority</option>
                      <option value="high">High priority</option>
                    </select>
                    <input className="input-field" type="date" value={taskForm.dueDate} onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))} style={{ fontSize: 13 }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '8px 0', fontSize: 13 }} onClick={() => handleAddTask(col.key)}>Add Task</button>
                    <button className="btn-ghost" style={{ padding: '8px 12px', fontSize: 13 }} onClick={() => { setAddingTask(null); setTaskForm({ title: '', description: '', priority: 'medium', dueDate: '' }) }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAddingTask(col.key)} style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '9px 12px', background: 'transparent', border: '1.5px dashed var(--border)', borderRadius: 10, color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = col.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add task
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
