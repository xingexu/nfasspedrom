import prisma from "@/lib/prisma"
import { headers } from 'next/headers'
import { getSession } from '@/lib/auth'
import LogoScrollBar from "@/components/LogoScrollBar"
import PostContent from "@/components/PostContent"
import BackButton from "@/components/BackButton"

const ADMIN_USERNAME = process.env.ADMIN_USERNAME?.trim() || 'bigguy'

export default async function SinglePost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession()
  const isAdmin = session?.username === ADMIN_USERNAME
  
  let post = null
  try {
    // Admins can see all posts, users can only see published posts
    const where = isAdmin ? { id } : { id, published: true }
    post = await prisma.post.findUnique({
      where
    })
  } catch (error: any) {
    console.error('Error fetching post:', error?.message || error)
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <LogoScrollBar />
        <div className="max-w-2xl mx-auto px-6 py-12">
          <p className="text-text/60">Post not found.</p>
        </div>
      </div>
    )
  }

  // Handle date formatting safely
  let formattedDate = 'No date'
  try {
    if (post.date) {
      const postDate = new Date(post.date)
      if (!isNaN(postDate.getTime())) {
        formattedDate = postDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
    } else if (post.createdAt) {
      const postDate = new Date(post.createdAt)
      if (!isNaN(postDate.getTime())) {
        formattedDate = postDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
    }
  } catch (error) {
    console.error('Error formatting date:', error)
    formattedDate = 'Invalid date'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50/50">
      <LogoScrollBar />
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-16 md:py-24 animate-fade-in">
        {/* Back link - smart navigation */}
        <BackButton isAdmin={isAdmin} />

        {/* Post Card - Header and Content */}
        <article className="bg-white rounded-2xl p-8 md:p-10 border border-neutral-200/50 shadow-lg overflow-hidden relative">
          {/* Gradient accent on left */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/80 to-transparent"></div>
          
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}></div>
          
          {/* Post Header */}
          <div className="mb-10 relative">
            <div className="mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time className="text-xs text-text-muted font-medium tracking-wider uppercase">
                {formattedDate}
              </time>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              {post.title || 'Untitled Post'}
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent rounded-full"></div>
          </div>

          {/* Post Content - ensure proper flow */}
          <div 
            className="w-full max-w-full"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <PostContent content={post.content} maxLength={999999} />
          </div>
        </article>
      </div>
    </div>
  )
}

