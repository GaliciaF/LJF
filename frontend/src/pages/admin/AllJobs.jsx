import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function AllJobs() {
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')

  const loadJobs = (currentFilter, currentSearch) => {
    setLoading(true)
    api.get('/admin/jobs', {
      params: {
        status: currentFilter === 'all' ? null : currentFilter,
        search: currentSearch || null,
      }
    })
      .then(res => setJobs(res.data.data ?? res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadJobs(filter, search) }, [filter])

  const handleSearch  = () => loadJobs(filter, search)
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch() }

  const handleRemove = async (id) => {
    if (!confirm('Remove this job?')) return
    await api.delete(`/admin/jobs/${id}`)
    setJobs(p => p.filter(j => j.id !== id))
  }

  const handleFlag = async (id) => {
    await api.patch(`/admin/jobs/${id}/status`, { status: 'flagged' })
    loadJobs(filter, search)
  }

  const tag  = (bg, c, b) => ({ display:'inline-flex', padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:600, background:bg, color:c, border:`1px solid ${b}`, whiteSpace:'nowrap' })
  const btn  = (bg, c, b) => ({ background:bg, color:c, border:b?`1px solid ${b}`:'none', padding:'5px 12px', borderRadius:'8px', fontSize:'11px', fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' })
  const chip = (active) => ({ padding:'6px 14px', borderRadius:'20px', border:`1.5px solid ${active?'#7c3aed':'#2a2940'}`, fontSize:'12px', fontWeight:active?600:500, color:active?'#a78bfa':'#8b8aad', cursor:'pointer', background:active?'rgba(124,58,237,.12)':'transparent', whiteSpace:'nowrap' })

  const statusTag = (s) => ({
    available:     tag('rgba(34,197,94,.12)',  '#22c55e', 'rgba(34,197,94,.3)'),
    not_available: tag('rgba(251,191,36,.12)', '#fbbf24', 'rgba(251,191,36,.3)'),
    done:          tag('#1e1d30',              '#5a5978', '#2a2940'),
    flagged:       tag('rgba(248,113,113,.12)','#f87171', 'rgba(248,113,113,.3)'),
  })[s] ?? tag('#1e1d30', '#8b8aad', '#2a2940')

  const statusLabel = (s) => ({
    available:     'Available',
    not_available: 'Not Available',
    done:          'Done',
    flagged:       'Flagged',
  })[s] ?? s

  const filters = [
    { value: 'all',           label: 'All' },
    { value: 'available',     label: 'Available' },
    { value: 'not_available', label: 'Not Available' },
    { value: 'done',          label: 'Done' },
    { value: 'flagged',       label: 'Flagged' },
  ]

  return (
    <div style={{ padding:'16px', maxWidth:'1280px', boxSizing:'border-box' }}>

      <style>{`
        @media (min-width: 640px) {
          .jobs-padding { padding: 28px !important; }
        }

        /* Desktop table */
        .jobs-table-wrap { display: none; }
        @media (min-width: 768px) {
          .jobs-table-wrap { display: block; }
          .jobs-card-list  { display: none !important; }
        }

        /* Card list for mobile */
        .jobs-card-list { display: flex; flex-direction: column; gap: 10px; padding: 12px; }

        .job-card {
          background: #1e1d30;
          border: 1px solid #2a2940;
          border-radius: 10px;
          padding: 14px;
        }

        .job-card-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 8px;
        }

        .job-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 10px;
        }

        .job-card-actions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        th.jobs-th { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #5a5978; padding: 10px 14px; border-bottom: 1px solid #2a2940; text-align: left; }
        td.jobs-td { padding: 12px 14px; border-bottom: 1px solid #1a1930; font-size: 13px; color: #f0eeff; vertical-align: middle; }
      `}</style>

      {/* Filters + Search */}
      <div className="jobs-padding" style={{ background:'#161525', borderRadius:'14px', border:'1px solid #2a2940', padding:'14px', marginBottom:'16px' }}>
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'14px', overflowX:'auto', paddingBottom:'4px' }}>
          {filters.map(f => (
            <div key={f.value} style={chip(filter === f.value)} onClick={() => setFilter(f.value)}>
              {f.label}
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:'10px' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="🔍 Search job title..."
            style={{ flex:1, minWidth:0, padding:'9px 14px', border:'1.5px solid #2a2940', borderRadius:'9px', fontSize:'13px', background:'#1e1d30', color:'#f0eeff', outline:'none' }}
          />
          <button style={btn('#7c3aed', '#fff')} onClick={handleSearch}>Search</button>
        </div>
      </div>

      {/* Table/Cards Container */}
      <div style={{ background:'#161525', borderRadius:'14px', border:'1px solid #2a2940', overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:'32px', textAlign:'center', color:'#8b8aad' }}>Loading jobs...</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="jobs-table-wrap" style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'700px' }}>
                <thead>
                  <tr>
                    {['Title','Employer','Category','Rate','Applicants','Status','Actions'].map(h => (
                      <th key={h} className="jobs-th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jobs.length === 0
                    ? <tr><td colSpan={7} className="jobs-td" style={{ textAlign:'center', color:'#5a5978' }}>No jobs found.</td></tr>
                    : jobs.map(j => (
                      <tr key={j.id}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,.04)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="jobs-td">
                          <div style={{ fontWeight:600 }}>{j.title}</div>
                          <div style={{ fontSize:'11px', color:'#8b8aad' }}>{j.barangay}</div>
                        </td>
                        <td className="jobs-td" style={{ color:'#8b8aad' }}>{j.employer?.name ?? '—'}</td>
                        <td className="jobs-td">{j.category?.emoji} {j.category?.name}</td>
                        <td className="jobs-td" style={{ color:'#22c55e', fontWeight:700 }}>
                          ₱{parseFloat(j.salary).toLocaleString()}
                          <span style={{ color:'#5a5978', fontWeight:400, fontSize:'11px' }}>
                            /{j.rate_type === 'Daily' ? 'day' : 'hr'}
                          </span>
                        </td>
                        <td className="jobs-td">{j.applications_count ?? 0}</td>
                        <td className="jobs-td">
                          <span style={statusTag(j.status)}>{statusLabel(j.status)}</span>
                        </td>
                        <td className="jobs-td">
                          <div style={{ display:'flex', gap:'6px' }}>
                            {j.status !== 'flagged' && (
                              <button style={btn('rgba(251,191,36,.12)', '#fbbf24', 'rgba(251,191,36,.3)')} onClick={() => handleFlag(j.id)}>Flag</button>
                            )}
                            <button style={btn('rgba(248,113,113,.12)', '#f87171', 'rgba(248,113,113,.3)')} onClick={() => handleRemove(j.id)}>Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="jobs-card-list">
              {jobs.length === 0 ? (
                <div style={{ textAlign:'center', color:'#5a5978', padding:'32px' }}>No jobs found.</div>
              ) : jobs.map(j => (
                <div key={j.id} className="job-card">
                  <div className="job-card-row">
                    <div>
                      <div style={{ fontWeight:700, fontSize:'14px', color:'#f0eeff' }}>{j.title}</div>
                      <div style={{ fontSize:'11px', color:'#8b8aad', marginTop:'2px' }}>{j.barangay}</div>
                    </div>
                    <span style={statusTag(j.status)}>{statusLabel(j.status)}</span>
                  </div>
                  <div className="job-card-meta">
                    <span style={{ fontSize:'12px', color:'#8b8aad' }}>{j.employer?.name ?? '—'}</span>
                    <span style={{ fontSize:'12px', color:'#8b8aad' }}>•</span>
                    <span style={{ fontSize:'12px', color:'#8b8aad' }}>{j.category?.emoji} {j.category?.name}</span>
                    <span style={{ fontSize:'12px', color:'#22c55e', fontWeight:700 }}>
                      ₱{parseFloat(j.salary).toLocaleString()}/{j.rate_type === 'Daily' ? 'day' : 'hr'}
                    </span>
                    <span style={{ fontSize:'12px', color:'#8b8aad' }}>{j.applications_count ?? 0} applicants</span>
                  </div>
                  <div className="job-card-actions">
                    {j.status !== 'flagged' && (
                      <button style={btn('rgba(251,191,36,.12)', '#fbbf24', 'rgba(251,191,36,.3)')} onClick={() => handleFlag(j.id)}>Flag</button>
                    )}
                    <button style={btn('rgba(248,113,113,.12)', '#f87171', 'rgba(248,113,113,.3)')} onClick={() => handleRemove(j.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}