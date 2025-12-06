import prisma from "@/lib/prisma"
import Link from "next/link"
import LogoScrollBar from "@/components/LogoScrollBar"
import PostDeleteButton from "@/components/PostDeleteButton"

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: { date: "desc" }
  })

  return (
    <div className="min-h-screen bg-white">
      <LogoScrollBar />
      
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 md:py-24">
        {/* Minimalistic header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-text mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Blog
          </h1>
          <div className="w-16 h-0.5 bg-primary mx-auto"></div>
        </div>

        {/* Posts List - Minimalistic Design */}
        {posts.length === 0 ? (
          <div className="relative">
            {/* Decorative background elements */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
            </div>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/3 blur-2xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/3 blur-2xl"></div>
            
            {/* Content */}
            <div className="relative text-center py-32">
              {/* Icon with decorative ring */}
              <div className="relative inline-flex items-center justify-center mb-8">
                <div className="absolute w-40 h-40 rounded-full border-2 border-primary/20 animate-pulse"></div>
                <div className="absolute w-32 h-32 rounded-full border border-primary/30"></div>
                <div className="relative inline-flex items-center justify-center w-24 h-24 bg-primary/5 rounded-full">
                  <svg
                    className="w-12 h-12 text-primary"
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
              <p className="text-text-muted text-lg mb-10 max-w-md mx-auto">
                Create your first post to begin your blog.
              </p>
              
              {/* Enhanced Create Post Button */}
              <Link
                href="/posts/new"
                className="relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-primary/40 overflow-hidden group/button"
              >
                {/* Animated background shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/button:translate-x-[100%] transition-transform duration-1000"></div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-primary blur-xl opacity-0 group-hover/button:opacity-50 transition-opacity duration-300 -z-10"></div>
                
                <svg
                  className="w-6 h-6 relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="relative z-10 text-lg">Create Post</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {posts.map((post: any) => {
              const postDate = new Date(post.date)
              const formattedDate = postDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
              
              // Extract text content from HTML
              const textContent = post.content.replace(/<[^>]*>/g, '')
              const previewText = textContent.substring(0, 200)
              
              return (
                <article 
                  key={post.id} 
                  className="group"
                >
                  {/* Date */}
                  <div className="mb-3">
                    <time className="text-sm text-text-muted font-medium">
                      {formattedDate}
                    </time>
                  </div>
                  
                  {/* Title */}
                  <Link href={`/posts/${post.id}`}>
                    <h2 className="text-3xl md:text-4xl font-bold text-text mb-4 group-hover:text-primary transition-colors leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                      {post.title || 'Untitled Post'}
                    </h2>
                  </Link>
                  
                  {/* Preview Text */}
                  {previewText && (
                    <p className="text-text/60 leading-relaxed mb-6 text-base max-w-2xl" style={{ fontFamily: 'var(--font-body)' }}>
                      {previewText}...
                    </p>
                  )}
                  
                  {/* Read More Link */}
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/posts/${post.id}`}
                      className="inline-flex items-center gap-2 text-primary hover:opacity-70 transition-opacity font-medium text-sm group/link"
                    >
                      <span>Read more</span>
                      <svg
                        className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform"
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
                    </Link>
                    
                    {/* Admin Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="p-2 rounded-lg hover:bg-primary/5 transition-all"
                        title="Edit"
                      >
                        <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <PostDeleteButton postId={post.id} />
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className="mt-8 pt-8 border-t border-neutral-100"></div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

