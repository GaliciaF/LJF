import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function AllJobs() {
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')

  const fetch = () => {
    setLoading(true)
    api.get('/admin/jobs', { params: { status: filter==='all'?null:filter, search: search||null } })
      .then(res => setJobs(res.data.data ?? res.data))
      .finally(() => setLoading(false))
  }
  useEffect(() => { fetch() }, [filter, search])

  const handleRemove = async (id) => { if (!confirm('Remove this job?')) return; await api.delete(`/admin/jobs/${id}`); setJobs(p=>p.filter(j=>j.id!==id)) }
  const handleFlag   = async (id) => { await api.patch(`/admin/jobs/${id}/status`, { status:'flagged' }); fetch() }

  const tag  = (bg,c,b) => ({ display:'inline-flex',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:bg,color:c,border:`1px solid ${b}` })
  const btn  = (bg,c,b) => ({ background:bg,color:c,border:b?`1px solid ${b}`:'none',padding:'5px 12px',borderRadius:'8px',fontSize:'11px',fontWeight:600,cursor:'pointer' })
  const chip = (a) => ({ padding:'6px 14px',borderRadius:'20px',border:`1.5px solid ${a?'#7c3aed':'#2a2940'}`,fontSize:'12px',fontWeight:a?600:500,color:a?'#a78bfa':'#8b8aad',cursor:'pointer',background:a?'rgba(124,58,237,.12)':'transparent' })
  const th   = { fontSize:'10px',fontWeight:700,textTransform:'uppercase',color:'#5a5978',padding:'10px 14px',borderBottom:'1px solid #2a2940',textAlign:'left' }
  const td   = { padding:'12px 14px',borderBottom:'1px solid #1a1930',fontSize:'13px',color:'#f0eeff',verticalAlign:'middle' }
  const sTag = (s) => ({ open:tag('rgba(34,197,94,.12)','#22c55e','rgba(34,197,94,.3)'), filled:tag('rgba(96,165,250,.12)','#60a5fa','rgba(96,165,250,.3)'), closed:tag('#1e1d30','#5a5978','#2a2940'), flagged:tag('rgba(248,113,113,.12)','#f87171','rgba(248,113,113,.3)') })[s] ?? tag('#1e1d30','#8b8aad','#2a2940')

  return (
    <div style={{ padding:'28px',maxWidth:'1280px' }}>
      <div style={{ background:'#161525',borderRadius:'14px',border:'1px solid #2a2940',padding:'18px 20px',marginBottom:'16px' }}>
        <div style={{ display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'14px' }}>
          {['all','open','filled','closed','flagged'].map(f=><div key={f} style={chip(filter===f)} onClick={()=>setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</div>)}
        </div>
        <div style={{ display:'flex',gap:'10px' }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search job title..."
            style={{ flex:1,padding:'9px 14px',border:'1.5px solid #2a2940',borderRadius:'9px',fontSize:'13px',background:'#1e1d30',color:'#f0eeff',outline:'none' }} />
          <button style={btn('#7c3aed','#fff')} onClick={fetch}>Search</button>
        </div>
      </div>
      <div style={{ background:'#161525',borderRadius:'14px',border:'1px solid #2a2940',overflow:'hidden' }}>
        {loading ? <div style={{ padding:'32px',textAlign:'center',color:'#8b8aad' }}>Loading jobs...</div>
          : <table style={{ width:'100%',borderCollapse:'collapse' }}>
              <thead><tr>{['Title','Employer','Category','Rate','Applicants','Status','Actions'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>
                {jobs.length===0 ? <tr><td colSpan={7} style={{ ...td,textAlign:'center',color:'#5a5978' }}>No jobs found.</td></tr>
                  : jobs.map(j=>(
                    <tr key={j.id} onMouseEnter={e=>e.currentTarget.style.background='rgba(124,58,237,.04)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td style={td}><div style={{ fontWeight:600 }}>{j.title}</div><div style={{ fontSize:'11px',color:'#8b8aad' }}>{j.barangay}</div></td>
                      <td style={{ ...td,color:'#8b8aad' }}>{j.employer?.name??'—'}</td>
                      <td style={td}>{j.category?.emoji} {j.category?.name}</td>
                      <td style={{ ...td,color:'#22c55e',fontWeight:700 }}>₱{parseFloat(j.salary).toLocaleString()}<span style={{ color:'#5a5978',fontWeight:400,fontSize:'11px' }}>/{j.rate_type==='Daily'?'day':'hr'}</span></td>
                      <td style={td}>{j.applications_count??0}</td>
                      <td style={td}><span style={sTag(j.status)}>{j.status}</span></td>
                      <td style={td}>
                        <div style={{ display:'flex',gap:'6px' }}>
                          {j.status!=='flagged' && <button style={btn('rgba(251,191,36,.12)','#fbbf24','rgba(251,191,36,.3)')} onClick={()=>handleFlag(j.id)}>Flag</button>}
                          <button style={btn('rgba(248,113,113,.12)','#f87171','rgba(248,113,113,.3)')} onClick={()=>handleRemove(j.id)}>Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
        }
      </div>
    </div>
  )
}
