import prisma from "@/lib/prisma"
import Link from "next/link"
import LogoScrollBar from "@/components/LogoScrollBar"
import PostContent from "@/components/PostContent"

export default async function SinglePost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let post = null
  try {
    post = await prisma.post.findUnique({
      where: { id }
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
    <div className="min-h-screen bg-gradient-to-b from-white via-neutral-50/30 to-white">
      <LogoScrollBar />
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 md:py-24 animate-fade-in">
        {/* Back link */}
        <Link 
          href="/"
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
          <span>Back to Journal</span>
        </Link>

        {/* Post Header */}
        <div className="mb-12">
          <time className="text-sm text-text-muted font-semibold tracking-wide uppercase block mb-6">
            {formattedDate}
          </time>
          <h1 className="text-5xl md:text-6xl font-bold text-text mb-8 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            {post.title || 'Untitled Post'}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary/80 to-transparent rounded-full"></div>
        </div>

        {/* Post Content */}
        <article 
          className="max-w-none w-full overflow-hidden"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <PostContent content={post.content} maxLength={999999} />
        </article>
      </div>
    </div>
  )
}

