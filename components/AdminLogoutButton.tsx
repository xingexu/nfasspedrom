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
      className="text-sm text-text-muted hover:text-text transition-colors"
    >
      Log out
    </button>
  )
}






