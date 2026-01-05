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
    { label: 'Total posts', value: stats.posts, hint: `${stats.publishedPosts} published`, tone: 'primary' },
    { label: 'Comments', value: stats.comments, hint: null, tone: null },
    { label: 'Users', value: stats.users, hint: null, tone: null },
  ]

  return (
    <div className="bg-gradient-to-b from-white via-neutral-50/30 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-8 py-16 space-y-16">
        {/* Title Section - Editorial Style */}
        <div className="space-y-12">
          <div>
            <h1 className="text-6xl md:text-7xl font-bold text-text mb-6 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Admin Dashboard
            </h1>
            <div className="w-24 h-px bg-neutral-200"></div>
          </div>

          {/* Header Actions - Subtle */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-2.5">
                <ViewAsUserButton />
              </div>
              <Link
                href="/admin/about"
                className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-text/60 hover:text-text hover:border-neutral-300 transition-all"
              >
                Edit about page
              </Link>
            </div>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Create post
            </Link>
          </div>
        </div>

        {/* Stats Cards - Elegant Boxes */}
        <div className="grid gap-6 sm:grid-cols-3">
          {cards.map((card, index) => (
            <div 
              key={card.label} 
              className="rounded-2xl bg-white border-2 border-neutral-200 p-8 hover:bg-neutral-50/50 hover:border-neutral-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <p className="text-xs font-semibold tracking-wide text-text/50 uppercase mb-4">
                {card.label}
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-text transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
                  {card.value}
                </span>
                {card.hint && (
                  <span className="text-sm font-medium text-text/50">
                    {card.hint}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Posts Section - Elegant Box */}
        <div className="rounded-2xl bg-white border-2 border-neutral-200 p-8 space-y-6 hover:border-neutral-300 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-text transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
              Recent posts
            </h2>
            <Link 
              href="/admin/posts/new" 
              className="text-sm font-semibold text-text/60 hover:text-text transition-colors"
            >
              New post →
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-text/40">No posts yet</p>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-neutral-200">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="group grid grid-cols-12 items-center gap-6 py-5 hover:bg-neutral-50/50 transition-colors rounded-xl -mx-2 px-2"
                >
                  <div className="col-span-6">
                    <span className="font-semibold text-text group-hover:text-text/80 transition-colors">
                      {post.title || 'Untitled'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs font-semibold text-text/50 uppercase tracking-wide border border-neutral-200 rounded-full px-2 py-1 inline-block">
                      {post.status}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-text/50 font-medium">
                      {new Date(post.updatedAt ?? post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="col-span-2 flex justify-end gap-3">
                    <Link
                      href={`/posts/${post.id}`}
                      className="text-xs font-semibold text-text/50 hover:text-text transition-colors rounded-lg border border-neutral-200 px-2 py-1 hover:border-neutral-300"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="text-xs font-semibold text-primary hover:bg-primary/10 transition-colors rounded-lg border border-primary/30 px-2 py-1 hover:border-primary/50"
                    >
                      Edit
                    </Link>
                    <PostDeleteButton postId={post.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout - Subtle Footer */}
        <div className="pt-12 border-t border-neutral-100">
          <div className="flex justify-end">
            <AdminLogoutButton />
          </div>
        </div>
      </div>
    </div>
  )
}

