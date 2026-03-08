export default function MyProfile() {
  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2',padding:'24px',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }
  const inp = { width:'100%',padding:'10px 14px',border:'1.5px solid #e2e8e2',borderRadius:'9px',fontSize:'14px',background:'#fff',color:'#111827',outline:'none' }
  const lbl = { fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',color:'#6b7280',display:'block',marginBottom:'6px' }
  const Toggle = ({on=true}) => (
    <div style={{ position:'relative',width:'40px',height:'22px',flexShrink:0,cursor:'pointer' }}>
      <div style={{ position:'absolute',inset:0,background:on?'#16a34a':'#e2e8e2',borderRadius:'20px' }} />
      <div style={{ position:'absolute',width:'16px',height:'16px',top:'3px',left:on?'21px':'3px',background:'#fff',borderRadius:'50%',transition:'.25s' }} />
    </div>
  )

  return (
    <div style={{ padding:'28px',maxWidth:'1280px' }}>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px' }}>
        <div style={{ display:'flex',flexDirection:'column',gap:'16px' }}>
          <div style={card}>
            <div style={{ textAlign:'center',padding:'20px',border:'2px dashed #e2e8e2',borderRadius:'14px',cursor:'pointer',marginBottom:'16px' }}>
              <div style={{ fontSize:'48px',marginBottom:'8px' }}>👷</div>
              <div style={{ fontSize:'14px',fontWeight:600 }}>Click to upload photo</div>
              <div style={{ fontSize:'12px',color:'#6b7280',marginTop:'2px' }}>JPG, PNG up to 5MB</div>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px' }}>
              <div><label style={lbl}>Full Name</label><input style={inp} defaultValue="Juan dela Cruz" /></div>
              <div><label style={lbl}>Phone</label><input style={inp} defaultValue="0912-345-6789" /></div>
            </div>
            <div><label style={lbl}>Barangay</label><select style={{ ...inp,appearance:'none' }}><option>Brgy. Dolores</option><option>Brgy. San Jose</option></select></div>
          </div>

          <div style={card}>
            <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'12px' }}>🛠️ Service Offerings</div>
            <div style={{ display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'12px' }}>
              {['🔧 Plumbing','⚡ Electrical','🏗️ Carpentry'].map(s=>(
                <div key={s} style={{ display:'flex',alignItems:'center',gap:'4px',background:'rgba(22,163,74,.1)',border:'1px solid rgba(22,163,74,.3)',borderRadius:'20px',padding:'5px 12px',fontSize:'12px',fontWeight:600,color:'#16a34a',cursor:'pointer' }}>{s} ×</div>
              ))}
              <div style={{ background:'#f1f5f1',border:'1px solid #e2e8e2',borderRadius:'20px',padding:'5px 12px',fontSize:'12px',fontWeight:600,color:'#6b7280',cursor:'pointer' }}>+ Add Service</div>
            </div>
            <div style={{ marginBottom:'12px' }}><label style={lbl}>Skills & Experience</label><textarea style={{ ...inp,minHeight:'80px',resize:'vertical' }} defaultValue="TESDA-certified plumber with 5 years of residential and commercial plumbing experience." /></div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px' }}>
              <div><label style={lbl}>Years Experience</label><input style={inp} type="number" defaultValue="5" /></div>
              <div><label style={lbl}>Travel Distance</label><select style={{ ...inp,appearance:'none' }}><option>Within Barangay</option><option selected>Up to 3km</option><option>Up to 5km</option></select></div>
            </div>
          </div>
        </div>

        <div style={{ display:'flex',flexDirection:'column',gap:'16px' }}>
          <div style={card}>
            <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'12px' }}>📅 Weekly Availability</div>
            <label style={lbl}>Working Days</label>
            <div style={{ display:'flex',gap:'6px',marginBottom:'14px' }}>
              {[['M',true],['T',true],['W',true],['Th',true],['F',true],['Sa',false],['Su',false]].map(([d,on])=>(
                <div key={d} style={{ width:'36px',height:'36px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:600,border:`1.5px solid ${on?'#16a34a':'#e2e8e2'}`,color:on?'#fff':'#6b7280',background:on?'#16a34a':'transparent',cursor:'pointer' }}>{d}</div>
              ))}
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'14px' }}>
              <div><label style={lbl}>Start Time</label><input style={inp} type="time" defaultValue="08:00" /></div>
              <div><label style={lbl}>End Time</label><input style={inp} type="time" defaultValue="17:00" /></div>
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
              <Toggle on={true} />
              <div><div style={{ fontSize:'13px',fontWeight:500 }}>Currently Available for Work</div><div style={{ fontSize:'12px',color:'#6b7280' }}>Employers can see and contact you</div></div>
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'12px' }}>📍 Location</div>
            <div style={{ background:'#e8f5e9',border:'1.5px solid #e2e8e2',borderRadius:'14px',height:'160px',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'8px',cursor:'pointer' }}>
              <div style={{ fontSize:'36px' }}>📍</div>
              <div style={{ fontSize:'13px',fontWeight:600 }}>Brgy. Dolores, Purok 2</div>
              <div style={{ fontSize:'12px',color:'#6b7280' }}>Click to update location</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
