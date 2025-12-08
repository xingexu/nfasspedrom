import prisma from "@/lib/prisma"
import Link from "next/link"
import LogoScrollBar from "@/components/LogoScrollBar"
import PostDeleteButton from "@/components/PostDeleteButton"
import { getSession } from "@/lib/auth"
import { LogoutButton } from "@/components/LogoutButton"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getSession()
  const isLoggedIn = !!session

  const posts = await prisma.post.findMany({
    orderBy: { date: "desc" }
  })

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
          
          {/* Login/Logout Button and Navigation */}
          <div className="flex justify-center items-center gap-4">
            <Link
              href="/about"
              className="text-text-muted hover:text-primary transition-colors text-sm font-medium"
            >
              About
            </Link>
            {isLoggedIn ? (
              <LogoutButton />
            ) : (
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
              
              {isLoggedIn ? (
                <>
                  <p className="text-text-muted text-lg mb-8 max-w-md mx-auto leading-relaxed">
                    Create your first post to begin your journal.
                  </p>
                  
                  {/* Create Post Button - Only for logged-in admins */}
                  <Link
                    href="/posts/new"
                    className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-white font-semibold text-base hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 overflow-hidden"
                  >
                    {/* Animated background shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-primary blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
                    
                    <svg
                      className="w-5 h-5 relative z-10 transform group-hover:rotate-90 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="relative z-10">Create Post</span>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-text-muted text-lg mb-3 max-w-md mx-auto leading-relaxed">
                    This journal is currently empty. Log in as an admin to create posts.
                  </p>
                  <p className="text-text-muted/70 text-sm mb-0 max-w-md mx-auto">
                    Visitors can read posts once they're published.
                  </p>
                </>
              )}
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
                        
                        {/* Admin Actions - Only show if logged in */}
                        {isLoggedIn && (
                          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <Link
                              href={`/admin/posts/${post.id}/edit`}
                              className="p-3 rounded-xl hover:bg-primary/10 transition-all group/edit"
                              title="Edit"
                            >
                              <svg className="w-5 h-5 text-text-muted group-hover/edit:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                            <PostDeleteButton postId={post.id} />
                          </div>
                        )}
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

