import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteProject } from '../store/slices/projectSlice.js'
import NewProjectModal from '../components/ui/NewProjectModal.jsx'
import toast from 'react-hot-toast'

const PRIORITY_BADGE = { high: 'badge-red', medium: 'badge-amber', low: 'badge-green' }

export default function ProjectsPage() {
  const projects = useSelector(s => s.projects.list)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (window.confirm('Delete this project? This cannot be undone.')) {
      dispatch(deleteProject(id))
      toast.success('Project deleted')
    }
  }

  return (
    <div className="fade-in">
      {showModal && <NewProjectModal onClose={() => setShowModal(false)} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700 }}>Projects</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 3 }}>{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Project
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input className="input-field" style={{ paddingLeft: 36 }} placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'in-progress', 'done', 'todo'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 14px',
              borderRadius: 9,
              border: '1px solid',
              borderColor: filter === f ? 'var(--primary)' : 'var(--border)',
              background: filter === f ? 'var(--primary-light)' : 'var(--surface)',
              color: filter === f ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}>
              {f === 'all' ? 'All' : f === 'in-progress' ? 'Active' : f === 'done' ? 'Done' : 'Todo'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>{search ? '🔍' : '📂'}</div>
          <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{search ? 'No projects found' : 'No projects yet'}</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 22 }}>
            {search ? 'Try a different search term' : 'Create your first project to get started!'}
          </p>
          {!search && (
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(p => {
            const done = p.tasks?.filter(t => t.status === 'done').length || 0
            const total = p.tasks?.length || 0
            const pct = total ? Math.round((done / total) * 100) : 0
            const color = p.color || '#6366f1'

            return (
              <div key={p.id} className="card" onClick={() => navigate(`/projects/${p.id}`)}
                style={{ cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.15s', position: 'relative' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
              >
                {/* Top accent */}
                <div style={{ height: 4, background: color, borderRadius: '12px 12px 0 0', position: 'absolute', top: 0, left: 0, right: 0 }} />

                <div style={{ paddingTop: 8 }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</h3>
                      {p.description && (
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</p>
                      )}
                    </div>
                    <button onClick={e => handleDelete(e, p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', padding: '2px 4px', borderRadius: 6, flexShrink: 0, marginLeft: 8 }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={e => e.currentTarget.style.color = '#d1d5db'}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  </div>

                  {/* Badges */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                    <span className={`badge ${PRIORITY_BADGE[p.priority] || 'badge-gray'}`}>{p.priority || 'medium'}</span>
                    <span className={`badge ${p.status === 'done' ? 'badge-green' : p.status === 'in-progress' ? 'badge-cyan' : 'badge-gray'}`}>
                      {p.status === 'in-progress' ? 'Active' : p.status === 'done' ? 'Done' : 'Todo'}
                    </span>
                    {p.dueDate && (
                      <span className="badge badge-purple">Due {new Date(p.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    )}
                  </div>

                  {/* Progress */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                      <span>Progress</span>
                      <span>{done}/{total} tasks</span>
                    </div>
                    <div style={{ height: 6, background: '#f1f0fb', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
