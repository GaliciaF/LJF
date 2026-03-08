export default function WorkerDashboard() {
  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2',padding:'24px',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }
  const stat = (accent) => ({ background:'#fff',border:'1px solid #e2e8e2',borderRadius:'14px',padding:'20px 24px',borderTop:`3px solid ${accent}`,boxShadow:'0 1px 3px rgba(0,0,0,.08)' })
  const tag = (bg,c,b) => ({ display:'inline-flex',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:bg,color:c,border:`1px solid ${b}` })
  const ibox = (green) => ({ background:green?'rgba(22,163,74,.08)':'#f1f5f1',borderRadius:'10px',padding:'12px 14px',border:`1px solid ${green?'rgba(22,163,74,.3)':'#e2e8e2'}` })
  const ava = (bg,sz=40) => ({ width:sz,height:sz,borderRadius:'50%',background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:sz*.36,fontWeight:700,color:'#fff',flexShrink:0 })

  return (
    <div style={{ padding:'28px',maxWidth:'1280px' }}>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'24px' }}>
        {[
          { n:'23',l:'Jobs Completed',c:'↑ 3 this month',accent:'#16a34a',nc:'#16a34a' },
          { n:'3',l:'Pending Applications',c:'Under review',accent:'#3b82f6',nc:'#3b82f6' },
          { n:'4.8★',l:'Your Rating',c:'Top Worker!',accent:'#f59e0b',nc:'#f59e0b' },
          { n:'₱18k',l:'This Month Earnings',c:'↑ 12% vs last month',accent:'#7c3aed',nc:'#7c3aed' },
        ].map(({n,l,c,accent,nc})=>(
          <div key={l} style={stat(accent)}>
            <div style={{ fontSize:'32px',fontWeight:800,color:nc,fontFamily:'Syne,sans-serif' }}>{n}</div>
            <div style={{ fontSize:'13px',color:'#6b7280',marginTop:'2px' }}>{l}</div>
            <div style={{ fontSize:'11px',fontWeight:600,marginTop:'6px',color:nc }}>{c}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px' }}>
        <div>
          <div style={{ marginBottom:'16px' }}><div style={{ fontSize:'17px',fontWeight:800,fontFamily:'Syne,sans-serif' }}>🔥 Hot Jobs Near You</div><div style={{ fontSize:'13px',color:'#6b7280' }}>Matching your skills in Brgy. Dolores</div></div>
          <div style={{ display:'flex',flexDirection:'column',gap:'12px' }}>
            {[
              { ico:'🔧',title:'Plumber — Urgent!',sub:'Santos Household · Brgy. Dolores · 0.3km',match:'98% Match',urgent:true,rate:'₱800',rtype:'/day' },
              { ico:'⚡',title:'Electrician Needed',sub:'Reyes Residence · Brgy. San Jose · 1.5km',match:'90% Match',urgent:false,rate:'₱120',rtype:'/hour' },
              { ico:'🧹',title:'House Cleaner',sub:'Garcia Home · Brgy. Dolores · 0.8km',match:'85% Match',urgent:false,rate:'₱500',rtype:'/day' },
            ].map(({ico,title,sub,match,urgent,rate,rtype})=>(
              <div key={title} style={{ ...card,cursor:'pointer' }}>
                <div style={{ display:'flex',alignItems:'flex-start',gap:'12px' }}>
                  <div style={{ fontSize:'32px' }}>{ico}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px' }}>
                      <div style={{ fontWeight:700,fontFamily:'Syne,sans-serif' }}>{title}</div>
                      {urgent && <span style={tag('rgba(239,68,68,.1)','#ef4444','rgba(239,68,68,.3)')}>Urgent</span>}
                    </div>
                    <div style={{ fontSize:'13px',color:'#6b7280' }}>{sub}</div>
                    <div style={{ display:'flex',gap:'8px',marginTop:'8px' }}>
                      <span style={tag('rgba(22,163,74,.1)','#16a34a','rgba(22,163,74,.25)')}>{match}</span>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}><div style={{ fontSize:'22px',fontWeight:800,color:'#16a34a',fontFamily:'Syne,sans-serif' }}>{rate}</div><div style={{ fontSize:'11px',color:'#6b7280' }}>{rtype}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ marginBottom:'16px' }}><div style={{ fontSize:'17px',fontWeight:800,fontFamily:'Syne,sans-serif' }}>📊 Your Activity</div><div style={{ fontSize:'13px',color:'#6b7280' }}>Summary for this month</div></div>
          <div style={{ ...card,marginBottom:'16px' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px' }}>
              <div style={{ fontSize:'14px',fontWeight:600 }}>Active Applications</div>
              <span style={tag('rgba(245,158,11,.1)','#f59e0b','rgba(245,158,11,.3)')}>3 Pending</span>
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:'8px' }}>
              {[['Plumber — Santos Household','Under Review','yellow'],['Electrician — Reyes Residence','Seen','blue'],['Carpenter — Cruz Home','Pending','gray']].map(([t,s,c])=>(
                <div key={t} style={{ display:'flex',alignItems:'center',gap:'12px' }}>
                  <span style={{ fontSize:'13px',flex:1 }}>{t}</span>
                  <span style={c==='yellow' ? tag('rgba(245,158,11,.1)','#f59e0b','rgba(245,158,11,.3)') : c==='blue' ? tag('rgba(59,130,246,.1)','#3b82f6','rgba(59,130,246,.3)') : tag('#f1f5f1','#6b7280','#e2e8e2')}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize:'14px',fontWeight:600,marginBottom:'12px' }}>Upcoming Schedule</div>
            <div style={{ ...ibox(true),marginBottom:'8px' }}><div style={{ fontWeight:600,fontSize:'14px' }}>🔧 Santos Household</div><div style={{ fontSize:'12px',color:'#6b7280',marginTop:'2px' }}>Feb 25, 2025 · 8:00 AM – 5:00 PM</div></div>
            <div style={ibox(false)}><div style={{ fontWeight:600,fontSize:'14px' }}>⚡ Reyes Residence</div><div style={{ fontSize:'12px',color:'#6b7280',marginTop:'2px' }}>Mar 3, 2025 · 9:00 AM – 12:00 PM</div></div>
          </div>
        </div>
      </div>
    </div>
  )
}
