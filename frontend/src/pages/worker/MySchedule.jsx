export default function MySchedule() {
  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2',padding:'24px',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }
  const inp = { width:'100%',padding:'10px 14px',border:'1.5px solid #e2e8e2',borderRadius:'9px',fontSize:'14px',background:'#fff',color:'#111827',outline:'none' }
  const lbl = { fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',color:'#6b7280',display:'block',marginBottom:'6px' }
  const tag = (bg,c,b) => ({ display:'inline-flex',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:bg,color:c,border:`1px solid ${b}` })

  return (
    <div style={{ padding:'28px',maxWidth:'1280px' }}>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px' }}>
        <div style={{ display:'flex',flexDirection:'column',gap:'16px' }}>
          <div style={card}>
            <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'14px' }}>⏰ Working Hours</div>
            <div style={{ marginBottom:'14px' }}>
              <label style={lbl}>Working Days</label>
              <div style={{ display:'flex',gap:'6px' }}>
                {[['M',true],['T',true],['W',true],['Th',true],['F',true],['Sa',false],['Su',false]].map(([d,on])=>(
                  <div key={d} style={{ width:'36px',height:'36px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:600,border:`1.5px solid ${on?'#16a34a':'#e2e8e2'}`,color:on?'#fff':'#6b7280',background:on?'#16a34a':'transparent',cursor:'pointer' }}>{d}</div>
                ))}
              </div>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px' }}>
              <div><label style={lbl}>Start Time</label><input style={inp} type="time" defaultValue="08:00" /></div>
              <div><label style={lbl}>End Time</label><input style={inp} type="time" defaultValue="17:00" /></div>
            </div>
          </div>

          <div style={card}>
            <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'14px' }}>🗓️ Blocked Dates</div>
            <div style={{ display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'12px' }}>
              {['Mar 1','Mar 8'].map(d=><span key={d} style={tag('rgba(239,68,68,.1)','#ef4444','rgba(239,68,68,.3)')}>{d} ×</span>)}
            </div>
            <input style={{ ...inp,marginBottom:'8px' }} type="date" />
            <button style={{ background:'transparent',border:'1px solid #e2e8e2',padding:'8px',borderRadius:'9px',fontSize:'13px',color:'#6b7280',cursor:'pointer',width:'100%' }}>+ Block Date</button>
          </div>
        </div>

        <div style={card}>
          <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'14px' }}>📋 Incoming Job Requests</div>
          {[
            { ico:'🔧',title:'Plumber — Santos Household',sub:'Feb 25, 2025 · 8:00 AM · Brgy. Dolores',rate:'₱800/day',bg:'rgba(22,163,74,1)' },
            { ico:'⚡',title:'Electrician — Reyes Residence',sub:'Mar 3, 2025 · 9:00 AM · Brgy. San Jose',rate:'₱120/hour' },
          ].map(({ico,title,sub,rate})=>(
            <div key={title} style={{ display:'flex',alignItems:'center',gap:'14px',padding:'14px 16px',border:'1px solid #e2e8e2',borderRadius:'14px',marginBottom:'10px' }}>
              <div style={{ fontSize:'28px' }}>{ico}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600,fontSize:'14px' }}>{title}</div>
                <div style={{ fontSize:'12px',color:'#6b7280' }}>{sub}</div>
                <div style={{ fontSize:'12px',color:'#16a34a',fontWeight:600,marginTop:'2px' }}>{rate}</div>
              </div>
              <div style={{ display:'flex',gap:'6px' }}>
                <button style={{ background:'rgba(22,163,74,.1)',color:'#16a34a',border:'1px solid rgba(22,163,74,.3)',padding:'7px 14px',borderRadius:'8px',fontSize:'13px',fontWeight:600,cursor:'pointer' }}>✓ Accept</button>
                <button style={{ background:'rgba(239,68,68,.08)',color:'#ef4444',border:'1px solid rgba(239,68,68,.3)',padding:'7px 14px',borderRadius:'8px',fontSize:'13px',fontWeight:600,cursor:'pointer' }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
