import prisma from '@/lib/prisma'
import LogoScrollBar from '@/components/LogoScrollBar'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import PostContent from '@/components/PostContent'

export default async function AboutPage() {
  const session = await getSession()
  const isLoggedIn = !!session

  const about = await prisma.about.findFirst({
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-neutral-50/30 to-white">
      <LogoScrollBar />
      
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-block mb-4">
            <h1 className="text-5xl md:text-6xl font-bold text-text mb-3 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              About Pedrom
            </h1>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
          </div>
        </div>

        {/* Content */}
        {about ? (
          <article 
            className="max-w-none text-text leading-relaxed prose prose-lg prose-neutral animate-fade-in"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <PostContent content={about.content} maxLength={999999} />
          </article>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-32 h-32 mb-8">
              <svg
                className="w-full h-full text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-text mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              No about content yet
            </h2>
            {isLoggedIn ? (
              <p className="text-text-muted text-lg mb-8 max-w-md mx-auto">
                Log in as an admin to add your about content.
              </p>
            ) : (
              <p className="text-text-muted text-lg mb-8 max-w-md mx-auto">
                Check back soon for more information.
              </p>
            )}
          </div>
        )}

        {/* Admin Edit Link */}
        {isLoggedIn && (
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <Link
              href="/admin/about"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span>Edit About Pedrom</span>
            </Link>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-medium"
          >
            <svg
              className="w-5 h-5 transform -translate-x-1"
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
        </div>
      </div>
    </div>
  )
}
