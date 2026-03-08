import { useState, useEffect, useRef } from 'react'
import api from '../../api/axios'

const BARANGAYS = ['Brgy. San Jose','Brgy. Dolores','Brgy. Sta. Cruz','Brgy. Bagong Silang','Brgy. Poblacion']
const ALL_DAYS  = ['M','T','W','Th','F','Sa','Su']

export default function MyProfile() {
  const [profile,    setProfile]    = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [msg,        setMsg]        = useState({ type:'', text:'' })
  const [skillInput, setSkillInput] = useState('')
  const photoRef = useRef()

  useEffect(() => {
    api.get('/worker/profile').then(r => {
      const p = r.data.worker_profile ?? {}
      setProfile({
        full_name:        p.full_name        ?? r.data.name ?? '',
        phone:            p.phone            ?? '',
        email:            p.email            ?? '',
        barangay:         p.barangay         ?? '',
        purok:            p.purok            ?? '',
        bio:              p.bio              ?? '',
        skills:           p.skills           ?? [],
        years_experience: p.years_experience ?? 0,
        travel_distance:  p.travel_distance  ?? 'Up to 3km',
        expected_rate:    p.expected_rate    ?? '',
        rate_type:        p.rate_type        ?? 'Daily',
        negotiable:       p.negotiable       ?? true,
        is_available:     p.is_available     ?? true,
        work_days:        p.work_days        ?? ['M','T','W','Th','F'],
        work_start:       p.work_start       ?? '08:00',
        work_end:         p.work_end         ?? '17:00',
        photo_path:       p.photo_path       ?? null,
      })
    }).finally(() => setLoading(false))
  }, [])

  const flash = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type:'', text:'' }), 3000) }

  const save = async () => {
    setSaving(true)
    try { await api.put('/worker/profile', profile); flash('success','Profile saved successfully.') }
    catch { flash('error','Failed to save. Please try again.') }
    finally { setSaving(false) }
  }

  const uploadPhoto = async (e) => {
    const file = e.target.files[0]; if (!file) return
    const form = new FormData(); form.append('photo', file)
    try {
      const res = await api.post('/worker/profile/photo', form, { headers:{ 'Content-Type':'multipart/form-data' } })
      setProfile(p => ({ ...p, photo_path: res.data.photo_url }))
      flash('success','Photo updated.')
    } catch { flash('error','Photo upload failed.') }
  }

  const toggleDay   = (d) => setProfile(p => ({ ...p, work_days: p.work_days.includes(d) ? p.work_days.filter(x=>x!==d) : [...p.work_days,d] }))
  const addSkill    = () => { const s=skillInput.trim(); if(s && !profile.skills.includes(s)){ setProfile(p=>({...p,skills:[...p.skills,s]})); setSkillInput('') } }
  const removeSkill = (s) => setProfile(p => ({ ...p, skills: p.skills.filter(x=>x!==s) }))

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{ position:'relative',width:'40px',height:'22px',flexShrink:0,cursor:'pointer' }}>
      <div style={{ position:'absolute',inset:0,background:on?'#16a34a':'#e2e8e2',borderRadius:'20px',transition:'background .25s' }} />
      <div style={{ position:'absolute',width:'16px',height:'16px',top:'3px',left:on?'21px':'3px',background:'#fff',borderRadius:'50%',transition:'left .25s' }} />
    </div>
  )

  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2',padding:'24px',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }
  const inp  = { width:'100%',padding:'10px 14px',border:'1.5px solid #e2e8e2',borderRadius:'9px',fontSize:'14px',background:'#fff',color:'#111827',outline:'none',boxSizing:'border-box' }
  const lbl  = { fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',color:'#6b7280',display:'block',marginBottom:'6px' }

  if (loading) return <div style={{ padding:'28px',color:'#6b7280' }}>Loading profile...</div>

  return (
    <div style={{ padding:'28px',maxWidth:'1280px' }}>
      {msg.text && (
        <div style={{ background:msg.type==='success'?'rgba(22,163,74,.1)':'rgba(239,68,68,.1)', border:`1px solid ${msg.type==='success'?'rgba(22,163,74,.3)':'rgba(239,68,68,.3)'}`, borderRadius:'10px',padding:'12px 16px',marginBottom:'16px',color:msg.type==='success'?'#16a34a':'#ef4444',fontSize:'13px',fontWeight:500 }}>
          {msg.text}
        </div>
      )}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px' }}>
        <div style={{ display:'flex',flexDirection:'column',gap:'16px' }}>
          <div style={card}>
            <input type="file" accept="image/*" ref={photoRef} style={{ display:'none' }} onChange={uploadPhoto} />
            <div onClick={() => photoRef.current.click()} style={{ textAlign:'center',padding:'20px',border:'2px dashed #e2e8e2',borderRadius:'14px',cursor:'pointer',marginBottom:'16px' }}>
              {profile.photo_path
                ? <img src={profile.photo_path} alt="Profile" style={{ width:'80px',height:'80px',borderRadius:'50%',objectFit:'cover',marginBottom:'8px' }} />
                : <div style={{ fontSize:'48px',marginBottom:'8px' }}>👷</div>}
              <div style={{ fontSize:'14px',fontWeight:600 }}>Click to upload photo</div>
              <div style={{ fontSize:'12px',color:'#6b7280',marginTop:'2px' }}>JPG, PNG up to 5MB</div>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px' }}>
              <div><label style={lbl}>Full Name</label><input style={inp} value={profile.full_name} onChange={e=>setProfile(p=>({...p,full_name:e.target.value}))} /></div>
              <div><label style={lbl}>Phone</label><input style={inp} value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))} /></div>
              <div><label style={lbl}>Email</label><input style={inp} type="email" value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))} /></div>
              <div><label style={lbl}>Purok</label><input style={inp} value={profile.purok} placeholder="Purok 3" onChange={e=>setProfile(p=>({...p,purok:e.target.value}))} /></div>
            </div>
            <div><label style={lbl}>Barangay</label>
              <select style={{ ...inp,appearance:'none' }} value={profile.barangay} onChange={e=>setProfile(p=>({...p,barangay:e.target.value}))}>
                <option value="">Select barangay</option>
                {BARANGAYS.map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
            <div style={{ marginTop:'12px' }}><label style={lbl}>Bio</label>
              <textarea style={{ ...inp,minHeight:'70px',resize:'vertical' }} value={profile.bio} onChange={e=>setProfile(p=>({...p,bio:e.target.value}))} placeholder="Tell employers about yourself..." />
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'12px' }}>🛠️ Skills & Services</div>
            <div style={{ display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'12px' }}>
              {profile.skills.map(s=>(
                <div key={s} onClick={()=>removeSkill(s)} style={{ display:'flex',alignItems:'center',gap:'4px',background:'rgba(22,163,74,.1)',border:'1px solid rgba(22,163,74,.3)',borderRadius:'20px',padding:'5px 12px',fontSize:'12px',fontWeight:600,color:'#16a34a',cursor:'pointer' }}>{s} ×</div>
              ))}
            </div>
            <div style={{ display:'flex',gap:'8px' }}>
              <input style={{ ...inp,flex:1 }} placeholder="Add skill (e.g. Plumbing)" value={skillInput} onChange={e=>setSkillInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addSkill()} />
              <button onClick={addSkill} style={{ background:'#16a34a',color:'#fff',border:'none',padding:'10px 16px',borderRadius:'9px',fontSize:'13px',fontWeight:600,cursor:'pointer' }}>+ Add</button>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginTop:'12px' }}>
              <div><label style={lbl}>Years Experience</label><input style={inp} type="number" value={profile.years_experience} onChange={e=>setProfile(p=>({...p,years_experience:parseInt(e.target.value)||0}))} /></div>
              <div><label style={lbl}>Travel Distance</label>
                <select style={{ ...inp,appearance:'none' }} value={profile.travel_distance} onChange={e=>setProfile(p=>({...p,travel_distance:e.target.value}))}>
                  {['Within Barangay','Up to 1km','Up to 3km','Up to 5km','Anywhere'].map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display:'flex',flexDirection:'column',gap:'16px' }}>
          <div style={card}>
            <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'12px' }}>💰 Rate & Availability</div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'14px' }}>
              <div><label style={lbl}>Expected Rate (₱)</label><input style={inp} type="number" value={profile.expected_rate} onChange={e=>setProfile(p=>({...p,expected_rate:e.target.value}))} /></div>
              <div><label style={lbl}>Rate Type</label>
                <select style={{ ...inp,appearance:'none' }} value={profile.rate_type} onChange={e=>setProfile(p=>({...p,rate_type:e.target.value}))}>
                  {['Daily','Hourly','Per Service','Monthly'].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px' }}>
              <Toggle on={profile.negotiable} onToggle={()=>setProfile(p=>({...p,negotiable:!p.negotiable}))} />
              <div style={{ fontSize:'13px',fontWeight:500 }}>Open to Negotiation</div>
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
              <Toggle on={profile.is_available} onToggle={()=>setProfile(p=>({...p,is_available:!p.is_available}))} />
              <div><div style={{ fontSize:'13px',fontWeight:500 }}>Currently Available for Work</div><div style={{ fontSize:'12px',color:'#6b7280' }}>Employers can see and contact you</div></div>
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'12px' }}>📅 Weekly Availability</div>
            <label style={lbl}>Working Days</label>
            <div style={{ display:'flex',gap:'6px',marginBottom:'14px' }}>
              {ALL_DAYS.map(d => {
                const on = profile.work_days.includes(d)
                return <div key={d} onClick={()=>toggleDay(d)} style={{ width:'36px',height:'36px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:600,border:`1.5px solid ${on?'#16a34a':'#e2e8e2'}`,color:on?'#fff':'#6b7280',background:on?'#16a34a':'transparent',cursor:'pointer' }}>{d}</div>
              })}
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px' }}>
              <div><label style={lbl}>Start Time</label><input style={inp} type="time" value={profile.work_start} onChange={e=>setProfile(p=>({...p,work_start:e.target.value}))} /></div>
              <div><label style={lbl}>End Time</label><input style={inp} type="time" value={profile.work_end} onChange={e=>setProfile(p=>({...p,work_end:e.target.value}))} /></div>
            </div>
          </div>

          <button onClick={save} disabled={saving} style={{ padding:'12px',background:'#16a34a',color:'#fff',border:'none',borderRadius:'10px',fontWeight:700,fontSize:'14px',cursor:'pointer' }}>
            {saving ? 'Saving...' : '💾 Save Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}