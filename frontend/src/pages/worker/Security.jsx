import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Preferences } from '@capacitor/preferences'
import api from '../../api/axios'

export default function Security() {
  const { logout } = useAuth()
  const navigate   = useNavigate()
  const [pwForm,  setPwForm]  = useState({ current_password:'', password:'', password_confirmation:'' })
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState({ type:'', text:'' })
  const [show,    setShow]    = useState({ current_password:false, password:false, password_confirmation:false })

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  const toggleShow = (key) => setShow(s => ({ ...s, [key]: !s[key] }))

  const flash    = (type, text) => { setMsg({ type, text }); setTimeout(()=>setMsg({type:'',text:''}),3000) }
  const changePw = async () => {
    if (!pwForm.password || pwForm.password !== pwForm.password_confirmation) {
      flash('error', 'Passwords do not match.'); return
    }
    setSaving(true)
    try {
      const res = await api.put('/worker/profile', pwForm)
      if (res.data.token) {
        await Preferences.set({ key: 'token', value: res.data.token })
      }
      flash('success', 'Password changed. All other devices have been signed out.')
      setPwForm({ current_password: '', password: '', password_confirmation: '' })
    } catch (e) {
      flash('error', e.response?.data?.message ?? 'Failed to change password.')
    } finally { setSaving(false) }
  }

  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2',padding: isMobile ? '16px' : '24px',marginBottom:'16px',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }
  const inp  = { width:'100%',padding:'10px 40px 10px 14px',border:'1.5px solid #e2e8e2',borderRadius:'9px',fontSize:'13px',background:'#fff',color:'#111827',outline:'none',boxSizing:'border-box' }
  const lbl  = { fontSize:'12px',fontWeight:600,color:'#6b7280',display:'block',marginBottom:'6px' }

  const EyeIcon = ({ visible }) => visible ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )

  return (
    <div style={{ padding: isMobile ? '16px' : '28px', maxWidth:'680px' }}>
      {msg.text && (
        <div style={{ background:msg.type==='success'?'rgba(22,163,74,.1)':'rgba(239,68,68,.1)',border:`1px solid ${msg.type==='success'?'rgba(22,163,74,.3)':'rgba(239,68,68,.3)'}`,borderRadius:'10px',padding:'12px 16px',marginBottom:'16px',color:msg.type==='success'?'#16a34a':'#ef4444',fontSize:'13px',fontWeight:500 }}>
          {msg.text}
        </div>
      )}

      <div style={card}>
        <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'16px' }}>🔑 Change Password</div>
        <div style={{ display:'flex',flexDirection:'column',gap:'12px' }}>
          {[['current_password','Current Password'],['password','New Password'],['password_confirmation','Confirm New Password']].map(([key,label])=>(
            <div key={key}>
              <label style={lbl}>{label}</label>
              <div style={{ position:'relative' }}>
                <input
                  style={inp}
                  type={show[key] ? 'text' : 'password'}
                  value={pwForm[key]}
                  onChange={e=>setPwForm(f=>({...f,[key]:e.target.value}))}
                />
                <button
                  type="button"
                  onClick={() => toggleShow(key)}
                  style={{ position:'absolute',right:'10px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#9ca3af',padding:'2px',display:'flex',alignItems:'center' }}
                >
                  <EyeIcon visible={show[key]} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={changePw} disabled={saving} style={{ marginTop:'16px',padding:'10px 20px',background:'#16a34a',color:'#fff',border:'none',borderRadius:'9px',fontWeight:600,fontSize:'13px',cursor:'pointer',width: isMobile ? '100%' : 'auto' }}>
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </div>

      <div style={{ ...card,border:'1px solid rgba(239,68,68,.3)',background:'rgba(239,68,68,.02)' }}>
        <div style={{ fontSize:'15px',fontWeight:700,color:'#ef4444',marginBottom:'16px' }}>⚠️ Danger Zone</div>
        <button onClick={async()=>{ await logout(); navigate('/login') }} style={{ padding:'10px 20px',background:'transparent',color:'#ef4444',border:'1px solid rgba(239,68,68,.4)',borderRadius:'9px',fontWeight:600,fontSize:'13px',cursor:'pointer',width: isMobile ? '100%' : 'auto' }}>
          Sign Out All Devices
        </button>
      </div>
    </div>
  )
}