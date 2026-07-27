import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Employers() {
  const [employers, setEmployers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({ companyName: '', email: '', phone: '', address: '' })

  const fetchEmployers = async () => {
    try {
      const res = await api.get('/employers')
      setEmployers(Array.isArray(res.data) ? res.data : res.data?.data || [])
    } catch (err) {
      console.error('Failed to fetch employers', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEmployers() }, [])

  const resetForm = () => {
    setForm({ companyName: '', email: '', phone: '', address: '' })
    setEditItem(null)
    setShowForm(false)
  }

  const openEdit = (employer) => {
    setForm({
      companyName: employer.companyName || '',
      email: employer.email || '',
      phone: employer.phone || '',
      address: employer.address || '',
    })
    setEditItem(employer)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editItem) {
        await api.put(`/employers/${editItem.id}`, form)
      } else {
        await api.post('/employers', form)
      }
      resetForm()
      fetchEmployers()
    } catch (err) {
      alert(err.response?.data?.error || 'Lưu thất bại')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa nhà tuyển dụng này?')) return
    try {
      await api.delete(`/employers/${id}`)
      fetchEmployers()
    } catch (err) {
      alert(err.response?.data?.error || 'Xóa thất bại')
    }
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <div className="admin-list-page">
      <div className="page-header">
        <div>
          <h1>Nhà tuyển dụng</h1>
          <p>{employers.length} nhà tuyển dụng</p>
        </div>
        <button className="btn btn-primary btn-with-icon" onClick={() => { resetForm(); setShowForm(true) }}>
          <span>+</span> Thêm mới
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) resetForm() }}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editItem ? 'Chỉnh sửa' : 'Thêm nhà tuyển dụng'}</h2>
              <button className="btn-close" onClick={resetForm}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên công ty *</label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Hủy</button>
                <button type="submit" className="btn btn-primary">
                  {editItem ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="data-card-list">
        {employers.map((emp) => (
          <div key={emp.id} className="data-card">
            <div className="data-card-avatar" style={{ backgroundColor: '#4f46e5' }}>
              {emp.companyName?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="data-card-body">
              <h3>{emp.companyName}</h3>
              <div className="data-card-details">
                <span>{emp.email}</span>
                <span>{emp.phone || '--'}</span>
                <span>{emp.address || '--'}</span>
              </div>
            </div>
            <div className="data-card-actions">
              <button className="btn btn-sm btn-edit" onClick={() => openEdit(emp)}>Sửa</button>
              <button className="btn btn-sm btn-delete" onClick={() => handleDelete(emp.id)}>Xóa</button>
            </div>
          </div>
        ))}
        {employers.length === 0 && (
          <div className="empty-state-card">
            <div className="empty-icon">&#127970;</div>
            <h3>Chưa có nhà tuyển dụng</h3>
            <p>Thêm nhà tuyển dụng đầu tiên để bắt đầu.</p>
          </div>
        )}
      </div>
    </div>
  )
}
