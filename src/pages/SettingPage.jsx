import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../store/slices/authSlice.js'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const user = useSelector(s => s.auth.user)
  const dispatch = useDispatch()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [tab, setTab] = useState('profile')

  const handleSave = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return toast.error('Name and email required')
    dispatch(login({ ...user, name: form.name, email: form.email }))
    toast.success('Profile saved!')
  }

  const initials = form.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700 }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 3 }}>Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#f1f0fb', borderRadius: 10, padding: 4, width: 'fit-content', marginBottom: '1.5rem' }}>
        {['profile', 'appearance', 'about'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer',
            background: tab === t ? 'white' : 'transparent',
            color: tab === t ? '#4f46e5' : 'var(--text-muted)',
            boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            textTransform: 'capitalize',
          }}>{t}</button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="card" style={{ maxWidth: 480 }}>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: 99, background: 'linear-gradient(135deg,#6366f1,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 22, fontWeight: 700 }}>
              {initials}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{form.name || 'Your Name'}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{form.email}</div>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Full Name</label>
              <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Email Address</label>
              <input className="input-field" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '10px 28px' }}>Save Changes</button>
          </form>
        </div>
      )}

      {tab === 'appearance' && (
        <div className="card" style={{ maxWidth: 480 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Theme</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>App currently uses a clean light theme. Dark mode coming soon!</p>
          <div style={{ display: 'flex', gap: 12 }}>
            {['Light', 'Dark (soon)'].map((t, i) => (
              <div key={t} style={{ border: `2px solid ${i === 0 ? '#6366f1' : 'var(--border)'}`, borderRadius: 12, padding: '12px 20px', cursor: i === 0 ? 'pointer' : 'default', opacity: i === 1 ? 0.5 : 1 }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{i === 0 ? '☀️' : '🌙'}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'about' && (
        <div className="card" style={{ maxWidth: 480 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 11, background: 'linear-gradient(135deg,#6366f1,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>ProjectFlow</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Version 1.0.0</div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 16 }}>
            An open-source project management platform built with React, Redux Toolkit, and Tailwind CSS.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            {[['⚛️ Framework', 'React 19'], ['🎨 Styling', 'Tailwind CSS 4'], ['🗃️ State', 'Redux Toolkit'], ['🚦 Routing', 'React Router v7']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
