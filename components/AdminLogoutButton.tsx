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
      className="text-sm font-medium text-text/70 hover:text-text transition-colors px-4 py-2 border border-neutral-200 rounded-md bg-white hover:border-neutral-300"
    >
      Log out
    </button>
  )
}








