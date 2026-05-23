import { useState } from 'react'
import toast from 'react-hot-toast'

const ROLES = ['Admin', 'Manager', 'Developer', 'Designer', 'Tester']
const COLORS = ['#6366f1','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899']

const initMembers = () => {
  try { return JSON.parse(localStorage.getItem('pf_team') || '[]') } catch { return [] }
}

export default function TeamPage() {
  const [members, setMembers] = useState(initMembers)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'Developer', color: '#6366f1' })

  const save = (list) => { setMembers(list); localStorage.setItem('pf_team', JSON.stringify(list)) }
  const change = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return toast.error('Name and email required')
    const m = { id: Date.now().toString(), ...form, joinedAt: new Date().toISOString(), status: 'active' }
    save([...members, m])
    toast.success(`${form.name} added to team!`)
    setForm({ name: '', email: '', role: 'Developer', color: '#6366f1' })
    setShowForm(false)
  }

  const handleRemove = (id) => {
    if (!window.confirm('Remove this member?')) return
    save(members.filter(m => m.id !== id))
    toast.success('Member removed')
  }

  const initials = (name) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700 }}>Team</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 3 }}>{members.length} member{members.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Member
        </button>
      </div>

      {/* Role summary */}
      {members.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {ROLES.filter(r => members.some(m => m.role === r)).map(r => (
            <div key={r} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px', fontSize: 13 }}>
              <span style={{ fontWeight: 600 }}>{members.filter(m => m.role === r).length}</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: 5 }}>{r}{members.filter(m => m.role === r).length > 1 ? 's' : ''}</span>
            </div>
          ))}
        </div>
      )}

      {/* Members grid */}
      {members.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No team members yet</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>Add your first team member to get started</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>Add Member</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {members.map(m => (
            <div key={m.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 99, background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                {initials(m.name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</div>
                <span className="badge badge-purple" style={{ fontSize: 11 }}>{m.role}</span>
              </div>
              <button onClick={() => handleRemove(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', padding: 4, flexShrink: 0 }}
                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.color = '#d1d5db'}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Member Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,15,35,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowForm(false)}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: 420, padding: 28, position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text-muted)' }}>×</button>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Add Team Member</h2>
            <form onSubmit={handleAdd}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Full Name *</label>
                <input className="input-field" placeholder="Rahul Sharma" value={form.name} onChange={e => change('name', e.target.value)} autoFocus />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Email *</label>
                <input className="input-field" type="email" placeholder="rahul@company.com" value={form.email} onChange={e => change('email', e.target.value)} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Role</label>
                <select className="input-field" value={form.role} onChange={e => change('role', e.target.value)}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#374151' }}>Avatar Color</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {COLORS.map(c => (
                    <button type="button" key={c} onClick={() => change('color', c)} style={{ width: 26, height: 26, borderRadius: 99, background: c, border: 'none', cursor: 'pointer', outline: form.color === c ? `3px solid ${c}` : 'none', outlineOffset: 2 }} />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '11px 0' }}>Add Member</button>
                <button type="button" className="btn-ghost" onClick={() => setShowForm(false)} style={{ padding: '11px 18px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
