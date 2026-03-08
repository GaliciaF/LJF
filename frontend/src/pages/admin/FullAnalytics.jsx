import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function FullAnalytics() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.get('/admin/analytics').then(res=>setData(res.data)).finally(()=>setLoading(false)) }, [])

  const card = { background:'#161525',borderRadius:'14px',border:'1px solid #2a2940',padding:'24px' }
  const stat = (a) => ({ ...card,padding:'22px 24px',position:'relative',overflow:'hidden',borderTop:`3px solid ${a}` })
  const tag  = (bg,c,b) => ({ display:'inline-flex',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:bg,color:c,border:`1px solid ${b}` })

  if (loading) return <div style={{ padding:'28px',color:'#8b8aad' }}>Loading analytics...</div>
  if (!data)   return <div style={{ padding:'28px',color:'#f87171' }}>Failed to load analytics.</div>

  return (
    <div style={{ padding:'28px',maxWidth:'1280px' }}>
      {/* KPIs */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'24px' }}>
        {[
          { n: data.total_users,    l:'Total Users',      accent:'#7c3aed', nc:'#a78bfa' },
          { n: data.total_workers,  l:'Workers',          accent:'#22c55e', nc:'#22c55e' },
          { n: data.total_employers,l:'Employers',        accent:'#fbbf24', nc:'#fbbf24' },
          { n: data.total_jobs,     l:'Total Job Posts',  accent:'#60a5fa', nc:'#60a5fa' },
        ].map(({ n,l,accent,nc }) => (
          <div key={l} style={stat(accent)}>
            <div style={{ fontSize:'38px',fontWeight:800,lineHeight:1,color:nc }}>{n??'—'}</div>
            <div style={{ fontSize:'13px',color:'#8b8aad',marginTop:'4px' }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'20px' }}>
        {/* Hire rate / avg rating */}
        <div style={card}>
          <div style={{ fontSize:'15px',fontWeight:700,color:'#f0eeff',marginBottom:'16px' }}>📊 Platform KPIs</div>
          {[
            { l:'Hire Success Rate', v:`${data.hire_success_rate??0}%`, c:'#22c55e' },
            { l:'Average Rating',    v:`${data.avg_rating??0} ⭐`,       c:'#fbbf24' },
            { l:'Report Rate',       v:`${data.report_rate??0}%`,        c:'#f87171' },
          ].map(({ l,v,c }) => (
            <div key={l} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid #2a2940' }}>
              <span style={{ fontSize:'14px',color:'#8b8aad' }}>{l}</span>
              <span style={{ fontSize:'20px',fontWeight:800,color:c }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Top Barangays */}
        <div style={card}>
          <div style={{ fontSize:'15px',fontWeight:700,color:'#f0eeff',marginBottom:'16px' }}>📍 Top Barangays by Workers</div>
          {(data.top_barangays??[]).length===0
            ? <div style={{ color:'#5a5978',fontSize:'13px' }}>No data available.</div>
            : (data.top_barangays??[]).map((b,i) => (
              <div key={b.barangay} style={{ display:'flex',alignItems:'center',gap:'12px',padding:'10px 0',borderBottom:'1px solid #2a2940' }}>
                <div style={{ width:'22px',height:'22px',borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#4c1d95)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,color:'#fff' }}>{i+1}</div>
                <span style={{ flex:1,fontSize:'14px',color:'#f0eeff' }}>{b.barangay??'Unknown'}</span>
                <span style={tag('rgba(124,58,237,.12)','#a78bfa','rgba(124,58,237,.3)')}>{b.count} workers</span>
              </div>
            ))
          }
        </div>
      </div>

      {/* Bar chart placeholder */}
      <div style={card}>
        <div style={{ fontSize:'15px',fontWeight:700,color:'#f0eeff',marginBottom:'6px' }}>📈 Weekly Activity</div>
        <div style={{ fontSize:'12px',color:'#8b8aad',marginBottom:'16px' }}>New users and jobs per day this week</div>
        <div style={{ display:'flex',gap:'10px',alignItems:'flex-end',height:'150px',padding:'8px 0' }}>
          {[['Mon','35%'],['Tue','55%'],['Wed','72%'],['Thu','48%'],['Fri','90%'],['Sat','100%'],['Sun','78%']].map(([d,h])=>(
            <div key={d} style={{ display:'flex',flexDirection:'column',alignItems:'center',flex:1,gap:'6px' }}>
              <div style={{ background:'linear-gradient(180deg,#a78bfa,#7c3aed)',borderRadius:'6px 6px 0 0',width:'100%',height:h }} />
              <div style={{ fontSize:'10px',color:'#8b8aad',fontWeight:600 }}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
