import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { toast } from '../components/Toast'

const statusConfig = {
  Pending: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: '⏳', label: 'Đang chờ' },
  Approved: { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', icon: '✅', label: 'Đã duyệt' },
  Rejected: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: '❌', label: 'Từ chối' },
}

export default function EmployerApplications() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const jobIdFromUrl = searchParams.get('jobId')
  const [apps, setApps] = useState([])
  const [jobs, setJobs] = useState([])
  const [employer, setEmployer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('All')

  const fetchApps = async () => {
    try {
      const empRes = await api.get(`/employers/by-user/${user.id}`)
      const emp = empRes.data
      setEmployer(emp)
      if (emp) {
        if (jobIdFromUrl) {
          const appsRes = await api.get(`/applications?employerId=${emp.id}`)
          let allApps = Array.isArray(appsRes.data) ? appsRes.data : appsRes.data?.data || appsRes.data || []
          const jobRes = await api.get(`/jobs/${jobIdFromUrl}`)
          const j = jobRes.data?.data || jobRes.data
          setJobs(j ? [j] : [])
          allApps = allApps.filter((a) => Number(a.JobID || a.jobId) === Number(jobIdFromUrl))
          setApps(allApps)
        } else {
          const appsRes = await api.get(`/applications?employerId=${emp.id}`)
          setApps(Array.isArray(appsRes.data) ? appsRes.data : appsRes.data?.data || appsRes.data || [])
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchApps() }, [user, jobIdFromUrl])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/applications/${id}`, { status: newStatus })
      fetchApps()
    } catch (err) {
      toast(err.response?.data?.error || 'Cập nhật thất bại', 'error')
    }
  }

  const filtered = filterStatus === 'All' ? apps : apps.filter((a) => (a.Status || a.status) === filterStatus)
  const selectedJob = jobs[0]

  if (loading) return <div className="loading">Đang tải...</div>

  if (!employer) {
    return (
      <div className="employer-apps-page">
        <div className="page-header"><h1>Đơn ứng tuyển</h1></div>
        <div className="empty-state-card">
          <div className="empty-icon">&#127970;</div>
          <h3>Chưa có thông tin công ty</h3>
          <p>Vui lòng tạo thông tin công ty trước khi xem đơn ứng tuyển.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="employer-apps-page">
      <div className="page-header">
        <div>
          {selectedJob ? (
            <>
              <div className="page-header-nav">
                <Link to="/employer/applications" className="back-link">&larr; Tất cả đơn</Link>
              </div>
              <h1>{selectedJob.title}</h1>
              <p>{employer.companyName} &middot; {apps.length} ứng viên đã ứng tuyển</p>
            </>
          ) : (
            <>
              <h1>Đơn ứng tuyển</h1>
              <p>{employer.companyName} &middot; {apps.length} đơn</p>
            </>
          )}
        </div>
      </div>

      <div className="filter-tabs">
        {['All', 'Pending', 'Approved', 'Rejected'].map((f) => (
          <button
            key={f}
            className={`filter-tab ${filterStatus === f ? 'active' : ''}`}
            onClick={() => setFilterStatus(f)}
          >
            {f === 'All' ? 'Tất cả' : statusConfig[f]?.label || f}
            {f !== 'All' && <span className="filter-count">{apps.filter((a) => (a.Status || a.status) === f).length}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon">&#128203;</div>
          <h3>Không có đơn ứng tuyển</h3>
          <p>{selectedJob ? 'Chưa có ứng viên nào ứng tuyển vào vị trí này.' : 'Chưa có ứng viên nào ứng tuyển vào công ty bạn.'}</p>
        </div>
      ) : (
        <div className="employer-app-cards">
          {filtered.map((app) => {
            const status = app.Status || app.status || 'Unknown'
            const cfg = statusConfig[status] || { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb', icon: '❓', label: status }
            return (
              <div key={app.ApplicationID || app.id} className="employer-app-card" style={{ borderLeftColor: cfg.color }}>
                <div className="eapp-job-section">
                  <div className="eapp-job-icon">&#128188;</div>
                  <div className="eapp-job-info">
                    <h3 className="eapp-job-title">{app.JobTitle || app.jobTitle || `Job #${app.JobID || app.jobId}`}</h3>
                    <div className="eapp-job-meta">
                      {app.Salary && <span className="eapp-job-tag salary">{app.Salary}</span>}
                      {app.Location && <span className="eapp-job-tag location">{app.Location}</span>}
                    </div>
                  </div>
                </div>

                <div className="eapp-candidate-section">
                  <div className="eapp-header">
                    <div className="eapp-candidate-info">
                      <div className="eapp-avatar">
                        {(app.CandidateName || app.candidateName || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3>{app.CandidateName || app.candidateName || `#${app.CandidateID || app.candidateId}`}</h3>
                        <span className="eapp-candidate-sub">Ứng viên</span>
                      </div>
                    </div>
                    <div className="eapp-status" style={{ backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.border }}>
                      {cfg.icon} {cfg.label}
                    </div>
                  </div>

                  <div className="eapp-body">
                    <div className="eapp-detail-grid">
                      <div className="eapp-detail-item">
                        <span className="eapp-detail-label">Email</span>
                        <span className="eapp-detail-value">{app.CandidateEmail || app.candidateEmail || '--'}</span>
                      </div>
                      <div className="eapp-detail-item">
                        <span className="eapp-detail-label">SĐT</span>
                        <span className="eapp-detail-value">{app.CandidatePhone || app.candidatePhone || '--'}</span>
                      </div>
                      <div className="eapp-detail-item">
                        <span className="eapp-detail-label">Ngày nộp</span>
                        <span className="eapp-detail-value">{app.ApplyDate || app.applyDate ? new Date(app.ApplyDate || app.applyDate).toLocaleDateString('vi-VN') : '--'}</span>
                      </div>
                      <div className="eapp-detail-item">
                        <span className="eapp-detail-label">Kỹ năng</span>
                        <span className="eapp-detail-value">{app.Skills || app.skills || '--'}</span>
                      </div>
                    </div>
                    {(app.Skills || app.skills) && (
                      <div className="eapp-skills">
                        {String(app.Skills || app.skills).split(',').map((s, i) => (
                          <span key={i} className="eapp-skill-tag">{s.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="eapp-footer">
                  {status === 'Pending' && (
                    <div className="eapp-actions">
                      <button className="btn btn-approve btn-with-icon" onClick={() => handleStatusChange(app.ApplicationID || app.id, 'Approved')}>
                        <span>✅</span> Duyệt đơn
                      </button>
                      <button className="btn btn-reject btn-with-icon" onClick={() => handleStatusChange(app.ApplicationID || app.id, 'Rejected')}>
                        <span>❌</span> Từ chối
                      </button>
                    </div>
                  )}
                  {status !== 'Pending' && (
                    <div className="eapp-processed">
                      {status === 'Approved' ? '✅ Đã duyệt đơn ứng tuyển này' : '❌ Đã từ chối đơn ứng tuyển này'}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
