import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function HandleDisputes() {
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/admin/disputes')
      .then(res => setDisputes(res.data.data ?? res.data))
      .finally(() => setLoading(false))
  }, [])

  const resolve = async (id, resolution) => {
    await api.patch(`/admin/disputes/${id}`, { status:'resolved', resolution })
    setDisputes(p => p.filter(d => d.id !== id))
  }

  const dismiss = async (id) => {
    await api.patch(`/admin/disputes/${id}`, { status:'dismissed' })
    setDisputes(p => p.filter(d => d.id !== id))
  }

  const tag = (bg,c,b) => ({ display:'inline-flex', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600, background:bg, color:c, border:`1px solid ${b}`, whiteSpace:'nowrap' })
  const btn = (bg,c,b) => ({ background:bg, color:c, border:b?`1px solid ${b}`:'none', padding:'7px 14px', borderRadius:'8px', fontSize:'12px', fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' })
  const ava = (bg, sz=40) => ({ width:sz, height:sz, borderRadius:'50%', background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:sz*.36, fontWeight:700, color:'#fff', flexShrink:0 })
  const ini = (n='') => n.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
  const card = { background:'#161525', borderRadius:'14px', border:'1px solid #2a2940', padding:'16px', marginBottom:'16px' }

  if (loading) return <div style={{ padding:'28px', color:'#8b8aad' }}>Loading disputes...</div>

  return (
    <div style={{ padding:'16px', maxWidth:'1100px', boxSizing:'border-box' }}>
      <style>{`
        @media (min-width: 640px) {
          .hd-outer { padding: 28px !important; }
          .hd-card  { padding: 20px !important; }
        }

        /* Claims grid: stacks on mobile, side-by-side on tablet+ */
        .hd-claims-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }
        @media (min-width: 560px) {
          .hd-claims-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .hd-claim-box {
          border-radius: 10px;
          padding: 14px;
        }

        .hd-claim-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .hd-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .hd-dispute-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
      `}</style>

      {disputes.length === 0 ? (
        <div style={{ ...card, textAlign:'center', color:'#5a5978', padding:'40px' }}>No open disputes. ✅</div>
      ) : disputes.map(d => (
        <div key={d.id} className="hd-card" style={card}>
          <div className="hd-dispute-header">
            <span style={{ fontSize:'15px', fontWeight:700, color:'#f0eeff' }}>⚖️ Dispute #{d.id}</span>
            <span style={tag('rgba(248,113,113,.12)','#f87171','rgba(248,113,113,.3)')}>{d.type}</span>
            {d.urgency === 'urgent' && <span style={tag('rgba(251,191,36,.12)','#fbbf24','rgba(251,191,36,.3)')}>🔴 Urgent</span>}
          </div>

          <div className="hd-claims-grid">
            {/* Worker side */}
            <div className="hd-claim-box" style={{ background:'rgba(34,197,94,.06)', border:'1px solid rgba(34,197,94,.2)' }}>
              <div className="hd-claim-header">
                <div style={ava('linear-gradient(135deg,#22c55e,#15803d)')}>{ini(d.job?.hired_worker?.name ?? 'W')}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:'13px', color:'#f0eeff' }}>{d.job?.hired_worker?.name ?? 'Worker'}</div>
                  <div style={{ fontSize:'11px', color:'#22c55e' }}>Worker's Claim</div>
                </div>
              </div>
              <div style={{ fontSize:'13px', color:'#8b8aad', lineHeight:1.5 }}>{d.worker_claim ?? 'No claim submitted.'}</div>
            </div>

            {/* Employer side */}
            <div className="hd-claim-box" style={{ background:'rgba(251,191,36,.06)', border:'1px solid rgba(251,191,36,.2)' }}>
              <div className="hd-claim-header">
                <div style={ava('linear-gradient(135deg,#fbbf24,#b45309)')}>{ini(d.job?.employer?.name ?? 'E')}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:'13px', color:'#f0eeff' }}>{d.job?.employer?.name ?? 'Employer'}</div>
                  <div style={{ fontSize:'11px', color:'#fbbf24' }}>Employer's Claim</div>
                </div>
              </div>
              <div style={{ fontSize:'13px', color:'#8b8aad', lineHeight:1.5 }}>{d.employer_claim ?? 'No claim submitted.'}</div>
            </div>
          </div>

          <div className="hd-actions">
            <button style={btn('rgba(34,197,94,.12)','#22c55e','rgba(34,197,94,.3)')} onClick={() => resolve(d.id,'Ruled in favor of worker')}>✓ Favor Worker</button>
            <button style={btn('rgba(251,191,36,.12)','#fbbf24','rgba(251,191,36,.3)')} onClick={() => resolve(d.id,'Ruled in favor of employer')}>✓ Favor Employer</button>
            <button style={btn('rgba(96,165,250,.12)','#60a5fa','rgba(96,165,250,.3)')} onClick={() => resolve(d.id,'Resolved via mediation')}>🤝 Mediation</button>
            <button style={btn('transparent','#5a5978','#2a2940')} onClick={() => dismiss(d.id)}>Dismiss</button>
          </div>
        </div>
      ))}
    </div>
  )
}