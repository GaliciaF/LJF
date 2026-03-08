export default function Notifications() {
  const btn = (bg,c,b) => ({ background:bg,color:c,border:b?`1px solid ${b}`:'none',padding:'6px 12px',borderRadius:'8px',fontSize:'12px',fontWeight:600,cursor:'pointer',flexShrink:0 })
  const lbl = { fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',color:'#9ca3af',marginBottom:'10px' }
  const notifs_new = [
    { ico:'📢',title:<>New job posted in <strong>Brgy. Dolores</strong> matching your plumbing skills!</>,time:'Just now · Barangay Alert',action:'View' },
    { ico:'✅',title:<>Your application to <strong>Santos Household</strong> was <strong style={{color:'#16a34a'}}>accepted!</strong></>,time:'5 minutes ago · Application Update',action:'View' },
    { ico:'⏰',title:<>Reminder: Your job at <strong>Santos Household</strong> starts in 2 hours (2:00 PM today)</>,time:'30 minutes ago · Job Reminder',action:null },
  ]
  const notifs_old = [
    { ico:'💬',title:<>New message from <strong>Garcia Household</strong></>,time:'Yesterday · Message',action:'View' },
    { ico:'⭐',title:<><strong>Santos Household</strong> left you a 5-star review!</>,time:'2 days ago · Review',action:null },
  ]

  return (
    <div style={{ padding:'28px',maxWidth:'720px' }}>
      <div style={lbl}>New</div>
      <div style={{ display:'flex',flexDirection:'column',gap:'10px',marginBottom:'20px' }}>
        {notifs_new.map(({ico,title,time,action},i)=>(
          <div key={i} style={{ display:'flex',gap:'12px',padding:'14px 16px',borderRadius:'14px',border:'1px solid #e2e8e2',background:'#fff',cursor:'pointer',alignItems:'center',boxShadow:'0 1px 3px rgba(0,0,0,.06)' }}>
            <div style={{ width:'10px',height:'10px',borderRadius:'50%',background:'#16a34a',flexShrink:0 }} />
            <div style={{ fontSize:'20px' }}>{ico}</div>
            <div style={{ flex:1 }}><div style={{ fontSize:'14px',lineHeight:1.5 }}>{title}</div><div style={{ fontSize:'11px',color:'#9ca3af',marginTop:'2px' }}>{time}</div></div>
            {action && <button style={btn('transparent','#6b7280','#e2e8e2')}>{action}</button>}
          </div>
        ))}
      </div>
      <div style={lbl}>Earlier</div>
      <div style={{ display:'flex',flexDirection:'column',gap:'10px' }}>
        {notifs_old.map(({ico,title,time,action},i)=>(
          <div key={i} style={{ display:'flex',gap:'12px',padding:'14px 16px',borderRadius:'14px',border:'1px solid #e2e8e2',background:'#fff',cursor:'pointer',opacity:.7,alignItems:'center' }}>
            <div style={{ width:'10px',height:'10px',borderRadius:'50%',background:'#e2e8e2',flexShrink:0 }} />
            <div style={{ fontSize:'20px' }}>{ico}</div>
            <div style={{ flex:1 }}><div style={{ fontSize:'14px',lineHeight:1.5 }}>{title}</div><div style={{ fontSize:'11px',color:'#9ca3af',marginTop:'2px' }}>{time}</div></div>
            {action && <button style={btn('transparent','#6b7280','#e2e8e2')}>{action}</button>}
          </div>
        ))}
      </div>
    </div>
  )
}
