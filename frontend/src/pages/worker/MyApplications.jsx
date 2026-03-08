import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function MyApplications() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [filter,       setFilter]       = useState('All')

  useEffect(() => {
    api.get('/worker/applications')
      .then(r => setApplications(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statusMap = {
    pending:      { label:'Pending',      bg:'#f1f5f1',             c:'#6b7280', b:'#e2e8e2' },
    under_review: { label:'Under Review', bg:'rgba(245,158,11,.1)', c:'#f59e0b', b:'rgba(245,158,11,.3)' },
    accepted:     { label:'Accepted',     bg:'rgba(22,163,74,.1)',  c:'#16a34a', b:'rgba(22,163,74,.25)' },
    declined:     { label:'Declined',     bg:'rgba(239,68,68,.1)',  c:'#ef4444', b:'rgba(239,68,68,.3)' },
  }

  const tag  = (bg,c,b) => ({ display:'inline-flex',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:bg,color:c,border:`1px solid ${b}` })
  const chip = (active) => ({ padding:'6px 14px',borderRadius:'20px',border:`1.5px solid ${active?'#16a34a':'#e2e8e2'}`,fontSize:'12px',fontWeight:active?600:500,color:active?'#16a34a':'#6b7280',cursor:'pointer',background:active?'rgba(22,163,74,.08)':'transparent' })

  const filterKey = { All:null, Accepted:'accepted', 'Under Review':'under_review', Pending:'pending', Declined:'declined' }
  const visible   = applications.filter(a => !filterKey[filter] || a.status === filterKey[filter])

  if (loading) return <div style={{ padding:'28px',color:'#6b7280' }}>Loading applications...</div>

  return (
    <div style={{ padding:'28px',maxWidth:'1280px' }}>
      <div style={{ display:'flex',gap:'8px',marginBottom:'20px',flexWrap:'wrap' }}>
        {['All','Accepted','Under Review','Pending','Declined'].map(f => (
          <div key={f} style={chip(filter===f)} onClick={() => setFilter(f)}>{f}</div>
        ))}
      </div>

      {visible.length === 0 ? (
        <div style={{ textAlign:'center',color:'#6b7280',padding:'60px',background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2' }}>
          No applications {filter!=='All'?`with status "${filter}"`:'yet'}.<br/>
          <span style={{ color:'#16a34a',cursor:'pointer',fontWeight:600 }} onClick={() => navigate('/worker/browse-job')}>Browse jobs →</span>
        </div>
      ) : (
        <div style={{ display:'flex',flexDirection:'column',gap:'12px' }}>
          {visible.map(app => {
            const st  = statusMap[app.status] ?? statusMap.pending
            const job = app.job
            const rateLabel = { Daily:'/day',Hourly:'/hour',Monthly:'/month','Per Service':'/service' }[job?.rate_type] ?? ''
            const appliedDate = new Date(app.created_at).toLocaleDateString('en-PH',{ month:'short',day:'numeric',year:'numeric' })
            return (
              <div key={app.id} style={{ background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2',padding:'18px 20px',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }}>
                <div style={{ display:'flex',alignItems:'flex-start',gap:'14px' }}>
                  <div style={{ fontSize:'36px' }}>{job?.category?.emoji ?? '💼'}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700,fontSize:'15px',fontFamily:'Syne,sans-serif',marginBottom:'4px' }}>{job?.title ?? 'Job'}</div>
                    <div style={{ fontSize:'13px',color:'#6b7280' }}>
                      {job?.employer?.employer_profile?.household_name ?? job?.employer?.name} · 📍 {job?.barangay}
                    </div>
                    <div style={{ display:'flex',gap:'8px',marginTop:'8px',flexWrap:'wrap' }}>
                      {job?.salary && <span style={tag('rgba(22,163,74,.1)','#16a34a','rgba(22,163,74,.25)')}>₱{parseFloat(job.salary).toLocaleString()}{rateLabel}</span>}
                      <span style={tag('#f1f5f1','#6b7280','#e2e8e2')}>Applied: {appliedDate}</span>
                    </div>
                    {app.cover_message && (
                      <div style={{ marginTop:'8px',fontSize:'13px',color:'#6b7280',fontStyle:'italic',borderLeft:'3px solid #e2e8e2',paddingLeft:'10px' }}>
                        "{app.cover_message.slice(0,120)}{app.cover_message.length>120?'…':''}"
                      </div>
                    )}
                  </div>
                  <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'8px',flexShrink:0 }}>
                    <span style={tag(st.bg,st.c,st.b)}>{st.label}</span>
                    {app.status === 'accepted' && (
                      <button onClick={() => navigate('/worker/messages')} style={{ background:'#16a34a',color:'#fff',border:'none',padding:'6px 14px',borderRadius:'8px',fontSize:'12px',fontWeight:600,cursor:'pointer' }}>💬 Message</button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}