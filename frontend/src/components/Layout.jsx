import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import ToastContainer from './Toast'

export default function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  )
}
