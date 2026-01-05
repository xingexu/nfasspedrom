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
          className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors rounded-lg px-2 py-1 disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Confirm'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-xs font-semibold text-text/50 hover:text-text transition-colors rounded-lg border border-neutral-200 px-2 py-1 hover:border-neutral-300"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors rounded-lg border border-red-200 px-2 py-1 hover:border-red-300"
      title="Delete"
    >
      Delete
    </button>
  )
}

