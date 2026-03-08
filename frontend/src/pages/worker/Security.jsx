export default function Security() {
  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2',padding:'24px',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }
  const btn = (bg,c,b) => ({ background:bg,color:c,border:b?`1px solid ${b}`:'none',padding:'5px 12px',borderRadius:'8px',fontSize:'12px',fontWeight:600,cursor:'pointer' })
  const tag = (bg,c,b) => ({ display:'inline-flex',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:bg,color:c,border:`1px solid ${b}` })
  const ava = (bg,sz=32) => ({ width:sz,height:sz,borderRadius:'50%',background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:sz*.4,fontWeight:700,color:'#fff',flexShrink:0 })
  const Toggle = ({on}) => (
    <div style={{ position:'relative',width:'40px',height:'22px',flexShrink:0,cursor:'pointer' }}>
      <div style={{ position:'absolute',inset:0,background:on?'#16a34a':'#e2e8e2',borderRadius:'20px' }} />
      <div style={{ position:'absolute',width:'16px',height:'16px',top:'3px',left:on?'21px':'3px',background:'#fff',borderRadius:'50%',transition:'.25s' }} />
    </div>
  )
  const row = { display:'flex',alignItems:'center',gap:'12px',padding:'12px 0',borderBottom:'1px solid #e2e8e2' }

  return (
    <div style={{ padding:'28px',maxWidth:'1280px' }}>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px' }}>
        <div style={{ display:'flex',flexDirection:'column',gap:'16px' }}>
          <div style={card}>
            <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'16px' }}>🔐 Account Security</div>
            <div style={row}>
              <div style={{ width:'36px',height:'36px',borderRadius:'10px',background:'rgba(22,163,74,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',flexShrink:0 }}>📱</div>
              <div style={{ flex:1 }}><div style={{ fontWeight:600,fontSize:'14px' }}>Phone Verification</div><div style={{ fontSize:'12px',color:'#6b7280' }}>0912-345-6789 · Verified</div></div>
              <span style={tag('rgba(22,163,74,.1)','#16a34a','rgba(22,163,74,.25)')}>✓ Verified</span>
            </div>
            <div style={row}>
              <div style={{ width:'36px',height:'36px',borderRadius:'10px',background:'rgba(59,130,246,.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',flexShrink:0 }}>✉️</div>
              <div style={{ flex:1 }}><div style={{ fontWeight:600,fontSize:'14px' }}>Email Verification</div><div style={{ fontSize:'12px',color:'#6b7280' }}>juan@email.com · Not verified</div></div>
              <button style={btn('transparent','#6b7280','#e2e8e2')}>Verify</button>
            </div>
            <div style={{ ...row,borderBottom:'none' }}>
              <div style={{ width:'36px',height:'36px',borderRadius:'10px',background:'rgba(139,92,246,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',flexShrink:0 }}>🆔</div>
              <div style={{ flex:1 }}><div style={{ fontWeight:600,fontSize:'14px' }}>ID Verification</div><div style={{ fontSize:'12px',color:'#6b7280' }}>Upload gov't ID for trust badge</div></div>
              <button style={btn('#16a34a','#fff')}>Upload ID</button>
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'16px' }}>🚫 Blocked Users</div>
            <div style={{ display:'flex',alignItems:'center',gap:'10px',padding:'8px 0' }}>
              <div style={ava('linear-gradient(135deg,#ef4444,#dc2626)')}>RL</div>
              <div style={{ flex:1 }}><div style={{ fontSize:'13px',fontWeight:600 }}>Rodel Lim</div><div style={{ fontSize:'11px',color:'#6b7280' }}>Blocked on Feb 10, 2025</div></div>
              <button style={btn('transparent','#6b7280','#e2e8e2')}>Unblock</button>
            </div>
            <button style={{ background:'transparent',border:'1px solid #e2e8e2',padding:'8px',borderRadius:'9px',fontSize:'13px',color:'#6b7280',cursor:'pointer',width:'100%',marginTop:'8px' }}>+ Block Another User</button>
          </div>
        </div>

        <div style={card}>
          <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'16px' }}>🔒 Privacy Settings</div>
          <div style={{ display:'flex',flexDirection:'column',gap:'12px' }}>
            {[
              { l:'Show Profile to Employers',s:'Employers can discover your profile',on:true },
              { l:'Allow Location Services',s:'Enable barangay-level job matching',on:true },
              { l:'Receive SMS Alerts',s:'Job notifications via text message',on:true },
              { l:'Two-Factor Authentication',s:'Require OTP on every login',on:false },
            ].map(({l,s,on})=>(
              <div key={l} style={{ display:'flex',alignItems:'center',gap:'10px' }}>
                <Toggle on={on} />
                <div><div style={{ fontSize:'13px',fontWeight:500 }}>{l}</div><div style={{ fontSize:'12px',color:'#6b7280' }}>{s}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
