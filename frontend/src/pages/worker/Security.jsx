import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/axios'

export default function Security() {
  const { logout } = useAuth()
  const navigate   = useNavigate()
  const [profile, setProfile] = useState(null)
  const [pwForm,  setPwForm]  = useState({ current_password:'', password:'', password_confirmation:'' })
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState({ type:'', text:'' })

  useEffect(() => {
    api.get('/worker/profile').then(r => {
      const p = r.data.worker_profile ?? {}
      setProfile({ show_profile: p.show_profile??true, allow_location: p.allow_location??true, receive_alerts: p.receive_alerts??true, two_factor: p.two_factor??false })
    })
  }, [])

  const flash       = (type, text) => { setMsg({ type, text }); setTimeout(()=>setMsg({type:'',text:''}),3000) }
  const savePrivacy = async () => { setSaving(true); try { await api.put('/worker/profile', profile); flash('success','Privacy settings saved.') } catch { flash('error','Failed to save.') } finally { setSaving(false) } }
  const changePw    = async () => {
    if (!pwForm.password || pwForm.password!==pwForm.password_confirmation) { flash('error','Passwords do not match.'); return }
    setSaving(true)
    try { await api.put('/worker/profile', pwForm); flash('success','Password changed.'); setPwForm({ current_password:'', password:'', password_confirmation:'' }) }
    catch (e) { flash('error', e.response?.data?.message ?? 'Failed to change password.') }
    finally { setSaving(false) }
  }

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{ position:'relative',width:'40px',height:'22px',flexShrink:0,cursor:'pointer' }}>
      <div style={{ position:'absolute',inset:0,background:on?'#16a34a':'#e2e8e2',borderRadius:'20px',transition:'background .25s' }} />
      <div style={{ position:'absolute',width:'16px',height:'16px',top:'3px',left:on?'21px':'3px',background:'#fff',borderRadius:'50%',transition:'left .25s' }} />
    </div>
  )

  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2',padding:'24px',marginBottom:'16px',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }
  const inp  = { width:'100%',padding:'10px 14px',border:'1.5px solid #e2e8e2',borderRadius:'9px',fontSize:'13px',background:'#fff',color:'#111827',outline:'none',boxSizing:'border-box' }
  const lbl  = { fontSize:'12px',fontWeight:600,color:'#6b7280',display:'block',marginBottom:'6px' }
  const row  = (title, desc, key) => (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 0',borderBottom:'1px solid #f1f5f1' }}>
      <div><div style={{ fontSize:'14px',fontWeight:500 }}>{title}</div><div style={{ fontSize:'12px',color:'#6b7280',marginTop:'2px' }}>{desc}</div></div>
      {profile && <Toggle on={profile[key]} onToggle={()=>setProfile(p=>({...p,[key]:!p[key]}))} />}
    </div>
  )

  return (
    <div style={{ padding:'28px',maxWidth:'680px' }}>
      {msg.text && <div style={{ background:msg.type==='success'?'rgba(22,163,74,.1)':'rgba(239,68,68,.1)',border:`1px solid ${msg.type==='success'?'rgba(22,163,74,.3)':'rgba(239,68,68,.3)'}`,borderRadius:'10px',padding:'12px 16px',marginBottom:'16px',color:msg.type==='success'?'#16a34a':'#ef4444',fontSize:'13px',fontWeight:500 }}>{msg.text}</div>}

      <div style={card}>
        <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'16px' }}>🔑 Change Password</div>
        <div style={{ display:'flex',flexDirection:'column',gap:'12px' }}>
          {[['current_password','Current Password'],['password','New Password'],['password_confirmation','Confirm New Password']].map(([key,label])=>(
            <div key={key}><label style={lbl}>{label}</label><input style={inp} type="password" value={pwForm[key]} onChange={e=>setPwForm(f=>({...f,[key]:e.target.value}))} /></div>
          ))}
        </div>
        <button onClick={changePw} disabled={saving} style={{ marginTop:'16px',padding:'10px 20px',background:'#16a34a',color:'#fff',border:'none',borderRadius:'9px',fontWeight:600,fontSize:'13px',cursor:'pointer' }}>Update Password</button>
      </div>

      {profile && (
        <div style={card}>
          <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'4px' }}>🔒 Privacy Settings</div>
          {row('Show Profile to Employers','Employers can find and view your profile','show_profile')}
          {row('Allow Location Access','Share your barangay for job matching','allow_location')}
          {row('Receive Job Alerts','Get notified about nearby job postings','receive_alerts')}
          {row('Two-Factor Authentication','Extra layer of login security','two_factor')}
          <button onClick={savePrivacy} disabled={saving} style={{ marginTop:'16px',padding:'10px 20px',background:'#16a34a',color:'#fff',border:'none',borderRadius:'9px',fontWeight:600,fontSize:'13px',cursor:'pointer' }}>{saving?'Saving...':'Save Privacy Settings'}</button>
        </div>
      )}

      <div style={{ ...card,border:'1px solid rgba(239,68,68,.3)',background:'rgba(239,68,68,.02)' }}>
        <div style={{ fontSize:'15px',fontWeight:700,color:'#ef4444',marginBottom:'16px' }}>⚠️ Danger Zone</div>
        <button onClick={async()=>{ await logout(); navigate('/login') }} style={{ padding:'10px 20px',background:'transparent',color:'#ef4444',border:'1px solid rgba(239,68,68,.4)',borderRadius:'9px',fontWeight:600,fontSize:'13px',cursor:'pointer' }}>Sign Out All Devices</button>
      </div>
    </div>
  )
}