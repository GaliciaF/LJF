import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function RateWorkers() {
  const [jobs,     setJobs]     = useState([])
  const [reviews,  setReviews]  = useState([])
  const [form,     setForm]     = useState({ job_id:'', reviewee_id:'', rating:0, comment:'' })
  const [loading,  setLoading]  = useState(true)
  const [saved,    setSaved]    = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    Promise.all([api.get('/employer/jobs',{params:{status:'done'}}), api.get('/employer/reviews')])
      .then(([jRes,rRes]) => { setJobs((jRes.data||[]).filter(j=>j.hired_worker)); setReviews(rRes.data) })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async () => {
    if (!form.job_id||!form.reviewee_id||!form.rating) return
    await api.post('/employer/reviews', form)
    setSaved(true); setTimeout(()=>setSaved(false),2000)
  }

  const selectedJob = jobs.find(j=>j.id===parseInt(form.job_id))
  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e5e0d0',padding: isMobile?'16px':'24px',marginBottom:'16px',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }
  const inp  = { padding:'9px 12px',border:'1.5px solid #e5e0d0',borderRadius:'9px',fontSize:'13px',background:'#fffdf5',color:'#111827',outline:'none',width:'100%',boxSizing:'border-box' }
  const btn  = (bg,c,b) => ({ background:bg,color:c,border:b?`1px solid ${b}`:'none',padding:'8px 18px',borderRadius:'9px',fontSize:'13px',fontWeight:600,cursor:'pointer' })
  const ava  = (sz=40) => ({ width:sz,height:sz,borderRadius:'50%',background:'linear-gradient(135deg,#d97706,#b45309)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:sz*.36,fontWeight:700,color:'#fff',flexShrink:0 })
  const ini  = (n='') => n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()

  if (loading) return <div style={{ padding:'28px',color:'#6b7280' }}>Loading...</div>

  return (
    <div style={{ padding: isMobile?'14px':'28px', maxWidth:'800px', background:'#fffdf5', minHeight:'100vh' }}>
      {saved && <div style={{ background:'rgba(22,163,74,.1)',border:'1px solid rgba(22,163,74,.3)',borderRadius:'10px',padding:'12px 16px',marginBottom:'16px',color:'#16a34a',fontSize:'13px',fontWeight:500 }}>✓ Review submitted!</div>}

      <div style={card}>
        <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'16px' }}>⭐ Rate a Worker</div>
        <div style={{ marginBottom:'14px' }}>
          <div style={{ fontSize:'12px',fontWeight:600,color:'#6b7280',marginBottom:'6px' }}>Select Completed Job</div>
          <select value={form.job_id} onChange={e=>{const j=jobs.find(j=>j.id===parseInt(e.target.value));setForm(f=>({...f,job_id:e.target.value,reviewee_id:j?.hired_worker_id??''}))}} style={inp}>
            <option value="">Choose a completed job...</option>
            {jobs.map(j=><option key={j.id} value={j.id}>{j.title} — {j.hired_worker?.name??'Worker'}</option>)}
          </select>
        </div>
        {selectedJob && (
          <div style={{ display:'flex',gap:'12px',alignItems:'center',background:'#fef9f0',borderRadius:'10px',padding:'12px 14px',marginBottom:'14px',border:'1px solid rgba(217,119,6,.2)' }}>
            <div style={ava()}>{ini(selectedJob.hired_worker?.name)}</div>
            <div>
              <div style={{ fontWeight:600,fontSize:'14px' }}>{selectedJob.hired_worker?.name}</div>
              <div style={{ fontSize:'12px',color:'#6b7280' }}>{selectedJob.title}</div>
            </div>
          </div>
        )}
        <div style={{ marginBottom:'14px' }}>
          <div style={{ fontSize:'12px',fontWeight:600,color:'#6b7280',marginBottom:'8px' }}>Rating</div>
          <div style={{ display:'flex',gap:'8px' }}>
            {[1,2,3,4,5].map(n=>(
              <span key={n} onClick={()=>setForm(f=>({...f,rating:n}))} style={{ fontSize: isMobile?'32px':'28px',cursor:'pointer',filter:form.rating>=n?'none':'grayscale(1) opacity(.4)' }}>⭐</span>
            ))}
          </div>
        </div>
        <div style={{ marginBottom:'16px' }}>
          <div style={{ fontSize:'12px',fontWeight:600,color:'#6b7280',marginBottom:'6px' }}>Review</div>
          <textarea value={form.comment} onChange={e=>setForm(f=>({...f,comment:e.target.value}))} rows={3} placeholder="Share your experience with this worker..." style={{ ...inp,resize:'vertical' }} />
        </div>
        <button style={btn('#d97706','#fff')} onClick={handleSubmit}>Submit Review</button>
      </div>

      {reviews.length>0 && (
        <div style={card}>
          <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'14px' }}>📝 Reviews You Received</div>
          {reviews.map(r=>(
            <div key={r.id} style={{ padding:'12px 0',borderBottom:'1px solid #e5e0d0' }}>
              <div style={{ display:'flex',gap:'10px',alignItems:'center',marginBottom:'6px',flexWrap:'wrap' }}>
                <div style={{ ...ava(32),background:'linear-gradient(135deg,#16a34a,#15803d)' }}>{ini(r.reviewer?.name)}</div>
                <div style={{ fontWeight:600,fontSize:'13px' }}>{r.reviewer?.name}</div>
                <div style={{ marginLeft:'auto',color:'#f59e0b',fontSize:'14px' }}>{'⭐'.repeat(r.rating)}</div>
              </div>
              {r.comment && <div style={{ fontSize:'13px',color:'#6b7280' }}>{r.comment}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}