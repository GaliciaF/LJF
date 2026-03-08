import { useState } from 'react'
export default function BrowseJob() {
  const [dist,setDist] = useState('📍 My Barangay')
  const tag = (bg,c,b) => ({ display:'inline-flex',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:bg,color:c,border:`1px solid ${b}` })
  const chip = (a) => ({ padding:'6px 14px',borderRadius:'20px',border:`1.5px solid ${a?'#16a34a':'#e2e8e2'}`,fontSize:'12px',fontWeight:a?600:500,color:a?'#16a34a':'#6b7280',cursor:'pointer',background:a?'rgba(22,163,74,.08)':'transparent' })
  const jobs = [
    { ico:'🔧',title:'Plumber — Urgent!',sub:'Santos Household · 📍 0.3km',match:'98% Match',extra:'Urgent',extraC:'red',rate:'₱800',rtype:'/day' },
    { ico:'⚡',title:'Electrician — Part-time',sub:'Reyes Residence · 📍 1.5km',match:'90% Match',extra:'Part-time',extraC:'blue',rate:'₱120',rtype:'/hour' },
    { ico:'🧹',title:'House Cleaner',sub:'Garcia Home · 📍 0.8km',match:'85% Match',extra:'Weekly',extraC:'gray',rate:'₱500',rtype:'/day' },
    { ico:'🏗️',title:'Carpenter — Furniture Repair',sub:'Cruz Household · 📍 2.1km',match:'78% Match',extra:'Per Service',extraC:'gray',rate:'₱1,200',rtype:'/service' },
  ]

  return (
    <div style={{ padding:'28px',maxWidth:'1280px' }}>
      <div style={{ background:'#e8f5e9',border:'1.5px solid #e2e8e2',borderRadius:'14px',height:'200px',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'8px',marginBottom:'20px',position:'relative' }}>
        <div style={{ fontSize:'40px' }}>📍</div>
        <div style={{ fontWeight:600,fontSize:'14px' }}>4 jobs found in your area</div>
        <div style={{ fontSize:'12px',color:'#6b7280' }}>Interactive map · Brgy. Dolores & nearby</div>
      </div>
      <div style={{ display:'flex',gap:'12px',alignItems:'center',marginBottom:'16px',flexWrap:'wrap' }}>
        <div style={{ fontSize:'14px',fontWeight:600 }}>Distance:</div>
        <div style={{ display:'flex',gap:'8px',flexWrap:'wrap' }}>
          {['📍 My Barangay','📍 1km','📍 3km','📍 5km','🌐 All Areas'].map(c=><div key={c} style={chip(dist===c)} onClick={()=>setDist(c)}>{c}</div>)}
        </div>
      </div>
      <div style={{ background:'rgba(22,163,74,.08)',borderRadius:'10px',padding:'12px 14px',border:'1px solid rgba(22,163,74,.3)',marginBottom:'20px' }}>
        <div style={{ fontWeight:600,fontSize:'14px' }}>⚡ Smart Job Suggestions for You</div>
        <div style={{ fontSize:'12px',marginTop:'2px',color:'#6b7280' }}>Based on your skills (Plumbing, Electrical) and Brgy. Dolores location</div>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'16px' }}>
        {jobs.map(({ico,title,sub,match,extra,extraC,rate,rtype})=>(
          <div key={title} style={{ background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2',padding:'18px 20px',cursor:'pointer',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }}>
            <div style={{ display:'flex',alignItems:'flex-start',gap:'12px' }}>
              <div style={{ fontSize:'36px' }}>{ico}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700,fontFamily:'Syne,sans-serif',marginBottom:'4px' }}>{title}</div>
                <div style={{ fontSize:'13px',color:'#6b7280' }}>{sub}</div>
                <div style={{ display:'flex',gap:'8px',marginTop:'8px' }}>
                  <span style={tag('rgba(22,163,74,.1)','#16a34a','rgba(22,163,74,.25)')}>{match}</span>
                  <span style={extraC==='red' ? tag('rgba(239,68,68,.1)','#ef4444','rgba(239,68,68,.3)') : extraC==='blue' ? tag('rgba(59,130,246,.1)','#3b82f6','rgba(59,130,246,.3)') : tag('#f1f5f1','#6b7280','#e2e8e2')}>{extra}</span>
                </div>
              </div>
              <div style={{ textAlign:'right' }}><div style={{ fontSize:'20px',fontWeight:800,color:'#16a34a',fontFamily:'Syne,sans-serif' }}>{rate}</div><div style={{ fontSize:'11px',color:'#6b7280' }}>{rtype}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
