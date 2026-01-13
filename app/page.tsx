import prisma from "@/lib/prisma"
import Link from "next/link"
import { cookies } from "next/headers"
import LogoScrollBar from "@/components/LogoScrollBar"
import HomeLoading from "@/components/HomeLoading"
import ContentWrapper from "@/components/ContentWrapper"

const ADMIN_USERNAME = process.env.ADMIN_USERNAME?.trim() || 'bigguy'

export default async function Home() {
  // Always show login button on home page - don't check session status
  const isLoggedIn = false
  // Always show intro for now - can be made cookie-gated later if needed
  const showIntro = true

  type Post = Awaited<ReturnType<typeof prisma.post.findMany>>[number]
  let posts: Post[] = []
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: [
        { postDate: "desc" }, // First try postDate (user-set date)
        { date: "desc" }      // Fallback to date if postDate is null
      ]
    })
  } catch (error: any) {
    console.error('Error fetching posts:', error?.message || error)
    // Continue with empty posts array if database query fails
    posts = []
  }

  return (
    <>
      <HomeLoading showIntro={showIntro} />
      <ContentWrapper showIntro={showIntro}>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50/50">
        <LogoScrollBar />

        <div className="max-w-5xl mx-auto px-6 md:px-8 py-16 md:py-20">
        {/* Enhanced header */}
        <div className="mb-16 text-center animate-fade-in">
          <div className="inline-block mb-6">
            <h1 className="text-6xl md:text-7xl font-bold text-text mb-4 tracking-tight" style={{ fontFamily: 'var(--font-journal)', fontWeight: 600, letterSpacing: '-0.02em' }}>
              Journal
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full"></div>
          </div>
        </div>
        
        {/* Admin Login Icon - Fixed position top right */}
        <div className="fixed top-28 right-6 z-50">
          {!isLoggedIn ? (
            <Link
              href="/login"
              className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-neutral-200 hover:border-primary/50 text-text/60 hover:text-primary transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm"
              title="Admin Login"
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
          ) : (
            <Link
              href="/admin/dashboard"
              className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-primary/30 hover:border-primary/50 text-primary transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm"
              title="Admin Dashboard"
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </Link>
          )}
        </div>

        {/* Posts List - Enhanced Design */}
        {posts.length === 0 ? (
          <div className="relative">
            {/* Decorative background elements */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 rounded-full bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5 blur-3xl animate-pulse"></div>
            </div>
            
            {/* Content */}
            <div className="relative text-center py-16 md:py-20 animate-fade-in">
              {/* Icon with decorative ring */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute w-32 h-32 rounded-full border-2 border-primary/10 animate-pulse"></div>
                <div className="absolute w-24 h-24 rounded-full border border-primary/20"></div>
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl backdrop-blur-sm">
                  <svg
                    className="w-10 h-10 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-text mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                No posts yet
              </h2>
              
              <p className="text-text-muted text-lg mb-3 max-w-md mx-auto leading-relaxed">
                This journal is currently empty. Log in as an admin to create posts.
              </p>
              <p className="text-text-muted/70 text-sm mb-0 max-w-md mx-auto">
                Visitors can read posts once they're published.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post: any, index: number) => {
              // Handle date formatting safely - prefer postDate over date
              let formattedDate = 'No date'
              try {
                // Use postDate first (user-set date), then date, then createdAt as fallback
                const dateToUse = post.postDate ?? post.date ?? post.createdAt
                if (dateToUse) {
                  const postDate = new Date(dateToUse)
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
              
              // Extract text content from HTML
              const textContent = post.content.replace(/<[^>]*>/g, '')
              const previewText = textContent.substring(0, 200)
              const readingTime = Math.ceil(textContent.length / 1000)
              
              return (
                <article 
                  key={post.id} 
                  className="group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative bg-white rounded-2xl p-8 md:p-10 border border-neutral-200/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                    {/* Gradient accent on left */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-500" style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                      backgroundSize: '24px 24px'
                    }}></div>
                    
                    <div className="relative">
                      {/* Date with icon */}
                      <div className="mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <time className="text-xs text-text-muted font-medium tracking-wider uppercase">
                          {formattedDate}
                        </time>
                      </div>
                      
                      {/* Title */}
                      <Link href={`/posts/${post.id}`} className="block mb-4 group/title">
                        <h2 className="text-3xl md:text-4xl font-bold text-text mb-3 group-hover/title:text-primary transition-all duration-300 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                          {post.title || 'Untitled Post'}
                        </h2>
                        <div className="w-0 h-0.5 bg-gradient-to-r from-primary via-primary/60 to-transparent group-hover/title:w-32 transition-all duration-500 rounded-full"></div>
                      </Link>
                      
                      {/* Preview Text */}
                      {previewText && (
                        <p className="text-text/70 leading-relaxed mb-6 text-base line-clamp-2 group-hover:text-text/80 transition-colors" style={{ fontFamily: 'var(--font-body)' }}>
                          {previewText}...
                        </p>
                      )}
                      
                      {/* Read More Link - Enhanced */}
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-100 group-hover:border-neutral-200 transition-colors">
                        <Link
                          href={`/posts/${post.id}`}
                          className="group/link inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm transition-all"
                        >
                          <span>Read more</span>
                          <svg
                            className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </Link>
                        <div className="text-xs text-text/40 font-medium">
                          {readingTime} min read
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
        </div>
      </div>
      </ContentWrapper>
    </>
  )
}
