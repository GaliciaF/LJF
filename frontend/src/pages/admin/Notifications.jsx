import { useState, useEffect } from 'react'
import api from '../../api/axios'

const ICONS = {
  new_application: '👷', application_accepted: '✅',
  application_declined: '📋', new_message: '💬',
  job_done: '🏁', new_review: '⭐',
  id_verification: '🪪', user_reported: '🚨',
}

const isReport = (n) => n.data?.type === 'user_reported'

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading,       setLoading]       = useState(true)
  const [filter,        setFilter]        = useState('all')

  useEffect(() => {
    api.get('/admin/notifications')
      .then(res => setNotifications(res.data.data ?? res.data))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false))
  }, [])

  const markRead    = async (id) => { await api.patch(`/admin/notifications/${id}/read`).catch(() => {}); setNotifications(p => p.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)) }
  const markAllRead = async ()   => { await api.patch('/admin/notifications/read-all').catch(() => {}); setNotifications(p => p.map(n => ({ ...n, read_at: n.read_at ?? new Date().toISOString() }))) }
  const deleteOne   = (id)       => setNotifications(p => p.filter(n => n.id !== id))

  const filtered    = notifications.filter(n =>
    filter === 'unread'  ? !n.read_at :
    filter === 'read'    ? !!n.read_at :
    filter === 'reports' ? isReport(n) :
    true
  )
  const unreadCount      = notifications.filter(n => !n.read_at).length
  const reportUnread     = notifications.filter(n => !n.read_at && isReport(n)).length
  const totalReports     = notifications.filter(n => isReport(n)).length
  const fmtDate          = (d) => new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  /* ── styles ── */
  const card      = { background: '#161525', borderRadius: '14px', border: '1px solid #2a2940', overflow: 'hidden' }
  const chip      = (active, isRep) => ({
    padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: active ? 600 : 500,
    cursor: 'pointer', transition: 'all .15s',
    border:      active ? (isRep ? '1.5px solid #ef4444' : '1.5px solid #7c3aed') : '1.5px solid #2a2940',
    color:       active ? (isRep ? '#fca5a5' : '#a78bfa') : '#8b8aad',
    background:  active ? (isRep ? 'rgba(239,68,68,.12)' : 'rgba(124,58,237,.12)') : 'transparent',
  })
  const rowBg = (unread, report) =>
    report && unread ? 'rgba(239,68,68,.05)' :
    unread           ? 'rgba(124,58,237,.05)' :
    'transparent'
  const rowHoverBg = (report) => report ? 'rgba(239,68,68,.09)' : 'rgba(124,58,237,.08)'
  const iconBg  = (unread, report) =>
    report  ? 'rgba(239,68,68,.15)' :
    unread  ? 'rgba(124,58,237,.20)' :
    '#1e1d30'
  const dotColor = (report) => report ? '#ef4444' : '#7c3aed'

  if (loading) return <div style={{ padding: '28px', color: '#8b8aad' }}>Loading notifications...</div>

  return (
    <div style={{ padding: '28px', maxWidth: '720px' }}>

      {/* ── header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#f0eeff' }}>🔔 Notifications</div>
          {unreadCount > 0 && (
            <span style={{ background: '#7c3aed', color: '#fff', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: 700 }}>
              {unreadCount} new
            </span>
          )}
          {reportUnread > 0 && (
            <span style={{ background: 'rgba(239,68,68,.15)', color: '#fca5a5', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: 700, border: '1px solid rgba(239,68,68,.3)' }}>
              🚨 {reportUnread} report{reportUnread > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ background: 'transparent', border: '1.5px solid #2a2940', borderRadius: '9px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, color: '#8b8aad', cursor: 'pointer' }}>
            ✓ Mark all as read
          </button>
        )}
      </div>

      {/* ── filter chips ── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { key: 'all',     label: 'All' },
          { key: 'unread',  label: unreadCount > 0  ? `Unread (${unreadCount})`  : 'Unread' },
          { key: 'reports', label: totalReports > 0 ? `Reports (${totalReports})` : 'Reports', isRep: true },
          { key: 'read',    label: 'Read' },
        ].map(({ key, label, isRep }) => (
          <div key={key} style={chip(filter === key, isRep)} onClick={() => setFilter(key)}>
            {label}
          </div>
        ))}
      </div>

      {/* ── list ── */}
      {filtered.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', padding: '48px', color: '#5a5978' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔔</div>
          <div style={{ fontWeight: 600, color: '#8b8aad' }}>No {filter === 'all' ? '' : filter} notifications</div>
        </div>
      ) : (
        <div style={card}>
          {filtered.map((n, i) => {
            const data    = n.data ?? {}
            const unread  = !n.read_at
            const report  = isReport(n)

            return (
              <div
                key={n.id}
                style={{
                  display: 'flex', gap: '12px', padding: '16px',
                  borderBottom: i < filtered.length - 1 ? '1px solid #1e1d30' : 'none',
                  cursor: 'pointer', background: rowBg(unread, report), transition: 'background .15s',
                }}
                onClick={() => unread && markRead(n.id)}
                onMouseEnter={e => e.currentTarget.style.background = rowHoverBg(report)}
                onMouseLeave={e => e.currentTarget.style.background = rowBg(unread, report)}
              >
                {/* icon */}
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: iconBg(unread, report), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  {data.icon ?? ICONS[data.type] ?? '🔔'}
                </div>

                {/* body */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: unread ? 700 : 600, fontSize: '14px', color: '#f0eeff' }}>
                        {data.title ?? 'Notification'}
                      </span>
                      {report && unread && (
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#fca5a5', background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.25)', borderRadius: '4px', padding: '1px 6px', letterSpacing: '.3px' }}>
                          NEEDS REVIEW
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: '#5a5978', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {fmtDate(n.created_at)}
                    </div>
                  </div>

                  <div style={{ fontSize: '13px', color: '#8b8aad', marginTop: '3px', lineHeight: 1.5 }}>
                    {data.message}
                  </div>

                  {/* report actions */}
                  {report && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button
                        onClick={e => { e.stopPropagation(); /* navigate to report review */ }}
                        style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', border: '1px solid rgba(239,68,68,.4)', color: '#fca5a5', background: 'rgba(239,68,68,.1)', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Review →
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); deleteOne(n.id) }}
                        style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', border: '1px solid #2a2940', color: '#8b8aad', background: 'transparent', cursor: 'pointer' }}
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>

                {/* right indicators */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {unread && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: dotColor(report) }} />}
                  {!report && (
                    <button
                      onClick={e => { e.stopPropagation(); deleteOne(n.id) }}
                      style={{ background: 'none', border: 'none', color: '#3a3958', cursor: 'pointer', fontSize: '14px', padding: '0' }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}