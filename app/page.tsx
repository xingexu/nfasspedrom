import prisma from "@/lib/prisma"
import Link from "next/link"
import LogoScrollBar from "@/components/LogoScrollBar"

const ADMIN_USERNAME = process.env.ADMIN_USERNAME?.trim() || 'bigguy'

export default async function Home() {
  // Always show login button on home page - don't check session status
  const isLoggedIn = false

  type Post = Awaited<ReturnType<typeof prisma.post.findMany>>[number]
  let posts: Post[] = []
  try {
    posts = await prisma.post.findMany({
      orderBy: { date: "desc" }
    })
  } catch (error: any) {
    console.error('Error fetching posts:', error?.message || error)
    // Continue with empty posts array if database query fails
    posts = []
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-neutral-50/30 to-white">
      <LogoScrollBar />
      
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12 md:py-16">
        {/* Enhanced header */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-block mb-4">
            <h1 className="text-5xl md:text-6xl font-bold text-text mb-3 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Journal
            </h1>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
          </div>
          
          {/* Login/Dashboard Button */}
          <div className="flex justify-center">
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
              >
                <svg
                  className="w-4 h-4 transform group-hover:rotate-12 transition-transform"
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
                <span>Admin Login</span>
              </Link>
            ) : (
              <Link
                href="/admin/dashboard"
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
              >
                <svg
                  className="w-4 h-4 transform group-hover:rotate-12 transition-transform"
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
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>
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
          <div className="space-y-16">
            {posts.map((post: any, index: number) => {
              const postDate = new Date(post.date)
              const formattedDate = postDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })
              
              // Extract text content from HTML
              const textContent = post.content.replace(/<[^>]*>/g, '')
              const previewText = textContent.substring(0, 200)
              
              return (
                <article 
                  key={post.id} 
                  className="group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    {/* Hover background effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                    
                    <div className="relative">
                      {/* Date */}
                      <div className="mb-4">
                        <time className="text-sm text-text-muted font-semibold tracking-wide uppercase">
                          {formattedDate}
                        </time>
                      </div>
                      
                      {/* Title */}
                      <Link href={`/posts/${post.id}`} className="block mb-5">
                        <h2 className="text-4xl md:text-5xl font-bold text-text mb-4 group-hover:text-primary transition-all duration-300 leading-tight hover-lift" style={{ fontFamily: 'var(--font-heading)' }}>
                          {post.title || 'Untitled Post'}
                        </h2>
                        <div className="w-0 h-0.5 bg-gradient-to-r from-primary to-transparent group-hover:w-24 transition-all duration-500"></div>
                      </Link>
                      
                      {/* Preview Text */}
                      {previewText && (
                        <p className="text-text/70 leading-relaxed mb-8 text-lg max-w-3xl line-clamp-3" style={{ fontFamily: 'var(--font-body)' }}>
                          {previewText}...
                        </p>
                      )}
                      
                      {/* Read More Link */}
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/posts/${post.id}`}
                          className="group/link inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-base transition-all"
                        >
                          <span>Read more</span>
                          <svg
                            className="w-5 h-5 transform group-hover/link:translate-x-2 transition-transform duration-300"
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
                        
                      </div>
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className="mt-12 pt-8 border-t border-gradient-to-r from-transparent via-neutral-200 to-transparent"></div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
