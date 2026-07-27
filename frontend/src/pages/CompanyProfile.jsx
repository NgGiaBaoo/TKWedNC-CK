import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { toast } from '../components/Toast'

export default function CompanyProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ companyName: '', email: '', phone: '', address: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    api.get(`/employers/by-user/${user.id}`)
      .then((res) => {
        const p = res.data
        if (p) {
          setProfile(p)
          setForm({ companyName: p.companyName || '', email: p.email || '', phone: p.phone || '', address: p.address || '' })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (profile) {
        const res = await api.put(`/employers/${profile.id}`, form)
        setProfile(res.data)
      } else {
        const res = await api.post('/employers', { ...form, userId: user.id })
        setProfile(res.data)
      }
      toast('Cập nhật thông tin công ty thành công!')
    } catch (err) {
      toast(err.response?.data?.error || 'Lưu thất bại', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <div className="company-profile-page">
      <div className="page-header">
        <h1>Thông tin công ty</h1>
        <p>Quản lý thông tin doanh nghiệp của bạn</p>
      </div>

      <div className="company-profile-layout">
        <div className="company-logo-section">
          <div className="company-logo-circle">
            {form.companyName ? form.companyName.charAt(0).toUpperCase() : '?'}
          </div>
          <h2 className="company-name-display">{profile?.companyName || 'Chưa có tên công ty'}</h2>
          <div className="company-status-badge">
            {profile ? 'Đã đăng ký' : 'Chưa đăng ký'}
          </div>
        </div>

        <div className="company-form-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên công ty</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">&#127970;</span>
                <input type="text" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} placeholder="Công ty TNHH ABC" required />
              </div>
            </div>
            <div className="form-group">
              <label>Email công ty</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">&#9993;</span>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="info@company.com" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Số điện thoại</label>
                <div className="input-icon-wrapper">
                  <span className="input-icon">&#9742;</span>
                  <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0123 456 789" />
                </div>
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <div className="input-icon-wrapper">
                  <span className="input-icon">&#128205;</span>
                  <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="123 Đường ABC, Quận 1" />
                </div>
              </div>
            </div>

            {profile && (
              <div className="company-info-summary">
                <h3>Thông tin hiện tại</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Email</span>
                    <span className="summary-value">{profile.email}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">SĐT</span>
                    <span className="summary-value">{profile.phone || '--'}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Địa chỉ</span>
                    <span className="summary-value">{profile.address || '--'}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-with-icon" disabled={saving}>
                <span>{saving ? '⏳' : '💾'}</span>
                {saving ? 'Đang lưu...' : (profile ? 'Cập nhật thông tin' : 'Tạo thông tin công ty')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
