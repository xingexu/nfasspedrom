'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TipTapEditor from '@/components/Editor/TipTapEditor'

export default function AboutEditorPage() {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Fetch existing about content
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        setContent(data.content || '')
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching about:', err)
        setError('Failed to load about content')
        setLoading(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)

    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/about')
        }, 1500)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save about content')
      }
    } catch (err) {
      setError('An error occurred while saving')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-text/60">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
        {/* Back link */}
        <button
          type="button"
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-8 text-sm font-medium"
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
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Edit About Pedrom
          </h1>
          <div className="w-16 h-0.5 bg-primary"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content editor */}
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">
              About Pedrom Content
            </label>
            <div className="border border-neutral-200 rounded-lg p-4 bg-white focus-within:border-primary transition-all min-h-[400px]">
              <TipTapEditor content={content} onChange={setContent} />
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              About content saved successfully! Redirecting...
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-6 py-2.5 text-text-muted hover:text-text transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save About Pedrom'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


