import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function BrowseWorkers() {
  const navigate = useNavigate()
  const [workers,   setWorkers]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [modal,     setModal]     = useState(null)
  const [msgText,   setMsgText]   = useState('')
  const [sending,   setSending]   = useState(false)
  const [err,       setErr]       = useState('')
  const [isMobile,  setIsMobile]  = useState(window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const loadWorkers = () => {
    setLoading(true)
    api.get('/employer/workers', { params: { search: search || null } })
      .then(res => setWorkers(res.data.data ?? res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadWorkers() }, [])

  const openModal  = (w) => { setModal(w); setMsgText(''); setErr('') }
  const closeModal = () => { setModal(null); setMsgText(''); setErr('') }

  const sendFirstMessage = async () => {
    if (!msgText.trim()) { setErr('Please type a message first.'); return }
    setSending(true); setErr('')
    try {
      await api.post('/employer/messages', { receiver_id: modal.id, body: msgText.trim() })
      closeModal()
      navigate(`/employer/messages?userId=${modal.id}`)
    } catch {
      setErr('Failed to send message. Please try again.')
    } finally { setSending(false) }
  }

  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e5e0d0',padding:'18px',boxShadow:'0 1px 3px rgba(0,0,0,.08)',transition:'all .2s' }
  const tag  = (bg,c,b) => ({ display:'inline-flex',padding:'2px 8px',borderRadius:'20px',fontSize:'10px',fontWeight:600,background:bg,color:c,border:`1px solid ${b}` })
  const btn  = (bg,c,b) => ({ background:bg,color:c,border:b?`1px solid ${b}`:'none',padding:'7px 14px',borderRadius:'8px',fontSize:'12px',fontWeight:600,cursor:'pointer' })
  const ini  = (n='') => n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()

  return (
    <div style={{ padding: isMobile ? '14px' : '28px', maxWidth:'1200px', background:'#fffdf5', minHeight:'100vh' }}>

      {/* Compose Modal */}
      {modal && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.45)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px' }}
          onClick={e => e.target===e.currentTarget && closeModal()}>
          <div style={{ background:'#fff',borderRadius:'16px',padding: isMobile ? '20px' : '28px',width:'100%',maxWidth:'460px',boxShadow:'0 20px 60px rgba(0,0,0,.2)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px' }}>
              <div style={{ width:'44px',height:'44px',borderRadius:'50%',background:'linear-gradient(135deg,#16a34a,#15803d)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',fontWeight:700,color:'#fff',flexShrink:0 }}>
                {ini(modal.name)}
              </div>
              <div>
                <div style={{ fontWeight:700,fontSize:'15px' }}>{modal.name}</div>
                <div style={{ fontSize:'12px',color:'#6b7280' }}>{modal.worker_profile?.barangay ?? 'Worker'}</div>
              </div>
              <button onClick={closeModal} style={{ marginLeft:'auto',background:'none',border:'none',fontSize:'20px',cursor:'pointer',color:'#9ca3af' }}>✕</button>
            </div>
            {err && <div style={{ background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.3)',borderRadius:'8px',padding:'10px 14px',marginBottom:'14px',color:'#ef4444',fontSize:'13px' }}>{err}</div>}
            <textarea
              value={msgText}
              onChange={e => setMsgText(e.target.value)}
              onKeyDown={e => e.key==='Enter' && !e.shiftKey && sendFirstMessage()}
              placeholder={`Hi ${modal.name.split(' ')[0]}, I'd like to discuss a job opportunity...`}
              rows={4}
              style={{ width:'100%',padding:'12px 14px',border:'1.5px solid #e5e0d0',borderRadius:'10px',fontSize:'14px',outline:'none',resize:'none',boxSizing:'border-box',background:'#fffdf5',lineHeight:1.5 }}
            />
            <div style={{ display:'flex',gap:'10px',marginTop:'14px' }}>
              <button onClick={closeModal} style={{ ...btn('transparent','#6b7280','#e5e0d0'),flex:1,padding:'10px',justifyContent:'center',display:'flex' }}>Cancel</button>
              <button onClick={sendFirstMessage} disabled={sending} style={{ ...btn('#d97706','#fff'),flex:2,padding:'10px',justifyContent:'center',display:'flex',opacity:sending?.7:1 }}>
                {sending ? 'Sending...' : '💬 Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ display:'flex',gap:'10px',marginBottom:'20px' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&loadWorkers()} placeholder="🔍 Search by skill or name..."
          style={{ flex:1,padding:'9px 14px',border:'1.5px solid #e5e0d0',borderRadius:'9px',fontSize:'13px',background:'#fff',color:'#111827',outline:'none',minWidth:0 }} />
        <button style={btn('#d97706','#fff')} onClick={loadWorkers}>Search</button>
      </div>

      {loading ? (
        <div style={{ color:'#6b7280' }}>Loading workers...</div>
      ) : (
        <div style={{
          display:'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill,minmax(280px,1fr))',
          gap:'16px'
        }}>
          {workers.length === 0 ? (
            <div style={{ gridColumn:'1/-1',textAlign:'center',color:'#6b7280',padding:'40px' }}>No workers found.</div>
          ) : workers.map(w => (
            <div key={w.id} style={card}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='#d97706';e.currentTarget.style.transform='translateY(-2px)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='#e5e0d0';e.currentTarget.style.transform='translateY(0)'}}>
              <div style={{ display:'flex',gap:'12px',marginBottom:'10px' }}>
                <div style={{ width:'52px',height:'52px',borderRadius:'50%',background:'linear-gradient(135deg,#16a34a,#15803d)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',fontWeight:700,color:'#fff',flexShrink:0 }}>
                  {ini(w.name)}
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontWeight:700,fontSize:'14px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{w.name}</div>
                  <div style={{ fontSize:'12px',color:'#6b7280' }}>{w.worker_profile?.barangay ?? '—'} · ⭐ {w.avg_rating ?? 'New'}</div>
                  {w.worker_profile?.id_verification_status==='verified' && (
                    <span style={tag('rgba(22,163,74,.1)','#16a34a','rgba(22,163,74,.3)')}>✓ Verified</span>
                  )}
                </div>
              </div>
              <div style={{ display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'10px' }}>
                {(w.worker_profile?.skills ?? []).slice(0,3).map(s => (
                  <span key={s} style={tag('rgba(217,119,6,.08)','#d97706','rgba(217,119,6,.25)')}>{s}</span>
                ))}
              </div>
              <div style={{ fontSize:'12px',color:'#16a34a',fontWeight:700,marginBottom:'12px' }}>
                ₱{w.worker_profile?.expected_rate?.toLocaleString() ?? '—'}/{w.worker_profile?.rate_type==='Daily'?'day':'hr'}
                {w.worker_profile?.negotiable && <span style={{ color:'#6b7280',fontWeight:400 }}> · Negotiable</span>}
              </div>
              <button style={{ ...btn('#d97706','#fff'),width:'100%',justifyContent:'center',display:'flex' }} onClick={() => openModal(w)}>
                💬 Message
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}