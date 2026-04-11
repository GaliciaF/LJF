import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function ServiceCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [form, setForm]             = useState({ name:'', emoji:'' })
  const [editing, setEditing]       = useState(null)

  useEffect(() => {
    api.get('/admin/categories').then(res => setCategories(res.data)).finally(() => setLoading(false))
  }, [])

  const handleAdd = async () => {
    if (!form.name.trim()) return
    const res = await api.post('/admin/categories', form)
    setCategories(p => [...p, res.data])
    setForm({ name:'', emoji:'' })
  }

  const handleEdit = async () => {
    await api.put(`/admin/categories/${editing.id}`, { name:editing.name, emoji:editing.emoji })
    setCategories(p => p.map(c => c.id === editing.id ? { ...c, ...editing } : c))
    setEditing(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    await api.delete(`/admin/categories/${id}`)
    setCategories(p => p.filter(c => c.id !== id))
  }

  const btn = (bg, c, b) => ({
    background:bg, color:c, border:b ? `1px solid ${b}` : 'none',
    padding:'7px 14px', borderRadius:'8px', fontSize:'12px',
    fontWeight:600, cursor:'pointer', whiteSpace:'nowrap',
  })

  const inp = {
    padding:'9px 12px', border:'1.5px solid #2a2940', borderRadius:'9px',
    fontSize:'13px', background:'#1e1d30', color:'#f0eeff', outline:'none',
    boxSizing:'border-box',
  }

  const tag = (bg, c, b) => ({
    display:'inline-flex', padding:'3px 10px', borderRadius:'20px',
    fontSize:'11px', fontWeight:600, background:bg, color:c, border:`1px solid ${b}`,
    whiteSpace:'nowrap',
  })

  const card = {
    background:'#161525', borderRadius:'14px',
    border:'1px solid #2a2940', padding:'20px 16px',
  }

  if (loading) return <div style={{ padding:'28px', color:'#8b8aad' }}>Loading...</div>

  return (
    <div style={{ padding:'16px', maxWidth:'900px', boxSizing:'border-box' }}>
      <style>{`
        @media (min-width: 640px) {
          .sc-outer { padding: 28px !important; }
          .sc-card  { padding: 20px 24px !important; }
        }

        .sc-form-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .sc-form-row .sc-emoji-input {
          width: 80px;
          flex-shrink: 0;
        }

        .sc-form-row .sc-name-input {
          flex: 1;
          min-width: 120px;
        }

        .sc-cat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: #1e1d30;
          border-radius: 10px;
          border: 1px solid #2a2940;
          flex-wrap: wrap;
        }

        .sc-cat-name {
          font-weight: 600;
          color: #f0eeff;
          flex: 1;
          min-width: 100px;
        }

        .sc-cat-actions {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }
      `}</style>

      <div className="sc-outer sc-card" style={{ ...card, marginBottom:'20px' }}>
        <div style={{ fontSize:'15px', fontWeight:700, color:'#f0eeff', marginBottom:'14px' }}>
          {editing ? '✏️ Edit Category' : '➕ Add New Category'}
        </div>
        <div className="sc-form-row">
          <input
            className="sc-emoji-input"
            value={editing ? editing.emoji : form.emoji}
            onChange={e => editing ? setEditing({ ...editing, emoji:e.target.value }) : setForm({ ...form, emoji:e.target.value })}
            placeholder="Emoji"
            style={{ ...inp, width:'80px' }}
          />
          <input
            className="sc-name-input"
            value={editing ? editing.name : form.name}
            onChange={e => editing ? setEditing({ ...editing, name:e.target.value }) : setForm({ ...form, name:e.target.value })}
            placeholder="Category name"
            style={{ ...inp, flex:1, minWidth:'120px' }}
          />
          {editing ? (
            <>
              <button style={btn('#7c3aed', '#fff')} onClick={handleEdit}>Save</button>
              <button style={btn('transparent', '#8b8aad', '#2a2940')} onClick={() => setEditing(null)}>Cancel</button>
            </>
          ) : (
            <button style={btn('#7c3aed', '#fff')} onClick={handleAdd}>+ Add</button>
          )}
        </div>
      </div>

      <div className="sc-outer sc-card" style={card}>
        <div style={{ fontSize:'15px', fontWeight:700, color:'#f0eeff', marginBottom:'14px' }}>🗂️ All Categories</div>
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {categories.length === 0 ? (
            <div style={{ color:'#5a5978', fontSize:'13px', textAlign:'center', padding:'20px' }}>No categories yet.</div>
          ) : categories.map(cat => (
            <div key={cat.id} className="sc-cat-item">
              <span style={{ fontSize:'22px', flexShrink:0 }}>{cat.emoji}</span>
              <span className="sc-cat-name">{cat.name}</span>
              <span style={tag('rgba(34,197,94,.12)', '#22c55e', 'rgba(34,197,94,.25)')}>{cat.jobs_count ?? 0} jobs</span>
              <div className="sc-cat-actions">
                <button style={btn('transparent', '#8b8aad', '#2a2940')} onClick={() => setEditing({ id:cat.id, name:cat.name, emoji:cat.emoji })}>Edit</button>
                <button style={btn('rgba(248,113,113,.12)', '#f87171', 'rgba(248,113,113,.3)')} onClick={() => handleDelete(cat.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}