import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function ReviewApplicants() {
  const navigate = useNavigate()
  const [jobs,        setJobs]       = useState([])
  const [applicants,  setApplicants] = useState([])
  const [selectedJob, setSelectedJob]= useState(null)
  const [loading,     setLoading]    = useState(true)
  const [profile,     setProfile]    = useState(null)  // worker profile modal

  useEffect(() => {
    api.get('/employer/jobs').then(res => {
      setJobs(res.data)
      const first = res.data.find(j => j.status === 'open') ?? res.data[0]
      if (first) loadApplicants(first.id)
      else setLoading(false)
    })
  }, [])

  const loadApplicants = (jobId) => {
    setLoading(true)
    setSelectedJob(jobId)
    api.get(`/employer/jobs/${jobId}/applicants`)
      .then(res => setApplicants(res.data))
      .finally(() => setLoading(false))
  }

  const handleAccept = async (appId) => {
    await api.patch(`/employer/applications/${appId}`, { status: 'accepted' })
    setApplicants(p => p.map(a => a.id === appId
      ? { ...a, status: 'accepted' }
      : a.status === 'pending' ? { ...a, status: 'declined' } : a
    ))
  }

  const handleDecline = async (appId) => {
    await api.patch(`/employer/applications/${appId}`, { status: 'declined' })
    setApplicants(p => p.map(a => a.id === appId ? { ...a, status: 'declined' } : a))
  }

  const ini  = (n = '') => n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const card = { background:'#fff', borderRadius:'14px', border:'1px solid #e5e0d0', padding:'20px', marginBottom:'12px', boxShadow:'0 1px 3px rgba(0,0,0,.08)' }
  const btn  = (bg,c,b) => ({ background:bg, color:c, border:b?`1px solid ${b}`:'none', padding:'7px 14px', borderRadius:'8px', fontSize:'12px', fontWeight:600, cursor:'pointer' })
  const tag  = (bg,c,b) => ({ display:'inline-flex', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600, background:bg, color:c, border:`1px solid ${b}` })
  const sTag = (s) => ({
    accepted: tag('rgba(22,163,74,.1)','#16a34a','rgba(22,163,74,.3)'),
    declined: tag('rgba(239,68,68,.1)','#ef4444','rgba(239,68,68,.3)'),
    pending:  tag('rgba(245,158,11,.1)','#f59e0b','rgba(245,158,11,.3)'),
  })[s] ?? tag('#f3f4f6','#6b7280','#e5e0d0')

  const jobSTag = (s) => ({
  available:     { display:'inline-flex', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600, background:'rgba(22,163,74,.1)',   color:'#16a34a', border:'1px solid rgba(22,163,74,.3)' },
  not_available: { display:'inline-flex', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600, background:'rgba(59,130,246,.1)',  color:'#3b82f6', border:'1px solid rgba(59,130,246,.3)' },
  done:          { display:'inline-flex', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600, background:'rgba(107,114,128,.1)', color:'#6b7280', border:'1px solid #e5e0d0' },
})[s] ?? { display:'inline-flex', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600, background:'#f3f4f6', color:'#6b7280', border:'1px solid #e5e0d0' }

const STATUS_LABEL = { available:'Available', not_available:'Not Available', done:'Done' }

  const selectedJobObj = jobs.find(j => j.id === selectedJob)

  return (
    <div style={{ padding:'28px', maxWidth:'1000px', background:'#fffdf5', minHeight:'100vh' }}>

      {/* Worker Profile Modal */}
      {profile && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
          onClick={e => e.target === e.currentTarget && setProfile(null)}>
          <div style={{ background:'#fff', borderRadius:'18px', width:'100%', maxWidth:'560px', maxHeight:'88vh', overflowY:'auto', boxShadow:'0 24px 64px rgba(0,0,0,.2)' }}>

            {/* Modal header banner */}
            <div style={{ background:'linear-gradient(135deg,#16a34a,#14532d)', padding:'0', borderRadius:'18px 18px 0 0', position:'relative', overflow:'hidden', height:'90px' }}>
              <div style={{ position:'absolute', right:'-20px', top:'-20px', width:'100px', height:'100px', borderRadius:'50%', background:'rgba(255,255,255,.08)' }} />
              <button onClick={() => setProfile(null)} style={{ position:'absolute', top:'12px', right:'14px', background:'rgba(255,255,255,.2)', border:'none', borderRadius:'50%', width:'28px', height:'28px', color:'#fff', fontSize:'16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>

            <div style={{ padding:'0 24px 24px' }}>
              {/* Avatar overlapping banner */}
              <div style={{ marginTop:'-40px', marginBottom:'12px', display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
                <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'linear-gradient(135deg,#16a34a,#15803d)', border:'4px solid #fff', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px', fontWeight:700, color:'#fff', boxShadow:'0 2px 10px rgba(0,0,0,.15)', flexShrink:0 }}>
                  {profile.worker?.worker_profile?.photo_path
                    ? <img src={profile.worker.worker_profile.photo_path} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => e.target.style.display='none'} />
                    : ini(profile.worker?.name)
                  }
                </div>
                <button style={btn('#d97706','#fff')} onClick={() => { setProfile(null); navigate(`/employer/messages`) }}>
                  💬 Message
                </button>
              </div>

              {/* Name + badges */}
              <div style={{ marginBottom:'16px' }}>
                <div style={{ fontSize:'20px', fontWeight:800, marginBottom:'4px' }}>{profile.worker?.name}</div>
                <div style={{ fontSize:'13px', color:'#6b7280', marginBottom:'8px' }}>
                  {profile.worker?.worker_profile?.barangay ?? '—'}
                  {profile.worker?.worker_profile?.purok ? ` · ${profile.worker.worker_profile.purok}` : ''}
                </div>
                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                  {profile.worker?.worker_profile?.id_verification_status === 'approved' && (
                    <span style={tag('rgba(22,163,74,.1)','#16a34a','rgba(22,163,74,.3)')}>✓ Verified ID</span>
                  )}
                  <span style={profile.worker?.worker_profile?.is_available
                    ? tag('rgba(22,163,74,.1)','#16a34a','rgba(22,163,74,.3)')
                    : tag('#f3f4f6','#6b7280','#e5e0d0')}>
                    {profile.worker?.worker_profile?.is_available ? '🟢 Available' : '⚫ Unavailable'}
                  </span>
                  {profile.worker?.avg_rating > 0 && (
                    <span style={tag('rgba(245,158,11,.1)','#d97706','rgba(245,158,11,.3)')}>⭐ {profile.worker.avg_rating}</span>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'16px' }}>
                {[
                  ['💰 Rate', `₱${profile.worker?.worker_profile?.expected_rate?.toLocaleString() ?? '—'}/${profile.worker?.worker_profile?.rate_type === 'Daily' ? 'day' : profile.worker?.worker_profile?.rate_type === 'Hourly' ? 'hr' : 'job'}`],
                  ['🏆 Experience', `${profile.worker?.worker_profile?.years_experience ?? 0} yr${profile.worker?.worker_profile?.years_experience !== 1 ? 's' : ''}`],
                  ['📍 Distance', profile.worker?.worker_profile?.travel_distance ?? '—'],
                ].map(([label, value]) => (
                  <div key={label} style={{ background:'#f9fafb', borderRadius:'10px', padding:'10px 12px', textAlign:'center' }}>
                    <div style={{ fontSize:'11px', color:'#6b7280', marginBottom:'3px' }}>{label}</div>
                    <div style={{ fontSize:'13px', fontWeight:700, color:'#111827' }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Bio */}
              {profile.worker?.worker_profile?.bio && (
                <div style={{ marginBottom:'14px' }}>
                  <div style={{ fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'#6b7280', marginBottom:'6px' }}>About</div>
                  <div style={{ fontSize:'13px', color:'#374151', lineHeight:1.6 }}>{profile.worker.worker_profile.bio}</div>
                </div>
              )}

              {/* Skills */}
              {(profile.worker?.worker_profile?.skills ?? []).length > 0 && (
                <div style={{ marginBottom:'14px' }}>
                  <div style={{ fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'#6b7280', marginBottom:'8px' }}>Skills</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                    {profile.worker.worker_profile.skills.map(s => (
                      <span key={s} style={{ background:'rgba(22,163,74,.08)', border:'1px solid rgba(22,163,74,.25)', borderRadius:'20px', padding:'4px 12px', fontSize:'12px', fontWeight:600, color:'#16a34a' }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Work schedule */}
              {(profile.worker?.worker_profile?.work_days ?? []).length > 0 && (
                <div style={{ marginBottom:'14px' }}>
                  <div style={{ fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'#6b7280', marginBottom:'8px' }}>Work Schedule</div>
                  <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'6px' }}>
                    {['M','T','W','Th','F','Sa','Su'].map(d => {
                      const on = profile.worker.worker_profile.work_days.includes(d)
                      return (
                        <div key={d} style={{ width:'32px', height:'32px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:600, background:on?'#16a34a':'#f3f4f6', color:on?'#fff':'#9ca3af', border:`1.5px solid ${on?'#16a34a':'#e5e7eb'}` }}>{d}</div>
                      )
                    })}
                  </div>
                  {profile.worker.worker_profile.work_start && (
                    <div style={{ fontSize:'12px', color:'#6b7280' }}>
                      🕐 {profile.worker.worker_profile.work_start} – {profile.worker.worker_profile.work_end}
                    </div>
                  )}
                </div>
              )}

              {/* Cover message for this application */}
              {profile.cover_message && (
                <div style={{ background:'#fef9f0', borderRadius:'10px', padding:'14px', border:'1px solid rgba(217,119,6,.2)', marginBottom:'14px' }}>
                  <div style={{ fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'#d97706', marginBottom:'6px' }}>Cover Message</div>
                  <div style={{ fontSize:'13px', color:'#374151', lineHeight:1.6 }}>{profile.cover_message}</div>
                </div>
              )}

              {/* Action buttons */}
              {(profile.status === 'pending') && (
                <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
                  <button style={{ ...btn('rgba(239,68,68,.1)','#ef4444','rgba(239,68,68,.3)'), flex:1, padding:'10px', display:'flex', justifyContent:'center' }}
                    onClick={() => { handleDecline(profile.id); setProfile(null) }}>✕ Decline</button>
                  <button style={{ ...btn('rgba(22,163,74,.1)','#16a34a','rgba(22,163,74,.3)'), flex:1, padding:'10px', display:'flex', justifyContent:'center' }}
                    onClick={() => { handleAccept(profile.id); setProfile(null) }}>✓ Accept</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Job tabs */}
      {jobs.length > 0 && (
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'20px' }}>
          {jobs.map(j => (
            <div key={j.id} onClick={() => loadApplicants(j.id)}
              style={{ padding:'8px 16px', borderRadius:'20px', border:`1.5px solid ${selectedJob===j.id?'#d97706':'#e5e0d0'}`, fontSize:'12px', fontWeight:selectedJob===j.id?700:500, color:selectedJob===j.id?'#d97706':'#6b7280', cursor:'pointer', background:selectedJob===j.id?'rgba(217,119,6,.08)':'transparent' }}>
              {j.category?.emoji} {j.title} <span style={{ opacity:.7 }}>({j.applications_count ?? 0})</span>
            </div>
          ))}
        </div>
      )}

      {/* Selected job info */}
      {selectedJobObj && (
        <div style={{ background:'rgba(217,119,6,.06)', border:'1px solid rgba(217,119,6,.2)', borderRadius:'12px', padding:'12px 16px', marginBottom:'20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'8px' }}>
          <div>
            <div style={{ fontWeight:700, fontSize:'14px' }}>{selectedJobObj.category?.emoji} {selectedJobObj.title}</div>
            <div style={{ fontSize:'12px', color:'#6b7280', marginTop:'2px' }}>
              {selectedJobObj.barangay} · ₱{parseFloat(selectedJobObj.salary).toLocaleString()}/{selectedJobObj.rate_type === 'Daily' ? 'day' : 'hr'}
            </div>
          </div>
          <span style={jobSTag(selectedJobObj.status)}>{STATUS_LABEL[selectedJobObj.status] ?? selectedJobObj.status}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign:'center', color:'#6b7280', padding:'48px' }}>Loading applicants...</div>
      ) : jobs.length === 0 ? (
        <div style={{ ...card, textAlign:'center', color:'#6b7280', padding:'48px' }}>
          <div style={{ fontSize:'32px', marginBottom:'10px' }}>📋</div>
          You haven't posted any jobs yet.
        </div>
      ) : applicants.length === 0 ? (
        <div style={{ ...card, textAlign:'center', color:'#6b7280', padding:'48px' }}>
          <div style={{ fontSize:'32px', marginBottom:'10px' }}>👥</div>
          No applicants yet for this job.
        </div>
      ) : applicants.map(a => (
        <div key={a.id} style={card}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:'14px' }}>

            {/* Avatar — clickable to open profile */}
            <div onClick={() => setProfile(a)}
              style={{ width:'52px', height:'52px', borderRadius:'50%', background:'linear-gradient(135deg,#16a34a,#15803d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:700, color:'#fff', flexShrink:0, overflow:'hidden', cursor:'pointer', border:'2px solid #e5e0d0' }}>
              {a.worker?.worker_profile?.photo_path
                ? <img src={a.worker.worker_profile.photo_path} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => e.target.style.display='none'} />
                : ini(a.worker?.name)
              }
            </div>

            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px', flexWrap:'wrap' }}>
                <div style={{ fontWeight:700, fontSize:'15px', cursor:'pointer', color:'#111827' }}
                  onClick={() => setProfile(a)}>
                  {a.worker?.name}
                </div>
                <span style={sTag(a.status)}>{a.status}</span>
                {a.worker?.worker_profile?.id_verification_status === 'approved' && (
                  <span style={tag('rgba(22,163,74,.1)','#16a34a','rgba(22,163,74,.3)')}>✓ Verified</span>
                )}
              </div>

              <div style={{ fontSize:'12px', color:'#6b7280', marginBottom:'6px' }}>
                📍 {a.worker?.worker_profile?.barangay ?? '—'}
                {a.worker?.worker_profile?.expected_rate && <span style={{ marginLeft:'10px' }}>💰 ₱{parseFloat(a.worker.worker_profile.expected_rate).toLocaleString()}/{a.worker.worker_profile.rate_type === 'Daily' ? 'day' : 'hr'}</span>}
                {a.worker?.worker_profile?.years_experience > 0 && <span style={{ marginLeft:'10px' }}>🏆 {a.worker.worker_profile.years_experience} yrs exp</span>}
              </div>

              {/* Skills preview */}
              {(a.worker?.worker_profile?.skills ?? []).length > 0 && (
                <div style={{ display:'flex', gap:'5px', flexWrap:'wrap', marginBottom:'8px' }}>
                  {a.worker.worker_profile.skills.slice(0, 4).map(s => (
                    <span key={s} style={{ background:'rgba(22,163,74,.08)', border:'1px solid rgba(22,163,74,.2)', borderRadius:'20px', padding:'2px 9px', fontSize:'11px', fontWeight:600, color:'#16a34a' }}>{s}</span>
                  ))}
                  {a.worker.worker_profile.skills.length > 4 && <span style={{ fontSize:'11px', color:'#9ca3af' }}>+{a.worker.worker_profile.skills.length - 4} more</span>}
                </div>
              )}

              {/* Cover message */}
              {a.cover_message && (
                <div style={{ fontSize:'13px', color:'#374151', background:'#fef9f0', borderRadius:'8px', padding:'9px 12px', marginBottom:'10px', borderLeft:'3px solid #d97706', lineHeight:1.5 }}>
                  "{a.cover_message}"
                </div>
              )}

              <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                <button style={btn('transparent','#d97706','rgba(217,119,6,.4)')} onClick={() => setProfile(a)}>
                  👤 View Profile
                </button>
                {(a.status === 'pending') && <>
                  <button style={btn('rgba(22,163,74,.1)','#16a34a','rgba(22,163,74,.3)')} onClick={() => handleAccept(a.id)}>✓ Accept</button>
                  <button style={btn('rgba(239,68,68,.1)','#ef4444','rgba(239,68,68,.3)')} onClick={() => handleDecline(a.id)}>✕ Decline</button>
                </>}
                <button style={btn('transparent','#6b7280','#e5e0d0')} onClick={() => navigate('/employer/messages')}>💬 Message</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}