import { useState } from 'react'
export default function Reviews() {
  const [rating,setRating] = useState(4)
  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2',padding:'24px',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }
  const tag = (bg,c,b) => ({ display:'inline-flex',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:bg,color:c,border:`1px solid ${b}` })
  const ava = (bg,sz=40) => ({ width:sz,height:sz,borderRadius:'50%',background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:sz*.36,fontWeight:700,color:'#fff',flexShrink:0 })

  return (
    <div style={{ padding:'28px',maxWidth:'1280px' }}>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px' }}>
        <div style={card}>
          <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'16px' }}>Rate this Employer</div>
          <div style={{ display:'flex',gap:'14px',marginBottom:'16px',padding:'14px',border:'1px solid #e2e8e2',borderRadius:'14px' }}>
            <div style={ava('linear-gradient(135deg,#f59e0b,#d97706)')}>SH</div>
            <div><div style={{ fontWeight:700,fontSize:'15px' }}>Santos Household</div><div style={{ fontSize:'12px',color:'#6b7280' }}>Plumbing Job · Feb 22, 2025</div><span style={{ ...tag('rgba(22,163,74,.1)','#16a34a','rgba(22,163,74,.25)'),marginTop:'6px',display:'inline-flex' }}>✅ Completed</span></div>
          </div>
          <div style={{ marginBottom:'16px' }}>
            <label style={{ fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',color:'#6b7280',display:'block',marginBottom:'6px' }}>Overall Rating</label>
            <div style={{ display:'flex',gap:'4px' }}>
              {[1,2,3,4,5].map(n=>(
                <span key={n} onClick={()=>setRating(n)} style={{ fontSize:'28px',cursor:'pointer',color:n<=rating?'#f59e0b':'#e2e8e2',transition:'color .1s' }}>★</span>
              ))}
            </div>
            <div style={{ fontSize:'13px',color:'#f59e0b',fontWeight:600,marginTop:'6px' }}>{['','Poor','Fair','Good','Very Good','Excellent'][rating]} ({rating}/5)</div>
          </div>
          <div style={{ marginBottom:'16px' }}>
            <label style={{ fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',color:'#6b7280',display:'block',marginBottom:'6px' }}>Write Your Review</label>
            <textarea style={{ width:'100%',padding:'10px 14px',border:'1.5px solid #e2e8e2',borderRadius:'9px',fontSize:'14px',minHeight:'100px',resize:'vertical',outline:'none' }} defaultValue="Great employer! They were clear with instructions, paid on time, and were very respectful. Would love to work for them again." />
          </div>
          <button style={{ background:'#16a34a',color:'#fff',border:'none',padding:'12px',borderRadius:'9px',fontSize:'13px',fontWeight:600,cursor:'pointer',width:'100%' }}>⭐ Submit Review</button>
        </div>

        <div style={card}>
          <div style={{ fontSize:'15px',fontWeight:700,marginBottom:'16px' }}>Reviews You've Received</div>
          <div style={{ display:'flex',flexDirection:'column',gap:'12px' }}>
            {[
              { i:'SH',n:'Santos Household',d:'Feb 22, 2025',r:'★★★★★',review:'"Excellent plumber! Fixed our pipe quickly and professionally. Will hire again."',bg:'linear-gradient(135deg,#f59e0b,#d97706)' },
              { i:'GH',n:'Garcia Household',d:'Feb 15, 2025',r:'★★★★★',review:'"Very skilled and trustworthy. Fixed all electrical issues in one day."',bg:'linear-gradient(135deg,#f59e0b,#d97706)' },
            ].map(({i,n,d,r,review,bg})=>(
              <div key={n} style={{ padding:'14px',border:'1px solid #e2e8e2',borderRadius:'14px' }}>
                <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px' }}>
                  <div style={ava(bg,32)}>{i}</div>
                  <div><div style={{ fontWeight:600,fontSize:'13px' }}>{n}</div><div style={{ fontSize:'11px',color:'#6b7280' }}>{d}</div></div>
                  <div style={{ marginLeft:'auto',color:'#f59e0b',fontWeight:700 }}>{r}</div>
                </div>
                <div style={{ fontSize:'13px' }}>{review}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
