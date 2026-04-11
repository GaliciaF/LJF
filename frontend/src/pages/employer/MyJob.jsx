import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function MyJob() {
  const navigate = useNavigate()
  const [jobs,        setJobs]        = useState([])
  const [loading,     setLoading]     = useState(true)
  const [filter,      setFilter]      = useState('all')
  const [editing,     setEditing]     = useState(null)
  const [editForm,    setEditForm]    = useState({})
  const [categories,  setCategories]  = useState([])
  const [barangays,   setBarangays]   = useState([])
  const [saving,      setSaving]      = useState(false)
  const [msg,         setMsg]         = useState({ type:'', text:'' })
  const [markingDone, setMarkingDone] = useState(null)
  const [isMobile,    setIsMobile]    = useState(window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    Promise.all([api.get('/employer/jobs'), api.get('/categories'), api.get('/barangays')])
      .then(([jRes, cRes, bRes]) => {
        setJobs(jRes.data)
        setCategories(cRes.data ?? [])
        setBarangays(Array.isArray(bRes.data) ? bRes.data : [])
      }).finally(() => setLoading(false))
  }, [])

  const flash = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type:'', text:'' }), 3000) }

  const handleMarkDone = async (id) => {
    if (!confirm('Mark this job as Done?')) return
    setMarkingDone(id)
    try {
      await api.put(`/employer/jobs/${id}`, { status:'done' })
      setJobs(prev => prev.map(j => j.id===id ? { ...j, status:'done' } : j))
      setFilter('done'); flash('success', 'Job marked as done.')
    } catch { flash('error', 'Failed to mark job as done.') }
    finally { setMarkingDone(null) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this job post?')) return
    try { await api.delete(`/employer/jobs/${id}`); setJobs(p => p.filter(j => j.id!==id)); flash('success','Job deleted.') }
    catch { flash('error','Failed to delete job.') }
  }

  const handleReopen = (j) => {
    setEditForm({ title:j.title??'', category_id:j.category_id??'', description:j.description??'', salary:j.salary??'', rate_type:j.rate_type??'Daily', negotiable:j.negotiable??false, barangay:j.barangay??'', purok:j.purok??'', start_date:'', start_time:'', status:'available' })
    setEditing({ ...j, _reopening:true })
  }

  const openEdit = (j) => {
    setEditForm({ title:j.title??'', category_id:j.category_id??'', description:j.description??'', salary:j.salary??'', rate_type:j.rate_type??'Daily', negotiable:j.negotiable??false, barangay:j.barangay??'', purok:j.purok??'', start_date:j.start_date?j.start_date.slice(0,10):'', start_time:j.start_time??'', status:j.status??'available' })
    setEditing(j)
  }

  const handleSave = async () => {
    if (!editForm.title.trim() || !editForm.salary || !editForm.barangay) { flash('error','Please fill in title, salary, and barangay.'); return }
    setSaving(true)
    try {
      await api.put(`/employer/jobs/${editing.id}`, editForm)
      setJobs(p => p.map(j => j.id===editing.id ? { ...j, ...editForm, category:categories.find(c=>c.id===parseInt(editForm.category_id)) } : j))
      flash('success', editing._reopening?'Job reposted!':'Job updated.')
      setEditing(null)
      if (editing._reopening) setFilter('available')
    } catch { flash('error','Failed to save.') }
    finally { setSaving(false) }
  }

  const filtered = filter==='all' ? jobs : jobs.filter(j=>j.status===filter)

  const STATUS = {
    available:     { label:'Available',     bg:'rgba(22,163,74,.1)',   color:'#16a34a', border:'rgba(22,163,74,.3)' },
    not_available: { label:'Not Available', bg:'rgba(59,130,246,.1)',  color:'#3b82f6', border:'rgba(59,130,246,.3)' },
    done:          { label:'Done',          bg:'rgba(107,114,128,.1)', color:'#6b7280', border:'#e5e0d0' },
    flagged:       { label:'Flagged',       bg:'rgba(239,68,68,.1)',   color:'#ef4444', border:'rgba(239,68,68,.3)' },
  }

  const sTag = (s) => { const st=STATUS[s]??STATUS.done; return { display:'inline-flex',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:st.bg,color:st.color,border:`1px solid ${st.border}` } }
  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e5e0d0',padding: isMobile ? '14px' : '20px',marginBottom:'12px',boxShadow:'0 1px 3px rgba(0,0,0,.08)',transition:'all .2s' }
  const btn  = (bg,c,b) => ({ background:bg,color:c,border:b?`1px solid ${b}`:'none',padding:'6px 14px',borderRadius:'8px',fontSize:'12px',fontWeight:600,cursor:'pointer',whiteSpace:'nowrap' })
  const chip = (a) => ({ padding:'6px 14px',borderRadius:'20px',border:`1.5px solid ${a?'#d97706':'#e5e0d0'}`,fontSize:'12px',fontWeight:a?600:500,color:a?'#d97706':'#6b7280',cursor:'pointer',background:a?'rgba(217,119,6,.08)':'transparent' })
  const inp  = { padding:'9px 12px',border:'1.5px solid #e5e0d0',borderRadius:'9px',fontSize:'13px',background:'#fffdf5',color:'#111827',outline:'none',width:'100%',boxSizing:'border-box' }
  const lbl  = { fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',color:'#6b7280',display:'block',marginBottom:'5px' }

  if (loading) return <div style={{ padding:'28px',color:'#6b7280' }}>Loading jobs...</div>

  return (
    <div style={{ padding: isMobile ? '14px' : '28px', maxWidth:'900px', background:'#fffdf5', minHeight:'100vh' }}>
      {msg.text && (
        <div style={{ background:msg.type==='success'?'rgba(22,163,74,.1)':'rgba(239,68,68,.1)',border:`1px solid ${msg.type==='success'?'rgba(22,163,74,.3)':'rgba(239,68,68,.3)'}`,borderRadius:'10px',padding:'12px 16px',marginBottom:'16px',color:msg.type==='success'?'#16a34a':'#ef4444',fontSize:'13px',fontWeight:500 }}>
          {msg.text}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px' }}
          onClick={e => e.target===e.currentTarget && setEditing(null)}>
          <div style={{ background:'#fff',borderRadius:'18px',padding: isMobile ? '20px' : '28px',width:'100%',maxWidth:'620px',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 64px rgba(0,0,0,.2)' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px' }}>
              <div style={{ fontSize:'17px',fontWeight:800 }}>{editing._reopening?'🔄 Reopen Job Post':'✏️ Edit Job Post'}</div>
              <button onClick={() => setEditing(null)} style={{ background:'none',border:'none',fontSize:'20px',cursor:'pointer',color:'#9ca3af' }}>✕</button>
            </div>
            {editing._reopening && (
              <div style={{ background:'rgba(217,119,6,.08)',border:'1px solid rgba(217,119,6,.25)',borderRadius:'10px',padding:'12px 14px',marginBottom:'16px',fontSize:'13px',color:'#92400e',lineHeight:1.5 }}>
                📢 Review and update the details below — especially the start date.
              </div>
            )}
            <div style={{ display:'flex',flexDirection:'column',gap:'14px' }}>
              <div><label style={lbl}>Job Title *</label><input value={editForm.title} onChange={e=>setEditForm(f=>({...f,title:e.target.value}))} style={inp} /></div>
              <div><label style={lbl}>Category</label>
                <select value={editForm.category_id} onChange={e=>setEditForm(f=>({...f,category_id:e.target.value}))} style={{ ...inp,appearance:'none' }}>
                  <option value="">Select category</option>
                  {categories.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Description</label><textarea value={editForm.description} onChange={e=>setEditForm(f=>({...f,description:e.target.value}))} rows={4} style={{ ...inp,resize:'vertical' }} /></div>
              <div style={{ display:'grid',gridTemplateColumns: isMobile?'1fr':'1fr 1fr',gap:'12px' }}>
                <div><label style={lbl}>Salary (₱) *</label><input type="number" min="0" value={editForm.salary} onChange={e=>setEditForm(f=>({...f,salary:e.target.value}))} style={inp} /></div>
                <div><label style={lbl}>Rate Type</label>
                  <select value={editForm.rate_type} onChange={e=>setEditForm(f=>({...f,rate_type:e.target.value}))} style={{ ...inp,appearance:'none' }}>
                    {['Daily','Hourly','Per Service','Monthly'].map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:'grid',gridTemplateColumns: isMobile?'1fr':'1fr 1fr',gap:'12px' }}>
                <div><label style={lbl}>Barangay *</label>
                  <select value={editForm.barangay} onChange={e=>setEditForm(f=>({...f,barangay:e.target.value,purok:''}))} style={{ ...inp,appearance:'none' }}>
                    <option value="">Select barangay</option>
                    {barangays.map(b=><option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Purok</label><input value={editForm.purok} onChange={e=>setEditForm(f=>({...f,purok:e.target.value}))} style={inp} placeholder="Purok 3" /></div>
              </div>
              <div style={{ display:'grid',gridTemplateColumns: isMobile?'1fr':'1fr 1fr',gap:'12px' }}>
                <div>
                  <label style={lbl}>Start Date {editing._reopening&&<span style={{ color:'#d97706',fontWeight:700 }}>*</span>}</label>
                  <input type="date" value={editForm.start_date} onChange={e=>setEditForm(f=>({...f,start_date:e.target.value}))} style={{ ...inp,borderColor:editing._reopening&&!editForm.start_date?'#d97706':'#e5e0d0' }} />
                </div>
                <div><label style={lbl}>Start Time</label><input type="time" value={editForm.start_time} onChange={e=>setEditForm(f=>({...f,start_time:e.target.value}))} style={inp} /></div>
              </div>
              <div style={{ display:'flex',alignItems:'center',gap:'10px',padding:'12px',borderRadius:'10px',background:'#fef9f0',border:'1px solid rgba(217,119,6,.2)' }}>
                <div onClick={() => setEditForm(f=>({...f,negotiable:!f.negotiable}))} style={{ position:'relative',width:'38px',height:'20px',cursor:'pointer',flexShrink:0 }}>
                  <div style={{ position:'absolute',inset:0,background:editForm.negotiable?'#d97706':'#e5e0d0',borderRadius:'20px',transition:'background .2s' }} />
                  <div style={{ position:'absolute',width:'14px',height:'14px',top:'3px',left:editForm.negotiable?'21px':'3px',background:'#fff',borderRadius:'50%',transition:'left .2s' }} />
                </div>
                <span style={{ fontSize:'13px',fontWeight:500 }}>Open to salary negotiation</span>
              </div>
            </div>
            <div style={{ display:'flex',gap:'10px',marginTop:'22px' }}>
              <button onClick={() => setEditing(null)} style={{ ...btn('transparent','#6b7280','#e5e0d0'),flex:1,padding:'11px',display:'flex',justifyContent:'center' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ ...btn(editing._reopening?'#16a34a':'#d97706','#fff'),flex:2,padding:'11px',display:'flex',justifyContent:'center',opacity:saving?.7:1 }}>
                {saving?'Saving...':editing._reopening?'🚀 Post Again':'💾 Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px',flexWrap:'wrap',gap:'10px' }}>
        <div style={{ display:'flex',gap:'8px',flexWrap:'wrap' }}>
          {['all','available','not_available','done'].map(f => (
            <div key={f} style={chip(filter===f)} onClick={() => setFilter(f)}>
              {f==='all'?'All':STATUS[f]?.label??f}
              {f!=='all' && <span style={{ marginLeft:'5px',fontSize:'11px',opacity:.7 }}>({jobs.filter(j=>j.status===f).length})</span>}
            </div>
          ))}
        </div>
        <button style={btn('#d97706','#fff')} onClick={() => navigate('/employer/create-job')}>+ Post New Job</button>
      </div>

      {/* Job List */}
      {filtered.length===0 ? (
        <div style={{ ...card,textAlign:'center',color:'#6b7280',padding:'48px' }}>
          <div style={{ fontSize:'32px',marginBottom:'10px' }}>{filter==='done'?'✅':'📋'}</div>
          <div style={{ fontWeight:700,marginBottom:'8px' }}>{filter==='done'?'No completed jobs yet':`No ${filter==='all'?'':STATUS[filter]?.label?.toLowerCase()} jobs`}</div>
          {filter==='all' && <div style={{ marginTop:'12px' }}><button style={btn('#d97706','#fff')} onClick={() => navigate('/employer/create-job')}>Post Your First Job</button></div>}
        </div>
      ) : filtered.map(j => (
        <div key={j.id} style={{ ...card,opacity:j.status==='done'?.85:1 }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='#d97706';e.currentTarget.style.transform='translateY(-2px)'}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='#e5e0d0';e.currentTarget.style.transform='translateY(0)'}}>
          <div style={{ display:'flex',alignItems:'flex-start',gap:'12px' }}>
            <div style={{ fontSize: isMobile?'28px':'38px',lineHeight:1,filter:j.status==='done'?'grayscale(1)':'' }}>{j.category?.emoji??'📋'}</div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'6px',flexWrap:'wrap' }}>
                <div style={{ fontWeight:700,fontSize:'16px',textDecoration:j.status==='done'?'line-through':'none',color:j.status==='done'?'#9ca3af':'#111827',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth: isMobile?'160px':'none' }}>{j.title}</div>
                <span style={sTag(j.status)}>{STATUS[j.status]?.label??j.status}</span>
                {j.negotiable && <span style={{ display:'inline-flex',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:'rgba(217,119,6,.08)',color:'#d97706',border:'1px solid rgba(217,119,6,.25)' }}>Negotiable</span>}
              </div>
              <div style={{ fontSize:'13px',color:'#6b7280',marginBottom:'4px' }}>📍 {j.barangay}{j.purok?` · ${j.purok}`:''}</div>
              <div style={{ fontSize:'13px',color:'#6b7280',marginBottom:'10px',flexWrap:'wrap',display:'flex',gap:'8px' }}>
                <span>💰 ₱{parseFloat(j.salary).toLocaleString()}/{j.rate_type==='Daily'?'day':j.rate_type==='Hourly'?'hr':j.rate_type==='Monthly'?'mo':'job'}</span>
                {j.start_date && <span>📅 {new Date(j.start_date).toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'})}</span>}
                <span>👥 {j.applications_count??0} applicant{j.applications_count!==1?'s':''}</span>
              </div>
              {(j.status==='not_available'||j.status==='done') && j.hired_worker && (
                <div style={{ background:j.status==='done'?'rgba(107,114,128,.08)':'rgba(59,130,246,.06)',border:`1px solid ${j.status==='done'?'#e5e0d0':'rgba(59,130,246,.2)'}`,borderRadius:'10px',padding:'10px 14px',marginBottom:'10px',display:'flex',alignItems:'center',gap:'10px' }}>
                  <span style={{ fontSize:'20px' }}>{j.status==='done'?'🏁':'👷'}</span>
                  <div>
                    <div style={{ fontSize:'12px',fontWeight:700,color:j.status==='done'?'#6b7280':'#3b82f6' }}>{j.status==='done'?'Completed by':'Hired Worker'}</div>
                    <div style={{ fontSize:'13px',color:'#374151' }}>{j.hired_worker?.name??'—'}</div>
                  </div>
                </div>
              )}
              {j.status==='done' && (
                <div style={{ background:'rgba(22,163,74,.06)',border:'1px solid rgba(22,163,74,.2)',borderRadius:'10px',padding:'10px 14px',marginBottom:'10px',fontSize:'13px',color:'#15803d' }}>
                  ✅ This job is completed and no longer visible to workers.
                </div>
              )}
              <div style={{ display:'flex',gap:'8px',flexWrap:'wrap' }}>
                {j.status!=='done' && <button style={btn('#d97706','#fff')} onClick={e=>{e.stopPropagation();openEdit(j)}}>✏️ Edit</button>}
                {j.status==='available' && <button style={btn('rgba(59,130,246,.1)','#3b82f6','rgba(59,130,246,.3)')} onClick={e=>{e.stopPropagation();navigate('/employer/applicants')}}>👥 Applicants ({j.applications_count??0})</button>}
                {j.status==='not_available' && <button disabled={markingDone===j.id} style={{ ...btn('rgba(22,163,74,.1)','#16a34a','rgba(22,163,74,.3)'),opacity:markingDone===j.id?.6:1 }} onClick={e=>{e.stopPropagation();handleMarkDone(j.id)}}>{markingDone===j.id?'⏳ Marking...':'✅ Mark as Done'}</button>}
                {(j.status==='not_available'||j.status==='done') && <button style={btn('transparent','#6b7280','#e5e0d0')} onClick={e=>{e.stopPropagation();handleReopen(j)}}>🔄 Reopen & Edit</button>}
                <button style={btn('rgba(239,68,68,.1)','#ef4444','rgba(239,68,68,.3)')} onClick={e=>{e.stopPropagation();handleDelete(j.id)}}>🗑 Delete</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}