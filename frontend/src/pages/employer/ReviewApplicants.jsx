import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const styles = `
  .ra-root {
    padding: 16px;
    max-width: 1000px;
    background: #fffdf5;
    min-height: 100vh;
    box-sizing: border-box;
    width: 100%;
  }
  @media (min-width: 640px) {
    .ra-root { padding: 28px; }
  }

  .ra-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .ra-tab {
    padding: 8px 14px;
    border-radius: 20px;
    border: 1.5px solid #e5e0d0;
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    background: transparent;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .ra-tab.active {
    border-color: #d97706;
    font-weight: 700;
    color: #d97706;
    background: rgba(217,119,6,.08);
  }

  .ra-job-info {
    background: rgba(217,119,6,.06);
    border: 1px solid rgba(217,119,6,.2);
    border-radius: 12px;
    padding: 12px 16px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .ra-card {
    background: #fff;
    border-radius: 14px;
    border: 1px solid #e5e0d0;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,.08);
  }
  @media (min-width: 640px) {
    .ra-card { padding: 20px; }
  }

  .ra-card-inner {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  @media (min-width: 480px) {
    .ra-card-inner { gap: 14px; }
  }

  .ra-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg,#16a34a,#15803d);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid #e5e0d0;
  }
  @media (min-width: 480px) {
    .ra-avatar { width: 52px; height: 52px; font-size: 18px; }
  }

  .ra-card-body { flex: 1; min-width: 0; }

  .ra-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
    flex-wrap: wrap;
  }
  .ra-name {
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    color: #111827;
  }
  @media (min-width: 480px) { .ra-name { font-size: 15px; } }

  .ra-meta {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 6px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .ra-skills {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }

  .ra-cover {
    font-size: 13px;
    color: #374151;
    background: #fef9f0;
    border-radius: 8px;
    padding: 9px 12px;
    margin-bottom: 10px;
    border-left: 3px solid #d97706;
    line-height: 1.5;
  }

  .ra-actions {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  /* Modal */
  .ra-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
  }
  .ra-modal {
    background: #fff;
    border-radius: 18px;
    width: 100%;
    max-width: 560px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 24px 64px rgba(0,0,0,.2);
  }

  .ra-modal-banner {
    background: linear-gradient(135deg,#16a34a,#14532d);
    padding: 0;
    border-radius: 18px 18px 0 0;
    position: relative;
    overflow: hidden;
    height: 80px;
    flex-shrink: 0;
  }

  .ra-modal-body { padding: 0 20px 20px; }
  @media (min-width: 480px) { .ra-modal-body { padding: 0 24px 24px; } }

  .ra-modal-header-row {
    margin-top: -36px;
    margin-bottom: 12px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }

  .ra-modal-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg,#16a34a,#15803d);
    border: 4px solid #fff;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,.15);
    flex-shrink: 0;
  }
  @media (min-width: 480px) {
    .ra-modal-avatar { width: 80px; height: 80px; font-size: 26px; }
  }

  .ra-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }

  .ra-stat {
    background: #f9fafb;
    border-radius: 10px;
    padding: 8px 10px;
    text-align: center;
  }

  .ra-days-row {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    margin-bottom: 6px;
  }

  .ra-day-dot {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
  }
  @media (min-width: 360px) {
    .ra-day-dot { width: 32px; height: 32px; }
  }

  .ra-modal-action-row {
    display: flex;
    gap: 10px;
    margin-top: 4px;
    flex-wrap: wrap;
  }
  .ra-modal-action-row button { flex: 1; min-width: 120px; }

  .ra-empty {
    background: #fff;
    border-radius: 14px;
    border: 1px solid #e5e0d0;
    padding: 40px 20px;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,.08);
    text-align: center;
    color: #6b7280;
  }
`

export default function ReviewApplicants() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [applicants, setApplicants] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

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

  const goToMessage = (workerId) => navigate(`/employer/messages?userId=${workerId}`)

  const ini = (n = '') => n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const btn = (bg, c, b) => ({
    background: bg, color: c, border: b ? `1px solid ${b}` : 'none',
    padding: '7px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
  })

  const tag = (bg, c, b) => ({
    display: 'inline-flex', padding: '3px 10px', borderRadius: '20px',
    fontSize: '11px', fontWeight: 600, background: bg, color: c, border: `1px solid ${b}`
  })

  const sTag = (s) => ({
    accepted: tag('rgba(22,163,74,.1)', '#16a34a', 'rgba(22,163,74,.3)'),
    declined: tag('rgba(239,68,68,.1)', '#ef4444', 'rgba(239,68,68,.3)'),
    pending: tag('rgba(245,158,11,.1)', '#f59e0b', 'rgba(245,158,11,.3)'),
  })[s] ?? tag('#f3f4f6', '#6b7280', '#e5e0d0')

  const jobSTag = (s) => ({
    available: { display: 'inline-flex', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: 'rgba(22,163,74,.1)', color: '#16a34a', border: '1px solid rgba(22,163,74,.3)' },
    not_available: { display: 'inline-flex', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: 'rgba(59,130,246,.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,.3)' },
    done: { display: 'inline-flex', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: 'rgba(107,114,128,.1)', color: '#6b7280', border: '1px solid #e5e0d0' },
  })[s] ?? { display: 'inline-flex', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e0d0' }

  const STATUS_LABEL = { available: 'Available', not_available: 'Not Available', done: 'Done' }
  const selectedJobObj = jobs.find(j => j.id === selectedJob)

  const resumeFileName = (path) => {
    if (!path) return 'Resume'
    return path.split('/').pop().split('\\').pop()
  }

  const ResumeButton = ({ resumePath, style = {} }) => {
    if (!resumePath) return null
    return (
      <a
        href={resumePath}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '7px 14px', borderRadius: '8px',
          border: '1px solid rgba(59,130,246,.35)',
          background: 'rgba(59,130,246,.08)',
          color: '#2563eb', fontSize: '12px', fontWeight: 600,
          textDecoration: 'none', cursor: 'pointer', ...style,
        }}
      >
        📄 {resumeFileName(resumePath)}
      </a>
    )
  }

  return (
    <>
      <style>{styles}</style>
      <div className="ra-root">

        {/* Worker Profile Modal */}
        {profile && (
          <div className="ra-modal-overlay" onClick={e => e.target === e.currentTarget && setProfile(null)}>
            <div className="ra-modal">
              <div className="ra-modal-banner">
                <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,.08)' }} />
                <button onClick={() => setProfile(null)} style={{ position: 'absolute', top: '12px', right: '14px', background: 'rgba(255,255,255,.2)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: '#fff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              </div>

              <div className="ra-modal-body">
                <div className="ra-modal-header-row">
                  <div className="ra-modal-avatar">
                    {profile.worker?.worker_profile?.photo_path
                      ? <img src={profile.worker.worker_profile.photo_path} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                      : ini(profile.worker?.name)
                    }
                  </div>
                  <button style={btn('#d97706', '#fff')} onClick={() => { setProfile(null); goToMessage(profile.worker?.id) }}>
                    💬 Message
                  </button>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>{profile.worker?.name}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                    {profile.worker?.worker_profile?.barangay ?? '—'}
                    {profile.worker?.worker_profile?.purok ? ` · ${profile.worker.worker_profile.purok}` : ''}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {profile.worker?.worker_profile?.id_verification_status === 'approved' && (
                      <span style={tag('rgba(22,163,74,.1)', '#16a34a', 'rgba(22,163,74,.3)')}>✓ Verified ID</span>
                    )}
                    <span style={profile.worker?.worker_profile?.is_available
                      ? tag('rgba(22,163,74,.1)', '#16a34a', 'rgba(22,163,74,.3)')
                      : tag('#f3f4f6', '#6b7280', '#e5e0d0')}>
                      {profile.worker?.worker_profile?.is_available ? '🟢 Available' : '⚫ Unavailable'}
                    </span>
                    {profile.worker?.avg_rating > 0 && (
                      <span style={tag('rgba(245,158,11,.1)', '#d97706', 'rgba(245,158,11,.3)')}>⭐ {profile.worker.avg_rating}</span>
                    )}
                  </div>
                </div>

                <div className="ra-stats-grid">
                  {[
                    ['💰 Rate', `₱${profile.worker?.worker_profile?.expected_rate?.toLocaleString() ?? '—'}/${profile.worker?.worker_profile?.rate_type === 'Daily' ? 'day' : profile.worker?.worker_profile?.rate_type === 'Hourly' ? 'hr' : 'job'}`],
                    ['🏆 Exp', `${profile.worker?.worker_profile?.years_experience ?? 0} yr${profile.worker?.worker_profile?.years_experience !== 1 ? 's' : ''}`],
                    ['📍 Dist', profile.worker?.worker_profile?.travel_distance ?? '—'],
                  ].map(([label, value]) => (
                    <div key={label} className="ra-stat">
                      <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '3px' }}>{label}</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>{value}</div>
                    </div>
                  ))}
                </div>

                {profile.worker?.worker_profile?.bio && (
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#6b7280', marginBottom: '6px' }}>About</div>
                    <div style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>{profile.worker.worker_profile.bio}</div>
                  </div>
                )}

                {(profile.worker?.worker_profile?.skills ?? []).length > 0 && (
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#6b7280', marginBottom: '8px' }}>Skills</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {profile.worker.worker_profile.skills.map(s => (
                        <span key={s} style={{ background: 'rgba(22,163,74,.08)', border: '1px solid rgba(22,163,74,.25)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, color: '#16a34a' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {(profile.worker?.worker_profile?.work_days ?? []).length > 0 && (
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#6b7280', marginBottom: '8px' }}>Work Schedule</div>
                    <div className="ra-days-row">
                      {['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'].map(d => {
                        const on = profile.worker.worker_profile.work_days.includes(d)
                        return (
                          <div key={d} className="ra-day-dot" style={{ background: on ? '#16a34a' : '#f3f4f6', color: on ? '#fff' : '#9ca3af', border: `1.5px solid ${on ? '#16a34a' : '#e5e7eb'}` }}>{d}</div>
                        )
                      })}
                    </div>
                    {profile.worker.worker_profile.work_start && (
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        🕐 {profile.worker.worker_profile.work_start} – {profile.worker.worker_profile.work_end}
                      </div>
                    )}
                  </div>
                )}

                {profile.cover_message && (
                  <div style={{ background: '#fef9f0', borderRadius: '10px', padding: '14px', border: '1px solid rgba(217,119,6,.2)', marginBottom: '14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#d97706', marginBottom: '6px' }}>Cover Message</div>
                    <div style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>{profile.cover_message}</div>
                  </div>
                )}

                {profile.resume_url && (
                  <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '14px 16px', border: '1px solid rgba(59,130,246,.2)', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#2563eb', marginBottom: '4px' }}>Attached Resume / CV</div>
                      <div style={{ fontSize: '13px', color: '#1d4ed8', fontWeight: 600 }}>📄 {resumeFileName(profile.resume_url)}</div>
                    </div>
                    <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" download
                      style={{ flexShrink: 0, padding: '8px 16px', borderRadius: '8px', background: '#2563eb', color: '#fff', fontSize: '12px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                      ⬇ Download
                    </a>
                  </div>
                )}

                {profile.status === 'pending' && (
                  <div className="ra-modal-action-row">
                    <button style={{ ...btn('rgba(239,68,68,.1)', '#ef4444', 'rgba(239,68,68,.3)'), padding: '10px' }}
                      onClick={() => { handleDecline(profile.id); setProfile(null) }}>✕ Decline</button>
                    <button style={{ ...btn('rgba(22,163,74,.1)', '#16a34a', 'rgba(22,163,74,.3)'), padding: '10px' }}
                      onClick={() => { handleAccept(profile.id); setProfile(null) }}>✓ Accept</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Job tabs */}
        {jobs.length > 0 && (
          <div className="ra-tabs">
            {jobs.map(j => (
              <div key={j.id} onClick={() => loadApplicants(j.id)} className={`ra-tab${selectedJob === j.id ? ' active' : ''}`}>
                {j.category?.emoji} {j.title} <span style={{ opacity: .7 }}>({j.applications_count ?? 0})</span>
              </div>
            ))}
          </div>
        )}

        {/* Selected job info */}
        {selectedJobObj && (
          <div className="ra-job-info">
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>{selectedJobObj.category?.emoji} {selectedJobObj.title}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                {selectedJobObj.barangay} · ₱{parseFloat(selectedJobObj.salary).toLocaleString()}/{selectedJobObj.rate_type === 'Daily' ? 'day' : 'hr'}
              </div>
            </div>
            <span style={jobSTag(selectedJobObj.status)}>{STATUS_LABEL[selectedJobObj.status] ?? selectedJobObj.status}</span>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: '48px' }}>Loading applicants...</div>
        ) : jobs.length === 0 ? (
          <div className="ra-empty">
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📋</div>
            You haven't posted any jobs yet.
          </div>
        ) : applicants.length === 0 ? (
          <div className="ra-empty">
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
            No applicants yet for this job.
          </div>
        ) : applicants.map(a => (
          <div key={a.id} className="ra-card">
            <div className="ra-card-inner">
              <div className="ra-avatar" onClick={() => setProfile(a)}>
                {a.worker?.worker_profile?.photo_path
                  ? <img src={a.worker.worker_profile.photo_path} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                  : ini(a.worker?.name)
                }
              </div>

              <div className="ra-card-body">
                <div className="ra-name-row">
                  <div className="ra-name" onClick={() => setProfile(a)}>{a.worker?.name}</div>
                  <span style={sTag(a.status)}>{a.status}</span>
                  {a.worker?.worker_profile?.id_verification_status === 'approved' && (
                    <span style={tag('rgba(22,163,74,.1)', '#16a34a', 'rgba(22,163,74,.3)')}>✓ Verified</span>
                  )}
                </div>

                <div className="ra-meta">
                  <span>📍 {a.worker?.worker_profile?.barangay ?? '—'}</span>
                  {a.worker?.worker_profile?.expected_rate && (
                    <span>· 💰 ₱{parseFloat(a.worker.worker_profile.expected_rate).toLocaleString()}/{a.worker.worker_profile.rate_type === 'Daily' ? 'day' : 'hr'}</span>
                  )}
                  {a.worker?.worker_profile?.years_experience > 0 && (
                    <span>· 🏆 {a.worker.worker_profile.years_experience} yrs</span>
                  )}
                </div>

                {(a.worker?.worker_profile?.skills ?? []).length > 0 && (
                  <div className="ra-skills">
                    {a.worker.worker_profile.skills.slice(0, 4).map(s => (
                      <span key={s} style={{ background: 'rgba(22,163,74,.08)', border: '1px solid rgba(22,163,74,.2)', borderRadius: '20px', padding: '2px 9px', fontSize: '11px', fontWeight: 600, color: '#16a34a' }}>{s}</span>
                    ))}
                    {a.worker.worker_profile.skills.length > 4 && <span style={{ fontSize: '11px', color: '#9ca3af' }}>+{a.worker.worker_profile.skills.length - 4} more</span>}
                  </div>
                )}

                {a.cover_message && (
                  <div className="ra-cover">"{a.cover_message}"</div>
                )}

                {a.resume_url && (
                  <div style={{ marginBottom: '10px' }}>
                    <ResumeButton resumePath={a.resume_url} />
                  </div>
                )}

                <div className="ra-actions">
                  <button style={btn('transparent', '#d97706', 'rgba(217,119,6,.4)')} onClick={() => setProfile(a)}>👤 Profile</button>
                  {a.status === 'pending' && <>
                    <button style={btn('rgba(22,163,74,.1)', '#16a34a', 'rgba(22,163,74,.3)')} onClick={() => handleAccept(a.id)}>✓ Accept</button>
                    <button style={btn('rgba(239,68,68,.1)', '#ef4444', 'rgba(239,68,68,.3)')} onClick={() => handleDecline(a.id)}>✕ Decline</button>
                  </>}
                  <button style={btn('transparent', '#6b7280', '#e5e0d0')} onClick={() => goToMessage(a.worker?.id)}>💬 Msg</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}