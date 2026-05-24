import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'

const menus = [
  { to: '/dashboard/input',  label: '매출 입력' },
  { to: '/dashboard/report', label: '월별 리포트' },
  { to: '/dashboard/excel',  label: '엑셀 다운로드' },
  { to: '/dashboard/tax',    label: '세금 요약' },
  { to: '/dashboard/biz',    label: '사업자 정보' },
]

export default function DashboardLayout() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col">
        <div className="px-6 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-brand">오늘장부</h1>
          <p className="text-xs text-gray-400 mt-1">관리자 대시보드</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {menus.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-50 text-brand font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100 flex flex-col gap-2">
          <a
            href="/"
            className="px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50 text-center"
          >
            모바일 앱으로
          </a>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-50"
          >
            로그아웃
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
