import { useState } from 'react'
import { useSelector } from 'react-redux'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function CalendarPage() {
  const projects = useSelector(s => s.projects.list)
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Collect all events (project due dates + task due dates)
  const events = []
  projects.forEach(p => {
    if (p.dueDate) events.push({ date: p.dueDate, label: p.name, type: 'project', color: p.color || '#6366f1' })
    ;(p.tasks || []).forEach(t => {
      if (t.dueDate) events.push({ date: t.dueDate, label: t.title, type: 'task', color: p.color || '#06b6d4' })
    })
  })

  const getEvents = (d) => {
    const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    return events.filter(e => e.date === dateStr)
  }

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y-1) } else setMonth(m => m-1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y+1) } else setMonth(m => m+1) }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  // Upcoming events sorted
  const upcoming = [...events]
    .filter(e => new Date(e.date) >= new Date(now.toDateString()))
    .sort((a,b) => new Date(a.date) - new Date(b.date))
    .slice(0, 8)

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700 }}>Calendar</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 3 }}>Project & task deadlines at a glance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Calendar */}
        <div className="card">
          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <button onClick={prevMonth} className="btn-ghost" style={{ padding: '6px 12px' }}>‹</button>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="btn-ghost" style={{ padding: '6px 12px' }}>›</button>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', padding: '4px 0' }}>{d}</div>
            ))}
          </div>

          {/* Dates grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {cells.map((d, i) => {
              if (!d) return <div key={`e-${i}`} />
              const dayEvents = getEvents(d)
              const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear()
              return (
                <div key={d} style={{
                  minHeight: 72, padding: 6, borderRadius: 8,
                  background: isToday ? '#ede9fe' : 'transparent',
                  border: isToday ? '1.5px solid #6366f1' : '1px solid transparent',
                }}>
                  <div style={{ fontSize: 13, fontWeight: isToday ? 700 : 400, color: isToday ? '#6366f1' : 'var(--text)', marginBottom: 4 }}>{d}</div>
                  {dayEvents.slice(0, 2).map((ev, ei) => (
                    <div key={ei} style={{ background: ev.color, color: 'white', borderRadius: 4, padding: '2px 5px', fontSize: 10, fontWeight: 500, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ev.label}
                    </div>
                  ))}
                  {dayEvents.length > 2 && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{dayEvents.length - 2} more</div>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming sidebar */}
        <div>
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Upcoming Deadlines</h3>
            {upcoming.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: 13 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
                No upcoming deadlines
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {upcoming.map((ev, i) => {
                  const d = new Date(ev.date)
                  const diff = Math.ceil((d - new Date()) / 86400000)
                  return (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px', borderRadius: 10, background: 'var(--surface2)' }}>
                      <div style={{ width: 4, height: '100%', minHeight: 36, borderRadius: 99, background: ev.color, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{ev.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          {' · '}
                          <span style={{ color: diff <= 2 ? '#ef4444' : diff <= 7 ? '#f59e0b' : '#10b981', fontWeight: 600 }}>
                            {diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `${diff} days left`}
                          </span>
                        </div>
                        <span style={{ fontSize: 10, color: ev.type === 'project' ? '#7c3aed' : '#0891b2', fontWeight: 600 }}>
                          {ev.type === 'project' ? '📁 Project' : '✅ Task'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
