'use client'

import { useRouter } from 'next/navigation'

interface BackButtonProps {
  isAdmin: boolean
}

export default function BackButton({ isAdmin }: BackButtonProps) {
  const router = useRouter()

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    // If admin, always go back to dashboard
    if (isAdmin) {
      router.push('/admin/dashboard')
    } else {
      // For non-admin users, go to home/journal
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
      <span>{isAdmin ? 'Back to Dashboard' : 'Back to Journal'}</span>
    </button>
  )
}

