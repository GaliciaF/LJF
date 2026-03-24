import { useState, useEffect } from 'react'
import api from '../../api/axios'

const ICONS = {
  new_application: '👷', application_accepted: '✅',
  application_declined: '📋', new_message: '💬',
  job_done: '🏁', new_review: '⭐',
  id_verification: '🪪', user_reported: '🚨',
}

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

  const markRead    = async (id) => { await api.patch(`/admin/notifications/${id}/read`).catch(()=>{}); setNotifications(p => p.map(n => n.id===id ? {...n,read_at:new Date().toISOString()} : n)) }
  const markAllRead = async ()   => { await api.patch('/admin/notifications/read-all').catch(()=>{}); setNotifications(p => p.map(n => ({...n,read_at:n.read_at??new Date().toISOString()}))) }
  const deleteOne   = (id)       => setNotifications(p => p.filter(n => n.id !== id))

  const filtered    = notifications.filter(n => filter==='unread'?!n.read_at : filter==='read'?!!n.read_at : true)
  const unreadCount = notifications.filter(n => !n.read_at).length
  const fmtDate     = (d) => new Date(d).toLocaleDateString('en-PH', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })

  const card = { background:'#161525', borderRadius:'14px', border:'1px solid #2a2940', overflow:'hidden' }
  const chip = (a) => ({ padding:'6px 14px', borderRadius:'20px', border:`1.5px solid ${a?'#7c3aed':'#2a2940'}`, fontSize:'12px', fontWeight:a?600:500, color:a?'#a78bfa':'#8b8aad', cursor:'pointer', background:a?'rgba(124,58,237,.12)':'transparent' })

  if (loading) return <div style={{ padding:'28px', color:'#8b8aad' }}>Loading notifications...</div>

  return (
    <div style={{ padding:'28px', maxWidth:'720px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'10px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ fontSize:'20px', fontWeight:800, color:'#f0eeff' }}>🔔 Notifications</div>
          {unreadCount > 0 && <span style={{ background:'#7c3aed', color:'#fff', borderRadius:'20px', padding:'2px 10px', fontSize:'12px', fontWeight:700 }}>{unreadCount} new</span>}
        </div>
        {unreadCount > 0 && <button onClick={markAllRead} style={{ background:'transparent', border:'1.5px solid #2a2940', borderRadius:'9px', padding:'6px 14px', fontSize:'12px', fontWeight:600, color:'#8b8aad', cursor:'pointer' }}>✓ Mark all as read</button>}
      </div>

      <div style={{ display:'flex', gap:'8px', marginBottom:'20px' }}>
        {['all','unread','read'].map(f => (
          <div key={f} style={chip(filter===f)} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase()+f.slice(1)}{f==='unread'&&unreadCount>0?` (${unreadCount})`:''}
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ ...card, textAlign:'center', padding:'48px', color:'#5a5978' }}>
          <div style={{ fontSize:'36px', marginBottom:'10px' }}>🔔</div>
          <div style={{ fontWeight:600, color:'#8b8aad' }}>No {filter==='all'?'':filter} notifications</div>
        </div>
      ) : (
        <div style={card}>
          {filtered.map((n, i) => {
            const data = n.data ?? {}
            const isUnread = !n.read_at
            return (
              <div key={n.id}
                style={{ display:'flex', gap:'12px', padding:'16px', borderBottom: i<filtered.length-1?'1px solid #1e1d30':'none', cursor:'pointer', background:isUnread?'rgba(124,58,237,.05)':'transparent', transition:'background .15s' }}
                onClick={() => isUnread && markRead(n.id)}
                onMouseEnter={e => e.currentTarget.style.background='rgba(124,58,237,.08)'}
                onMouseLeave={e => e.currentTarget.style.background=isUnread?'rgba(124,58,237,.05)':'transparent'}>

                <div style={{ width:'42px', height:'42px', borderRadius:'50%', background:isUnread?'rgba(124,58,237,.2)':'#1e1d30', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>
                  {data.icon ?? ICONS[data.type] ?? '🔔'}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', gap:'8px' }}>
                    <div style={{ fontWeight:isUnread?700:600, fontSize:'14px', color:'#f0eeff' }}>{data.title ?? 'Notification'}</div>
                    <div style={{ fontSize:'11px', color:'#5a5978', whiteSpace:'nowrap', flexShrink:0 }}>{fmtDate(n.created_at)}</div>
                  </div>
                  <div style={{ fontSize:'13px', color:'#8b8aad', marginTop:'3px', lineHeight:1.5 }}>{data.message}</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', flexShrink:0 }}>
                  {isUnread && <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#7c3aed' }} />}
                  <button onClick={e => { e.stopPropagation(); deleteOne(n.id) }} style={{ background:'none', border:'none', color:'#3a3958', cursor:'pointer', fontSize:'14px', padding:'0' }}>✕</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}