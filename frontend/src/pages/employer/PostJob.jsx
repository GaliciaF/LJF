// PostJob.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function PostJob() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ title:'',category_id:'',description:'',salary:'',rate_type:'Daily',negotiable:false,barangay:'',purok:'',start_date:'',start_time:'',notify_nearby:true })
  const [saving, setSaving] = useState(false)
  const [err, setErr]       = useState('')

  useEffect(() => { api.get('/admin/categories').then(res=>setCategories(res.data)) }, [])

  const handleSubmit = async () => {
    setErr(''); setSaving(true)
    try {
      await api.post('/employer/jobs', { ...form, salary: parseFloat(form.salary) })
      navigate('/employer/jobs')
    } catch (e) { setErr(e.response?.data?.message ?? 'Failed to post job.') }
    finally { setSaving(false) }
  }

  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e5e0d0',padding:'24px',marginBottom:'16px',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }
  const inp  = { padding:'9px 12px',border:'1.5px solid #e5e0d0',borderRadius:'9px',fontSize:'13px',background:'#fffdf5',color:'#111827',outline:'none',width:'100%',boxSizing:'border-box' }
  const lbl  = { fontSize:'12px',fontWeight:600,color:'#6b7280',marginBottom:'6px',display:'block' }
  const btn  = (bg,c,b) => ({ background:bg,color:c,border:b?`1px solid ${b}`:'none',padding:'8px 18px',borderRadius:'9px',fontSize:'13px',fontWeight:600,cursor:'pointer' })
  const barangays = ['Brgy. San Jose','Brgy. Dolores','Brgy. Sta. Cruz','Brgy. Bagong Silang','Brgy. Poblacion']

  return (
    <div style={{ padding:'28px',maxWidth:'800px',background:'#fffdf5',minHeight:'100vh' }}>
      {err && <div style={{ background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.3)',borderRadius:'10px',padding:'12px 16px',marginBottom:'16px',color:'#ef4444',fontSize:'13px' }}>{err}</div>}
      <div style={card}>
        <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'16px' }}>📢 Post a New Job</div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px' }}>
          <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Job Title</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Plumber Needed" style={inp} /></div>
          <div>
            <label style={lbl}>Category</label>
            <select value={form.category_id} onChange={e=>setForm(f=>({...f,category_id:e.target.value}))} style={inp}>
              <option value="">Select category</option>
              {categories.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Rate Type</label>
            <select value={form.rate_type} onChange={e=>setForm(f=>({...f,rate_type:e.target.value}))} style={inp}>
              {['Daily','Hourly','Per Service','Monthly'].map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Salary Amount (₱)</label><input value={form.salary} onChange={e=>setForm(f=>({...f,salary:e.target.value}))} type="number" placeholder="800" style={inp} /></div>
          <div>
            <label style={lbl}>Barangay</label>
            <select value={form.barangay} onChange={e=>setForm(f=>({...f,barangay:e.target.value}))} style={inp}>
              <option value="">Select barangay</option>
              {barangays.map(b=><option key={b}>{b}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Purok / Street</label><input value={form.purok} onChange={e=>setForm(f=>({...f,purok:e.target.value}))} placeholder="Purok 3" style={inp} /></div>
          <div><label style={lbl}>Start Date</label><input value={form.start_date} onChange={e=>setForm(f=>({...f,start_date:e.target.value}))} type="date" style={inp} /></div>
          <div><label style={lbl}>Start Time</label><input value={form.start_time} onChange={e=>setForm(f=>({...f,start_time:e.target.value}))} type="time" style={inp} /></div>
          <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Job Description</label><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={4} placeholder="Describe the job in detail..." style={{ ...inp,resize:'vertical' }} /></div>
          <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
            <div onClick={()=>setForm(f=>({...f,negotiable:!f.negotiable}))} style={{ width:'40px',height:'22px',borderRadius:'11px',background:form.negotiable?'#d97706':'#e5e0d0',cursor:'pointer',position:'relative',transition:'background .2s',flexShrink:0 }}>
              <div style={{ position:'absolute',top:'3px',left:form.negotiable?'21px':'3px',width:'16px',height:'16px',borderRadius:'50%',background:'#fff',transition:'left .2s' }} />
            </div>
            <span style={{ fontSize:'13px',color:'#6b7280' }}>Salary is negotiable</span>
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
            <div onClick={()=>setForm(f=>({...f,notify_nearby:!f.notify_nearby}))} style={{ width:'40px',height:'22px',borderRadius:'11px',background:form.notify_nearby?'#d97706':'#e5e0d0',cursor:'pointer',position:'relative',transition:'background .2s',flexShrink:0 }}>
              <div style={{ position:'absolute',top:'3px',left:form.notify_nearby?'21px':'3px',width:'16px',height:'16px',borderRadius:'50%',background:'#fff',transition:'left .2s' }} />
            </div>
            <span style={{ fontSize:'13px',color:'#6b7280' }}>Notify nearby workers</span>
          </div>
        </div>
        <div style={{ marginTop:'20px',display:'flex',gap:'10px' }}>
          <button style={btn('#d97706','#fff')} onClick={handleSubmit} disabled={saving}>{saving?'Posting...':'📢 Post Job'}</button>
          <button style={btn('transparent','#6b7280','#e5e0d0')} onClick={()=>navigate('/employer/jobs')}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
