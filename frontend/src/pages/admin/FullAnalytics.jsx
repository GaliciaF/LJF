import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function FullAnalytics() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/analytics')
      .then(res => setData(res.data))
      .finally(() => setLoading(false))
  }, [])

  const card = { background:'#161525', borderRadius:'14px', border:'1px solid #2a2940', padding:'20px' }
  const tag  = (bg,c,b) => ({ display:'inline-flex', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600, background:bg, color:c, border:`1px solid ${b}` })

  if (loading) return <div style={{ padding:'28px', color:'#8b8aad' }}>Loading analytics...</div>
  if (!data)   return <div style={{ padding:'28px', color:'#f87171' }}>Failed to load analytics.</div>

  return (
    <div style={{ padding:'16px', maxWidth:'1280px', boxSizing:'border-box' }}>
      <style>{`
        @media (min-width: 640px) {
          .fa-outer { padding: 28px !important; }
        }

        /* KPI grid: 2 cols on mobile, 4 on desktop */
        .fa-kpi-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        @media (min-width: 900px) {
          .fa-kpi-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        /* Middle section: stack on mobile, side-by-side on tablet+ */
        .fa-mid-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        @media (min-width: 700px) {
          .fa-mid-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .fa-kpi-card {
          border-radius: 14px;
          border: 1px solid #2a2940;
          padding: 18px 16px;
          position: relative;
          overflow: hidden;
        }

        .fa-kpi-icon {
          position: absolute;
          right: 12px;
          top: 12px;
          font-size: 28px;
          opacity: 0.15;
        }

        @media (min-width: 640px) {
          .fa-kpi-icon { font-size: 34px; right: 18px; top: 18px; }
          .fa-kpi-number { font-size: 38px !important; }
        }
      `}</style>

      {/* KPI Cards */}
      <div className="fa-kpi-grid fa-outer" style={{ padding:0 }}>
        {[
          { n: data.total_users,     l:'Total Users',     accent:'#7c3aed', nc:'#a78bfa', ico:'👥' },
          { n: data.total_workers,   l:'Workers',         accent:'#22c55e', nc:'#22c55e', ico:'👷' },
          { n: data.total_employers, l:'Employers',       accent:'#fbbf24', nc:'#fbbf24', ico:'🏢' },
          { n: data.total_jobs,      l:'Total Job Posts', accent:'#60a5fa', nc:'#60a5fa', ico:'📋' },
        ].map(({ n,l,accent,nc,ico }) => (
          <div key={l} className="fa-kpi-card" style={{ background:'#161525', borderTop:`3px solid ${accent}` }}>
            <div className="fa-kpi-icon">{ico}</div>
            <div className="fa-kpi-number" style={{ fontSize:'28px', fontWeight:800, lineHeight:1, color:nc }}>{n ?? '—'}</div>
            <div style={{ fontSize:'12px', color:'#8b8aad', marginTop:'4px' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Platform KPIs & Top Barangays */}
      <div className="fa-mid-grid">
        {/* Platform KPIs */}
        <div style={card}>
          <div style={{ fontSize:'15px', fontWeight:700, color:'#f0eeff', marginBottom:'16px' }}>📊 Platform KPIs</div>
          {[
            { l:'Hire Success Rate', v:`${data.hire_success_rate ?? 0}%`, c:'#22c55e' },
            { l:'Average Rating',    v:`${data.avg_rating ?? 0} ⭐`,       c:'#fbbf24' },
            { l:'Report Rate',       v:`${data.report_rate ?? 0}%`,       c:'#f87171' },
          ].map(({ l,v,c }) => (
            <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #2a2940', gap:'8px', flexWrap:'wrap' }}>
              <span style={{ fontSize:'14px', color:'#8b8aad' }}>{l}</span>
              <span style={{ fontSize:'20px', fontWeight:800, color:c }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Top Barangays */}
        <div style={card}>
          <div style={{ fontSize:'15px', fontWeight:700, color:'#f0eeff', marginBottom:'16px' }}>📍 Top Barangays by Workers</div>
          {(data.top_barangays ?? []).length === 0 ? (
            <div style={{ color:'#5a5978', fontSize:'13px' }}>No data available.</div>
          ) : data.top_barangays.map((b,i) => (
            <div key={b.barangay} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 0', borderBottom:'1px solid #2a2940' }}>
              <div style={{ width:'22px', height:'22px', borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#4c1d95)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:700, color:'#fff', flexShrink:0 }}>{i+1}</div>
              <span style={{ flex:1, fontSize:'14px', color:'#f0eeff', minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.barangay ?? 'Unknown'}</span>
              <span style={tag('rgba(124,58,237,.12)', '#a78bfa', 'rgba(124,58,237,.3)')}>{b.count} workers</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Activity */}
      <div style={card}>
        <div style={{ fontSize:'15px', fontWeight:700, color:'#f0eeff', marginBottom:'6px' }}>📈 Weekly Activity</div>
        <div style={{ fontSize:'12px', color:'#8b8aad', marginBottom:'16px' }}>New users and jobs per day this week</div>
        <div style={{ display:'flex', gap:'8px', alignItems:'flex-end', height:'120px', padding:'8px 0', overflowX:'auto' }}>
          {(data.weekly_activity ?? []).map(({ day, new_users, new_jobs }) => {
            const total = new_users + new_jobs
            const maxHeight = Math.max(...(data.weekly_activity.map(w => w.new_users + w.new_jobs))) || 1
            const height = `${(total / maxHeight) * 100}%`
            return (
              <div key={day} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1, minWidth:'32px', gap:'6px' }}>
                <div style={{ background:'linear-gradient(180deg,#a78bfa,#7c3aed)', borderRadius:'6px 6px 0 0', width:'100%', height }} />
                <div style={{ fontSize:'10px', color:'#8b8aad', fontWeight:600, whiteSpace:'nowrap' }}>{day}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}