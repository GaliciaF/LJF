import { useState, useEffect } from 'react'
import api from '../../api/axios'

const ALL_DAYS = ['M','T','W','Th','F','Sa','Su']

export default function MySchedule() {
  const [profile, setProfile] = useState(null)
  const [jobs,    setJobs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState({ type:'', text:'' })
  const [newDate, setNewDate] = useState('')

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024)
  useEffect(() => {
    const handle = () => {
      setIsMobile(window.innerWidth < 640)
      setIsTablet(window.innerWidth < 1024)
    }
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  useEffect(() => {
    Promise.all([api.get('/worker/profile'), api.get('/worker/applications')])
      .then(([pRes, aRes]) => {
        const p = pRes.data.worker_profile ?? {}
        setProfile({ work_days: p.work_days ?? ['M','T','W','Th','F'], work_start: p.work_start ?? '08:00', work_end: p.work_end ?? '17:00', blocked_dates: p.blocked_dates ?? [] })
        setJobs((aRes.data ?? []).filter(a => a.status==='accepted' && a.job?.start_date))
      }).finally(() => setLoading(false))
  }, [])

  const flash    = (type, text) => { setMsg({ type, text }); setTimeout(()=>setMsg({type:'',text:''}),2500) }
  const save     = async () => { setSaving(true); try { await api.put('/worker/profile', profile); flash('success','Schedule saved.') } catch { flash('error','Failed to save.') } finally { setSaving(false) } }
  const toggleDay  = (d) => setProfile(p => ({ ...p, work_days: p.work_days.includes(d) ? p.work_days.filter(x=>x!==d) : [...p.work_days,d] }))
  const addBlock   = () => { if(!newDate) return; if(!profile.blocked_dates.includes(newDate)) setProfile(p=>({...p,blocked_dates:[...p.blocked_dates,newDate]})); setNewDate('') }
  const removeBlock = (d) => setProfile(p => ({ ...p, blocked_dates: p.blocked_dates.filter(x=>x!==d) }))

  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2',padding: isMobile ? '16px' : '24px',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }
  const inp  = { width:'100%',padding:'10px 14px',border:'1.5px solid #e2e8e2',borderRadius:'9px',fontSize:'14px',background:'#fff',color:'#111827',outline:'none',boxSizing:'border-box' }
  const lbl  = { fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',color:'#6b7280',display:'block',marginBottom:'6px' }
  const tag  = (bg,c,b) => ({ display:'inline-flex',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:bg,color:c,border:`1px solid ${b}`,cursor:'pointer' })

  if (loading || !profile) return <div style={{ padding:'28px',color:'#6b7280' }}>Loading schedule...</div>

  return (
    <div style={{ padding: isMobile ? '16px' : '28px', maxWidth:'1280px' }}>
      {msg.text && <div style={{ background:msg.type==='success'?'rgba(22,163,74,.1)':'rgba(239,68,68,.1)',border:`1px solid ${msg.type==='success'?'rgba(22,163,74,.3)':'rgba(239,68,68,.3)'}`,borderRadius:'10px',padding:'12px 16px',marginBottom:'16px',color:msg.type==='success'?'#16a34a':'#ef4444',fontSize:'13px',fontWeight:500 }}>{msg.text}</div>}
      <div style={{ display:'grid',gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr',gap:'20px' }}>
        <div style={{ display:'flex',flexDirection:'column',gap:'16px' }}>
          <div style={card}>
            <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'14px' }}>⏰ Working Hours</div>
            <label style={lbl}>Working Days</label>
            <div style={{ display:'flex',gap:'6px',marginBottom:'14px',flexWrap:'wrap' }}>
              {ALL_DAYS.map(d => { const on=profile.work_days.includes(d); return <div key={d} onClick={()=>toggleDay(d)} style={{ width:'36px',height:'36px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:600,border:`1.5px solid ${on?'#16a34a':'#e2e8e2'}`,color:on?'#fff':'#6b7280',background:on?'#16a34a':'transparent',cursor:'pointer' }}>{d}</div> })}
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px' }}>
              <div><label style={lbl}>Start Time</label><input style={inp} type="time" value={profile.work_start} onChange={e=>setProfile(p=>({...p,work_start:e.target.value}))} /></div>
              <div><label style={lbl}>End Time</label><input style={inp} type="time" value={profile.work_end} onChange={e=>setProfile(p=>({...p,work_end:e.target.value}))} /></div>
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'14px' }}>🗓️ Blocked Dates</div>
            {profile.blocked_dates.length === 0
              ? <div style={{ fontSize:'13px',color:'#6b7280',marginBottom:'12px' }}>No blocked dates set.</div>
              : <div style={{ display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'12px' }}>
                  {profile.blocked_dates.map(d=><span key={d} onClick={()=>removeBlock(d)} style={tag('rgba(239,68,68,.1)','#ef4444','rgba(239,68,68,.3)')}>{new Date(d).toLocaleDateString('en-PH',{month:'short',day:'numeric'})} ×</span>)}
                </div>}
            <div style={{ display:'flex',gap:'8px' }}>
              <input style={{ ...inp,flex:1 }} type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} />
              <button onClick={addBlock} style={{ background:'transparent',border:'1px solid #e2e8e2',padding:'10px 14px',borderRadius:'9px',fontSize:'13px',color:'#6b7280',cursor:'pointer',flexShrink:0 }}>+ Block</button>
            </div>
          </div>

          <button onClick={save} disabled={saving} style={{ padding:'12px',background:'#16a34a',color:'#fff',border:'none',borderRadius:'10px',fontWeight:700,fontSize:'14px',cursor:'pointer' }}>{saving?'Saving...':'💾 Save Schedule'}</button>
        </div>

        <div style={card}>
          <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'14px' }}>📋 Upcoming Jobs</div>
          {jobs.length === 0
            ? <div style={{ color:'#6b7280',fontSize:'13px',textAlign:'center',padding:'30px' }}>No upcoming scheduled jobs yet.</div>
            : jobs.map(app=>(
              <div key={app.id} style={{ display:'flex',alignItems:'center',gap:'14px',padding:'14px 16px',border:'1px solid #e2e8e2',borderRadius:'14px',marginBottom:'10px' }}>
                <div style={{ fontSize:'28px',flexShrink:0 }}>{app.job.category?.emoji??'💼'}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600,fontSize:'14px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{app.job.title}</div>
                  <div style={{ fontSize:'12px',color:'#6b7280', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{app.job.employer?.employer_profile?.household_name ?? app.job.employer?.name} · {app.job.barangay}</div>
                  <div style={{ fontSize:'12px',color:'#16a34a',fontWeight:600,marginTop:'2px' }}>{new Date(app.job.start_date).toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'})}{app.job.start_time?` · ${app.job.start_time}`:''}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}