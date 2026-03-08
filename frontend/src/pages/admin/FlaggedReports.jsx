import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function FlaggedReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('pending')

  useEffect(() => {
    setLoading(true)
    api.get('/admin/reports', { params: { status: filter } })
      .then(res => setReports(res.data.data ?? res.data))
      .finally(() => setLoading(false))
  }, [filter])

  const handle = async (reportId, reportedId, action) => {
    if (action === 'dismiss') {
      await api.patch(`/admin/reports/${reportId}`, { action: 'dismiss' })
    } else {
      const statusMap = { warn:'active', suspend:'suspended', ban:'banned' }
      await api.patch(`/admin/users/${reportedId}/status`, { status: statusMap[action], suspension_reason: 'Admin action from report' })
      await api.patch(`/admin/reports/${reportId}`, { action })
    }
    setReports(p => p.filter(r => r.id !== reportId))
  }

  const tag  = (bg,c,b) => ({ display:'inline-flex',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:bg,color:c,border:`1px solid ${b}` })
  const btn  = (bg,c,b) => ({ background:bg,color:c,border:b?`1px solid ${b}`:'none',padding:'7px 14px',borderRadius:'8px',fontSize:'12px',fontWeight:600,cursor:'pointer' })
  const chip = (a) => ({ padding:'6px 14px',borderRadius:'20px',border:`1.5px solid ${a?'#7c3aed':'#2a2940'}`,fontSize:'12px',fontWeight:a?600:500,color:a?'#a78bfa':'#8b8aad',cursor:'pointer',background:a?'rgba(124,58,237,.12)':'transparent' })
  const ava  = (sz=44) => ({ width:sz,height:sz,borderRadius:'50%',background:'linear-gradient(135deg,#f87171,#b91c1c)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:sz*.36,fontWeight:700,color:'#fff',flexShrink:0 })
  const ini  = (n='') => n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  const card = { background:'#161525',borderRadius:'14px',border:'1px solid #2a2940',padding:'20px',marginBottom:'12px' }

  const reasonColor = (r) => ['Fake profile','Fake credentials'].includes(r)
    ? { bg:'rgba(248,113,113,.12)',c:'#f87171',b:'rgba(248,113,113,.3)' }
    : { bg:'rgba(251,191,36,.12)',c:'#fbbf24',b:'rgba(251,191,36,.3)' }

  if (loading) return <div style={{ padding:'28px',color:'#8b8aad' }}>Loading reports...</div>

  return (
    <div style={{ padding:'28px',maxWidth:'900px' }}>
      <div style={{ display:'flex',gap:'8px',marginBottom:'20px' }}>
        {['pending','resolved','dismissed'].map(f=><div key={f} style={chip(filter===f)} onClick={()=>setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</div>)}
      </div>
      {reports.length===0
        ? <div style={{ ...card,textAlign:'center',color:'#5a5978',padding:'40px' }}>No {filter} reports.</div>
        : reports.map(r => {
          const rc = reasonColor(r.reason)
          return (
            <div key={r.id} style={card}>
              <div style={{ display:'flex',alignItems:'flex-start',gap:'14px' }}>
                <div style={ava()}>{ini(r.reported?.name)}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'6px',flexWrap:'wrap' }}>
                    <div style={{ fontWeight:700,fontSize:'15px',color:'#f0eeff' }}>{r.reported?.name}</div>
                    <span style={tag(rc.bg,rc.c,rc.b)}>{r.reason}</span>
                    <span style={tag('rgba(124,58,237,.12)','#a78bfa','rgba(124,58,237,.3)')}>{r.reported?.role}</span>
                  </div>
                  <div style={{ fontSize:'13px',color:'#8b8aad',marginBottom:'4px' }}>Reported by: <span style={{ color:'#f0eeff' }}>{r.reporter?.name}</span></div>
                  {r.details && <div style={{ fontSize:'13px',color:'#8b8aad',background:'#1e1d30',borderRadius:'8px',padding:'10px 12px',marginBottom:'12px',borderLeft:'3px solid #2a2940' }}>{r.details}</div>}
                  {filter==='pending' && (
                    <div style={{ display:'flex',gap:'8px',flexWrap:'wrap' }}>
                      <button style={btn('rgba(251,191,36,.12)','#fbbf24','rgba(251,191,36,.3)')} onClick={()=>handle(r.id,r.reported_id,'warn')}>⚠ Warn</button>
                      <button style={btn('rgba(248,113,113,.12)','#f87171','rgba(248,113,113,.3)')} onClick={()=>handle(r.id,r.reported_id,'suspend')}>⏸ Suspend</button>
                      <button style={btn('rgba(248,113,113,.2)','#f87171','rgba(248,113,113,.4)')} onClick={()=>handle(r.id,r.reported_id,'ban')}>⛔ Ban</button>
                      <button style={btn('transparent','#5a5978','#2a2940')} onClick={()=>handle(r.id,r.reported_id,'dismiss')}>Dismiss</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
