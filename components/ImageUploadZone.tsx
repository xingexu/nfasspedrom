'use client'

import { useId, useRef, useState } from 'react'

interface ImageUploadZoneProps {
  readonly onUploadComplete: (url: string) => void
}

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])

export default function ImageUploadZone({ onUploadComplete }: ImageUploadZoneProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()

  const resetError = () => setError(null)

  const handleFile = async (file: File) => {
    resetError()

    if (!ALLOWED_TYPES.has(file.type)) {
      setError('Please upload a PNG, JPG, GIF, or WebP image.')
      return
    }

    if (file.size > MAX_SIZE) {
      setError('File too large. Max size is 5MB.')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Upload failed')
      }

      const data = await res.json().catch(() => null)
      if (data?.url) {
        onUploadComplete(data.url)
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      handleFile(droppedFile)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFile(selectedFile)
    }
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className={`block rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          dragActive
            ? 'border-primary bg-subtle-highlight shadow-lg'
            : 'border-muted-border bg-surface'
        } ${uploading ? 'opacity-60 cursor-progress' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        aria-label="Image upload zone"
        aria-busy={uploading}
      >
        <input
          id={inputId}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-text font-semibold">
            {uploading ? 'Uploading...' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-text-muted text-sm">PNG, JPG, GIF, WebP up to 5MB</p>
        </div>
      </label>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}











