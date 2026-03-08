import { useState } from 'react'
export default function FileReport() {
  const [selected,setSelected] = useState(1)
  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2',padding:'24px',marginBottom:'16px',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }
  const ava = (bg) => ({ width:'44px',height:'44px',borderRadius:'50%',background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',fontWeight:700,color:'#fff',flexShrink:0 })
  const reasons = [
    { ico:'⛔',t:'No-show / Ghosted after accepting job' },
    { ico:'⚠️',t:'Fake profile or scammer' },
    { ico:'🤬',t:'Rude or threatening behavior' },
    { ico:'💸',t:'Payment dispute or fraud' },
    { ico:'📋',t:'Other' },
  ]

  return (
    <div style={{ padding:'28px',maxWidth:'680px' }}>
      <div style={card}>
        <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'14px' }}>Reporting</div>
        <div style={{ display:'flex',gap:'14px',alignItems:'center' }}>
          <div style={ava('linear-gradient(135deg,#3b82f6,#1d4ed8)')}>MR</div>
          <div><div style={{ fontWeight:700,fontSize:'15px' }}>Marco Reyes</div><div style={{ fontSize:'12px',color:'#6b7280' }}>Worker · ⭐ 4.5 · Brgy. San Jose</div></div>
        </div>
      </div>
      <div style={card}>
        <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'14px' }}>Select Report Reason</div>
        <div style={{ display:'flex',flexDirection:'column',gap:'8px' }}>
          {reasons.map(({ico,t},i)=>(
            <div key={t} onClick={()=>setSelected(i)} style={{ display:'flex',alignItems:'center',gap:'12px',padding:'12px 14px',border:`1.5px solid ${selected===i?'#16a34a':'#e2e8e2'}`,borderRadius:'10px',cursor:'pointer',background:selected===i?'rgba(22,163,74,.06)':'transparent' }}>
              <span style={{ fontSize:'20px' }}>{ico}</span>
              <span style={{ fontSize:'14px',fontWeight:500 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={card}>
        <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'14px' }}>Complaint Details</div>
        <textarea style={{ width:'100%',padding:'10px 14px',border:'1.5px solid #e2e8e2',borderRadius:'9px',fontSize:'14px',minHeight:'120px',resize:'vertical',outline:'none',marginBottom:'12px' }} defaultValue="This user had a fake profile photo and false credentials. After I accepted their application, they never showed up and stopped responding." />
        <div style={{ fontSize:'13px',color:'#6b7280' }}>Your report is confidential. Admins will review within 24 hours.</div>
      </div>
      <button style={{ background:'rgba(239,68,68,.1)',color:'#ef4444',border:'1px solid rgba(239,68,68,.3)',padding:'12px',borderRadius:'9px',fontSize:'13px',fontWeight:600,cursor:'pointer',width:'100%' }}>🚨 Submit Report</button>
    </div>
  )
}
