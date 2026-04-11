import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function PostJob() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ title:'', category_id:'', custom_category:'', description:'', salary:'', rate_type:'Daily', negotiable:false, barangay:'', purok:'', start_date:'', start_time:'', notify_nearby:true })
  const [saving,    setSaving]    = useState(false)
  const [err,       setErr]       = useState('')
  const [purokOpen, setPurokOpen] = useState(false)
  const [isMobile,  setIsMobile]  = useState(window.innerWidth < 768)
  const purokRef = useRef(null)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => { api.get('/categories').then(res=>setCategories(res.data)).catch(()=>setErr('Failed to load categories.')) }, [])
  useEffect(() => {
    const handler = (e) => { if (purokRef.current&&!purokRef.current.contains(e.target)) setPurokOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const barangays = ['Banlasan','Bongbong','Catoogan','Guinobatan','Hinlayagan Ilaud','Hinlayagan Ilaya','Kauswagan','Kinan‑oan','La Union','La Victoria','Mabuhay Cabigohan','Mahagbu','Manuel A. Roxas','Poblacion','San Isidro','San Vicente','Santo Tomas','Soom','Tagum Norte','Tagum Sur']
  const puroksByBarangay = Object.fromEntries(barangays.map(b => [b, ['Purok 1','Purok 2','Purok 3','Purok 4','Purok 5','Purok 6','Purok 7']]))
  const currentPuroks   = form.barangay ? puroksByBarangay[form.barangay]||[] : []
  const filteredPuroks  = currentPuroks.filter(p=>p.toLowerCase().includes(form.purok.toLowerCase()))

  const handleSubmit = async () => {
    setErr('')
    if (!form.title.trim()) return setErr('Job title is required.')
    if (!form.category_id && !(form.custom_category&&form.custom_category.trim())) return setErr('Category is required.')
    if (!form.salary||isNaN(parseFloat(form.salary))) return setErr('Salary must be a number.')
    if (!form.barangay) return setErr('Barangay is required.')
    if (!form.purok.trim()) return setErr('Purok is required.')
    setSaving(true)
    try {
      await api.post('/employer/jobs', { ...form, category_id:form.category_id?Number(form.category_id):null, category_name:form.custom_category?.trim()||undefined, salary:parseFloat(form.salary) })
      navigate('/employer/jobs')
    } catch (e) { setErr(e.response?.data?.message??'Failed to post job.') }
    finally { setSaving(false) }
  }

  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e5e0d0',padding: isMobile?'16px':'24px',marginBottom:'16px',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }
  const inp  = { padding:'9px 12px',border:'1.5px solid #e5e0d0',borderRadius:'9px',fontSize:'13px',background:'#fffdf5',color:'#111827',outline:'none',width:'100%',boxSizing:'border-box' }
  const lbl  = { fontSize:'12px',fontWeight:600,color:'#6b7280',marginBottom:'6px',display:'block' }
  const btn  = (bg,c,b) => ({ background:bg,color:c,border:b?`1px solid ${b}`:'none',padding:'8px 18px',borderRadius:'9px',fontSize:'13px',fontWeight:600,cursor:'pointer' })

  return (
    <div style={{ padding: isMobile?'14px':'28px', maxWidth:'800px', background:'#fffdf5', minHeight:'100vh' }}>
      {err && <div style={{ background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.3)',borderRadius:'10px',padding:'12px 16px',marginBottom:'16px',color:'#ef4444',fontSize:'13px' }}>{err}</div>}

      <div style={card}>
        <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'16px' }}>📢 Post a New Job</div>
        <div style={{ display:'grid',gridTemplateColumns: isMobile?'1fr':'1fr 1fr',gap:'14px' }}>

          <div style={{ gridColumn:'1/-1' }}>
            <label style={lbl}>Job Title</label>
            <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Plumber Needed" style={inp} />
          </div>

          <div>
            <label style={lbl}>Category</label>
            <select value={form.category_id} onChange={e => { const val=e.target.value; if(val==='custom') setForm(f=>({...f,category_id:'',custom_category:''})); else setForm(f=>({...f,category_id:Number(val),custom_category:undefined})) }} style={{ ...inp,marginBottom:'6px' }}>
              <option value="">Select category</option>
              {categories.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
              <option value="custom">Other (type below)</option>
            </select>
            {form.category_id===''&&form.custom_category!==undefined && <input type="text" placeholder="Or type your category here" value={form.custom_category||''} onChange={e=>setForm(f=>({...f,custom_category:e.target.value}))} style={inp} />}
          </div>

          <div>
            <label style={lbl}>Rate Type</label>
            <select value={form.rate_type} onChange={e=>setForm(f=>({...f,rate_type:e.target.value}))} style={inp}>
              {['Daily','Hourly','Per Service','Monthly'].map(r=><option key={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label style={lbl}>Salary Amount (₱)</label>
            <input type="number" value={form.salary} onChange={e=>setForm(f=>({...f,salary:e.target.value}))} placeholder="800" style={inp} />
          </div>

          <div>
            <label style={lbl}>Barangay</label>
            <select value={form.barangay} onChange={e=>setForm(f=>({...f,barangay:e.target.value,purok:''}))} style={inp}>
              <option value="">Select barangay</option>
              {barangays.map(b=><option key={b}>{b}</option>)}
            </select>
          </div>

          <div ref={purokRef} style={{ position:'relative' }}>
            <label style={lbl}>Purok / Street</label>
            <input placeholder={form.barangay?'Type or select purok...':'Select a barangay first'} value={form.purok} disabled={!form.barangay}
              onChange={e=>{setForm(f=>({...f,purok:e.target.value}));setPurokOpen(true)}}
              onFocus={()=>form.barangay&&setPurokOpen(true)}
              style={{ ...inp,cursor:form.barangay?'text':'not-allowed',opacity:form.barangay?1:0.5 }} />
            {purokOpen&&filteredPuroks.length>0 && (
              <div style={{ position:'absolute',top:'100%',left:0,right:0,zIndex:100,background:'#fff',border:'1.5px solid #e5e0d0',borderRadius:'9px',boxShadow:'0 4px 12px rgba(0,0,0,.1)',marginTop:'4px',overflow:'hidden' }}>
                {filteredPuroks.map(p=>(
                  <div key={p} onMouseDown={()=>{setForm(f=>({...f,purok:p}));setPurokOpen(false)}}
                    style={{ padding:'9px 12px',fontSize:'13px',cursor:'pointer',color:'#111827',background:form.purok===p?'#fef3c7':'#fffdf5',borderBottom:'1px solid #f3ede0' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#fef3c7'}
                    onMouseLeave={e=>e.currentTarget.style.background=form.purok===p?'#fef3c7':'#fffdf5'}>
                    {p}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label style={lbl}>Start Date</label>
            <input type="date" value={form.start_date} onChange={e=>setForm(f=>({...f,start_date:e.target.value}))} style={inp} />
          </div>

          <div>
            <label style={lbl}>Start Time</label>
            <input type="time" value={form.start_time} onChange={e=>setForm(f=>({...f,start_time:e.target.value}))} style={inp} />
          </div>

          <div style={{ gridColumn:'1/-1' }}>
            <label style={lbl}>Job Description</label>
            <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={4} placeholder="Describe the job in detail..." style={{ ...inp,resize:'vertical' }} />
          </div>

          <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
            <div onClick={()=>setForm(f=>({...f,negotiable:!f.negotiable}))} style={{ width:'40px',height:'22px',borderRadius:'11px',background:form.negotiable?'#d97706':'#e5e0d0',cursor:'pointer',position:'relative',transition:'background .2s',flexShrink:0 }}>
              <div style={{ position:'absolute',top:'3px',left:form.negotiable?'21px':'3px',width:'16px',height:'16px',borderRadius:'50%',background:'#fff',transition:'left .2s' }} />
            </div>
            <span style={{ fontSize:'13px',color:'#6b7280' }}>Salary is negotiable</span>
          </div>
        </div>

        <div style={{ marginTop:'20px',display:'flex',gap:'10px',flexWrap:'wrap' }}>
          <button style={btn('#d97706','#fff')} onClick={handleSubmit} disabled={saving}>{saving?'Posting...':'📢 Post Job'}</button>
          <button style={btn('transparent','#6b7280','#e5e0d0')} onClick={()=>navigate('/employer/jobs')}>Cancel</button>
        </div>
      </div>
    </div>
  )
}