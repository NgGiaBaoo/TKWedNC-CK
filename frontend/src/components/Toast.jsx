import { useState, useEffect, useCallback } from 'react'

let toastIdCounter = 0
let addToastGlobal = null

export function toast(message, type = 'success', duration = 3000) {
  if (addToastGlobal) {
    addToastGlobal({ id: ++toastIdCounter, message, type, duration })
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((t) => {
    setToasts((prev) => [...prev, t])
  }, [])

  useEffect(() => {
    addToastGlobal = addToast
    return () => { addToastGlobal = null }
  }, [addToast])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  )
}

function ToastItem({ toast: t, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(t.id), t.duration)
    return () => clearTimeout(timer)
  }, [t.id, t.duration, onRemove])

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }

  return (
    <div className={`toast-item toast-${t.type}`} onClick={() => onRemove(t.id)}>
      <span className="toast-icon">{icons[t.type] || icons.info}</span>
      <span className="toast-message">{t.message}</span>
    </div>
  )
}
