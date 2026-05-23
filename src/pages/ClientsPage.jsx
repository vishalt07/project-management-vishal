import { useState } from 'react'
import toast from 'react-hot-toast'

const initClients = () => { try { return JSON.parse(localStorage.getItem('pf_clients') || '[]') } catch { return [] } }
const initMessages = () => { try { return JSON.parse(localStorage.getItem('pf_messages') || '{}') } catch { return {} } }
const COLORS = ['#6366f1','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6']

export default function ClientsPage() {
  const [clients, setClients] = useState(initClients)
  const [messages, setMessages] = useState(initMessages)
  const [showForm, setShowForm] = useState(false)
  const [activeClient, setActiveClient] = useState(null)
  const [msgInput, setMsgInput] = useState('')
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', color: '#6366f1' })
  const [tab, setTab] = useState('contacts')

  const saveClients = (list) => { setClients(list); localStorage.setItem('pf_clients', JSON.stringify(list)) }
  const saveMessages = (msgs) => { setMessages(msgs); localStorage.setItem('pf_messages', JSON.stringify(msgs)) }

  const handleAddClient = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Client name required')
    const c = { id: Date.now().toString(), ...form, addedAt: new Date().toISOString() }
    saveClients([...clients, c])
    toast.success('Client added!')
    setForm({ name: '', company: '', email: '', phone: '', color: '#6366f1' })
    setShowForm(false)
  }

  const handleSendMsg = (clientId) => {
    if (!msgInput.trim()) return
    const msg = { id: Date.now().toString(), text: msgInput, from: 'me', time: new Date().toISOString() }
    const updated = { ...messages, [clientId]: [...(messages[clientId] || []), msg] }
    saveMessages(updated)
    setMsgInput('')
  }

  const initials = (name) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const client = clients.find(c => c.id === activeClient)
  const clientMsgs = messages[activeClient] || []

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700 }}>Clients</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 3 }}>{clients.length} client{clients.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(true); setTab('contacts') }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Client
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#f1f0fb', borderRadius: 10, padding: 4, width: 'fit-content', marginBottom: '1.5rem' }}>
        {['contacts', 'messages'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer',
            background: tab === t ? 'white' : 'transparent',
            color: tab === t ? '#4f46e5' : 'var(--text-muted)',
            boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
          }}>
            {t === 'contacts' ? '👤 Contacts' : '💬 Messages'}
          </button>
        ))}
      </div>

      {/* Contacts tab */}
      {tab === 'contacts' && (
        clients.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🤝</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No clients yet</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>Add your first client contact</p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>Add Client</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {clients.map(c => (
              <div key={c.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 99, background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                    {initials(c.name)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                    {c.company && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.company}</div>}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{c.email && `📧 ${c.email}`}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>{c.phone && `📱 ${c.phone}`}</div>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '8px 0' }}
                  onClick={() => { setActiveClient(c.id); setTab('messages') }}>
                  💬 Send Message
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {/* Messages tab */}
      {tab === 'messages' && (
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16, height: 560 }}>
          {/* Client list */}
          <div className="card" style={{ padding: 12, overflowY: 'auto' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, padding: '0 4px' }}>CONVERSATIONS</div>
            {clients.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No clients yet</div>
            ) : clients.map(c => {
              const lastMsg = (messages[c.id] || []).slice(-1)[0]
              return (
                <div key={c.id} onClick={() => setActiveClient(c.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
                  background: activeClient === c.id ? 'var(--primary-light)' : 'transparent',
                  marginBottom: 2,
                }}>
                  <div style={{ width: 34, height: 34, borderRadius: 99, background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {initials(c.name)}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: activeClient === c.id ? '#4f46e5' : 'var(--text)' }}>{c.name}</div>
                    {lastMsg && <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lastMsg.text}</div>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Chat area */}
          <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {!activeClient ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 36 }}>💬</div>
                <div style={{ fontSize: 14 }}>Select a client to start messaging</div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 99, background: client?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>
                    {client && initials(client.name)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{client?.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{client?.company}</div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {clientMsgs.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginTop: '4rem' }}>No messages yet. Say hello! 👋</div>
                  ) : clientMsgs.map(m => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{ background: '#6366f1', color: 'white', borderRadius: '14px 14px 4px 14px', padding: '9px 14px', maxWidth: '70%', fontSize: 14 }}>
                        {m.text}
                        <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, textAlign: 'right' }}>
                          {new Date(m.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                  <input className="input-field" placeholder="Type a message..." value={msgInput}
                    onChange={e => setMsgInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMsg(activeClient)}
                    style={{ flex: 1 }}
                  />
                  <button className="btn-primary" style={{ padding: '10px 16px' }} onClick={() => handleSendMsg(activeClient)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,15,35,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowForm(false)}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: 420, padding: 28, position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text-muted)' }}>×</button>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Add Client</h2>
            <form onSubmit={handleAddClient}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Name *</label>
                <input className="input-field" placeholder="Client name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Company</label>
                <input className="input-field" placeholder="Company name" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label>
                  <input className="input-field" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Phone</label>
                  <input className="input-field" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Color</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {COLORS.map(c => <button type="button" key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{ width: 26, height: 26, borderRadius: 99, background: c, border: 'none', cursor: 'pointer', outline: form.color === c ? `3px solid ${c}` : 'none', outlineOffset: 2 }} />)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '11px 0' }}>Add Client</button>
                <button type="button" className="btn-ghost" onClick={() => setShowForm(false)} style={{ padding: '11px 18px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
