import { useState, useEffect, useRef } from 'react'
import api from '../../api/axios'

export default function Messages() {
  const [convos,  setConvos]  = useState([])
  const [active,  setActive]  = useState(null)
  const [thread,  setThread]  = useState([])
  const [body,    setBody]    = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef()

  useEffect(() => {
    api.get('/worker/messages')
      .then(r => { setConvos(r.data); if (r.data.length > 0) openThread(r.data[0]) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [thread])

  const openThread = async (convo) => {
    setActive(convo)
    try {
      const r = await api.get(`/worker/messages/${convo.user.id}`)
      setThread(r.data)
      setConvos(prev => prev.map(c => c.user.id===convo.user.id ? { ...c, unread:0 } : c))
    } catch { setThread([]) }
  }

  const sendMessage = async () => {
    if (!body.trim() || !active) return
    setSending(true)
    try {
      const r = await api.post('/worker/messages', { receiver_id: active.user.id, body: body.trim() })
      setThread(prev => [...prev, r.data])
      setBody('')
    } catch { }
    finally { setSending(false) }
  }

  const initials = (name) => (name ?? '?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  const ava      = (bg, sz=34) => ({ width:sz,height:sz,borderRadius:'50%',background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:sz*.4,fontWeight:700,color:'#fff',flexShrink:0 })
  const bubble   = (me) => ({ padding:'10px 14px',borderRadius:me?'16px 16px 4px 16px':'16px 16px 16px 4px',fontSize:'14px',maxWidth:'68%',lineHeight:1.5,background:me?'#16a34a':'#f1f5f1',color:me?'#fff':'#111827' })
  const myId = JSON.parse(localStorage.getItem('user') ?? '{}')?.id

  if (loading) return <div style={{ padding:'28px',color:'#6b7280' }}>Loading messages...</div>

  return (
    <div style={{ padding:'28px',maxWidth:'1100px' }}>
      {convos.length === 0 ? (
        <div style={{ textAlign:'center',color:'#6b7280',padding:'60px',background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2' }}>
          No conversations yet. Apply to jobs to start messaging employers.
        </div>
      ) : (
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1.6fr',height:'560px',border:'1px solid #e2e8e2',borderRadius:'14px',overflow:'hidden' }}>
          <div style={{ background:'#fff',borderRight:'1px solid #e2e8e2',display:'flex',flexDirection:'column' }}>
            <div style={{ padding:'14px 18px',borderBottom:'1px solid #e2e8e2',fontWeight:700,fontSize:'15px' }}>Conversations</div>
            <div style={{ flex:1,overflowY:'auto' }}>
              {convos.map(convo => (
                <div key={convo.user.id} onClick={()=>openThread(convo)} style={{ display:'flex',gap:'12px',alignItems:'center',padding:'14px 16px',borderBottom:'1px solid #e2e8e2',cursor:'pointer',background:active?.user.id===convo.user.id?'rgba(22,163,74,.06)':'transparent' }}>
                  <div style={ava('linear-gradient(135deg,#f59e0b,#d97706)')}>{initials(convo.user.name)}</div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontWeight:700,fontSize:'14px' }}>{convo.user.name}</div>
                    <div style={{ fontSize:'12px',color:'#6b7280',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{convo.last?.body ?? ''}</div>
                  </div>
                  <div style={{ textAlign:'right',flexShrink:0 }}>
                    <div style={{ fontSize:'11px',color:'#9ca3af' }}>{convo.last ? new Date(convo.last.created_at).toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'}) : ''}</div>
                    {convo.unread > 0 && <div style={{ width:'18px',height:'18px',background:'#16a34a',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',color:'#fff',marginTop:'4px',marginLeft:'auto' }}>{convo.unread}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:'#fff',display:'flex',flexDirection:'column' }}>
            {active ? (
              <>
                <div style={{ padding:'14px 20px',borderBottom:'1px solid #e2e8e2',display:'flex',alignItems:'center',gap:'12px' }}>
                  <div style={ava('linear-gradient(135deg,#f59e0b,#d97706)')}>{initials(active.user.name)}</div>
                  <div style={{ fontWeight:700,fontSize:'14px' }}>{active.user.name}</div>
                </div>
                <div style={{ flex:1,overflowY:'auto',padding:'20px',display:'flex',flexDirection:'column',gap:'12px' }}>
                  {thread.map((m,i) => {
                    const isMe = m.sender_id === myId
                    return (
                      <div key={m.id??i} style={{ display:'flex',gap:'8px',flexDirection:isMe?'row-reverse':'row' }}>
                        {!isMe && <div style={{ ...ava('linear-gradient(135deg,#f59e0b,#d97706)',28),alignSelf:'flex-end' }}>{initials(active.user.name)}</div>}
                        <div>
                          <div style={bubble(isMe)}>{m.body}</div>
                          <div style={{ fontSize:'10px',color:'#9ca3af',marginTop:'2px',textAlign:isMe?'right':'left' }}>{new Date(m.created_at).toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'})}</div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={bottomRef} />
                </div>
                <div style={{ padding:'14px 16px',borderTop:'1px solid #e2e8e2',display:'flex',gap:'10px',alignItems:'center' }}>
                  <input placeholder="Type a message..." value={body} onChange={e=>setBody(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendMessage()} style={{ flex:1,padding:'10px 14px',border:'1.5px solid #e2e8e2',borderRadius:'9px',fontSize:'14px',outline:'none' }} />
                  <button onClick={sendMessage} disabled={sending||!body.trim()} style={{ background:'#16a34a',color:'#fff',border:'none',padding:'10px 20px',borderRadius:'9px',fontSize:'13px',fontWeight:600,cursor:'pointer',opacity:!body.trim()?.5:1 }}>
                    {sending ? '...' : 'Send ➤'}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'#6b7280' }}>Select a conversation</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}