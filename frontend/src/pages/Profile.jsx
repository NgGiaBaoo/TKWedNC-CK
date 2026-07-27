import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { toast } from '../components/Toast'

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', skills: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    if (user.role === 'Candidate') {
      api.get(`/candidates/by-user/${user.id}`)
        .then((res) => {
          const p = res.data?.data
          if (p) {
            setProfile(p)
            setForm({ fullName: p.fullName || '', email: p.email || '', phone: p.phone || '', skills: p.skills || '' })
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (profile) {
        const res = await api.put(`/candidates/${profile.id}`, form)
        setProfile(res.data?.data || res.data)
      } else {
        const res = await api.post('/candidates', { ...form, userId: user.id })
        setProfile(res.data?.data || res.data)
      }
      toast('Cập nhật hồ sơ thành công!')
    } catch (err) {
      toast(err.response?.data?.error || err.response?.data?.message || 'Lưu thất bại', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading">Đang tải...</div>

  if (user?.role !== 'Candidate') {
    return (
      <div className="page-header">
        <h1>Hồ sơ cá nhân</h1>
        <div className="empty-state">
          <p>Thông tin cá nhân: <strong>{user?.username}</strong> (Vai trò: {user?.role})</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Hồ sơ ứng viên</h1>
        <p>Quản lý thông tin cá nhân của bạn</p>
      </div>

      <div className="profile-layout">
        <div className="profile-avatar-section">
          <div className="profile-avatar-circle">
            {profile?.fullName?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <h2 className="profile-name">{profile?.fullName || user?.username}</h2>
          <p className="profile-email">{profile?.email || 'Chưa có email'}</p>
          <div className="profile-role-badge">{user?.role}</div>
        </div>

        <div className="profile-form-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ và tên</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">&#128100;</span>
                <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Nhập họ tên của bạn" required />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">&#9993;</span>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="example@email.com" required />
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
                <label>Kỹ năng</label>
                <div className="input-icon-wrapper">
                  <span className="input-icon">&#9889;</span>
                  <input type="text" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Node.js, React, MySQL" />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Kỹ năng chi tiết</label>
              <textarea rows={3} value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Ví dụ: Node.js, React, MySQL, Docker, AWS" />
            </div>

            {form.skills && (
              <div className="skills-preview">
                {form.skills.split(',').map((s, i) => (
                  <span key={i} className="skill-tag">{s.trim()}</span>
                ))}
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-with-icon" disabled={saving}>
                <span>{saving ? '⏳' : '💾'}</span>
                {saving ? 'Đang lưu...' : (profile ? 'Cập nhật hồ sơ' : 'Tạo hồ sơ')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
