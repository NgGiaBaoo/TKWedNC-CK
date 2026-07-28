import { NavLink, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

const adminItems = [
  { to: '/dashboard', label: 'Tổng quan', icon: '\u2302' },
  { to: '/jobs', label: 'Tin tuyển dụng', icon: '\u2697' },
  { to: '/applications', label: 'Đơn ứng tuyển', icon: '\u2709' },
  { to: '/employers', label: 'Nhà tuyển dụng', icon: '\uD83C\uDFED' },
  { to: '/candidates', label: 'Ứng viên', icon: '\uD83D\uDC65' },
  { to: '/users', label: 'Người dùng', icon: '\uD83D\uDC64' },
]

const employerItems = [
  { to: '/dashboard', label: 'Tổng quan', icon: '\u2302' },
  { to: '/jobs', label: 'Tin tuyển dụng', icon: '\u2697' },
  { to: '/employer/applications', label: 'Đơn ứng tuyển', icon: '\u2709' },
  { to: '/employer/company', label: 'Thông tin công ty', icon: '\uD83C\uDFED' },
]

const candidateItems = [
  { to: '/dashboard', label: 'Tổng quan', icon: '\u2302' },
  { to: '/jobs/browse', label: 'Việc làm', icon: '\uD83D\uDD0D' },
  { to: '/candidate/applications', label: 'Đơn đã nộp', icon: '\u2709' },
  { to: '/profile', label: 'Hồ sơ cá nhân', icon: '\uD83D\uDC64' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = user?.role === 'Admin' ? adminItems
    : user?.role === 'Employer' ? employerItems
    : candidateItems

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Tuyển Dụng</h2>
        <span className="sidebar-subtitle">Hệ thống quản lý</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <span className="user-name">{user?.username}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}
