import { useState, useEffect, useRef } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../contexts/AuthContext'

export default function EmployerProfile() {
  const [profile,   setProfile]   = useState({ household_name:'', phone:'', alt_phone:'', email:'', barangay:'', purok:'' })
  const [barangays, setBarangays] = useState([])
  const [preview,   setPreview]   = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg,       setMsg]       = useState({ type:'', text:'' })
  const photoRef = useRef()
  const { updateUser } = useAuth()

  useEffect(() => {
    Promise.all([
      api.get('/employer/profile'),
      api.get('/barangays'),
    ]).then(([pRes, bRes]) => {
      const p = pRes.data.employer_profile ?? {}
      setProfile({
        household_name: p.household_name ?? '',
        phone:          p.phone          ?? '',
        alt_phone:      p.alt_phone      ?? '',
        email:          p.email          ?? '',
        barangay:       p.barangay       ?? '',
        purok:          p.purok          ?? '',
      })
      if (p.photo_path) {
        setPreview(p.photo_path)
        updateUser({ photo: p.photo_path })  // ← sync photo to layout on load
      }
      setBarangays(bRes.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  const flash = (type, text) => {
    setMsg({ type, text })
    setTimeout(() => setMsg({ type:'', text:'' }), 3000)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/employer/profile', profile)
      updateUser({ name: profile.household_name })  // ← sync name to layout
      flash('success', 'Profile saved successfully.')
    } catch { flash('error', 'Failed to save. Please try again.') }
    finally { setSaving(false) }
  }

  const handlePhoto = async (e) => {
    const file = e.target.files[0]; if (!file) return
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setUploading(true)
    const form = new FormData(); form.append('photo', file)
    try {
      const res = await api.post('/employer/profile/photo', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setPreview(res.data.photo_url)
      updateUser({ photo: res.data.photo_url })  // ← sync photo to all avatars
      flash('success', 'Photo updated.')
    } catch {
      setPreview(preview)
      flash('error', 'Photo upload failed.')
    } finally { setUploading(false) }
  }

  const ini  = (name = 'E') => name.trim().charAt(0).toUpperCase()
  const card = { background:'#fff', borderRadius:'14px', border:'1px solid #e5e0d0', padding:'24px', marginBottom:'16px', boxShadow:'0 1px 3px rgba(0,0,0,.08)' }
  const inp  = { padding:'9px 12px', border:'1.5px solid #e5e0d0', borderRadius:'9px', fontSize:'13px', background:'#fffdf5', color:'#111827', outline:'none', width:'100%', boxSizing:'border-box' }
  const btn  = (bg,c,b) => ({ background:bg, color:c, border:b?`1px solid ${b}`:'none', padding:'8px 18px', borderRadius:'9px', fontSize:'13px', fontWeight:600, cursor:'pointer' })
  const lbl  = { fontSize:'12px', fontWeight:600, color:'#6b7280', marginBottom:'6px', display:'block' }

  if (loading) return <div style={{ padding:'28px', color:'#6b7280' }}>Loading profile...</div>

  return (
    <div style={{ padding:'28px', maxWidth:'900px', background:'#fffdf5', minHeight:'100vh' }}>

      {msg.text && (
        <div style={{ background:msg.type==='success'?'rgba(22,163,74,.1)':'rgba(239,68,68,.1)', border:`1px solid ${msg.type==='success'?'rgba(22,163,74,.3)':'rgba(239,68,68,.3)'}`, borderRadius:'10px', padding:'12px 16px', marginBottom:'16px', color:msg.type==='success'?'#16a34a':'#ef4444', fontSize:'13px', fontWeight:500 }}>
          {msg.text}
        </div>
      )}

      {/* Photo card */}
      <div style={card}>
        <div style={{ fontSize:'15px', fontWeight:700, marginBottom:'16px' }}>🏡 Employer Profile</div>
        <div style={{ display:'flex', alignItems:'center', gap:'20px' }}>

          {/* Avatar */}
          <div style={{ position:'relative', flexShrink:0 }}>
            <div style={{ width:'88px', height:'88px', borderRadius:'50%', background:'linear-gradient(135deg,#d97706,#b45309)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px', fontWeight:700, color:'#fff', overflow:'hidden', border:'3px solid #fff', boxShadow:'0 2px 12px rgba(0,0,0,.15)' }}>
              {preview
                ? <img src={preview} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover' }}
                    onError={e => { e.target.style.display='none' }} />
                : ini(profile.household_name)
              }
            </div>
            <div onClick={() => photoRef.current.click()} style={{ position:'absolute', bottom:'2px', right:'2px', width:'26px', height:'26px', borderRadius:'50%', background:'#d97706', border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:'13px' }} title="Change photo">
              📷
            </div>
          </div>

          <input type="file" accept="image/*" ref={photoRef} style={{ display:'none' }} onChange={handlePhoto} />

          <div>
            <div style={{ fontWeight:700, fontSize:'16px', marginBottom:'4px' }}>{profile.household_name || 'Your Household'}</div>
            <div style={{ fontSize:'13px', color:'#6b7280', marginBottom:'12px' }}>
              {profile.barangay || 'No barangay set'}{profile.purok ? ` · ${profile.purok}` : ''}
            </div>
            <button onClick={() => photoRef.current.click()} disabled={uploading} style={btn('#d97706','#fff')}>
              {uploading ? 'Uploading...' : '📷 Change Photo'}
            </button>
            <div style={{ fontSize:'11px', color:'#9ca3af', marginTop:'6px' }}>JPG, PNG up to 5MB</div>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div style={card}>
        <div style={{ fontSize:'15px', fontWeight:700, marginBottom:'16px' }}>📋 Household / Business Info</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
          <div><label style={lbl}>Household / Business Name</label>
            <input value={profile.household_name} onChange={e=>setProfile(p=>({...p,household_name:e.target.value}))} style={inp} placeholder="Juan dela Cruz Household" />
          </div>
          <div><label style={lbl}>Contact Number</label>
            <input value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))} style={inp} placeholder="09XX-XXX-XXXX" />
          </div>
          <div><label style={lbl}>Alt. Number</label>
            <input value={profile.alt_phone} onChange={e=>setProfile(p=>({...p,alt_phone:e.target.value}))} style={inp} placeholder="09XX-XXX-XXXX" />
          </div>
          <div><label style={lbl}>Email Address</label>
            <input value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))} type="email" style={inp} placeholder="email@example.com" />
          </div>
          <div>
            <label style={lbl}>Barangay</label>
            <select value={profile.barangay} onChange={e=>setProfile(p=>({...p,barangay:e.target.value}))} style={inp}>
              <option value="">Select barangay</option>
              {barangays.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Purok</label>
            <input value={profile.purok} onChange={e=>setProfile(p=>({...p,purok:e.target.value}))} placeholder="Purok 3" style={inp} />
          </div>
        </div>
        <div style={{ marginTop:'16px', display:'flex', gap:'10px' }}>
          <button style={btn('#d97706','#fff')} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
          <button style={btn('transparent','#6b7280','#e5e0d0')} onClick={() => window.location.reload()}>Cancel</button>
        </div>
      </div>
    </div>
  )
}