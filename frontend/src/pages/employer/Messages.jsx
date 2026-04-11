import { useState, useEffect, useRef } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../contexts/AuthContext'
import { useSearchParams } from 'react-router-dom'

function Avatar({ name='', photo, size=40, gradient='linear-gradient(135deg,#16a34a,#15803d)' }) {
  const [imgFailed, setImgFailed] = useState(false)
  const ini = (n) => n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  return (
    <div style={{ width:size,height:size,borderRadius:'50%',background:gradient,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'#fff',flexShrink:0,overflow:'hidden',fontSize:size*0.35 }}>
      {photo && !imgFailed
        ? <img src={photo} alt={name} style={{ width:'100%',height:'100%',objectFit:'cover' }} onError={()=>setImgFailed(true)} />
        : ini(name)
      }
    </div>
  )
}

export default function EmployerMessages() {
  const { user }           = useAuth()
  const [convos,  setConvos]  = useState([])
  const [thread,  setThread]  = useState([])
  const [active,  setActive]  = useState(null)
  const [body,    setBody]    = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showThread, setShowThread] = useState(false) // mobile: show thread pane
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const bottomRef = useRef()
  const pollRef   = useRef()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const targetId = parseInt(searchParams.get('userId'))
    api.get('/employer/messages')
      .then(async r => {
        setConvos(r.data)
        if (targetId) {
          const match = r.data.find(c => c.user.id === targetId)
          if (match) { openThread(match); if (isMobile) setShowThread(true) }
          else {
            try {
              await api.post('/employer/messages/start', { worker_id: targetId })
              const workerInfo = await api.get(`/employer/profile/${targetId}`).catch(() => null)
              const name  = workerInfo?.data?.name ?? `User ${targetId}`
              const photo = workerInfo?.data?.worker_profile?.photo_path ?? null
              const placeholder = { user:{ id:targetId, name, photo }, last:null, unread:0 }
              setConvos(prev => [placeholder, ...prev])
              setActive(placeholder); setThread([])
              if (isMobile) setShowThread(true)
            } catch {
              const placeholder = { user:{ id:targetId, name:`New Message`, photo:null }, last:null, unread:0 }
              setConvos(prev => [placeholder, ...prev])
              setActive(placeholder); setThread([])
              if (isMobile) setShowThread(true)
            }
          }
        } else if (r.data.length > 0) { openThread(r.data[0]) }
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [thread])

  useEffect(() => {
    if (!active) return
    pollRef.current = setInterval(() => {
      api.get(`/employer/messages/${active.user.id}`).then(r => setThread(r.data)).catch(()=>{})
      api.get('/employer/messages').then(r => setConvos(r.data)).catch(()=>{})
    }, 5000)
    return () => clearInterval(pollRef.current)
  }, [active])

  const openThread = async (convo) => {
    setActive(convo); clearInterval(pollRef.current)
    try {
      const r = await api.get(`/employer/messages/${convo.user.id}`)
      setThread(r.data)
      setConvos(prev => prev.map(c => c.user.id===convo.user.id ? {...c,unread:0} : c))
    } catch { setThread([]) }
  }

  const sendMessage = async () => {
    if (!body.trim() || !active || sending) return
    setSending(true)
    try {
      const r = await api.post('/employer/messages', { receiver_id:active.user.id, body:body.trim() })
      setThread(prev => [...prev, r.data]); setBody('')
      api.get('/employer/messages').then(r => setConvos(r.data))
    } catch {}
    finally { setSending(false) }
  }

  const fmtTime = d => new Date(d).toLocaleTimeString('en-PH', { hour:'2-digit', minute:'2-digit' })
  const fmtDate = d => {
    const date=new Date(d), today=new Date()
    return date.toDateString()===today.toDateString() ? fmtTime(d) : date.toLocaleDateString('en-PH',{month:'short',day:'numeric'})
  }

  if (loading) return <div style={{ padding:28, color:'#6b7280' }}>Loading messages...</div>

  const totalUnread = convos.reduce((s,c) => s+(c.unread??0), 0)

  // ── Mobile: show either convo list or thread ──
  if (isMobile) {
    return (
      <div style={{ background:'#fffdf5', minHeight:'100vh' }}>
        {!showThread ? (
          // Convo list
          <div style={{ background:'#fff' }}>
            <div style={{ padding:'16px 18px', borderBottom:'1px solid #e5e0d0', fontWeight:700, fontSize:15, display:'flex', alignItems:'center', gap:'8px' }}>
              💬 Messages
              {totalUnread > 0 && <span style={{ background:'#d97706',color:'#fff',borderRadius:20,padding:'2px 8px',fontSize:11,fontWeight:700 }}>{totalUnread}</span>}
            </div>
            {convos.length === 0
              ? <div style={{ textAlign:'center',color:'#6b7280',padding:'60px 20px',fontSize:13 }}>No conversations yet.</div>
              : convos.map(c => (
                <div key={c.user.id} onClick={() => { openThread(c); setShowThread(true) }}
                  style={{ display:'flex',gap:12,alignItems:'center',padding:'14px 16px',borderBottom:'1px solid #f3f4f6',cursor:'pointer',background:active?.user.id===c.user.id?'rgba(217,119,6,.08)':'transparent' }}>
                  <Avatar name={c.user.name} photo={c.user.photo} size={44} />
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontWeight:700,fontSize:14,color:'#111827' }}>{c.user.name}</div>
                    <div style={{ fontSize:12,color:'#6b7280',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
                      {c.last ? (c.last.sender_id===user?.id?'You: ':'')+c.last.body : <em style={{ color:'#9ca3af' }}>New conversation</em>}
                    </div>
                  </div>
                  <div style={{ textAlign:'right',flexShrink:0 }}>
                    <div style={{ fontSize:11,color:'#9ca3af' }}>{c.last ? fmtDate(c.last.created_at) : ''}</div>
                    {c.unread > 0 && <div style={{ width:18,height:18,background:'#d97706',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#fff',marginTop:4,marginLeft:'auto' }}>{c.unread}</div>}
                  </div>
                </div>
              ))
            }
          </div>
        ) : (
          // Thread
          <div style={{ display:'flex',flexDirection:'column',height:'100vh',background:'#fafaf8' }}>
            <div style={{ padding:'12px 16px',borderBottom:'1px solid #e5e0d0',display:'flex',alignItems:'center',gap:12,background:'#fff',flexShrink:0 }}>
              <button onClick={() => setShowThread(false)} style={{ background:'none',border:'none',fontSize:'20px',cursor:'pointer',color:'#6b7280',padding:0,display:'flex',alignItems:'center' }}>←</button>
              <Avatar name={active?.user.name??''} photo={active?.user.photo} size={36} />
              <div>
                <div style={{ fontWeight:700,fontSize:14 }}>{active?.user.name}</div>
                <div style={{ fontSize:11,color:'#16a34a' }}>Worker</div>
              </div>
            </div>
            <div style={{ flex:1,overflowY:'auto',padding:16,display:'flex',flexDirection:'column',gap:12 }}>
              {thread.length===0 && <div style={{ textAlign:'center',color:'#9ca3af',fontSize:13,marginTop:40 }}>No messages yet. Say hello! 👋</div>}
              {thread.map((m,i) => {
                const isMe = m.sender_id===user?.id
                const showDate = i===0 || new Date(thread[i-1].created_at).toDateString()!==new Date(m.created_at).toDateString()
                return (
                  <div key={m.id??i}>
                    {showDate && <div style={{ textAlign:'center',fontSize:11,color:'#9ca3af',margin:'8px 0' }}>{new Date(m.created_at).toLocaleDateString('en-PH',{weekday:'short',month:'short',day:'numeric'})}</div>}
                    <div style={{ display:'flex',gap:8,flexDirection:isMe?'row-reverse':'row',alignItems:'flex-end' }}>
                      {!isMe && <Avatar name={active?.user.name??''} photo={active?.user.photo} size={28} />}
                      <div style={{ maxWidth:'75%' }}>
                        <div style={{ padding:'10px 14px',borderRadius:isMe?'16px 16px 4px 16px':'16px 16px 16px 4px',fontSize:14,lineHeight:1.5,background:isMe?'#d97706':'#fff',color:isMe?'#fff':'#111827',boxShadow:'0 1px 2px rgba(0,0,0,.08)' }}>{m.body}</div>
                        <div style={{ fontSize:10,color:'#9ca3af',marginTop:3,textAlign:isMe?'right':'left' }}>{fmtTime(m.created_at)}{isMe&&<span style={{ marginLeft:4 }}>{m.is_read?' ✓✓':' ✓'}</span>}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>
            <div style={{ padding:'12px 14px',borderTop:'1px solid #e5e0d0',display:'flex',gap:10,alignItems:'center',background:'#fff',flexShrink:0 }}>
              <input placeholder="Type a message..." value={body} onChange={e=>setBody(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendMessage()}
                style={{ flex:1,padding:'10px 14px',border:'1.5px solid #e5e0d0',borderRadius:24,fontSize:14,outline:'none',background:'#fffdf5',minWidth:0 }} />
              <button onClick={sendMessage} disabled={sending||!body.trim()}
                style={{ width:40,height:40,borderRadius:'50%',background:body.trim()?'#d97706':'#e5e0d0',color:'#fff',border:'none',fontSize:18,cursor:body.trim()?'pointer':'default',display:'flex',alignItems:'center',justifyContent:'center',transition:'background .2s',flexShrink:0 }}>➤</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Desktop ──
  return (
    <div style={{ padding:28, background:'#fffdf5', minHeight:'100vh' }}>
      {convos.length===0 ? (
        <div style={{ textAlign:'center',color:'#6b7280',padding:60,background:'#fff',borderRadius:14,border:'1px solid #e5e0d0' }}>
          <div style={{ fontSize:40,marginBottom:12 }}>💬</div>
          <div style={{ fontWeight:700,marginBottom:6 }}>No conversations yet</div>
          <div style={{ fontSize:13 }}>Workers will appear here once they message you or you contact them.</div>
        </div>
      ) : (
        <div style={{ display:'grid',gridTemplateColumns:'300px 1fr',height:'calc(100vh - 130px)',border:'1px solid #e5e0d0',borderRadius:14,overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,.06)' }}>
          <div style={{ background:'#fff',borderRight:'1px solid #e5e0d0',display:'flex',flexDirection:'column' }}>
            <div style={{ padding:'16px 18px',borderBottom:'1px solid #e5e0d0',fontWeight:700,fontSize:15 }}>
              💬 Messages
              {totalUnread > 0 && <span style={{ marginLeft:8,background:'#d97706',color:'#fff',borderRadius:20,padding:'2px 8px',fontSize:11,fontWeight:700 }}>{totalUnread}</span>}
            </div>
            <div style={{ flex:1,overflowY:'auto' }}>
              {convos.map(c => (
                <div key={c.user.id} onClick={() => openThread(c)}
                  style={{ display:'flex',gap:12,alignItems:'center',padding:'14px 16px',borderBottom:'1px solid #f3f4f6',cursor:'pointer',background:active?.user.id===c.user.id?'rgba(217,119,6,.08)':'transparent',transition:'background .15s' }}
                  onMouseEnter={e=>{ if(active?.user.id!==c.user.id) e.currentTarget.style.background='#fffbf0' }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=active?.user.id===c.user.id?'rgba(217,119,6,.08)':'transparent' }}>
                  <Avatar name={c.user.name} photo={c.user.photo} size={40} />
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontWeight:700,fontSize:14,color:'#111827' }}>{c.user.name}</div>
                    <div style={{ fontSize:12,color:'#6b7280',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
                      {c.last?(c.last.sender_id===user?.id?'You: ':'')+c.last.body:<em style={{ color:'#9ca3af' }}>New conversation</em>}
                    </div>
                  </div>
                  <div style={{ textAlign:'right',flexShrink:0 }}>
                    <div style={{ fontSize:11,color:'#9ca3af' }}>{c.last?fmtDate(c.last.created_at):''}</div>
                    {c.unread>0&&<div style={{ width:18,height:18,background:'#d97706',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#fff',marginTop:4,marginLeft:'auto' }}>{c.unread}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:'#fafaf8',display:'flex',flexDirection:'column' }}>
            {active ? (
              <>
                <div style={{ padding:'14px 20px',borderBottom:'1px solid #e5e0d0',display:'flex',alignItems:'center',gap:12,background:'#fff' }}>
                  <Avatar name={active.user.name} photo={active.user.photo} size={38} />
                  <div>
                    <div style={{ fontWeight:700,fontSize:14 }}>{active.user.name}</div>
                    <div style={{ fontSize:11,color:'#16a34a' }}>Worker</div>
                  </div>
                </div>
                <div style={{ flex:1,overflowY:'auto',padding:20,display:'flex',flexDirection:'column',gap:12 }}>
                  {thread.length===0&&<div style={{ textAlign:'center',color:'#9ca3af',fontSize:13,marginTop:40 }}>No messages yet. Say hello! 👋</div>}
                  {thread.map((m,i) => {
                    const isMe=m.sender_id===user?.id
                    const showDate=i===0||new Date(thread[i-1].created_at).toDateString()!==new Date(m.created_at).toDateString()
                    return (
                      <div key={m.id??i}>
                        {showDate&&<div style={{ textAlign:'center',fontSize:11,color:'#9ca3af',margin:'8px 0' }}>{new Date(m.created_at).toLocaleDateString('en-PH',{weekday:'short',month:'short',day:'numeric'})}</div>}
                        <div style={{ display:'flex',gap:8,flexDirection:isMe?'row-reverse':'row',alignItems:'flex-end' }}>
                          {!isMe&&<Avatar name={active.user.name} photo={active.user.photo} size={28} />}
                          <div style={{ maxWidth:'65%' }}>
                            <div style={{ padding:'10px 14px',borderRadius:isMe?'16px 16px 4px 16px':'16px 16px 16px 4px',fontSize:14,lineHeight:1.5,background:isMe?'#d97706':'#fff',color:isMe?'#fff':'#111827',boxShadow:'0 1px 2px rgba(0,0,0,.08)' }}>{m.body}</div>
                            <div style={{ fontSize:10,color:'#9ca3af',marginTop:3,textAlign:isMe?'right':'left' }}>{fmtTime(m.created_at)}{isMe&&<span style={{ marginLeft:4 }}>{m.is_read?' ✓✓':' ✓'}</span>}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={bottomRef} />
                </div>
                <div style={{ padding:'14px 16px',borderTop:'1px solid #e5e0d0',display:'flex',gap:10,alignItems:'center',background:'#fff' }}>
                  <input placeholder="Type a message..." value={body} onChange={e=>setBody(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendMessage()}
                    style={{ flex:1,padding:'10px 14px',border:'1.5px solid #e5e0d0',borderRadius:24,fontSize:14,outline:'none',background:'#fffdf5' }} />
                  <button onClick={sendMessage} disabled={sending||!body.trim()}
                    style={{ width:40,height:40,borderRadius:'50%',background:body.trim()?'#d97706':'#e5e0d0',color:'#fff',border:'none',fontSize:18,cursor:body.trim()?'pointer':'default',display:'flex',alignItems:'center',justifyContent:'center',transition:'background .2s',flexShrink:0 }}>➤</button>
                </div>
              </>
            ) : (
              <div style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'#6b7280',flexDirection:'column',gap:8 }}>
                <div style={{ fontSize:32 }}>💬</div>
                <div>Select a conversation</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}