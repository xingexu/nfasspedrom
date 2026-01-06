'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TipTapEditor from './Editor/TipTapEditor'

interface Post {
  id: string
  title: string
  excerpt: string | null
  content: string
  postDate: string | null
  coverImageUrl: string | null
  published: boolean
}

interface PostEditorProps {
  post?: Post
  isAdmin?: boolean
}

export default function PostEditor({ post, isAdmin = false }: PostEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [content, setContent] = useState(post?.content || '')
  const [postDate, setPostDate] = useState(
    post?.postDate || new Date().toISOString().split('T')[0]
  )
  const [published, setPublished] = useState(post?.published ?? true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const url = post
        ? `/api/posts/${post.id}`
        : '/api/posts'
      const method = post ? 'PUT' : 'POST'

      // Debug: Check if content has style attributes
      if (typeof window !== 'undefined' && content.includes('<img')) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(content, 'text/html')
        const images = doc.querySelectorAll('img')
        images.forEach((img, idx) => {
          const style = img.getAttribute('style') || ''
          if (style.includes('transform:')) {
            console.log(`Image ${idx} has transform:`, style)
          } else {
            console.warn(`Image ${idx} missing transform in saved HTML`)
          }
        })
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          date: postDate,
        }),
      })

      if (res.ok) {
        // If admin, go back to dashboard; otherwise go to home
        router.push(isAdmin ? '/admin/dashboard' : '/')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save post')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {/* Back link */}
      <button
        type="button"
        onClick={() => router.push(isAdmin ? '/admin/dashboard' : '/')}
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
        <span>{isAdmin ? 'Back to Dashboard' : 'Back to Journal'}</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          {post ? 'Edit Post' : 'New Post'}
        </h1>
        <div className="w-16 h-0.5 bg-primary"></div>
      </div>

      {/* Date and Title */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Date
          </label>
          <input
            id="postDate"
            type="date"
            value={postDate}
            onChange={(e) => setPostDate(e.target.value)}
            className="w-full border border-neutral-200 rounded-lg px-4 py-2 bg-white text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title..."
            className="w-full border border-neutral-200 rounded-lg px-4 py-3 bg-white text-text text-xl font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted"
            required
          />
        </div>
      </div>

      {/* Content editor */}
      <div>
        <label className="block text-sm font-medium text-text-muted mb-2">
          Content
        </label>
        <div className="border border-neutral-200 rounded-lg p-4 bg-white focus-within:border-primary transition-all min-h-[400px]">
          <TipTapEditor content={content} onChange={setContent} />
        </div>
      </div>

      {/* Bottom bar - simple Save and Cancel */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-4 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push(isAdmin ? '/admin/dashboard' : '/')}
            className="px-6 py-2.5 text-text-muted hover:text-text transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <div className="fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}
    </form>
  )
}

