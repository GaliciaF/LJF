import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../contexts/AuthContext'

const PUROK_OPTIONS    = ['Purok 1','Purok 2','Purok 3','Purok 4','Purok 5','Purok 6','Purok 7']
const BARANGAY_OPTIONS = ["Banlasan","Bongbong","Catoogan","Guinobatan","Hinlayagan Ilaud","Hinlayagan Ilaya","Kauswagan","Kinan-oan","La Union","La Victoria","Mabuhay Cabigohan","Mahagbu","Manuel M. Roxas","Poblacion","San Isidro","San Vicente","Santo Tomas","Soledad","Tagum Norte","Tagum Sur"]

export default function EmployerProfile() {
  const [profile,   setProfile]   = useState({ household_name:'', phone:'', alt_phone:'', email:'', barangay:'', purok:'' })
  const [preview,   setPreview]   = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg,       setMsg]       = useState({ type:'', text:'' })
  const [isMobile,  setIsMobile]  = useState(window.innerWidth < 768)
  const photoRef = useRef()
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    api.get('/employer/profile').then((pRes) => {
      const userData=pRes.data, p=userData.employer_profile??{}
      setProfile({ household_name:p.household_name??'', phone:p.phone??'', alt_phone:p.alt_phone??'', email:userData.email??'', barangay:p.barangay??'', purok:p.purok??'' })
      if (p.photo_path) { const url=p.photo_path+'?t='+Date.now(); setPreview(url); updateUser({ photo:url }) }
    }).finally(() => setLoading(false))
  }, [])

  const flash = (type, text) => { setMsg({ type, text }); setTimeout(()=>setMsg({type:'',text:''}),3000) }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await api.put('/employer/profile', profile)
      const updatedUser=res.data?.user
      if (updatedUser) { updateUser({ name:updatedUser.name, photo:updatedUser.employer_profile?.photo_path?updatedUser.employer_profile.photo_path+'?t='+Date.now():user?.photo }) }
      else { updateUser({ name:profile.household_name }) }
      flash('success','Profile saved successfully.')
    } catch { flash('error','Failed to save. Please try again.') }
    finally { setSaving(false) }
  }

  const handlePhoto = async (e) => {
    const file=e.target.files[0]; if(!file) return
    setPreview(URL.createObjectURL(file)); setUploading(true)
    const form=new FormData(); form.append('photo',file)
    try {
      const res=await api.post('/employer/profile/photo',form,{headers:{'Content-Type':'multipart/form-data'}})
      const freshUrl=res.data.photo_url+'?t='+Date.now()
      setPreview(freshUrl); updateUser({ photo:freshUrl }); flash('success','Photo updated.')
    } catch { setPreview(user?.photo??null); flash('error','Photo upload failed.') }
    finally { setUploading(false); e.target.value='' }
  }

  const ini = (name='E') => name.trim().charAt(0).toUpperCase()
  const card = { background:'rgba(255,255,255,0.88)',backdropFilter:'blur(12px)',borderRadius:'14px',border:'1.5px solid #fde9b8',padding: isMobile?'16px':'24px',marginBottom:'16px',boxShadow:'0 2px 12px rgba(245,158,11,0.07)' }
  const inp  = { padding:'9px 12px',border:'1.5px solid #fde9b8',borderRadius:'9px',fontSize:'13px',background:'#fffbf0',color:'#2d2006',outline:'none',width:'100%',boxSizing:'border-box' }
  const btn  = (bg,col,border) => ({ background:bg,color:col,border:border?`1px solid ${border}`:'none',padding:'8px 18px',borderRadius:'9px',fontSize:'13px',fontWeight:600,cursor:'pointer' })
  const lbl  = { fontSize:'12px',fontWeight:600,color:'#a08040',marginBottom:'6px',display:'block' }

  if (loading) return <div style={{ padding:'28px',color:'#a08040' }}>Loading profile...</div>

  return (
    <div style={{ padding: isMobile?'14px':'28px', maxWidth:'900px', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      {msg.text && (
        <div style={{ background:msg.type==='success'?'rgba(22,163,74,.1)':'rgba(239,68,68,.1)',border:`1px solid ${msg.type==='success'?'rgba(22,163,74,.3)':'rgba(239,68,68,.3)'}`,borderRadius:'10px',padding:'12px 16px',marginBottom:'16px',color:msg.type==='success'?'#16a34a':'#e85d75',fontSize:'13px',fontWeight:500 }}>
          {msg.text}
        </div>
      )}

      {/* Photo card */}
      <div style={card}>
        <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'16px',color:'#2d2006' }}>🏡 Employer Profile</div>
        <div style={{ display:'flex',alignItems: isMobile?'flex-start':'center',gap:'20px',flexDirection: isMobile?'column':'row' }}>
          <div style={{ position:'relative',flexShrink:0 }}>
            <div onClick={() => navigate('/employer/profile')} title="Go to profile"
              style={{ width: isMobile?'72px':'88px',height: isMobile?'72px':'88px',borderRadius:'50%',background:'linear-gradient(135deg,#fbbf24,#f59e0b,#d97706)',display:'flex',alignItems:'center',justifyContent:'center',fontSize: isMobile?'26px':'32px',fontWeight:700,color:'#fff',overflow:'hidden',border:'3px solid rgba(245,158,11,.3)',boxShadow:'0 0 0 4px rgba(245,158,11,.1)',cursor:'pointer' }}>
              {preview ? <img key={preview} src={preview} alt="Profile" style={{ width:'100%',height:'100%',objectFit:'cover' }} onError={e=>{e.target.style.display='none'}} /> : ini(profile.household_name)}
            </div>
            <div onClick={e=>{e.stopPropagation();photoRef.current.click()}}
              style={{ position:'absolute',bottom:'2px',right:'2px',width:'26px',height:'26px',borderRadius:'50%',background:'#f59e0b',border:'2px solid #fff',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:'13px',boxShadow:'0 1px 4px rgba(0,0,0,.15)' }}>📷</div>
          </div>
          <input type="file" accept="image/*" ref={photoRef} style={{ display:'none' }} onChange={handlePhoto} />
          <div>
            <div style={{ fontWeight:700,fontSize:'16px',color:'#2d2006' }}>{profile.household_name||'Your Household'}</div>
            <div style={{ fontSize:'13px',color:'#a08040',marginBottom:'12px' }}>{profile.barangay||'No barangay set'}{profile.purok?` · ${profile.purok}`:''}</div>
            <button onClick={() => photoRef.current.click()} disabled={uploading} style={btn('#f59e0b','#fff')}>
              {uploading?'Uploading...':'📷 Change Photo'}
            </button>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div style={card}>
        <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'16px',color:'#2d2006' }}>📋 Household / Business Info</div>
        <div style={{ display:'grid',gridTemplateColumns: isMobile?'1fr':'1fr 1fr',gap:'14px' }}>
          <div><label style={lbl}>Household / Business Name</label><input value={profile.household_name} onChange={e=>setProfile(p=>({...p,household_name:e.target.value}))} style={inp} /></div>
          <div><label style={lbl}>Contact Number</label><input value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))} style={inp} /></div>
          <div><label style={lbl}>Alt. Number</label><input value={profile.alt_phone} onChange={e=>setProfile(p=>({...p,alt_phone:e.target.value}))} style={inp} /></div>
          <div><label style={lbl}>Email Address</label><input value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))} style={inp} /></div>
          <div><label style={lbl}>Barangay</label>
            <select value={profile.barangay} onChange={e=>setProfile(p=>({...p,barangay:e.target.value,purok:''}))} style={inp}>
              <option value="">Select barangay</option>
              {BARANGAY_OPTIONS.map(b=><option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Purok</label>
            <input list="purok-options" value={profile.purok} onChange={e=>setProfile(p=>({...p,purok:e.target.value}))} placeholder="Select or type purok..." style={inp} />
            <datalist id="purok-options">{PUROK_OPTIONS.map(opt=><option key={opt} value={opt} />)}</datalist>
          </div>
        </div>
        <div style={{ marginTop:'16px',display:'flex',gap:'10px',flexWrap:'wrap' }}>
          <button style={btn('#f59e0b','#fff')} onClick={handleSave} disabled={saving}>{saving?'Saving...':'💾 Save Changes'}</button>
          <button style={btn('transparent','#a08040','#fde9b8')} onClick={() => window.location.reload()}>Cancel</button>
        </div>
      </div>
    </div>
  )
}