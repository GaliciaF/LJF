import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function MyRate() {
  const [form,    setForm]    = useState({ expected_rate:'', rate_type:'Daily', negotiable:true })
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState({ type:'', text:'' })

  useEffect(() => {
    api.get('/worker/profile').then(r => {
      const p = r.data.worker_profile ?? {}
      setForm({ expected_rate: p.expected_rate ?? '', rate_type: p.rate_type ?? 'Daily', negotiable: p.negotiable ?? true })
    }).finally(() => setLoading(false))
  }, [])

  const flash = (type, text) => { setMsg({ type, text }); setTimeout(()=>setMsg({type:'',text:''}),2500) }
  const save  = async () => { setSaving(true); try { await api.put('/worker/profile', form); flash('success','Rate updated.') } catch { flash('error','Failed to save.') } finally { setSaving(false) } }

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{ position:'relative',width:'40px',height:'22px',flexShrink:0,cursor:'pointer' }}>
      <div style={{ position:'absolute',inset:0,background:on?'#16a34a':'#e2e8e2',borderRadius:'20px',transition:'background .25s' }} />
      <div style={{ position:'absolute',width:'16px',height:'16px',top:'3px',left:on?'21px':'3px',background:'#fff',borderRadius:'50%',transition:'left .25s' }} />
    </div>
  )

  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2',padding:'24px',boxShadow:'0 1px 3px rgba(0,0,0,.08)',marginBottom:'16px' }
  const inp  = { width:'100%',padding:'10px 14px',border:'1.5px solid #e2e8e2',borderRadius:'9px',fontSize:'14px',background:'#fff',color:'#111827',outline:'none',boxSizing:'border-box' }
  const lbl  = { fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',color:'#6b7280',display:'block',marginBottom:'6px' }

  if (loading) return <div style={{ padding:'28px',color:'#6b7280' }}>Loading rate info...</div>

  return (
    <div style={{ padding:'28px',maxWidth:'720px' }}>
      {msg.text && <div style={{ background:msg.type==='success'?'rgba(22,163,74,.1)':'rgba(239,68,68,.1)',border:`1px solid ${msg.type==='success'?'rgba(22,163,74,.3)':'rgba(239,68,68,.3)'}`,borderRadius:'10px',padding:'12px 16px',marginBottom:'16px',color:msg.type==='success'?'#16a34a':'#ef4444',fontSize:'13px',fontWeight:500 }}>{msg.text}</div>}
      <div style={{ background:'linear-gradient(135deg,#16a34a,#15803d)',borderRadius:'14px',padding:'32px',textAlign:'center',color:'#fff',marginBottom:'24px' }}>
        <div style={{ fontSize:'13px',opacity:.85,marginBottom:'4px',textTransform:'uppercase',letterSpacing:'1px',fontWeight:600 }}>Your Expected Rate</div>
        <div style={{ fontSize:'56px',fontWeight:800,fontFamily:'Syne,sans-serif' }}>{form.expected_rate ? `₱${parseFloat(form.expected_rate).toLocaleString()}` : '₱ —'}</div>
        <div style={{ fontSize:'14px',opacity:.85,marginTop:'4px' }}>per {form.rate_type.toLowerCase().replace('per service','service')} · {form.negotiable?'Negotiable':'Fixed Rate'}</div>
      </div>
      <div style={card}>
        <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'16px' }}>Rate Configuration</div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'16px' }}>
          <div><label style={lbl}>Expected Salary (₱)</label><input style={inp} type="number" value={form.expected_rate} onChange={e=>setForm(f=>({...f,expected_rate:e.target.value}))} placeholder="e.g. 800" /></div>
          <div><label style={lbl}>Rate Type</label>
            <select style={{ ...inp,appearance:'none' }} value={form.rate_type} onChange={e=>setForm(f=>({...f,rate_type:e.target.value}))}>
              {['Daily','Hourly','Per Service','Monthly'].map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'20px' }}>
          <Toggle on={form.negotiable} onToggle={()=>setForm(f=>({...f,negotiable:!f.negotiable}))} />
          <div><div style={{ fontSize:'13px',fontWeight:500 }}>Open to Negotiation</div><div style={{ fontSize:'12px',color:'#6b7280' }}>Employers can propose a different rate</div></div>
        </div>
        <button onClick={save} disabled={saving} style={{ width:'100%',padding:'12px',background:'#16a34a',color:'#fff',border:'none',borderRadius:'10px',fontWeight:700,fontSize:'14px',cursor:'pointer' }}>{saving?'Saving...':'💾 Save Rate'}</button>
      </div>
      <div style={{ background:'rgba(22,163,74,.08)',borderRadius:'10px',padding:'14px',border:'1px solid rgba(22,163,74,.3)',fontSize:'13px',fontWeight:500,color:'#166534' }}>
        💡 Your rate is visible to employers when they browse workers or view your application.
      </div>
    </div>
  )
}