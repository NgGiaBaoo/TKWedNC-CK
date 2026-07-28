import { Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading">Đang tải...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
