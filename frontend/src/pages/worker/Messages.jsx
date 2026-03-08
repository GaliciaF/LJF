export default function Messages() {
  const ava = (bg,sz=34) => ({ width:sz,height:sz,borderRadius:'50%',background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:sz*.4,fontWeight:700,color:'#fff',flexShrink:0 })
  const bubble = (me) => ({ padding:'10px 14px',borderRadius:me?'16px 16px 4px 16px':'16px 16px 16px 4px',fontSize:'14px',maxWidth:'68%',lineHeight:1.5,background:me?'#16a34a':'#f1f5f1',color:me?'#fff':'#111827' })
  const convos = [
    { i:'SH',n:'Santos Household',last:'Okay po, see you at 2PM! 👍',time:'10:28 AM',unread:2,bg:'linear-gradient(135deg,#f59e0b,#d97706)',active:true },
    { i:'GH',n:'Garcia Household',last:'When can you start?',time:'Yesterday',bg:'linear-gradient(135deg,#f59e0b,#d97706)',active:false },
    { i:'RR',n:'Reyes Residence',last:'Thank you for applying!',time:'Mon',bg:'linear-gradient(135deg,#3b82f6,#1d4ed8)',active:false },
  ]
  const msgs = [
    { me:false,text:"Good day Juan! Are you available today for the pipe repair?",time:'10:23 AM' },
    { me:true,text:"Good day po! Yes, I'm available. When do you need me?",time:'10:24 AM' },
    { me:false,text:'Can you come at 2PM? Pay is ₱800 for the day.',time:'10:25 AM' },
    { me:true,text:"Yes po! I'll be there at 2PM with my tools. Thank you!",time:'10:26 AM' },
    { me:false,text:'Perfect! See you po at 2PM. 😊',time:'10:27 AM' },
  ]

  return (
    <div style={{ padding:'28px',maxWidth:'1100px' }}>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0',height:'520px',border:'1px solid #e2e8e2',borderRadius:'14px',overflow:'hidden' }}>
        <div style={{ background:'#fff',borderRight:'1px solid #e2e8e2',display:'flex',flexDirection:'column' }}>
          <div style={{ padding:'14px 18px',borderBottom:'1px solid #e2e8e2',fontWeight:700,fontSize:'15px' }}>Conversations</div>
          <div style={{ flex:1,overflowY:'auto' }}>
            {convos.map(({i,n,last,time,unread,bg,active})=>(
              <div key={n} style={{ display:'flex',gap:'12px',alignItems:'center',padding:'14px 16px',borderBottom:'1px solid #e2e8e2',cursor:'pointer',background:active?'rgba(22,163,74,.06)':'transparent' }}>
                <div style={ava(bg)}>{i}</div>
                <div style={{ flex:1 }}><div style={{ fontWeight:700,fontSize:'14px' }}>{n}</div><div style={{ fontSize:'12px',color:'#6b7280' }}>{last}</div></div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'11px',color:'#9ca3af' }}>{time}</div>
                  {unread && <div style={{ width:'18px',height:'18px',background:'#16a34a',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',color:'#fff',marginTop:'4px',marginLeft:'auto' }}>{unread}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background:'#fff',display:'flex',flexDirection:'column' }}>
          <div style={{ padding:'14px 20px',borderBottom:'1px solid #e2e8e2',display:'flex',alignItems:'center',gap:'12px' }}>
            <div style={ava('linear-gradient(135deg,#f59e0b,#d97706)')}>SH</div>
            <div><div style={{ fontWeight:700,fontSize:'14px' }}>Santos Household</div><div style={{ fontSize:'12px',color:'#16a34a' }}>● Online</div></div>
            <div style={{ marginLeft:'auto',display:'flex',gap:'8px' }}>
              <button style={{ background:'transparent',border:'1px solid #e2e8e2',padding:'6px 12px',borderRadius:'8px',fontSize:'12px',cursor:'pointer',color:'#6b7280' }}>📞 Call</button>
            </div>
          </div>
          <div style={{ flex:1,overflowY:'auto',padding:'20px',display:'flex',flexDirection:'column',gap:'12px' }}>
            {msgs.map(({me,text,time},idx)=>(
              <div key={idx} style={{ display:'flex',gap:'8px',flexDirection:me?'row-reverse':'row' }}>
                {!me && <div style={{ ...ava('linear-gradient(135deg,#f59e0b,#d97706)',28),alignSelf:'flex-end' }}>SH</div>}
                <div>
                  <div style={bubble(me)}>{text}</div>
                  <div style={{ fontSize:'10px',color:'#9ca3af',marginTop:'2px',textAlign:me?'right':'left' }}>{time}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding:'14px 16px',borderTop:'1px solid #e2e8e2',display:'flex',gap:'10px',alignItems:'center' }}>
            <button style={{ background:'transparent',border:'1px solid #e2e8e2',padding:'8px 10px',borderRadius:'9px',cursor:'pointer' }}>📎</button>
            <input placeholder="Type a message..." style={{ flex:1,padding:'10px 14px',border:'1.5px solid #e2e8e2',borderRadius:'9px',fontSize:'14px',outline:'none' }} />
            <button style={{ background:'#16a34a',color:'#fff',border:'none',padding:'10px 20px',borderRadius:'9px',fontSize:'13px',fontWeight:600,cursor:'pointer' }}>Send ➤</button>
          </div>
        </div>
      </div>
    </div>
  )
}
