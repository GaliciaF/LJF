import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function EmployerSecurity() {
  const [toggles, setToggles] = useState({ show_profile:true, allow_location:true, receive_alerts:true, two_factor:false })
  const [loading, setLoading] = useState(true)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    api.get('/employer/profile').then(res => {
      const p = res.data.employer_profile ?? {}
      setToggles({ show_profile:p.show_profile??true, allow_location:p.allow_location??true, receive_alerts:p.receive_alerts??true, two_factor:p.two_factor??false })
    }).finally(()=>setLoading(false))
  }, [])

  const handleToggle = async (key) => {
    const updated = { ...toggles, [key]: !toggles[key] }
    setToggles(updated)
    await api.put('/employer/profile', updated)
    setSaved(true); setTimeout(()=>setSaved(false),2000)
  }

  const card   = { background:'#fff',borderRadius:'14px',border:'1px solid #e5e0d0',padding:'24px',marginBottom:'16px',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }
  const Toggle = ({ k, label, desc }) => (
    <div style={{ display:'flex',alignItems:'center',gap:'14px',padding:'14px 0',borderBottom:'1px solid #f3f4f6' }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:'14px',fontWeight:600,color:'#111827' }}>{label}</div>
        <div style={{ fontSize:'12px',color:'#6b7280',marginTop:'2px' }}>{desc}</div>
      </div>
      <div onClick={()=>handleToggle(k)} style={{ width:'40px',height:'22px',borderRadius:'11px',background:toggles[k]?'#d97706':'#e5e0d0',cursor:'pointer',position:'relative',transition:'background .2s',flexShrink:0 }}>
        <div style={{ position:'absolute',top:'3px',left:toggles[k]?'21px':'3px',width:'16px',height:'16px',borderRadius:'50%',background:'#fff',transition:'left .2s' }} />
      </div>
    </div>
  )

  if (loading) return <div style={{ padding:'28px',color:'#6b7280' }}>Loading...</div>

  return (
    <div style={{ padding:'28px',maxWidth:'700px',background:'#fffdf5',minHeight:'100vh' }}>
      {saved && <div style={{ background:'rgba(22,163,74,.1)',border:'1px solid rgba(22,163,74,.3)',borderRadius:'10px',padding:'12px 16px',marginBottom:'16px',color:'#16a34a',fontSize:'13px',fontWeight:500 }}>✓ Settings saved.</div>}
      <div style={card}>
        <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'4px' }}>🔒 Privacy Settings</div>
        <div style={{ fontSize:'12px',color:'#6b7280',marginBottom:'14px' }}>Control how workers and the platform interact with your account.</div>
        <Toggle k="show_profile"   label="Show Profile to Workers"    desc="Workers can see your household info and job history" />
        <Toggle k="allow_location" label="Allow Location Services"    desc="Enable nearby worker matching for your barangay" />
        <Toggle k="receive_alerts" label="Receive Application Alerts" desc="Get SMS when workers apply to your jobs" />
        <Toggle k="two_factor"     label="Two-Factor Authentication"  desc="Require OTP on every login" />
      </div>
    </div>
  )
}
