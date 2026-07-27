import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { toast } from '../components/Toast'

export default function JobDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [candidate, setCandidate] = useState(null)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/jobs/${id}`)
        const j = res.data?.data || res.data
        setJob(j)
        if (user?.role === 'Candidate') {
          try {
            const canRes = await api.get(`/candidates/by-user/${user.id}`)
            const c = canRes.data?.data || canRes.data
            setCandidate(c)
            const appsRes = await api.get(`/applications?candidateId=${c.id}`)
            const apps = Array.isArray(appsRes.data) ? appsRes.data : appsRes.data?.data || appsRes.data || []
            if (apps.some((a) => Number(a.jobId) === Number(id) || Number(a.JobID) === Number(id))) {
              setApplied(true)
            }
          } catch {
          }
        }
      } catch (err) {
        if (err.response?.status === 404) navigate('/jobs/browse')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id, user, navigate])

  const handleApply = async () => {
    if (!candidate) {
      alert('Vui lòng tạo hồ sơ ứng viên trước khi ứng tuyển')
      navigate('/profile')
      return
    }
    setApplying(true)
    try {
      await api.post('/applications', {
        candidateId: candidate.id,
        jobId: Number(id),
        status: 'Pending'
      })
      setApplied(true)
      toast('Ứng tuyển thành công!')
    } catch (err) {
      toast(err.response?.data?.error || 'Ứng tuyển thất bại', 'error')
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <div className="loading">Đang tải...</div>
  if (!job) return <div className="loading">Không tìm thấy</div>

  return (
    <div className="job-detail-page">
      <div className="job-detail-back">
        <Link to={user?.role === 'Candidate' ? '/jobs/browse' : '/jobs'} className="back-link">&larr; Quay lại</Link>
      </div>

      <div className="job-detail-header-card">
        <div className="job-detail-company-avatar">{job.company?.charAt(0) || 'J'}</div>
        <div className="job-detail-header-info">
          <h1>{job.title}</h1>
          {job.company && <p className="job-detail-company">{job.company}</p>}
        </div>
      </div>

      <div className="job-detail-grid">
        {job.location && (
          <div className="job-detail-info-card">
            <div className="jdi-icon">&#128205;</div>
            <div className="jdi-content">
              <span className="jdi-label">Địa điểm</span>
              <span className="jdi-value">{job.location}</span>
            </div>
          </div>
        )}
        {job.salary && (
          <div className="job-detail-info-card">
            <div className="jdi-icon">&#128176;</div>
            <div className="jdi-content">
              <span className="jdi-label">Mức lương</span>
              <span className="jdi-value">{job.salary}</span>
            </div>
          </div>
        )}
        {job.employerId && (
          <div className="job-detail-info-card">
            <div className="jdi-icon">&#128100;</div>
            <div className="jdi-content">
              <span className="jdi-label">Mã nhà tuyển dụng</span>
              <span className="jdi-value">#{job.employerId}</span>
            </div>
          </div>
        )}
      </div>

      {job.description && (
        <div className="job-detail-section">
          <h2>Mô tả công việc</h2>
          <div className="job-detail-description">
            {job.description.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}

      {user?.role === 'Candidate' && (
        <div className="job-detail-apply-section">
          <button
            className={`btn btn-large ${applied ? 'btn-applied' : 'btn-apply'}`}
            onClick={handleApply}
            disabled={applied || applying}
          >
            {applied ? (
              <>&#10003; Đã ứng tuyển</>
            ) : applying ? (
              <>⏳ Đang xử lý...</>
            ) : (
              <>&#128140; Ứng tuyển ngay</>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
