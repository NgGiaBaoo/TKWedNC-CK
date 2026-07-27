import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Jobs() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const isAdmin = user?.role === 'Admin'

  const fetchJobs = async () => {
    try {
      let res
      if (isAdmin) {
        res = await api.get('/jobs')
      } else {
        const empRes = await api.get(`/employers/by-user/${user.id}`)
        const emp = empRes.data
        if (emp) {
          res = await api.get(`/jobs?employerId=${emp.id}`)
        } else {
          res = { data: [] }
        }
      }
      setJobs(Array.isArray(res.data) ? res.data : res.data?.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [user])

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa tin tuyển dụng này?')) return
    try {
      await api.delete(`/jobs/${id}`)
      fetchJobs()
    } catch (err) {
      alert(err.response?.data?.error || 'Xóa thất bại')
    }
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <h1>{isAdmin ? 'Quản lý Tin tuyển dụng' : 'Tin tuyển dụng của tôi'}</h1>
        {!isAdmin && <Link to="/jobs/new" className="btn btn-primary">+ Thêm tin mới</Link>}
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Công ty</th>
              <th>Địa điểm</th>
              <th>Mức lương</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.id}</td>
                <td>
                  {isAdmin ? (
                    job.title
                  ) : (
                    <Link to={`/employer/applications?jobId=${job.id}`} className="job-title-link">
                      {job.title}
                    </Link>
                  )}
                </td>
                <td>{job.company || '--'}</td>
                <td>{job.location || '--'}</td>
                <td>{job.salary || '--'}</td>
                <td className="actions">
                  <Link to={`/jobs/${job.id}/edit`} className="btn btn-sm btn-edit">Sửa</Link>
                  {!isAdmin && (
                    <Link to={`/employer/applications?jobId=${job.id}`} className="btn btn-sm btn-view">Xem đơn</Link>
                  )}
                  <button className="btn btn-sm btn-delete" onClick={() => handleDelete(job.id)}>Xóa</button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr><td colSpan={6} className="text-center">Chưa có tin tuyển dụng</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
