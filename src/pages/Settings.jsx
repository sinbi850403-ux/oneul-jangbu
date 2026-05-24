import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import Toast from '../components/Toast.jsx'

export default function Settings() {
  const [shopName, setShopName] = useState('')
  const [taxType, setTaxType] = useState('general')
  const [toast, setToast] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase
        .from('profiles')
        .select('shop_name, tax_type')
        .eq('user_id', user.id)
        .single()
      if (data) {
        setShopName(data.shop_name ?? '')
        setTaxType(data.tax_type ?? 'general')
      }
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('profiles')
      .update({ shop_name: shopName, tax_type: taxType })
      .eq('user_id', user.id)
    setSaving(false)
    if (error) setToast('저장에 실패했어요 ❌')
    else setToast('저장됐어요 ✅')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  async function handleDeleteAccount() {
    if (!window.confirm('정말 탈퇴하시겠어요?\n모든 매출 데이터와 계정이 즉시 삭제되며 복구할 수 없습니다.')) return
    setDeleting(true)
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const json = await res.json()
    if (!res.ok) {
      setDeleting(false)
      setToast(json.error || '탈퇴 처리 중 오류가 발생했어요 ❌')
      return
    }
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="px-5 pt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">설정</h2>

      <div className="bg-white rounded-2xl shadow-sm p-5 mb-4 flex flex-col gap-4">
        <div>
          <label className="text-sm text-gray-500 mb-1 block">가게 이름</label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="예) 홍길동 분식"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-brand"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-2 block">과세 유형</label>
          <div className="flex gap-3">
            {[
              { value: 'general', label: '일반과세자' },
              { value: 'simple',  label: '간이과세자' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTaxType(value)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-colors ${
                  taxType === value
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-brand text-white rounded-2xl py-4 text-lg font-bold mb-3 active:opacity-80 disabled:opacity-50"
      >
        {saving ? '저장 중...' : '저장하기'}
      </button>

      <a
        href="/dashboard"
        className="w-full text-center text-gray-500 text-sm py-3 block"
      >
        PC 대시보드로 →
      </a>

      <button
        onClick={handleLogout}
        className="w-full text-gray-400 text-sm py-3"
      >
        로그아웃
      </button>

      <button
        onClick={handleDeleteAccount}
        disabled={deleting}
        className="w-full text-red-400 text-sm py-3 disabled:opacity-50"
      >
        {deleting ? '탈퇴 처리 중...' : '회원 탈퇴'}
      </button>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}
