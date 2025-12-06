'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PostDeleteButtonProps {
  postId: string
}

export default function PostDeleteButton({ postId }: PostDeleteButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to delete post')
        setIsDeleting(false)
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete post')
      setIsDeleting(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1.5 text-xs bg-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Confirm'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1.5 text-xs border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2.5 rounded-lg border border-neutral-200 hover:border-primary hover:bg-primary/5 transition-all hover:scale-105"
      title="Delete"
    >
      <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  )
}

