import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function IDVerifications() {
  const [verifications, setVerifications] = useState([])
  const [loading, setLoading]             = useState(true)

  useEffect(() => {
    api.get('/admin/verifications', { params: { status: 'pending' } })
      .then(res => setVerifications(res.data.data ?? res.data))
      .finally(() => setLoading(false))
  }, [])

  const handle = async (id, action, reason=null) => {
    await api.patch(`/admin/verifications/${id}`, { action, rejection_reason: reason })
    setVerifications(p => p.filter(v => v.id !== id))
  }

  const tag  = (bg,c,b) => ({ display:'inline-flex',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:bg,color:c,border:`1px solid ${b}` })
  const btn  = (bg,c,b) => ({ background:bg,color:c,border:b?`1px solid ${b}`:'none',padding:'7px 14px',borderRadius:'8px',fontSize:'12px',fontWeight:600,cursor:'pointer' })
  const ava  = (sz=44) => ({ width:sz,height:sz,borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#4c1d95)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:sz*.36,fontWeight:700,color:'#fff',flexShrink:0 })
  const ini  = (n='') => n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  const card = { background:'#161525',borderRadius:'14px',border:'1px solid #2a2940',padding:'20px',marginBottom:'12px' }

  if (loading) return <div style={{ padding:'28px',color:'#8b8aad' }}>Loading verifications...</div>

  return (
    <div style={{ padding:'28px',maxWidth:'900px' }}>
      <div style={{ background:'rgba(251,191,36,.08)',border:'1px solid rgba(251,191,36,.3)',borderRadius:'10px',padding:'14px 16px',marginBottom:'20px',fontSize:'13px',color:'#fbbf24',fontWeight:500 }}>
        🪪 Review each ID carefully before approving. Blurry or incomplete uploads should be rejected or sent back.
      </div>
      {verifications.length === 0
        ? <div style={{ ...card,textAlign:'center',color:'#5a5978',padding:'40px' }}>No pending verifications. ✅</div>
        : verifications.map(v => (
          <div key={v.id} style={card}>
            <div style={{ display:'flex',alignItems:'flex-start',gap:'14px' }}>
              <div style={ava()}>{ini(v.worker?.name)}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'4px' }}>
                  <div style={{ fontWeight:700,fontSize:'15px',color:'#f0eeff' }}>{v.worker?.name}</div>
                  <span style={tag('rgba(124,58,237,.12)','#a78bfa','rgba(124,58,237,.3)')}>{v.id_type}</span>
                  {!v.back_path && <span style={tag('rgba(248,113,113,.12)','#f87171','rgba(248,113,113,.3)')}>⚠ Front only</span>}
                </div>
                <div style={{ fontSize:'12px',color:'#8b8aad',marginBottom:'12px' }}>
                  Submitted: {new Date(v.created_at).toLocaleDateString('en-PH',{month:'long',day:'numeric',year:'numeric'})}
                </div>
                <div style={{ display:'flex',gap:'10px',marginBottom:'14px' }}>
                  <div style={{ width:'90px',height:'56px',background:'#1e1d30',border:'1px solid #2a2940',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',cursor:'pointer' }}>🪪</div>
                  {v.back_path
                    ? <div style={{ width:'90px',height:'56px',background:'#1e1d30',border:'1px solid #2a2940',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',cursor:'pointer' }}>🪪</div>
                    : <div style={{ width:'90px',height:'56px',background:'rgba(248,113,113,.06)',border:'1px dashed rgba(248,113,113,.4)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',color:'#f87171',textAlign:'center',padding:'4px' }}>No back ID</div>
                  }
                </div>
                <div style={{ display:'flex',gap:'8px',flexWrap:'wrap' }}>
                  <button style={btn('rgba(34,197,94,.12)','#22c55e','rgba(34,197,94,.3)')} onClick={()=>handle(v.id,'approve')}>✓ Approve</button>
                  <button style={btn('rgba(248,113,113,.12)','#f87171','rgba(248,113,113,.3)')} onClick={()=>handle(v.id,'reject','ID unclear or invalid')}>✕ Reject</button>
                  {!v.back_path && <button style={btn('rgba(251,191,36,.12)','#fbbf24','rgba(251,191,36,.3)')} onClick={()=>handle(v.id,'request_back')}>Request Back Side</button>}
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}
