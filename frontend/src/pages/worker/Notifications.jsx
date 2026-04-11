import { useState, useEffect } from 'react'
import api from '../../api/axios'

const ICONS = {
  new_application:     '👷',
  application_accepted:'✅',
  application_declined:'📋',
  new_message:         '💬',
  job_done:            '🏁',
  new_review:          '⭐',
  id_verification:     '🪪',
  user_reported:       '🚨',
}

export default function WorkerNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading,       setLoading]       = useState(true)
  const [filter,        setFilter]        = useState('all')

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  useEffect(() => {
    api.get('/worker/notifications')
      .then(res => setNotifications(res.data.data ?? res.data))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false))
  }, [])

  const markRead = async (id) => {
    await api.patch(`/worker/notifications/${id}/read`).catch(() => {})
    setNotifications(p => p.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
  }

  const markAllRead = async () => {
    await api.patch('/worker/notifications/read-all').catch(() => {})
    setNotifications(p => p.map(n => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })))
  }

  const deleteOne = (id) => setNotifications(p => p.filter(n => n.id !== id))

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read_at
    if (filter === 'read')   return !!n.read_at
    return true
  })

  const unreadCount = notifications.filter(n => !n.read_at).length

  const cardWrap = { background:'#fff', borderRadius:'14px', border:'1px solid #e2e8e2', overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,.08)' }
  const chip = (a) => ({ padding:'6px 14px', borderRadius:'20px', border:`1.5px solid ${a?'#16a34a':'#e2e8e2'}`, fontSize:'12px', fontWeight:a?600:500, color:a?'#16a34a':'#6b7280', cursor:'pointer', background:a?'rgba(22,163,74,.08)':'transparent', whiteSpace:'nowrap' })

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-PH', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })

  if (loading) return <div style={{ padding:'28px', color:'#6b7280' }}>Loading notifications...</div>

  return (
    <div style={{ padding: isMobile ? '16px' : '28px', maxWidth:'720px' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'10px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ fontSize:'18px', fontWeight:800 }}>🔔 Notifications</div>
          {unreadCount > 0 && (
            <span style={{ background:'#16a34a', color:'#fff', borderRadius:'20px', padding:'2px 10px', fontSize:'12px', fontWeight:700 }}>
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ background:'transparent', border:'1.5px solid #e2e8e2', borderRadius:'9px', padding:'6px 14px', fontSize:'12px', fontWeight:600, color:'#6b7280', cursor:'pointer', flexShrink:0 }}>
            ✓ Mark all read
          </button>
        )}
      </div>

      {/* Filter chips - scrollable */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'20px', overflowX:'auto', paddingBottom:'4px' }}>
        {['all','unread','read'].map(f => (
          <div key={f} style={chip(filter===f)} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
            {f === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ ...cardWrap, textAlign:'center', padding:'48px 20px', color:'#6b7280' }}>
          <div style={{ fontSize:'36px', marginBottom:'10px' }}>🔔</div>
          <div style={{ fontWeight:600, marginBottom:'4px' }}>No {filter === 'all' ? '' : filter} notifications</div>
          <div style={{ fontSize:'13px' }}>You're all caught up!</div>
        </div>
      ) : (
        <div style={cardWrap}>
          {filtered.map((n, i) => {
            const data = n.data ?? {}
            const isUnread = !n.read_at
            return (
              <div key={n.id}
                style={{ display:'flex', gap:'12px', padding: isMobile ? '14px' : '16px', borderBottom: i < filtered.length-1 ? '1px solid #f3f4f6' : 'none', cursor:'pointer', background:isUnread?'rgba(22,163,74,.03)':'transparent' }}
                onClick={() => isUnread && markRead(n.id)}>
                <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:isUnread?'rgba(22,163,74,.12)':'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', flexShrink:0 }}>
                  {data.icon ?? ICONS[data.type] ?? '🔔'}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'8px', flexWrap:'wrap' }}>
                    <div style={{ fontWeight: isUnread ? 700 : 600, fontSize:'14px', color:'#111827' }}>{data.title ?? 'Notification'}</div>
                    <div style={{ fontSize:'11px', color:'#9ca3af', whiteSpace:'nowrap', flexShrink:0 }}>{fmtDate(n.created_at)}</div>
                  </div>
                  <div style={{ fontSize:'13px', color:'#6b7280', marginTop:'3px', lineHeight:1.5 }}>{data.message}</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', flexShrink:0 }}>
                  {isUnread && <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#16a34a' }} />}
                  <button onClick={e => { e.stopPropagation(); deleteOne(n.id) }}
                    style={{ background:'none', border:'none', color:'#d1d5db', cursor:'pointer', fontSize:'14px', padding:'0', lineHeight:1 }}
                    title="Dismiss">✕</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}