'use client'

import { useEffect } from 'react'

interface ViewAsUserModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ViewAsUserModal({ isOpen, onClose }: ViewAsUserModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] bg-white rounded-lg shadow-2xl flex flex-col">
        {/* Header with Go Back button */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text hover:text-primary transition-colors border border-neutral-200 rounded-lg hover:border-primary"
            >
              <svg
                className="w-4 h-4 transform rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Go Back
            </button>
            <span className="text-sm text-text/60">Preview: View as User</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text/40 hover:text-text transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Iframe with site preview */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src="/"
            className="w-full h-full border-0"
            title="Site Preview"
          />
        </div>
      </div>
    </div>
  )
}

