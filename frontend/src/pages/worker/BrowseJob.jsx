// BrowseJob.jsx
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../../api/axios'

// Fix for Leaflet default icon in React
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
})

export default function BrowseJob() {
  const [jobs, setJobs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(null)
  const [applied, setApplied] = useState(new Set())
  const [msg, setMsg] = useState({ type:'', text:'' })
  const [coverModal, setCoverModal] = useState(null)
  const [coverText, setCoverText] = useState('')
  const [filters, setFilters] = useState({ category_id:'', min_rate:'', max_rate:'', search:'' })
  const [dist, setDist] = useState('📍 My Barangay')
  const [currentLocation, setCurrentLocation] = useState(null)

  const tag = (bg,c,b) => ({ display:'inline-flex',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:600,background:bg,color:c,border:`1px solid ${b}` })
  const inp = { padding:'9px 12px',border:'1.5px solid #e2e8e2',borderRadius:'9px',fontSize:'13px',outline:'none',background:'#fff' }
  const chip = (a) => ({ padding:'6px 14px',borderRadius:'20px',border:`1.5px solid ${a?'#16a34a':'#e2e8e2'}`,fontSize:'12px',fontWeight:a?600:500,color:a?'#16a34a':'#6b7280',cursor:'pointer',background:a?'rgba(22,163,74,.08)':'transparent' })

  // Get user's real-time location
  useEffect(() => {
    if(navigator.geolocation){
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
      setMsg({ type:'error', text:'Failed to load jobs.' })
    } finally {
      setLoading(false)
    }
  }

  const flash = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type:'', text:'' }), 3500) }

  const submitApply = async () => {
    if (!coverModal) return
    setApplying(coverModal.id)
    try {
      await api.post(`/worker/jobs/${coverModal.id}/apply`, { cover_message: coverText })
      setApplied(prev => new Set([...prev, coverModal.id]))
      flash('success', `Applied to "${coverModal.title}" successfully!`)
      setCoverModal(null)
    } catch (e) {
      flash('error', e.response?.data?.message ?? 'Failed to apply.')
    } finally {
      setApplying(null)
    }
  }

  // Filtered jobs for nearby display
  const nearbyJobs = jobs.filter(j => {
    if(dist==='📍 My Barangay') return true
    if(dist==='🌐 All Areas') return true
    const km = parseInt(dist)
    return j.distance_km <= km
  })

  // Helper to create DivIcon with emoji
  const createEmojiIcon = (emoji) => L.divIcon({
    html: `<div style="font-size:24px;">${emoji}</div>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  })

  return (
    <div style={{ padding:'28px',maxWidth:'1280px' }}>
      {msg.text && (
        <div style={{ background:msg.type==='success'?'rgba(22,163,74,.1)':'rgba(239,68,68,.1)', border:`1px solid ${msg.type==='success'?'rgba(22,163,74,.3)':'rgba(239,68,68,.3)'}`, borderRadius:'10px',padding:'12px 16px',marginBottom:'16px',color:msg.type==='success'?'#16a34a':'#ef4444',fontSize:'13px',fontWeight:500 }}>
          {msg.text}
        </div>
      )}

      {/* Map */}
      {currentLocation && (
        <div style={{ marginBottom:'20px' }}>
          <MapContainer center={currentLocation} zoom={14} style={{ height:'300px', width:'100%', borderRadius:'14px' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {/* User location */}
            <Marker position={currentLocation}>
              <Popup>You are here 📍</Popup>
            </Marker>
            {/* Job locations */}
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
      <div style={{ display:'flex',gap:'12px',alignItems:'center',marginBottom:'16px',flexWrap:'wrap' }}>
        <div style={{ fontSize:'14px',fontWeight:600 }}>Distance:</div>
        <div style={{ display:'flex',gap:'8px',flexWrap:'wrap' }}>
          {['📍 My Barangay','📍 1km','📍 3km','📍 5km','🌐 All Areas'].map(c =>
            <div key={c} style={chip(dist===c)} onClick={()=>setDist(c)}>{c}</div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex',gap:'10px',marginBottom:'20px',flexWrap:'wrap' }}>
        <input style={{ ...inp,flex:1,minWidth:'180px' }} placeholder="Search jobs..." value={filters.search} onChange={e => setFilters(f => ({ ...f, search:e.target.value }))} onKeyDown={e => e.key==='Enter' && fetchJobs()} />
        <select style={inp} value={filters.category_id} onChange={e => { const v=e.target.value; setFilters(f=>({...f,category_id:v})); fetchJobs({ category_id:v }) }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
        </select>
        <input style={{ ...inp,width:'100px' }} type="number" placeholder="Min ₱" value={filters.min_rate} onChange={e => setFilters(f => ({ ...f, min_rate:e.target.value }))} />
        <input style={{ ...inp,width:'100px' }} type="number" placeholder="Max ₱" value={filters.max_rate} onChange={e => setFilters(f => ({ ...f, max_rate:e.target.value }))} />
        <button onClick={() => fetchJobs()} style={{ background:'#16a34a',color:'#fff',border:'none',padding:'9px 20px',borderRadius:'9px',fontSize:'13px',fontWeight:600,cursor:'pointer' }}>Search</button>
      </div>

      {/* Jobs Grid */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'16px' }}>
        {(dist==='🌐 All Areas' ? jobs : nearbyJobs).map(job => {
          const isApplied = applied.has(job.id)
          const rateLabel = { Daily:'/day',Hourly:'/hour',Monthly:'/month','Per Service':'/service' }[job.rate_type] ?? ''
          return (
            <div key={job.id} style={{ background:'#fff',borderRadius:'14px',border:'1px solid #e2e8e2',padding:'18px 20px',boxShadow:'0 1px 3px rgba(0,0,0,.08)',display:'flex',flexDirection:'column',gap:'10px' }}>
              <div style={{ display:'flex',alignItems:'flex-start',gap:'12px' }}>
                <div style={{ fontSize:'36px' }}>{job.category?.emoji ?? '💼'}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700,fontFamily:'Syne,sans-serif',marginBottom:'4px' }}>{job.title}</div>
                  <div style={{ fontSize:'13px',color:'#6b7280' }}>{job.employer?.employer_profile?.household_name ?? job.employer?.name} · 📍 {job.barangay}</div>
                  <div style={{ display:'flex',gap:'8px',marginTop:'8px',flexWrap:'wrap' }}>
                    {job.category && <span style={tag('rgba(22,163,74,.1)','#16a34a','rgba(22,163,74,.25)')}>{job.category.name}</span>}
                    {job.negotiable && <span style={tag('rgba(59,130,246,.1)','#3b82f6','rgba(59,130,246,.3)')}>Negotiable</span>}
                  </div>
                </div>
                <div style={{ textAlign:'right',flexShrink:0 }}>
                  <div style={{ fontSize:'20px',fontWeight:800,color:'#16a34a',fontFamily:'Syne,sans-serif' }}>₱{parseFloat(job.salary).toLocaleString()}</div>
                  <div style={{ fontSize:'11px',color:'#6b7280' }}>{rateLabel}</div>
                </div>
              </div>
              {job.description && (
                <div style={{ fontSize:'13px',color:'#6b7280',lineHeight:1.5,borderTop:'1px solid #f1f5f1',paddingTop:'8px' }}>
                  {job.description.slice(0,110)}{job.description.length>110?'…':''}
                </div>
              )}
              <button onClick={() => !isApplied && (setCoverText(''), setCoverModal(job))} disabled={isApplied} style={{ width:'100%',padding:'9px',borderRadius:'9px',border:'none',fontSize:'13px',fontWeight:600,cursor:isApplied?'default':'pointer',background:isApplied?'rgba(22,163,74,.1)':'#16a34a',color:isApplied?'#16a34a':'#fff' }}>
                {isApplied ? '✓ Applied' : 'Apply Now'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Cover Modal */}
      {coverModal && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.45)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px' }}>
          <div style={{ background:'#fff',borderRadius:'16px',padding:'28px',width:'100%',maxWidth:'460px',boxShadow:'0 20px 60px rgba(0,0,0,.25)' }}>
            <div style={{ fontWeight:700,fontSize:'17px',marginBottom:'4px' }}>Apply: {coverModal.title}</div>
            <div style={{ fontSize:'13px',color:'#6b7280',marginBottom:'18px' }}>{coverModal.employer?.name} · {coverModal.barangay}</div>
            <label style={{ fontSize:'12px',fontWeight:600,color:'#6b7280',display:'block',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'.5px' }}>Cover Message (optional)</label>
            <textarea rows={4} value={coverText} onChange={e => setCoverText(e.target.value)} placeholder="Introduce yourself and explain why you're a good fit..." style={{ width:'100%',padding:'10px 12px',border:'1.5px solid #e2e8e2',borderRadius:'9px',fontSize:'13px',resize:'vertical',outline:'none',boxSizing:'border-box' }} />
            <div style={{ display:'flex',gap:'10px',marginTop:'16px' }}>
              <button onClick={submitApply} disabled={applying===coverModal.id} style={{ flex:1,padding:'11px',background:'#16a34a',color:'#fff',border:'none',borderRadius:'9px',fontWeight:600,fontSize:'14px',cursor:'pointer' }}>
                {applying===coverModal.id ? 'Submitting…' : '✓ Submit Application'}
              </button>
              <button onClick={() => setCoverModal(null)} style={{ padding:'11px 18px',background:'transparent',border:'1px solid #e2e8e2',borderRadius:'9px',fontSize:'14px',cursor:'pointer',color:'#6b7280' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}