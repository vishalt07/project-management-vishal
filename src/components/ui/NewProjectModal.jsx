import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addProject } from '../../store/slices/projectSlice.js'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#f97316']

export default function NewProjectModal({ onClose }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', description: '', color: '#6366f1', priority: 'medium', dueDate: '' })

  const change = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Project name is required')
    const action = dispatch(addProject(form))
    toast.success('Project created! 🚀')
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,15,35,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 480, padding: '28px', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 20 }}>×</button>

        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>New Project</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 22 }}>Fill in the details to create a new project</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Project Name *</label>
            <input className="input-field" placeholder="e.g. Website Redesign" value={form.name} onChange={e => change('name', e.target.value)} autoFocus />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Description</label>
            <textarea className="input-field" placeholder="Brief description of the project..." value={form.description} onChange={e => change('description', e.target.value)} rows={3} style={{ resize: 'vertical', paddingTop: 10 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Priority</label>
              <select className="input-field" value={form.priority} onChange={e => change('priority', e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Due Date</label>
              <input className="input-field" type="date" value={form.dueDate} onChange={e => change('dueDate', e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#374151' }}>Project Color</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {COLORS.map(c => (
                <button type="button" key={c} onClick={() => change('color', c)} style={{
                  width: 28, height: 28, borderRadius: 99, background: c, border: form.color === c ? `3px solid ${c}` : '3px solid transparent',
                  outline: form.color === c ? '2px solid white' : 'none',
                  boxShadow: form.color === c ? `0 0 0 2px ${c}` : 'none',
                  cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                }} />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '11px 0' }}>
              Create Project
            </button>
            <button type="button" className="btn-ghost" onClick={onClose} style={{ padding: '11px 20px' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
