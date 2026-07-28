import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router'
import api from '../api/axios'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ jobs: 0, applications: 0, employers: 0, candidates: 0, users: 0 })
  const [recentJobs, setRecentJobs] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === 'Admin') {
          const [jobsRes, appsRes, employersRes, candidatesRes, usersRes] = await Promise.all([
            api.get('/jobs'), api.get('/applications'), api.get('/employers'), api.get('/candidates'), api.get('/users'),
          ])
          setStats({
            jobs: (Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data?.data || []).length,
            applications: (Array.isArray(appsRes.data) ? appsRes.data : appsRes.data?.data || []).length,
            employers: (Array.isArray(employersRes.data) ? employersRes.data : employersRes.data?.data || []).length,
            candidates: (Array.isArray(candidatesRes.data) ? candidatesRes.data : candidatesRes.data?.data || []).length,
            users: (Array.isArray(usersRes.data) ? usersRes.data : usersRes.data?.data || []).length,
          })
          const jobs = Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data?.data || []
          setRecentJobs(jobs.slice(-5).reverse())
        } else if (user?.role === 'Employer') {
          const empRes = await api.get(`/employers/by-user/${user.id}`)
          const emp = empRes.data
          if (emp) {
            const [jobsRes, appsRes] = await Promise.all([
              api.get(`/jobs?employerId=${emp.id}`),
              api.get(`/applications?employerId=${emp.id}`),
            ])
            const jobs = Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data?.data || []
            const apps = Array.isArray(appsRes.data) ? appsRes.data : appsRes.data?.data || appsRes.data || []
            setStats({ jobs: jobs.length, applications: apps.length, employers: 1, candidates: 0, users: 0 })
            setRecentJobs(jobs.slice(-5).reverse())
          }
        } else if (user?.role === 'Candidate') {
          const [jobsRes, appsRes] = await Promise.all([
            api.get('/jobs'),
            api.get(`/candidates/by-user/${user.id}`).then((r) => {
              const c = r.data?.data
              return c ? api.get(`/applications?candidateId=${c.id}`) : { data: [] }
            }).catch(() => ({ data: [] })),
          ])
          const jobs = Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data?.data || []
          const apps = Array.isArray(appsRes.data) ? appsRes.data : appsRes.data?.data || appsRes.data || []
          setStats({ jobs: jobs.length, applications: apps.length, employers: 0, candidates: 0, users: 0 })
          setRecentJobs(jobs.slice(-5).reverse())
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [user])

  const cards = user?.role === 'Admin' ? [
    { label: 'Tin tuyển dụng', value: stats.jobs, color: '#4f46e5', link: '/jobs' },
    { label: 'Đơn ứng tuyển', value: stats.applications, color: '#0891b2', link: '/applications' },
    { label: 'Nhà tuyển dụng', value: stats.employers, color: '#059669', link: '/employers' },
    { label: 'Ứng viên', value: stats.candidates, color: '#d97706', link: '/candidates' },
    { label: 'Người dùng', value: stats.users, color: '#7c3aed', link: '/users' },
  ] : user?.role === 'Employer' ? [
    { label: 'Tin tuyển dụng', value: stats.jobs, color: '#4f46e5', link: '/jobs' },
    { label: 'Đơn ứng tuyển', value: stats.applications, color: '#0891b2', link: '/employer/applications' },
  ] : [
    { label: 'Việc làm', value: stats.jobs, color: '#4f46e5', link: '/jobs/browse' },
    { label: 'Đơn đã nộp', value: stats.applications, color: '#0891b2', link: '/candidate/applications' },
  ]

  return (
    <div>
      <div className="page-header">
        <h1>Tổng quan</h1>
        <p>Chào mừng, {user?.username}!</p>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <div key={card.label} className="stat-card clickable" style={{ borderLeftColor: card.color }} onClick={() => navigate(card.link)}>
            <span className="stat-value">{card.value}</span>
            <span className="stat-label">{card.label}</span>
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Tin tuyển dụng mới nhất</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tiêu đề</th>
                <th>Công ty</th>
                <th>Địa điểm</th>
                <th>Mức lương</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map((job) => (
                <tr key={job.id} className="clickable-row" onClick={() => navigate(`/jobs/${user?.role === 'Candidate' ? 'browse/' : ''}${job.id}`)}>
                  <td>{job.id}</td>
                  <td>{job.title}</td>
                  <td>{job.company || '--'}</td>
                  <td>{job.location || '--'}</td>
                  <td>{job.salary || '--'}</td>
                </tr>
              ))}
              {recentJobs.length === 0 && (
                <tr><td colSpan={5} className="text-center">Chưa có tin tuyển dụng nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
