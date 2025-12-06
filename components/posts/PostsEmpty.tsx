'use client'

import Link from 'next/link'

export default function PostsEmpty() {
  return (
    <div className="text-center py-32 animate-fade-in">
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-text mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
        No posts yet
      </h2>
      <p className="text-text-muted text-lg mb-8 max-w-md mx-auto">
        Create your first post to begin your blog.
      </p>
      <Link
        href="/posts/new"
        className="relative inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl hover:shadow-primary/30 overflow-hidden group/button"
      >
        {/* Animated background shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/button:translate-x-[100%] transition-transform duration-1000"></div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-lg bg-primary blur-xl opacity-0 group-hover/button:opacity-50 transition-opacity duration-300 -z-10"></div>
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create Post
      </Link>
    </div>
  )
}

