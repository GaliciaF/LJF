import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function Suspended() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('suspended')

  const fetch = () => {
    setLoading(true)
    api.get('/admin/users', { params: { status: tab } })
      .then(res => setUsers(res.data.data ?? res.data))
      .finally(() => setLoading(false))
  }
  useEffect(() => { fetch() }, [tab])

  const handleReinstate = async (id) => { await api.patch(`/admin/users/${id}/status`, { status:'active' }); fetch() }
  const handleBan = async (id) => { await api.patch(`/admin/users/${id}/status`, { status:'banned', suspension_reason:'Escalated from suspension' }); fetch() }

  const tag  = (bg,c,b) => ({ display:'inline-flex',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:bg,color:c,border:`1px solid ${b}` })
  const btn  = (bg,c,b) => ({ background:bg,color:c,border:b?`1px solid ${b}`:'none',padding:'7px 14px',borderRadius:'8px',fontSize:'12px',fontWeight:600,cursor:'pointer' })
  const chip = (a) => ({ padding:'6px 16px',borderRadius:'20px',border:`1.5px solid ${a?'#7c3aed':'#2a2940'}`,fontSize:'12px',fontWeight:a?600:500,color:a?'#a78bfa':'#8b8aad',cursor:'pointer',background:a?'rgba(124,58,237,.12)':'transparent' })
  const ava  = (sz=44) => ({ width:sz,height:sz,borderRadius:'50%',background:'linear-gradient(135deg,#f87171,#b91c1c)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:sz*.36,fontWeight:700,color:'#fff',flexShrink:0 })
  const ini  = (n='') => n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  const card = { background:'#161525',borderRadius:'14px',border:'1px solid #2a2940',padding:'18px 20px',marginBottom:'12px' }

  if (loading) return <div style={{ padding:'28px',color:'#8b8aad' }}>Loading...</div>

  return (
    <div style={{ padding:'28px',maxWidth:'900px' }}>
      <div style={{ display:'flex',gap:'8px',marginBottom:'20px' }}>
        <div style={chip(tab==='suspended')} onClick={()=>setTab('suspended')}>⏸ Suspended</div>
        <div style={chip(tab==='banned')} onClick={()=>setTab('banned')}>⛔ Banned</div>
      </div>
      {users.length===0
        ? <div style={{ ...card,textAlign:'center',color:'#5a5978',padding:'40px' }}>No {tab} users.</div>
        : users.map(u=>(
          <div key={u.id} style={card}>
            <div style={{ display:'flex',alignItems:'flex-start',gap:'14px' }}>
              <div style={ava()}>{ini(u.name)}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'4px' }}>
                  <div style={{ fontWeight:700,fontSize:'15px',color:'#f0eeff' }}>{u.name}</div>
                  <span style={tag('rgba(124,58,237,.12)','#a78bfa','rgba(124,58,237,.3)')}>{u.role}</span>
                  <span style={u.status==='banned' ? tag('rgba(248,113,113,.12)','#f87171','rgba(248,113,113,.3)') : tag('rgba(251,191,36,.12)','#fbbf24','rgba(251,191,36,.3)')}>{u.status}</span>
                </div>
                <div style={{ fontSize:'12px',color:'#8b8aad',marginBottom:'8px' }}>
                  {u.suspension_reason??'No reason recorded'} · {u.suspended_until ? `Until ${new Date(u.suspended_until).toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'})}` : 'Indefinite'}
                </div>
                <div style={{ display:'flex',gap:'8px' }}>
                  <button style={btn('rgba(34,197,94,.12)','#22c55e','rgba(34,197,94,.3)')} onClick={()=>handleReinstate(u.id)}>✓ Reinstate</button>
                  {u.status==='suspended' && <button style={btn('rgba(248,113,113,.12)','#f87171','rgba(248,113,113,.3)')} onClick={()=>handleBan(u.id)}>⛔ Permanent Ban</button>}
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}
