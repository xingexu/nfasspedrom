import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import LogoScrollBar from '@/components/LogoScrollBar'
import PostContent from '@/components/PostContent'

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })

  if (!post || !post.published) {
    notFound()
  }

  const postDate = new Date(post.createdAt)
  const formattedDate = postDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-white">
      <LogoScrollBar />
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <Link
          href="/blog"
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
          <span>Back to Blog</span>
        </Link>

        <div className="mb-8">
          <time className="text-sm text-text-muted font-medium block mb-4">
            {formattedDate}
          </time>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-6 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            {post.title || 'Untitled Post'}
          </h1>
          <div className="w-16 h-0.5 bg-primary"></div>
        </div>

        <div
          className="max-w-none text-text leading-relaxed"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <PostContent content={post.content} maxLength={999999} />
        </div>
      </div>
    </div>
  )
}
