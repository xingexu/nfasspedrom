'use client'

import { useRouter } from 'next/navigation'

interface BackButtonProps {
  isAdmin: boolean
}

export default function BackButton({ isAdmin }: BackButtonProps) {
  const router = useRouter()

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    // Only go to dashboard if user is actually signed in as admin
    // If not signed in or not admin, go to home page
    if (isAdmin === true) {
      router.push('/admin/dashboard')
    } else {
      // For non-admin users or not signed in, go to home/journal
      router.push('/')
    }
  }

  return (
    <button
      onClick={handleBack}
      className="group inline-flex items-center gap-2 text-text-muted hover:text-primary transition-all mb-10 text-sm font-semibold"
    >
      <svg
        className="w-5 h-5 transform -translate-x-1 group-hover:-translate-x-2 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span>{isAdmin === true ? 'Back to Dashboard' : 'Back to Journal'}</span>
    </button>
  )
}

