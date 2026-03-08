import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function Notifications() {
  const [notifs,  setNotifs]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/worker/notifications').then(r=>setNotifs(r.data?.data??r.data??[])).catch(()=>setNotifs([])).finally(()=>setLoading(false))
  }, [])

  const markRead    = async (id) => { try { await api.patch(`/worker/notifications/${id}/read`); setNotifs(prev=>prev.map(n=>n.id===id?{...n,read_at:new Date().toISOString()}:n)) } catch {} }
  const markAllRead = async ()   => { try { await api.patch('/worker/notifications/read-all');   setNotifs(prev=>prev.map(n=>({...n,read_at:n.read_at??new Date().toISOString()}))) } catch {} }

  const unread = notifs.filter(n=>!n.read_at).length
  if (loading) return <div style={{ padding:'28px',color:'#6b7280' }}>Loading notifications...</div>

  return (
    <div style={{ padding:'28px',maxWidth:'760px' }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px' }}>
        <div>
          <div style={{ fontSize:'17px',fontWeight:800,fontFamily:'Syne,sans-serif' }}>🔔 Notifications</div>
          {unread > 0 && <div style={{ fontSize:'13px',color:'#6b7280' }}>{unread} unread</div>}
        </div>
        {unread > 0 && <button onClick={markAllRead} style={{ background:'transparent',border:'1px solid rgba(22,163,74,.3)',color:'#16a34a',padding:'6px 12px',borderRadius:'8px',fontSize:'12px',fontWeight:600,cursor:'pointer' }}>Mark all as read</button>}
      </div>

      {notifs.length === 0 ? (
        <div style={{ textAlign:'center',color:'#6b7280',padding:'60px',background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2' }}>
          <div style={{ fontSize:'36px',marginBottom:'12px' }}>🔔</div>
          No notifications yet. Job alerts and updates will appear here.
        </div>
      ) : notifs.map(n => {
        const data  = n.data ?? {}
        const icons = { job_alert:'📢', application_update:'📋', message:'💬', review:'⭐' }
        const icon  = icons[n.type?.split('\\').pop()] ?? '🔔'
        const isRead = !!n.read_at
        return (
          <div key={n.id} style={{ display:'flex',gap:'14px',alignItems:'flex-start',padding:'16px',background:isRead?'#fff':'rgba(22,163,74,.04)',border:`1px solid ${isRead?'#e2e8e2':'rgba(22,163,74,.2)'}`,borderRadius:'12px',marginBottom:'10px' }}>
            <div style={{ fontSize:'24px',flexShrink:0 }}>{icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600,fontSize:'14px' }}>{data.title??n.type}</div>
              <div style={{ fontSize:'13px',color:'#6b7280',marginTop:'2px' }}>{data.body??data.message??''}</div>
              <div style={{ fontSize:'11px',color:'#9ca3af',marginTop:'6px' }}>{new Date(n.created_at).toLocaleDateString('en-PH',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</div>
            </div>
            {!isRead && <button onClick={()=>markRead(n.id)} style={{ background:'transparent',border:'1px solid #e2e8e2',padding:'5px 10px',borderRadius:'7px',fontSize:'11px',cursor:'pointer',color:'#6b7280',flexShrink:0 }}>Dismiss</button>}
          </div>
        )
      })}
    </div>
  )
}