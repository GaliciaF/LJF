import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  useEffect(() => {
    api.get('/worker/reviews').then(r => setReviews(r.data ?? [])).finally(()=>setLoading(false))
  }, [])

  const avg  = reviews.length > 0 ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : 0
  const Stars = ({ rating, size=16 }) => (
    <div style={{ display:'flex',gap:'2px' }}>
      {[1,2,3,4,5].map(i=><span key={i} style={{ fontSize:size,color:i<=rating?'#f59e0b':'#e2e8e2' }}>★</span>)}
    </div>
  )
  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2',padding: isMobile ? '16px' : '24px',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }

  if (loading) return <div style={{ padding:'28px',color:'#6b7280' }}>Loading reviews...</div>

  return (
    <div style={{ padding: isMobile ? '16px' : '28px', maxWidth:'900px' }}>
      {/* Summary Banner */}
      <div style={{ background:'linear-gradient(135deg,#16a34a,#15803d)',borderRadius:'14px',padding: isMobile ? '20px' : '28px',color:'#fff',marginBottom:'24px',display:'flex',alignItems:'center',gap:'24px',flexWrap:'wrap' }}>
        <div style={{ textAlign:'center', flexShrink:0 }}>
          <div style={{ fontSize: isMobile ? '40px' : '52px',fontWeight:800,fontFamily:'Syne,sans-serif',lineHeight:1 }}>{avg > 0 ? avg : '—'}</div>
          <Stars rating={Math.round(parseFloat(avg))} size={isMobile ? 16 : 20} />
          <div style={{ fontSize:'12px',opacity:.8,marginTop:'4px' }}>{reviews.length} review{reviews.length!==1?'s':''}</div>
        </div>
        <div style={{ flex:1, minWidth:'180px' }}>
          {[5,4,3,2,1].map(star => {
            const count = reviews.filter(r=>r.rating===star).length
            const pct   = reviews.length > 0 ? (count/reviews.length*100) : 0
            return (
              <div key={star} style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'4px' }}>
                <span style={{ fontSize:'12px',opacity:.8,width:'12px' }}>{star}</span>
                <span style={{ fontSize:'12px' }}>★</span>
                <div style={{ flex:1,height:'6px',background:'rgba(255,255,255,.3)',borderRadius:'3px',overflow:'hidden' }}>
                  <div style={{ width:`${pct}%`,height:'100%',background:'#fff',borderRadius:'3px' }} />
                </div>
                <span style={{ fontSize:'12px',opacity:.8,width:'20px' }}>{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {reviews.length === 0 ? (
        <div style={{ textAlign:'center',color:'#6b7280',padding:'60px 20px',...card }}>
          <div style={{ fontSize:'36px',marginBottom:'12px' }}>⭐</div>
          No reviews yet. Complete jobs to receive ratings from employers.
        </div>
      ) : (
        <div style={{ display:'flex',flexDirection:'column',gap:'12px' }}>
          {reviews.map(r=>(
            <div key={r.id} style={card}>
              <div style={{ display:'flex',alignItems:'flex-start',gap:'14px' }}>
                <div style={{ width:'40px',height:'40px',borderRadius:'50%',background:'linear-gradient(135deg,#d97706,#b45309)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',fontWeight:700,color:'#fff',flexShrink:0 }}>
                  {(r.reviewer?.name??'?').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'6px',flexWrap:'wrap',gap:'8px' }}>
                    <div>
                      <div style={{ fontWeight:700,fontSize:'14px' }}>{r.reviewer?.name??'Employer'}</div>
                      <div style={{ fontSize:'12px',color:'#6b7280' }}>{r.job?.title??'Job'}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <Stars rating={r.rating} />
                      <div style={{ fontSize:'11px',color:'#9ca3af',marginTop:'3px' }}>{new Date(r.created_at).toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'})}</div>
                    </div>
                  </div>
                  {r.comment && <div style={{ fontSize:'13px',color:'#374151',lineHeight:1.6,background:'#f9fafb',borderRadius:'8px',padding:'10px 12px',borderLeft:'3px solid #e2e8e2' }}>"{r.comment}"</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}