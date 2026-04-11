import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function SecurityControls() {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [tab,     setTab]     = useState('all')
  const [msg,     setMsg]     = useState('')

  const fetchUsers = () => {
    setLoading(true)
    const params = {}
    if (tab !== 'all') params.status = tab
    if (search) params.search = search
    api.get('/admin/users', { params })
      .then(res => setUsers(res.data.data ?? res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [tab])

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 2500) }

  const updateStatus = async (userId, status, reason = null) => {
    await api.patch(`/admin/users/${userId}/status`, { status, suspension_reason: reason })
    flash(`User ${status}.`)
    fetchUsers()
  }

  const deleteUser = async (userId) => {
    if (!confirm('Permanently delete this user?')) return
    await api.delete(`/admin/users/${userId}`)
    flash('User deleted.')
    fetchUsers()
  }

  const btn = (bg,c,b) => ({ background:bg, color:c, border:b?`1px solid ${b}`:'none', padding:'6px 12px', borderRadius:'7px', fontSize:'11px', fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' })
  const chip = (active) => ({ padding:'6px 16px', borderRadius:'20px', border:`1.5px solid ${active?'#7c3aed':'#2a2940'}`, fontSize:'12px', fontWeight:active?700:500, color:active?'#a78bfa':'#8b8aad', cursor:'pointer', background:active?'rgba(124,58,237,.12)':'transparent', whiteSpace:'nowrap' })

  const statusBadge = {
    active:    ['rgba(34,197,94,.12)', '#22c55e', 'rgba(34,197,94,.3)'],
    suspended: ['rgba(245,158,11,.12)', '#f59e0b', 'rgba(245,158,11,.3)'],
    banned:    ['rgba(248,113,113,.12)', '#f87171', 'rgba(248,113,113,.3)'],
  }
  const tagStyle = (s) => {
    const [bg,c,b] = statusBadge[s] ?? statusBadge.active
    return { display:'inline-flex', padding:'2px 8px', borderRadius:'20px', fontSize:'10px', fontWeight:600, background:bg, color:c, border:`1px solid ${b}`, whiteSpace:'nowrap' }
  }

  return (
    <div style={{ padding:'16px', maxWidth:'1100px', boxSizing:'border-box' }}>
      <style>{`
        @media (min-width: 640px) {
          .sc-outer { padding: 28px !important; }
        }

        /* Tabs + search: stack on small, row on medium+ */
        .sc-toolbar {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }
        @media (min-width: 640px) {
          .sc-toolbar {
            flex-direction: row;
            align-items: center;
            flex-wrap: wrap;
          }
        }

        .sc-tab-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .sc-search-group {
          display: flex;
          gap: 8px;
          flex: 1;
        }

        @media (min-width: 640px) {
          .sc-search-group { margin-left: auto; max-width: 340px; }
        }

        /* Desktop table */
        .sc-table-wrap { display: none; }
        @media (min-width: 768px) {
          .sc-table-wrap { display: block; overflow-x: auto; }
          .sc-card-list  { display: none !important; }
        }

        /* Mobile card list */
        .sc-card-list {
          display: flex;
          flex-direction: column;
        }

        .sc-user-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 14px 16px;
          border-bottom: 1px solid #1e1d30;
        }

        .sc-user-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
        }

        .sc-user-card-actions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .sc-th { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #5a5978; padding: 12px 18px; border-bottom: 1px solid #2a2940; text-align: left; letter-spacing: 1px; }
        .sc-td { padding: 14px 18px; border-bottom: 1px solid #1e1d30; vertical-align: middle; }
      `}</style>

      {msg && (
        <div style={{ background:'rgba(124,58,237,.15)', border:'1px solid rgba(124,58,237,.4)', borderRadius:'10px', padding:'10px 16px', marginBottom:'16px', color:'#a78bfa', fontSize:'13px', fontWeight:500 }}>
          {msg}
        </div>
      )}

      {/* Toolbar */}
      <div className="sc-toolbar sc-outer" style={{ padding:0 }}>
        <div className="sc-tab-group">
          {['all','active','suspended','banned'].map(t => (
            <div key={t} style={chip(tab===t)} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </div>
          ))}
        </div>
        <div className="sc-search-group">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchUsers()}
            placeholder="Search user..."
            style={{ flex:1, minWidth:0, padding:'7px 12px', border:'1.5px solid #2a2940', borderRadius:'9px', fontSize:'13px', background:'#1e1d30', color:'#f0eeff', outline:'none' }}
          />
          <button style={btn('#7c3aed','#fff')} onClick={fetchUsers}>Search</button>
        </div>
      </div>

      {loading ? (
        <div style={{ color:'#8b8aad', padding:'40px', textAlign:'center' }}>Loading...</div>
      ) : users.length === 0 ? (
        <div style={{ color:'#8b8aad', padding:'40px', textAlign:'center', background:'#161525', borderRadius:'14px', border:'1px solid #2a2940' }}>No users found.</div>
      ) : (
        <div style={{ background:'#161525', borderRadius:'14px', border:'1px solid #2a2940', overflow:'hidden' }}>

          {/* Desktop Table */}
          <div className="sc-table-wrap">
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'640px' }}>
              <thead>
                <tr>
                  {['User','Role','Status','Actions'].map((h,i) => (
                    <th key={h} className="sc-th" style={{ width: i===3 ? '220px' : undefined }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="sc-td">
                      <div style={{ fontWeight:600, fontSize:'14px', color:'#f0eeff' }}>{user.name}</div>
                      <div style={{ fontSize:'11px', color:'#5a5978' }}>{user.email ?? user.phone ?? '—'}</div>
                    </td>
                    <td className="sc-td" style={{ fontSize:'12px', color:'#8b8aad', textTransform:'capitalize' }}>{user.role}</td>
                    <td className="sc-td"><span style={tagStyle(user.status)}>{user.status}</span></td>
                    <td className="sc-td">
                      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                        {user.status !== 'suspended' && <button style={btn('rgba(245,158,11,.15)','#f59e0b','rgba(245,158,11,.3)')} onClick={() => updateStatus(user.id,'suspended','Suspended by admin')}>Suspend</button>}
                        {user.status !== 'active'    && <button style={btn('rgba(34,197,94,.12)','#22c55e','rgba(34,197,94,.3)')} onClick={() => updateStatus(user.id,'active')}>Reinstate</button>}
                        {user.status !== 'banned'    && <button style={btn('rgba(248,113,113,.12)','#f87171','rgba(248,113,113,.3)')} onClick={() => updateStatus(user.id,'banned','Banned by admin')}>Ban</button>}
                        <button style={btn('rgba(248,113,113,.08)','#f87171','rgba(248,113,113,.2)')} onClick={() => deleteUser(user.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="sc-card-list">
            {users.map(user => (
              <div key={user.id} className="sc-user-card">
                <div className="sc-user-card-top">
                  <div>
                    <div style={{ fontWeight:600, fontSize:'14px', color:'#f0eeff' }}>{user.name}</div>
                    <div style={{ fontSize:'11px', color:'#5a5978', marginTop:'2px' }}>{user.email ?? user.phone ?? '—'}</div>
                  </div>
                  <div style={{ display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap' }}>
                    <span style={{ fontSize:'12px', color:'#8b8aad', textTransform:'capitalize' }}>{user.role}</span>
                    <span style={tagStyle(user.status)}>{user.status}</span>
                  </div>
                </div>
                <div className="sc-user-card-actions">
                  {user.status !== 'suspended' && <button style={btn('rgba(245,158,11,.15)','#f59e0b','rgba(245,158,11,.3)')} onClick={() => updateStatus(user.id,'suspended','Suspended by admin')}>Suspend</button>}
                  {user.status !== 'active'    && <button style={btn('rgba(34,197,94,.12)','#22c55e','rgba(34,197,94,.3)')} onClick={() => updateStatus(user.id,'active')}>Reinstate</button>}
                  {user.status !== 'banned'    && <button style={btn('rgba(248,113,113,.12)','#f87171','rgba(248,113,113,.3)')} onClick={() => updateStatus(user.id,'banned','Banned by admin')}>Ban</button>}
                  <button style={btn('rgba(248,113,113,.08)','#f87171','rgba(248,113,113,.2)')} onClick={() => deleteUser(user.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  )
}