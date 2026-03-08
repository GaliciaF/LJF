import { useState, useEffect, useRef } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../contexts/AuthContext'

export default function Messages() {
  const { user }                        = useAuth()
  const [conversations, setConvs]       = useState([])
  const [messages, setMessages]         = useState([])
  const [selected, setSelected]         = useState(null)
  const [text, setText]                 = useState('')
  const [loading, setLoading]           = useState(true)
  const bottomRef                       = useRef(null)

  useEffect(() => { api.get('/employer/messages').then(res=>setConvs(res.data)).finally(()=>setLoading(false)) }, [])

  useEffect(() => {
    if (!selected) return
    api.get(`/employer/messages/${selected}`).then(res=>setMessages(res.data))
  }, [selected])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  const handleSend = async () => {
    if (!text.trim() || !selected) return
    const msg = await api.post('/employer/messages', { receiver_id: selected, body: text })
    setMessages(p=>[...p, msg.data])
    setText('')
  }

  const card = { background:'#fff',borderRadius:'14px',border:'1px solid #e5e0d0',overflow:'hidden',boxShadow:'0 1px 3px rgba(0,0,0,.08)' }
  const ava  = (sz=36) => ({ width:sz,height:sz,borderRadius:'50%',background:'linear-gradient(135deg,#d97706,#b45309)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:sz*.36,fontWeight:700,color:'#fff',flexShrink:0 })
  const ini  = (n='') => n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()

  return (
    <div style={{ padding:'28px',background:'#fffdf5',minHeight:'100vh' }}>
      <div style={{ display:'grid',gridTemplateColumns:'280px 1fr',gap:'16px',height:'calc(100vh - 130px)' }}>
        {/* Conversations */}
        <div style={{ ...card,display:'flex',flexDirection:'column' }}>
          <div style={{ padding:'16px',borderBottom:'1px solid #e5e0d0',fontWeight:700,fontSize:'14px' }}>💬 Messages</div>
          <div style={{ flex:1,overflowY:'auto' }}>
            {loading ? <div style={{ padding:'16px',color:'#6b7280',fontSize:'13px' }}>Loading...</div>
              : conversations.length===0 ? <div style={{ padding:'16px',color:'#6b7280',fontSize:'13px' }}>No conversations yet.</div>
              : conversations.map(c=>(
                <div key={c.user?.id} onClick={()=>setSelected(c.user?.id)}
                  style={{ display:'flex',gap:'10px',padding:'12px 16px',cursor:'pointer',borderBottom:'1px solid #f3f4f6',background:selected===c.user?.id?'rgba(217,119,6,.06)':'transparent',transition:'background .15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(217,119,6,.04)'}
                  onMouseLeave={e=>e.currentTarget.style.background=selected===c.user?.id?'rgba(217,119,6,.06)':'transparent'}>
                  <div style={ava()}>{ini(c.user?.name)}</div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontWeight:600,fontSize:'13px' }}>{c.user?.name}</div>
                    <div style={{ fontSize:'11px',color:'#6b7280',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{c.last?.body}</div>
                  </div>
                  {c.unread>0 && <div style={{ width:'18px',height:'18px',borderRadius:'50%',background:'#d97706',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',fontWeight:700,color:'#fff',flexShrink:0 }}>{c.unread}</div>}
                </div>
              ))
            }
          </div>
        </div>

        {/* Thread */}
        <div style={{ ...card,display:'flex',flexDirection:'column' }}>
          {!selected
            ? <div style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'#6b7280',fontSize:'14px' }}>Select a conversation to start messaging.</div>
            : <>
              <div style={{ flex:1,overflowY:'auto',padding:'16px',display:'flex',flexDirection:'column',gap:'10px' }}>
                {messages.map(m=>{
                  const mine = m.sender_id === user?.id
                  return (
                    <div key={m.id} style={{ display:'flex',justifyContent:mine?'flex-end':'flex-start' }}>
                      <div style={{ maxWidth:'70%',padding:'10px 14px',borderRadius:mine?'18px 18px 4px 18px':'18px 18px 18px 4px',background:mine?'#d97706':'#f3f4f6',color:mine?'#fff':'#111827',fontSize:'13px',lineHeight:1.5 }}>{m.body}</div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>
              <div style={{ padding:'12px 16px',borderTop:'1px solid #e5e0d0',display:'flex',gap:'10px' }}>
                <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSend()} placeholder="Type a message..."
                  style={{ flex:1,padding:'9px 14px',border:'1.5px solid #e5e0d0',borderRadius:'9px',fontSize:'13px',outline:'none',background:'#fffdf5' }} />
                <button onClick={handleSend} style={{ background:'#d97706',color:'#fff',border:'none',padding:'9px 18px',borderRadius:'9px',fontSize:'13px',fontWeight:600,cursor:'pointer' }}>Send</button>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  )
}
