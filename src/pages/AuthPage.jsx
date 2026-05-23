import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login, signup } from '../store/slices/authSlice.js'
import toast from 'react-hot-toast'

const COLORS = {
  left: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
}

export default function AuthPage() {
  const dispatch = useDispatch()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleLogin = (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Please fill all fields')
    setLoading(true)
    setTimeout(() => {
      dispatch(login({ name: form.email.split('@')[0], email: form.email }))
      toast.success('Welcome back!')
      setLoading(false)
    }, 700)
  }

  const handleSignup = (e) => {
    e.preventDefault()
    if (!form.firstName || !form.email || !form.password) return toast.error('Please fill all fields')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    setTimeout(() => {
      dispatch(signup({ name: `${form.firstName} ${form.lastName}`.trim(), email: form.email }))
      toast.success('Account created! Welcome 🎉')
      setLoading(false)
    }, 800)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Left panel */}
      <div style={{
        width: '45%',
        background: COLORS.left,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '3.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ProjectFlow</span>
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.3, marginBottom: '1rem' }}>
            Plan smarter.<br />Ship faster.
          </h1>
          <p style={{ fontSize: 15, opacity: 0.85, lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Organize your projects, manage tasks, collaborate with your team — all in one clean workspace.
          </p>

          {/* Feature pills */}
          {['✓  Kanban task boards', '✓  Project analytics', '✓  Team collaboration', '✓  100% free & open source'].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 14, opacity: 0.9 }}>
              <span>{f}</span>
            </div>
          ))}

          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[['12k+', 'Users'], ['500+', 'Teams'], ['98%', 'Satisfaction'], ['Free', 'Forever']].map(([num, label]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '14px 16px', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{num}</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7ff', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: 420 }} className="fade-in">
          {/* Tabs */}
          <div style={{ display: 'flex', background: '#f1f0fb', borderRadius: 12, padding: 4, marginBottom: '2rem', gap: 4 }}>
            {['login', 'signup'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1,
                padding: '9px 0',
                border: 'none',
                borderRadius: 9,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: tab === t ? 'white' : 'transparent',
                color: tab === t ? '#4f46e5' : '#6b7280',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}>
                {t === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 6 }}>Welcome back</h2>
              <p style={{ fontSize: 14, color: '#6b7280', marginBottom: '1.75rem' }}>Enter your credentials to continue</p>
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email address</label>
                  <input className="input-field" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={change} />
                </div>
                <div style={{ marginBottom: 6 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input className="input-field" type={showPass ? 'text' : 'password'} name="password" placeholder="••••••••" value={form.password} onChange={change} />
                    <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 13 }}>
                      {showPass ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right', marginBottom: 20 }}>
                  <span style={{ fontSize: 13, color: '#6366f1', cursor: 'pointer', fontWeight: 500 }}>Forgot password?</span>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 15 }} disabled={loading}>
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </form>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0', color: '#9ca3af', fontSize: 12 }}>
                <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                or continue with
                <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              </div>
              <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', padding: '11px 0' }}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>
              <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 20 }}>
                Don't have an account? <span style={{ color: '#6366f1', fontWeight: 600, cursor: 'pointer' }} onClick={() => setTab('signup')}>Sign up free</span>
              </p>
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 6 }}>Create account</h2>
              <p style={{ fontSize: 14, color: '#6b7280', marginBottom: '1.75rem' }}>Start managing projects in minutes</p>
              <form onSubmit={handleSignup}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>First name</label>
                    <input className="input-field" type="text" name="firstName" placeholder="Rahul" value={form.firstName} onChange={change} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Last name</label>
                    <input className="input-field" type="text" name="lastName" placeholder="Sharma" value={form.lastName} onChange={change} />
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email address</label>
                  <input className="input-field" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={change} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password</label>
                  <input className="input-field" type={showPass ? 'text' : 'password'} name="password" placeholder="Min. 6 characters" value={form.password} onChange={change} />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 15 }} disabled={loading}>
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>
              <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 20 }}>
                Already have an account? <span style={{ color: '#6366f1', fontWeight: 600, cursor: 'pointer' }} onClick={() => setTab('login')}>Log in</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
