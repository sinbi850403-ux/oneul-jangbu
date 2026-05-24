import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Input from './pages/Input.jsx'
import Calendar from './pages/Calendar.jsx'
import Tax from './pages/Tax.jsx'
import Settings from './pages/Settings.jsx'
import Login from './pages/Login.jsx'
import NavBar from './components/NavBar.jsx'
import { useAuth } from './hooks/useAuth.js'

function ProtectedLayout() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-400 text-lg">불러오는 중...</span>
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto">
      <div className="flex-1 pb-20">
        <Routes>
          <Route path="/" element={<Navigate to="/input" replace />} />
          <Route path="/input" element={<Input />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/tax" element={<Tax />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      <NavBar />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </BrowserRouter>
  )
}
