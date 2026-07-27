import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/jobs')
      .then((res) => setJobs(Array.isArray(res.data) ? res.data : res.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = jobs.filter((job) =>
    !search || job.title?.toLowerCase().includes(search.toLowerCase()) ||
    job.company?.toLowerCase().includes(search.toLowerCase()) ||
    job.location?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <div className="browse-jobs-page">
      <div className="page-header">
        <div>
          <h1>Việc làm đang tuyển</h1>
          <p>{filtered.length} việc làm phù hợp</p>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">&#128269;</span>
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề, công ty, địa điểm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>&times;</button>
          )}
        </div>
      </div>

      <div className="browse-job-list">
        {filtered.map((job) => (
          <Link to={`/jobs/${job.id}`} key={job.id} className="browse-job-card">
            <div className="browse-job-left">
              <div className="browse-job-avatar">{job.company?.charAt(0) || 'J'}</div>
            </div>
            <div className="browse-job-body">
              <h3>{job.title}</h3>
              <div className="browse-job-meta">
                {job.company && (
                  <span className="browse-job-tag company-tag">{job.company}</span>
                )}
                {job.location && (
                  <span className="browse-job-tag location-tag">{job.location}</span>
                )}
                {job.salary && (
                  <span className="browse-job-tag salary-tag">{job.salary}</span>
                )}
              </div>
              <p className="browse-job-desc">{job.description}</p>
            </div>
            <div className="browse-job-right">
              <span className="browse-job-arrow">&rarr;</span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state-card">
            <div className="empty-icon">&#128270;</div>
            <h3>Không tìm thấy việc làm</h3>
            <p>Thử tìm kiếm với từ khóa khác</p>
          </div>
        )}
      </div>
    </div>
  )
}
