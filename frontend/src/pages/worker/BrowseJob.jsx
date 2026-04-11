import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../../api/axios'

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

const styles = `
  .bj-root {
    padding: 16px;
    max-width: 1280px;
    width: 100%;
    box-sizing: border-box;
  }
  @media (min-width: 640px) {
    .bj-root { padding: 28px; }
  }

  .bj-flash {
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 16px;
    font-size: 13px;
    font-weight: 500;
  }

  .bj-map-wrap {
    margin-bottom: 20px;
    border-radius: 14px;
    overflow: hidden;
  }
  .bj-map-wrap .leaflet-container {
    height: 200px;
    width: 100%;
    border-radius: 14px;
  }
  @media (min-width: 640px) {
    .bj-map-wrap .leaflet-container { height: 300px; }
  }

  .bj-chips-row {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 16px;
    overflow-x: auto;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;
  }
  .bj-chips-row::-webkit-scrollbar { display: none; }
  .bj-chips-label {
    font-size: 13px;
    font-weight: 600;
    flex-shrink: 0;
    white-space: nowrap;
  }
  .bj-chip {
    padding: 6px 14px;
    border-radius: 20px;
    border: 1.5px solid #e2e8e2;
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    background: transparent;
    white-space: nowrap;
    flex-shrink: 0;
    transition: all 0.15s;
  }
  .bj-chip.active {
    border-color: #16a34a;
    font-weight: 600;
    color: #16a34a;
    background: rgba(22,163,74,.08);
  }

  .bj-filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 20px;
  }
  @media (min-width: 640px) {
    .bj-filters {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }
    .bj-filters .bj-search-input,
    .bj-filters .bj-cat-select {
      grid-column: auto;
    }
  }
  .bj-search-input,
  .bj-cat-select {
    grid-column: 1 / -1;
  }

  .bj-inp {
    padding: 9px 12px;
    border: 1.5px solid #e2e8e2;
    border-radius: 9px;
    font-size: 13px;
    outline: none;
    background: #fff;
    box-sizing: border-box;
    width: 100%;
    font-family: inherit;
  }
  .bj-inp:focus { border-color: #16a34a; }

  .bj-btn-search {
    grid-column: 1 / -1;
    background: #16a34a;
    color: #fff;
    border: none;
    padding: 9px 20px;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
  }
  @media (min-width: 640px) {
    .bj-btn-search { grid-column: auto; width: auto; }
  }

  .bj-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  @media (min-width: 540px) {
    .bj-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
  }

  .bj-card {
    background: #fff;
    border-radius: 14px;
    border: 1px solid #e2e8e2;
    padding: 18px 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,.08);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .bj-card-top {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .bj-card-emoji { font-size: 32px; flex-shrink: 0; }
  .bj-card-body { flex: 1; min-width: 0; }
  .bj-card-title {
    font-weight: 700;
    font-family: Syne, sans-serif;
    margin-bottom: 4px;
    font-size: 14px;
    word-break: break-word;
  }
  @media (min-width: 640px) { .bj-card-title { font-size: 15px; } }
  .bj-card-sub {
    font-size: 12px;
    color: #6b7280;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bj-card-tags { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
  .bj-card-price {
    text-align: right;
    flex-shrink: 0;
  }
  .bj-card-amount {
    font-size: 17px;
    font-weight: 800;
    color: #16a34a;
    font-family: Syne, sans-serif;
  }
  @media (min-width: 640px) { .bj-card-amount { font-size: 20px; } }
  .bj-card-rate { font-size: 11px; color: #6b7280; }

  .bj-card-desc {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.5;
    border-top: 1px solid #f1f5f1;
    padding-top: 8px;
  }

  .bj-apply-btn {
    width: 100%;
    padding: 10px;
    border-radius: 9px;
    border: none;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  /* Modal */
  .bj-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.45);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
  }
  @media (min-width: 640px) {
    .bj-modal-overlay { padding: 20px; }
  }
  .bj-modal {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 20px 60px rgba(0,0,0,.25);
    max-height: 90vh;
    overflow-y: auto;
  }
  @media (min-width: 640px) {
    .bj-modal { padding: 28px; }
  }

  .bj-modal-actions {
    display: flex;
    gap: 10px;
    flex-direction: column;
  }
  @media (min-width: 480px) {
    .bj-modal-actions { flex-direction: row; }
  }

  .bj-tag {
    display: inline-flex;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
  }
`

export default function BrowseJob() {
  const [jobs, setJobs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(null)
  const [applied, setApplied] = useState(new Set())
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [coverModal, setCoverModal] = useState(null)
  const [coverText, setCoverText] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [filters, setFilters] = useState({ category_id: '', min_rate: '', max_rate: '', search: '' })
  const [dist, setDist] = useState('📍 My Barangay')
  const [currentLocation, setCurrentLocation] = useState(null)
  const resumeRef = useRef()

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentLocation([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.error('Failed to get location:', err)
      )
    }
  }, [])

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {})
    fetchJobs()
  }, [])

  const fetchJobs = async (overrides = {}) => {
    setLoading(true)
    try {
      const params = { ...filters, ...overrides }
      Object.keys(params).forEach(k => !params[k] && delete params[k])
      const res = await api.get('/worker/jobs', { params })
      setJobs(res.data.data ?? res.data)
    } catch {
      setMsg({ type: 'error', text: 'Failed to load jobs.' })
    } finally {
      setLoading(false)
    }
  }

  const flash = (type, text) => {
    setMsg({ type, text })
    setTimeout(() => setMsg({ type: '', text: '' }), 3500)
  }

  const openModal = (job) => {
    setCoverText('')
    setResumeFile(null)
    setCoverModal(job)
  }

  const submitApply = async () => {
    if (!coverModal) return
    if (resumeFile && resumeFile.size > 5 * 1024 * 1024) {
      flash('error', 'Resume file must be under 5MB.')
      return
    }
    setApplying(coverModal.id)
    try {
      const form = new FormData()
      if (coverText.trim()) form.append('cover_message', coverText.trim())
      if (resumeFile) form.append('resume', resumeFile)
      await api.post(`/worker/jobs/${coverModal.id}/apply`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setApplied(prev => new Set([...prev, coverModal.id]))
      flash('success', `Applied to "${coverModal.title}" successfully!`)
      setCoverModal(null)
    } catch (e) {
      flash('error', e.response?.data?.message ?? 'Failed to apply.')
    } finally {
      setApplying(null)
    }
  }

  const nearbyJobs = jobs.filter(j => {
    if (dist === '📍 My Barangay' || dist === '🌐 All Areas') return true
    const km = parseInt(dist)
    return j.distance_km <= km
  })

  const createEmojiIcon = (emoji) => L.divIcon({
    html: `<div style="font-size:24px;">${emoji}</div>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  })

  const displayedJobs = dist === '🌐 All Areas' ? jobs : nearbyJobs

  return (
    <>
      <style>{styles}</style>
      <div className="bj-root">

        {msg.text && (
          <div className="bj-flash" style={{
            background: msg.type === 'success' ? 'rgba(22,163,74,.1)' : 'rgba(239,68,68,.1)',
            border: `1px solid ${msg.type === 'success' ? 'rgba(22,163,74,.3)' : 'rgba(239,68,68,.3)'}`,
            color: msg.type === 'success' ? '#16a34a' : '#ef4444'
          }}>
            {msg.text}
          </div>
        )}

        {/* Map */}
        {currentLocation && (
          <div className="bj-map-wrap">
            <MapContainer center={currentLocation} zoom={14} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
              <Marker position={currentLocation}>
                <Popup>You are here 📍</Popup>
              </Marker>
              {nearbyJobs.map(job => job.latitude && job.longitude && (
                <Marker key={job.id} position={[job.latitude, job.longitude]} icon={createEmojiIcon(job.category?.emoji ?? '💼')}>
                  <Popup>
                    <b>{job.title}</b><br />
                    {job.employer?.name} · {job.barangay}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {/* Distance Chips */}
        <div className="bj-chips-row">
          <div className="bj-chips-label">Distance:</div>
          {['📍 My Barangay', '📍 1km', '📍 3km', '📍 5km', '🌐 All Areas'].map(c => (
            <div key={c} className={`bj-chip${dist === c ? ' active' : ''}`} onClick={() => setDist(c)}>{c}</div>
          ))}
        </div>

        {/* Filters */}
        <div className="bj-filters">
          <input
            className="bj-inp bj-search-input"
            placeholder="Search jobs..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && fetchJobs()}
          />
          <select
            className="bj-inp bj-cat-select"
            value={filters.category_id}
            onChange={e => { const v = e.target.value; setFilters(f => ({ ...f, category_id: v })); fetchJobs({ category_id: v }) }}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
          <input className="bj-inp" type="number" placeholder="Min ₱" value={filters.min_rate} onChange={e => setFilters(f => ({ ...f, min_rate: e.target.value }))} />
          <input className="bj-inp" type="number" placeholder="Max ₱" value={filters.max_rate} onChange={e => setFilters(f => ({ ...f, max_rate: e.target.value }))} />
          <button className="bj-btn-search" onClick={() => fetchJobs()}>Search</button>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading jobs...</div>
        ) : displayedJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No jobs found.</div>
        ) : (
          <div className="bj-grid">
            {displayedJobs.map(job => {
              const isApplied = applied.has(job.id)
              const rateLabel = { Daily: '/day', Hourly: '/hour', Monthly: '/month', 'Per Service': '/service' }[job.rate_type] ?? ''
              return (
                <div key={job.id} className="bj-card">
                  <div className="bj-card-top">
                    <div className="bj-card-emoji">{job.category?.emoji ?? '💼'}</div>
                    <div className="bj-card-body">
                      <div className="bj-card-title">{job.title}</div>
                      <div className="bj-card-sub">{job.employer?.employer_profile?.household_name ?? job.employer?.name} · 📍 {job.barangay}</div>
                      <div className="bj-card-tags">
                        {job.category && (
                          <span className="bj-tag" style={{ background: 'rgba(22,163,74,.1)', color: '#16a34a', border: '1px solid rgba(22,163,74,.25)' }}>{job.category.name}</span>
                        )}
                        {job.negotiable && (
                          <span className="bj-tag" style={{ background: 'rgba(59,130,246,.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,.3)' }}>Negotiable</span>
                        )}
                      </div>
                    </div>
                    <div className="bj-card-price">
                      <div className="bj-card-amount">₱{parseFloat(job.salary).toLocaleString()}</div>
                      <div className="bj-card-rate">{rateLabel}</div>
                    </div>
                  </div>
                  {job.description && (
                    <div className="bj-card-desc">
                      {job.description.slice(0, 110)}{job.description.length > 110 ? '…' : ''}
                    </div>
                  )}
                  <button
                    className="bj-apply-btn"
                    onClick={() => !isApplied && openModal(job)}
                    disabled={isApplied}
                    style={{
                      background: isApplied ? 'rgba(22,163,74,.1)' : '#16a34a',
                      color: isApplied ? '#16a34a' : '#fff',
                      cursor: isApplied ? 'default' : 'pointer'
                    }}
                  >
                    {isApplied ? '✓ Applied' : 'Apply Now'}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Apply Modal */}
        {coverModal && (
          <div className="bj-modal-overlay">
            <div className="bj-modal">
              <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>Apply: {coverModal.title}</div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>{coverModal.employer?.name} · {coverModal.barangay}</div>

              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                Cover Message <span style={{ fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                rows={4}
                value={coverText}
                onChange={e => setCoverText(e.target.value)}
                placeholder="Introduce yourself and explain why you're a good fit..."
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8e2', borderRadius: '9px', fontSize: '13px', resize: 'vertical', outline: 'none', boxSizing: 'border-box', marginBottom: '16px', fontFamily: 'inherit' }}
              />

              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                Resume / CV <span style={{ fontWeight: 400 }}>(optional · PDF, DOC, DOCX · max 5MB)</span>
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                ref={resumeRef}
                style={{ display: 'none' }}
                onChange={e => setResumeFile(e.target.files[0] ?? null)}
              />
              <div
                onClick={() => resumeRef.current.click()}
                style={{ border: `2px dashed ${resumeFile ? '#16a34a' : '#e2e8e2'}`, borderRadius: '10px', padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', background: resumeFile ? 'rgba(22,163,74,.04)' : '#fafafa', marginBottom: '20px' }}
              >
                <span style={{ fontSize: '22px', flexShrink: 0 }}>{resumeFile ? '📄' : '📎'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {resumeFile ? (
                    <>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#16a34a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resumeFile.name}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>{(resumeFile.size / 1024).toFixed(0)} KB · Click to change</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Click to attach resume</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>PDF, DOC, or DOCX up to 5MB</div>
                    </>
                  )}
                </div>
                {resumeFile && (
                  <span
                    onClick={e => { e.stopPropagation(); setResumeFile(null) }}
                    style={{ fontSize: '18px', color: '#9ca3af', cursor: 'pointer', flexShrink: 0 }}
                  >×</span>
                )}
              </div>

              <div className="bj-modal-actions">
                <button
                  onClick={submitApply}
                  disabled={applying === coverModal.id}
                  style={{ flex: 1, padding: '11px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '9px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                >
                  {applying === coverModal.id ? 'Submitting…' : '✓ Submit Application'}
                </button>
                <button
                  onClick={() => setCoverModal(null)}
                  style={{ padding: '11px 18px', background: 'transparent', border: '1px solid #e2e8e2', borderRadius: '9px', fontSize: '14px', cursor: 'pointer', color: '#6b7280' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}