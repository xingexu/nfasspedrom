import Link from 'next/link'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

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
    { label: 'Comments', value: stats.comments, hint: 'Moderation required soon', tone: 'amber' },
    { label: 'Users', value: stats.users, hint: 'Admins by invite only', tone: 'slate' },
  ]

  const toneClass = {
    primary: 'bg-primary/10 text-primary',
    amber: 'bg-amber-100 text-amber-800',
    slate: 'bg-slate-100 text-slate-700',
  } as const

  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-text/60">Admin Control</p>
            <h1 className="text-3xl md:text-4xl font-bold text-text" style={{ fontFamily: 'var(--font-heading)' }}>
              Dashboard overview
            </h1>
            <p className="text-text/70 mt-2">Monitor content, moderation, and users at a glance.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/posts/new"
              className="rounded-lg bg-primary text-white px-4 py-2.5 text-sm font-semibold shadow-md hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              Create post
            </Link>
            <Link
              href="/admin/about"
              className="rounded-lg border border-[#E4DFD7] bg-white px-4 py-2.5 text-sm font-semibold text-text hover:border-primary/40 hover:text-primary transition-colors"
            >
              Edit about page
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur smooth-shadow"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-text/60">{card.label}</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-3xl font-bold text-text" style={{ fontFamily: 'var(--font-heading)' }}>
                  {card.value}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClass[card.tone] ?? toneClass.slate}`}
                >
                  {card.hint}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur smooth-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text/60">Content</p>
                <h2 className="text-xl font-semibold text-text" style={{ fontFamily: 'var(--font-heading)' }}>
                  Recent posts
                </h2>
              </div>
              <Link href="/admin/posts/new" className="text-sm font-semibold text-primary hover:text-primary/80">
                New post →
              </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#E4DFD7] bg-white">
              <div className="grid grid-cols-4 border-b border-[#E4DFD7] bg-[#F8F4ED] px-4 py-3 text-sm font-semibold text-text/70">
                <span>Title</span>
                <span>Status</span>
                <span>Updated</span>
                <span className="text-right">Actions</span>
              </div>
              <div className="divide-y divide-[#F0E9DF]">
                {posts.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-text/60">No posts yet.</div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="grid grid-cols-4 items-center px-4 py-3 text-sm text-text/80">
                      <span className="truncate font-semibold text-text">{post.title || 'Untitled'}</span>
                      <span
                        className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                          post.status === 'Published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full bg-current" />
                        {post.status}
                      </span>
                      <span className="text-text/60">
                        {new Date(post.updatedAt ?? post.date).toLocaleDateString()}
                      </span>
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/posts/${post.id}`}
                          className="rounded-lg border border-[#E4DFD7] px-3 py-1 hover:border-primary/40 hover:text-primary transition-colors"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="rounded-lg bg-primary/10 px-3 py-1 font-semibold text-primary hover:bg-primary/15 transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur smooth-shadow">
              <p className="text-xs font-semibold uppercase tracking-wide text-text/60">Quick actions</p>
              <h3 className="text-lg font-semibold text-text mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
                Admin utilities
              </h3>
              <div className="mt-4 space-y-3">
                <Link
                  href="/admin/about"
                  className="flex items-center justify-between rounded-lg border border-[#E4DFD7] bg-[#FDFBF7] px-4 py-3 text-sm font-semibold text-text hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <span>Update About content</span>
                  <span aria-hidden className="ml-2">→</span>
                </Link>
                <Link
                  href="/posts/new"
                  className="flex items-center justify-between rounded-lg border border-[#E4DFD7] bg-white px-4 py-3 text-sm font-semibold text-text hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <span>Publish a new post</span>
                  <span aria-hidden className="ml-2">→</span>
                </Link>
                <Link
                  href="/admin/login"
                  className="flex items-center justify-between rounded-lg border border-[#E4DFD7] bg-white px-4 py-3 text-sm font-semibold text-text hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <span>Manage sessions</span>
                  <span aria-hidden className="ml-2">→</span>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur smooth-shadow">
              <p className="text-xs font-semibold uppercase tracking-wide text-text/60">System</p>
              <h3 className="text-lg font-semibold text-text mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
                Status
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-text/80">
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" aria-hidden />
                    <span>API health</span>
                  </div>
                  <span className="text-xs font-semibold text-green-700">Operational</span>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" aria-hidden />
                    <span>Database connectivity</span>
                  </div>
                  <span className="text-xs font-semibold text-green-700">Online</span>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" aria-hidden />
                    <span>Comment moderation</span>
                  </div>
                  <span className="text-xs font-semibold text-amber-800">Pending setup</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

