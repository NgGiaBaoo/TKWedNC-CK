import { useState, useEffect } from 'react'
import api from '../api/axios'

const statusColors = {
  Pending: '#d97706',
  Approved: '#059669',
  Rejected: '#dc2626',
}

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications')
      setApplications(Array.isArray(res.data) ? res.data : res.data?.data || [])
    } catch (err) {
      console.error('Failed to fetch applications', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchApplications() }, [])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/applications/${id}`, { status: newStatus })
      fetchApplications()
    } catch (err) {
      alert(err.response?.data?.error || 'Cập nhật thất bại')
    }
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <h1>Đơn ứng tuyển</h1>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Ứng viên</th>
              <th>ID Công việc</th>
              <th>Ngày nộp</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>{app.candidateId}</td>
                <td>{app.jobId}</td>
                <td>{app.applyDate ? new Date(app.applyDate).toLocaleDateString('vi-VN') : '--'}</td>
                <td>
                  <span className="status-badge" style={{ backgroundColor: statusColors[app.status] || '#6b7280' }}>
                    {app.status || 'Unknown'}
                  </span>
                </td>
                <td className="actions">
                  {app.status === 'Pending' && (
                    <>
                      <button className="btn btn-sm btn-approve" onClick={() => handleStatusChange(app.id, 'Approved')}>
                        Duyệt
                      </button>
                      <button className="btn btn-sm btn-reject" onClick={() => handleStatusChange(app.id, 'Rejected')}>
                        Từ chối
                      </button>
                    </>
                  )}
                  {app.status !== 'Pending' && <span className="text-muted">--</span>}
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr><td colSpan={6} className="text-center">Chưa có đơn ứng tuyển</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
