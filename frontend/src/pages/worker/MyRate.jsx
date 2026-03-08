export default function MyRate() {
  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2',padding:'24px',boxShadow:'0 1px 3px rgba(0,0,0,.08)',marginBottom:'16px' }
  const inp = { width:'100%',padding:'10px 14px',border:'1.5px solid #e2e8e2',borderRadius:'9px',fontSize:'14px',background:'#fff',color:'#111827',outline:'none' }
  const lbl = { fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',color:'#6b7280',display:'block',marginBottom:'6px' }
  const Toggle = ({on=true}) => (
    <div style={{ position:'relative',width:'40px',height:'22px',flexShrink:0,cursor:'pointer' }}>
      <div style={{ position:'absolute',inset:0,background:on?'#16a34a':'#e2e8e2',borderRadius:'20px' }} />
      <div style={{ position:'absolute',width:'16px',height:'16px',top:'3px',left:on?'21px':'3px',background:'#fff',borderRadius:'50%',transition:'.25s' }} />
    </div>
  )

  return (
    <div style={{ padding:'28px',maxWidth:'720px' }}>
      <div style={{ background:'linear-gradient(135deg,#16a34a,#15803d)',borderRadius:'14px',padding:'32px',textAlign:'center',color:'#fff',marginBottom:'24px' }}>
        <div style={{ fontSize:'13px',opacity:.85,marginBottom:'4px',textTransform:'uppercase',letterSpacing:'1px',fontWeight:600 }}>Your Expected Rate</div>
        <div style={{ fontSize:'56px',fontWeight:800,fontFamily:'Syne,sans-serif' }}>₱ 800</div>
        <div style={{ fontSize:'14px',opacity:.85,marginTop:'4px' }}>per day · Negotiable</div>
      </div>
      <div style={card}>
        <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'16px' }}>Rate Configuration</div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'16px' }}>
          <div><label style={lbl}>Expected Salary (₱)</label><input style={inp} type="number" defaultValue="800" /></div>
          <div><label style={lbl}>Rate Type</label>
            <select style={{ ...inp,appearance:'none' }}><option>Daily</option><option>Hourly</option><option>Per Service</option></select>
          </div>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
          <Toggle on={true} />
          <div><div style={{ fontSize:'13px',fontWeight:500 }}>Open to Negotiation</div><div style={{ fontSize:'12px',color:'#6b7280' }}>Employers can propose a different rate</div></div>
        </div>
      </div>
      <div style={{ background:'rgba(22,163,74,.08)',borderRadius:'10px',padding:'14px',border:'1px solid rgba(22,163,74,.3)',fontSize:'14px',fontWeight:600 }}>
        💡 Your rate is visible to employers when they view your profile or job applications.
      </div>
    </div>
  )
}
