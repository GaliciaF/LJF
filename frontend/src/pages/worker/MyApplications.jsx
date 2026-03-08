import { useState } from 'react'
export default function MyApplications() {
  const [filter,setFilter] = useState('All')
  const tag = (bg,c,b) => ({ display:'inline-flex',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:bg,color:c,border:`1px solid ${b}` })
  const chip = (a) => ({ padding:'6px 14px',borderRadius:'20px',border:`1.5px solid ${a?'#16a34a':'#e2e8e2'}`,fontSize:'12px',fontWeight:a?600:500,color:a?'#16a34a':'#6b7280',cursor:'pointer',background:a?'rgba(22,163,74,.08)':'transparent' })
  const apps = [
    { ico:'🔧',title:'Plumber — Urgent!',emp:'Santos Household · Brgy. Dolores',rate:'₱800/day',applied:'Applied: Feb 20, 2025',st:'Accepted',stc:'green' },
    { ico:'⚡',title:'Electrician — Part-time',emp:'Reyes Residence · Brgy. San Jose',rate:'₱120/hour',applied:'Applied: Feb 18, 2025',st:'Under Review',stc:'yellow' },
    { ico:'🏗️',title:'Carpenter — Furniture Repair',emp:'Cruz Household · Brgy. Sta. Cruz',rate:'₱1,200/service',applied:'Applied: Feb 16, 2025',st:'Pending',stc:'gray' },
    { ico:'🧹',title:'House Cleaner',emp:'Garcia Home · Brgy. Dolores',rate:'₱500/day',applied:'Applied: Feb 12, 2025',st:'Declined',stc:'red' },
  ]
  const stTag = (c) => c==='green' ? tag('rgba(22,163,74,.1)','#16a34a','rgba(22,163,74,.25)') : c==='yellow' ? tag('rgba(245,158,11,.1)','#f59e0b','rgba(245,158,11,.3)') : c==='red' ? tag('rgba(239,68,68,.1)','#ef4444','rgba(239,68,68,.3)') : tag('#f1f5f1','#6b7280','#e2e8e2')

  return (
    <div style={{ padding:'28px',maxWidth:'1280px' }}>
      <div style={{ display:'flex',gap:'8px',marginBottom:'16px',flexWrap:'wrap' }}>
        {['All','Accepted','Under Review','Pending','Declined'].map(c=><div key={c} style={chip(filter===c)} onClick={()=>setFilter(c)}>{c}</div>)}
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:'12px' }}>
        {apps.map(({ico,title,emp,rate,applied,st,stc})=>(
          <div key={title} style={{ background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2',padding:'18px 20px',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }}>
            <div style={{ display:'flex',alignItems:'flex-start',gap:'14px' }}>
              <div style={{ fontSize:'36px' }}>{ico}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700,fontSize:'15px',fontFamily:'Syne,sans-serif',marginBottom:'4px' }}>{title}</div>
                <div style={{ fontSize:'13px',color:'#6b7280' }}>{emp}</div>
                <div style={{ display:'flex',gap:'8px',marginTop:'8px' }}>
                  <span style={tag('rgba(22,163,74,.1)','#16a34a','rgba(22,163,74,.25)')}>{rate}</span>
                  <span style={tag('#f1f5f1','#6b7280','#e2e8e2')}>{applied}</span>
                </div>
              </div>
              <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'8px' }}>
                <span style={stTag(stc)}>{st}</span>
                {st==='Accepted' && <button style={{ background:'#16a34a',color:'#fff',border:'none',padding:'6px 14px',borderRadius:'8px',fontSize:'12px',fontWeight:600,cursor:'pointer' }}>💬 Message</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
