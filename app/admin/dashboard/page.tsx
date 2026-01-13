import Link from 'next/link'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import ViewAsUserButton from '@/components/ViewAsUserButton'
import { AdminLogoutButton } from '@/components/AdminLogoutButton'
import PostDeleteButton from '@/components/PostDeleteButton'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME?.trim() || 'bigguy'

async function getStats() {
  const stats = {
    posts: 0,
    publishedPosts: 0,
    comments: 0,
    users: 0,
  }

  try {
    stats.posts = await prisma.post.count()
    stats.publishedPosts = await prisma.post.count({ where: { published: true } })
  } catch (error) {
    console.warn('Post stats unavailable', error)
  }

  try {
    // Tables are introduced in the new migration; this block will no-op safely before migration runs
    // @ts-ignore - conditional access if Comment table exists after migration
    stats.comments = (await prisma.comment?.count?.()) ?? 0
  } catch (error) {
    console.warn('Comment stats unavailable', error)
  }

  try {
    // @ts-ignore - conditional access if User table exists after migration
    stats.users = (await prisma.user?.count?.()) ?? 0
  } catch (error) {
    console.warn('User stats unavailable', error)
  }

  return stats
}

async function getRecentPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 6,
      select: {
        id: true,
        title: true,
        published: true,
        updatedAt: true,
        date: true,
        postDate: true, // Include postDate field
      },
    })

    return posts.map((post) => ({
      ...post,
      status: post.published ? 'Published' : 'Draft',
    }))
  } catch (error) {
    console.warn('Recent posts unavailable', error)
    return []
  }
}

export default async function AdminDashboardPage() {
  const session = await getSession()
  if (session?.username !== ADMIN_USERNAME) {
    redirect('/admin/login')
  }

  const [stats, posts] = await Promise.all([getStats(), getRecentPosts()])

  const cards = [
    { label: 'Posts', value: stats.posts, hint: stats.posts !== stats.publishedPosts ? `${stats.publishedPosts} published` : null, tone: 'primary' },
    { label: 'Comments', value: stats.comments, hint: null, tone: null },
    { label: 'Users', value: stats.users, hint: null, tone: null },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-text mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Dashboard
              </h1>
              <p className="text-sm text-text/60">Overview of your content</p>
            </div>
          </div>
          
          {/* Action Buttons - Spacious Layout */}
          <div className="flex items-center gap-3">
            <div className="border border-neutral-200 rounded-md bg-white hover:border-neutral-300 transition-colors">
              <ViewAsUserButton />
            </div>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm border border-primary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Post
            </Link>
          </div>
        </div>

        {/* Stats Cards - Modern Grid */}
        <div className="grid gap-5 sm:grid-cols-3 mb-8">
          {cards.map((card) => (
            <div 
              key={card.label} 
              className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow"
            >
              <p className="text-xs font-semibold text-text/50 uppercase tracking-wider mb-3">
                {card.label}
              </p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-text" style={{ fontFamily: 'var(--font-heading)' }}>
                  {card.value}
                </span>
                {card.hint && (
                  <span className="text-sm text-text/40 mb-1">
                    {card.hint}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Posts - Card Style */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
            <h2 className="text-lg font-semibold text-text">
              Recent Posts
            </h2>
          </div>

          {posts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-text/40">No posts yet</p>
              <Link 
                href="/admin/posts/new"
                className="inline-block mt-4 text-sm text-primary hover:text-primary/80 font-medium"
              >
                Create your first post →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="group px-6 py-4 hover:bg-neutral-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-text group-hover:text-primary transition-colors mb-1.5 truncate">
                        {post.title || 'Untitled'}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-text/50">
                        <span className="inline-flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${post.published ? 'bg-green-500' : 'bg-neutral-400'}`}></span>
                          {post.status}
                        </span>
                        <span>
                          {new Date(post.postDate ?? post.date ?? post.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        href={`/posts/${post.id}?from=/admin/dashboard`}
                        className="text-xs font-medium text-text/70 hover:text-text transition-colors px-3 py-1.5 rounded-md border border-neutral-200 bg-white hover:border-neutral-300"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-xs font-medium text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-md border border-primary/30 bg-white hover:border-primary/50 hover:bg-primary/5"
                      >
                        Edit
                      </Link>
                      <PostDeleteButton postId={post.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <div className="flex justify-end">
            <AdminLogoutButton />
          </div>
        </div>
      </div>
    </div>
  )
}

