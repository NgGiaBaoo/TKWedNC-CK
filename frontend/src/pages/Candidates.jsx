import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Candidates() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/candidates')
      .then((res) => setCandidates(res.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <div className="admin-list-page">
      <div className="page-header">
        <div>
          <h1>Quản lý Ứng viên</h1>
          <p>{candidates.length} ứng viên</p>
        </div>
      </div>

      <div className="data-card-list">
        {candidates.map((c) => (
          <div key={c.id} className="data-card">
            <div className="data-card-avatar" style={{ backgroundColor: '#d97706' }}>
              {c.fullName?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="data-card-body">
              <h3>{c.fullName}</h3>
              <div className="data-card-details">
                <span>{c.email}</span>
                <span>{c.phone || '--'}</span>
              </div>
              {c.skills && (
                <div className="data-card-skills">
                  {c.skills.split(',').map((s, i) => (
                    <span key={i} className="skill-tag">{s.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {candidates.length === 0 && (
          <div className="empty-state-card">
            <div className="empty-icon">&#128101;</div>
            <h3>Chưa có ứng viên</h3>
            <p>Chưa có ứng viên nào đăng ký.</p>
          </div>
        )}
      </div>
    </div>
  )
}
