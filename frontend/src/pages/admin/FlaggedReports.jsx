import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function FlaggedReports() {
  const [reports, setReports]           = useState([])
  const [loading, setLoading]           = useState(true)
  const [filter, setFilter]             = useState('pending')
  const [suspendModal, setSuspendModal] = useState(null)
  const [suspendDays, setSuspendDays]   = useState(7)
  const [actionReason, setActionReason] = useState('')
  const [warnModal, setWarnModal]       = useState(null)
  const [banModal, setBanModal]         = useState(null)
  const [submitting, setSubmitting]     = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get('/admin/reports', { params: { status: filter } })
      .then(res => setReports(res.data.data ?? res.data))
      .finally(() => setLoading(false))
  }, [filter])

  const removeReport = (reportId) => setReports(p => p.filter(r => r.id !== reportId))

  const submitWarn = async () => {
    if (!warnModal) return
    setSubmitting(true)
    try {
      await api.patch(`/admin/reports/${warnModal.reportId}`, {
        action: 'warn',
        suspension_reason: actionReason || 'Violation of community guidelines.',
      })
      removeReport(warnModal.reportId)
      setWarnModal(null)
      setActionReason('')
    } finally { setSubmitting(false) }
  }

  const submitSuspend = async () => {
    if (!suspendModal) return
    setSubmitting(true)
    const until = new Date()
    until.setDate(until.getDate() + suspendDays)
    try {
      await api.patch(`/admin/reports/${suspendModal.reportId}`, {
        action: 'suspend',
        suspension_reason: actionReason || 'Violation of community guidelines.',
        suspended_until: until.toISOString(),
      })
      removeReport(suspendModal.reportId)
      setSuspendModal(null)
      setActionReason('')
      setSuspendDays(7)
    } finally { setSubmitting(false) }
  }

  const submitBan = async () => {
    if (!banModal) return
    setSubmitting(true)
    try {
      await api.patch(`/admin/reports/${banModal.reportId}`, {
        action: 'ban',
        suspension_reason: actionReason || 'Permanent violation of community guidelines.',
      })
      removeReport(banModal.reportId)
      setBanModal(null)
      setActionReason('')
    } finally { setSubmitting(false) }
  }

  const dismiss = async (reportId) => {
    await api.patch(`/admin/reports/${reportId}`, { action: 'dismiss' })
    removeReport(reportId)
  }

  const tag     = (bg,c,b) => ({ display:'inline-flex', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600, background:bg, color:c, border:`1px solid ${b}`, whiteSpace:'nowrap' })
  const btn     = (bg,c,b) => ({ background:bg, color:c, border:b?`1px solid ${b}`:'none', padding:'7px 14px', borderRadius:'8px', fontSize:'12px', fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' })
  const chip    = (a) => ({ padding:'6px 14px', borderRadius:'20px', border:`1.5px solid ${a?'#7c3aed':'#2a2940'}`, fontSize:'12px', fontWeight:a?600:500, color:a?'#a78bfa':'#8b8aad', cursor:'pointer', background:a?'rgba(124,58,237,.12)':'transparent', whiteSpace:'nowrap' })
  const ava     = (sz=44) => ({ width:sz, height:sz, borderRadius:'50%', background:'linear-gradient(135deg,#f87171,#b91c1c)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:sz*.36, fontWeight:700, color:'#fff', flexShrink:0 })
  const ini     = (n='') => n.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
  const card    = { background:'#161525', borderRadius:'14px', border:'1px solid #2a2940', padding:'16px', marginBottom:'12px' }
  const inp     = { width:'100%', padding:'9px 12px', border:'1px solid #2a2940', borderRadius:'8px', fontSize:'13px', background:'#1e1d30', color:'#f0eeff', outline:'none', boxSizing:'border-box', resize:'vertical' }

  const reasonColor = (r) => ['Fake profile','Fake credentials'].includes(r)
    ? { bg:'rgba(248,113,113,.12)', c:'#f87171', b:'rgba(248,113,113,.3)' }
    : { bg:'rgba(251,191,36,.12)', c:'#fbbf24', b:'rgba(251,191,36,.3)' }

  /* Modal — uses normal flow instead of position:fixed to avoid iframe collapse */
  const ModalWrap = ({ children }) => (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}>
      <div style={{ background:'#161525', border:'1px solid #2a2940', borderRadius:'16px', padding:'24px', width:'100%', maxWidth:'420px', boxSizing:'border-box' }}>
        {children}
      </div>
    </div>
  )

  if (loading) return <div style={{ padding:'28px', color:'#8b8aad' }}>Loading reports...</div>

  return (
    <div style={{ padding:'16px', maxWidth:'900px', boxSizing:'border-box' }}>
      <style>{`
        @media (min-width: 640px) {
          .fr-outer { padding: 28px !important; }
          .fr-card  { padding: 20px !important; }
        }

        .fr-report-inner {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .fr-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 4px;
        }

        .fr-header-tags {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 6px;
        }

        .fr-days-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .fr-modal-actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
          justify-content: flex-end;
          flex-wrap: wrap;
        }
      `}</style>

      {/* Warn Modal */}
      {warnModal && (
        <ModalWrap>
          <div style={{ fontSize:'16px', fontWeight:700, color:'#f0eeff', marginBottom:'6px' }}>⚠️ Warn User</div>
          <div style={{ fontSize:'13px', color:'#8b8aad', marginBottom:'16px' }}>
            Sending a warning to <span style={{ color:'#fbbf24', fontWeight:600 }}>{warnModal.reportedName}</span>. Their account stays active but they'll receive an in-app notification.
          </div>
          <label style={{ fontSize:'11px', fontWeight:600, color:'#8b8aad', display:'block', marginBottom:'6px' }}>REASON / MESSAGE TO USER</label>
          <textarea rows={3} style={inp} placeholder="e.g. Your behavior violated our community guidelines..." value={actionReason} onChange={e => setActionReason(e.target.value)} />
          <div className="fr-modal-actions">
            <button style={btn('transparent','#8b8aad','#2a2940')} onClick={() => { setWarnModal(null); setActionReason('') }}>Cancel</button>
            <button style={btn('rgba(251,191,36,.2)','#fbbf24','rgba(251,191,36,.4)')} onClick={submitWarn} disabled={submitting}>
              {submitting ? 'Sending...' : '⚠️ Send Warning'}
            </button>
          </div>
        </ModalWrap>
      )}

      {/* Suspend Modal */}
      {suspendModal && (
        <ModalWrap>
          <div style={{ fontSize:'16px', fontWeight:700, color:'#f0eeff', marginBottom:'6px' }}>🚫 Suspend User</div>
          <div style={{ fontSize:'13px', color:'#8b8aad', marginBottom:'16px' }}>
            Suspending <span style={{ color:'#f87171', fontWeight:600 }}>{suspendModal.reportedName}</span>. They won't be able to log in and will see a suspension notice with the end date.
          </div>
          <label style={{ fontSize:'11px', fontWeight:600, color:'#8b8aad', display:'block', marginBottom:'6px' }}>SUSPENSION DURATION</label>
          <div className="fr-days-row">
            {[1,3,7,14,30].map(d => (
              <div key={d} onClick={() => setSuspendDays(d)} style={{ padding:'6px 14px', borderRadius:'20px', border:`1.5px solid ${suspendDays===d?'#f87171':'#2a2940'}`, fontSize:'12px', fontWeight:suspendDays===d?700:500, color:suspendDays===d?'#f87171':'#8b8aad', cursor:'pointer', background:suspendDays===d?'rgba(248,113,113,.12)':'transparent' }}>
                {d} {d===1?'day':'days'}
              </div>
            ))}
          </div>
          <div style={{ fontSize:'12px', color:'#5a5978', marginBottom:'14px' }}>
            Reinstated on: <span style={{ color:'#f0eeff', fontWeight:600 }}>
              {(() => { const d=new Date(); d.setDate(d.getDate()+suspendDays); return d.toDateString() })()}
            </span>
          </div>
          <label style={{ fontSize:'11px', fontWeight:600, color:'#8b8aad', display:'block', marginBottom:'6px' }}>REASON / MESSAGE TO USER</label>
          <textarea rows={3} style={inp} placeholder="e.g. You have been suspended for violating community guidelines..." value={actionReason} onChange={e => setActionReason(e.target.value)} />
          <div className="fr-modal-actions">
            <button style={btn('transparent','#8b8aad','#2a2940')} onClick={() => { setSuspendModal(null); setActionReason(''); setSuspendDays(7) }}>Cancel</button>
            <button style={btn('rgba(248,113,113,.2)','#f87171','rgba(248,113,113,.4)')} onClick={submitSuspend} disabled={submitting}>
              {submitting ? 'Suspending...' : '🚫 Confirm Suspend'}
            </button>
          </div>
        </ModalWrap>
      )}

      {/* Ban Modal */}
      {banModal && (
        <ModalWrap>
          <div style={{ fontSize:'16px', fontWeight:700, color:'#f0eeff', marginBottom:'6px' }}>⛔ Permanently Ban User</div>
          <div style={{ fontSize:'13px', color:'#8b8aad', marginBottom:'16px' }}>
            Banning <span style={{ color:'#f87171', fontWeight:600 }}>{banModal.reportedName}</span> permanently. They will never be able to log in again.
          </div>
          <div style={{ background:'rgba(248,113,113,.08)', border:'1px solid rgba(248,113,113,.2)', borderRadius:'8px', padding:'10px 14px', marginBottom:'14px', fontSize:'12px', color:'#f87171' }}>
            ⚠️ This action is irreversible. The user will be permanently locked out.
          </div>
          <label style={{ fontSize:'11px', fontWeight:600, color:'#8b8aad', display:'block', marginBottom:'6px' }}>REASON / MESSAGE TO USER</label>
          <textarea rows={3} style={inp} placeholder="e.g. Your account has been banned for repeated violations..." value={actionReason} onChange={e => setActionReason(e.target.value)} />
          <div className="fr-modal-actions">
            <button style={btn('transparent','#8b8aad','#2a2940')} onClick={() => { setBanModal(null); setActionReason('') }}>Cancel</button>
            <button style={btn('rgba(248,113,113,.3)','#f87171','rgba(248,113,113,.5)')} onClick={submitBan} disabled={submitting}>
              {submitting ? 'Banning...' : '⛔ Confirm Permanent Ban'}
            </button>
          </div>
        </ModalWrap>
      )}

      {/* Filter Chips */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap' }}>
        {['pending','resolved','dismissed'].map(f =>
          <div key={f} style={chip(filter===f)} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </div>
        )}
      </div>

      {/* Report Cards */}
      {reports.length === 0 ? (
        <div style={{ ...card, textAlign:'center', color:'#5a5978', padding:'40px' }}>No {filter} reports.</div>
      ) : reports.map(r => {
        const rc = reasonColor(r.reason)
        return (
          <div key={r.id} className="fr-card" style={card}>
            <div className="fr-report-inner">
              <div style={ava()}>{ini(r.reported?.name)}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div className="fr-header-tags">
                  <div style={{ fontWeight:700, fontSize:'15px', color:'#f0eeff' }}>{r.reported?.name}</div>
                  <span style={tag(rc.bg, rc.c, rc.b)}>{r.reason}</span>
                  <span style={tag('rgba(124,58,237,.12)','#a78bfa','rgba(124,58,237,.3)')}>{r.reported?.role}</span>
                </div>
                <div style={{ fontSize:'13px', color:'#8b8aad', marginBottom:'4px' }}>
                  Reported by: <span style={{ color:'#f0eeff' }}>{r.reporter?.name}</span>
                </div>
                {r.details && (
                  <div style={{ fontSize:'13px', color:'#8b8aad', background:'#1e1d30', borderRadius:'8px', padding:'10px 12px', marginBottom:'12px', borderLeft:'3px solid #2a2940' }}>
                    {r.details}
                  </div>
                )}
                {filter === 'pending' && (
                  <div className="fr-actions">
                    <button style={btn('rgba(251,191,36,.12)','#fbbf24','rgba(251,191,36,.3)')}
                      onClick={() => { setActionReason(''); setWarnModal({ reportId:r.id, reportedId:r.reported_id, reportedName:r.reported?.name }) }}>
                      ⚠️ Warn
                    </button>
                    <button style={btn('rgba(248,113,113,.12)','#f87171','rgba(248,113,113,.3)')}
                      onClick={() => { setActionReason(''); setSuspendModal({ reportId:r.id, reportedId:r.reported_id, reportedName:r.reported?.name }) }}>
                      🚫 Suspend
                    </button>
                    <button style={btn('rgba(248,113,113,.2)','#f87171','rgba(248,113,113,.4)')}
                      onClick={() => { setActionReason(''); setBanModal({ reportId:r.id, reportedId:r.reported_id, reportedName:r.reported?.name }) }}>
                      ⛔ Ban
                    </button>
                    <button style={btn('transparent','#5a5978','#2a2940')} onClick={() => dismiss(r.id)}>Dismiss</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}