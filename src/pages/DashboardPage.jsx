import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import NewProjectModal from '../components/ui/NewProjectModal.jsx'

export default function DashboardPage() {
  const user = useSelector(s => s.auth.user)
  const projects = useSelector(s => s.projects.list)
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  const totalTasks = projects.reduce((a, p) => a + (p.tasks?.length || 0), 0)
  const doneTasks = projects.reduce((a, p) => a + (p.tasks?.filter(t => t.status === 'done').length || 0), 0)
  const inProgress = projects.filter(p => p.status === 'in-progress').length

  const getColor = (c) => c || '#6366f1'

  const recentProjects = [...projects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="fade-in">
      {showModal && <NewProjectModal onClose={() => setShowModal(false)} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
            {greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Here's what's happening with your projects today.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Project
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: '2rem' }}>
        {[
          { label: 'Total Projects', value: projects.length, icon: '📁', color: '#ede9fe', text: '#7c3aed' },
          { label: 'Total Tasks', value: totalTasks, icon: '✅', color: '#d1fae5', text: '#059669' },
          { label: 'In Progress', value: inProgress, icon: '🔄', color: '#cffafe', text: '#0891b2' },
        ].map(s => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 1 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Task progress bar */}
      {totalTasks > 0 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Overall Task Progress</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{doneTasks}/{totalTasks} completed</span>
          </div>
          <div style={{ height: 8, background: '#f1f0fb', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0}%`, background: 'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius: 99, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
            {totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0}% complete
          </div>
        </div>
      )}

      {/* Recent projects or empty */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Recent Projects</h2>
          {projects.length > 0 && (
            <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => navigate('/projects')}>
              View all
            </button>
          )}
        </div>

        {recentProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>No projects yet</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>Create your first project to get started</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Create Project
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentProjects.map(p => {
              const done = p.tasks?.filter(t => t.status === 'done').length || 0
              const total = p.tasks?.length || 0
              const pct = total ? Math.round((done / total) * 100) : 0
              return (
                <div key={p.id} onClick={() => navigate(`/projects/${p.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8f7ff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 10, height: 10, borderRadius: 99, background: getColor(p.color), flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>{p.name}</div>
                    <div style={{ height: 4, background: '#f1f0fb', borderRadius: 99, overflow: 'hidden', width: '100%', maxWidth: 200 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: getColor(p.color), borderRadius: 99 }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>{done}/{total} tasks</div>
                  <div>
                    <span className={`badge badge-${p.status === 'done' ? 'green' : p.status === 'in-progress' ? 'cyan' : 'gray'}`}>
                      {p.status === 'in-progress' ? 'Active' : p.status === 'done' ? 'Done' : 'Todo'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
