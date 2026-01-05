'use client'

import { useRouter } from 'next/navigation'

export function AdminLogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-text/50 hover:text-text transition-colors"
    >
      Log out
    </button>
  )
}








