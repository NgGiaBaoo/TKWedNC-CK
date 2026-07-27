import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users')
      .then((res) => setUsers(res.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return
    try {
      await api.delete(`/users/${id}`)
      setUsers(users.filter((u) => u.id !== id))
    } catch (err) {
      alert(err.response?.data?.error || 'Xóa thất bại')
    }
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <h1>Quản lý Người dùng</h1>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên đăng nhập</th>
              <th>Vai trò</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.role || '--'}</td>
                <td className="actions">
                  <button className="btn btn-sm btn-delete" onClick={() => handleDelete(u.id)}>Xóa</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={4} className="text-center">Chưa có người dùng</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
