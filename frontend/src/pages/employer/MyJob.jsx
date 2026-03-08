import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function MyJob() {
  const navigate = useNavigate()
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')

  useEffect(() => { api.get('/employer/jobs').then(res=>setJobs(res.data)).finally(()=>setLoading(false)) }, [])

  const handleClose  = async (id) => { await api.put(`/employer/jobs/${id}`, { status:'closed' }); setJobs(p=>p.map(j=>j.id===id?{...j,status:'closed'}:j)) }
  const handleDelete = async (id) => { if(!confirm('Delete this job?')) return; await api.delete(`/employer/jobs/${id}`); setJobs(p=>p.filter(j=>j.id!==id)) }

  const filtered = filter==='all' ? jobs : jobs.filter(j=>j.status===filter)

  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e5e0d0',padding:'20px',marginBottom:'12px',boxShadow:'0 1px 3px rgba(0,0,0,.08)',transition:'all .2s',cursor:'pointer' }
  const tag  = (bg,c,b) => ({ display:'inline-flex',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:bg,color:c,border:`1px solid ${b}` })
  const btn  = (bg,c,b) => ({ background:bg,color:c,border:b?`1px solid ${b}`:'none',padding:'6px 14px',borderRadius:'8px',fontSize:'12px',fontWeight:600,cursor:'pointer' })
  const chip = (a) => ({ padding:'6px 14px',borderRadius:'20px',border:`1.5px solid ${a?'#d97706':'#e5e0d0'}`,fontSize:'12px',fontWeight:a?600:500,color:a?'#d97706':'#6b7280',cursor:'pointer',background:a?'rgba(217,119,6,.08)':'transparent' })
  const sTag = (s) => ({ open:tag('rgba(22,163,74,.1)','#16a34a','rgba(22,163,74,.3)'), filled:tag('rgba(59,130,246,.1)','#3b82f6','rgba(59,130,246,.3)'), closed:tag('#f3f4f6','#6b7280','#e5e0d0') })[s] ?? tag('#f3f4f6','#6b7280','#e5e0d0')

  if (loading) return <div style={{ padding:'28px',color:'#6b7280' }}>Loading jobs...</div>

  return (
    <div style={{ padding:'28px',maxWidth:'900px',background:'#fffdf5',minHeight:'100vh' }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px' }}>
        <div style={{ display:'flex',gap:'8px' }}>
          {['all','open','filled','closed'].map(f=><div key={f} style={chip(filter===f)} onClick={()=>setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</div>)}
        </div>
        <button style={btn('#d97706','#fff')} onClick={()=>navigate('/employer/create-job')}>+ Post New Job</button>
      </div>
      {filtered.length===0
        ? <div style={{ ...card,textAlign:'center',color:'#6b7280',padding:'40px' }}>No {filter} jobs.</div>
        : filtered.map(j=>(
          <div key={j.id} style={card}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='#d97706';e.currentTarget.style.transform='translateY(-2px)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='#e5e0d0';e.currentTarget.style.transform='translateY(0)'}}>
            <div style={{ display:'flex',alignItems:'flex-start',gap:'12px' }}>
              <div style={{ fontSize:'36px' }}>{j.category?.emoji??'📋'}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'6px',flexWrap:'wrap' }}>
                  <div style={{ fontWeight:700,fontSize:'16px',fontFamily:'Syne,sans-serif' }}>{j.title}</div>
                  <span style={sTag(j.status)}>{j.status}</span>
                </div>
                <div style={{ fontSize:'13px',color:'#6b7280',marginBottom:'8px' }}>{j.barangay} · ₱{parseFloat(j.salary).toLocaleString()}/{j.rate_type==='Daily'?'day':'hr'} · {j.applications_count??0} applicants</div>
                <div style={{ display:'flex',gap:'8px',flexWrap:'wrap' }}>
                  {j.status==='open' && <>
                    <button style={btn('#d97706','#fff')} onClick={e=>{e.stopPropagation();navigate('/employer/applicants')}}>View Applicants ({j.applications_count??0})</button>
                    <button style={btn('transparent','#6b7280','#e5e0d0')} onClick={e=>{e.stopPropagation();handleClose(j.id)}}>Close Job</button>
                  </>}
                  <button style={btn('rgba(239,68,68,.1)','#ef4444','rgba(239,68,68,.3)')} onClick={e=>{e.stopPropagation();handleDelete(j.id)}}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}
