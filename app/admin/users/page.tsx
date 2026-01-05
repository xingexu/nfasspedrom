import Link from 'next/link'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export default async function AdminUsersPage() {
  const session = await getSession()
  if (!session) {
    redirect('/admin/login')
  }

  let users = []
  try {
    users = await prisma.user.findMany({
      orderBy: { joinedAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        joinedAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    })
  } catch (error) {
    console.warn('Users unavailable', error)
  }

  return (
    <div className="bg-[#FAFAF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-4 text-sm font-medium"
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
            Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Users
          </h1>
          <p className="text-text/60">Manage all registered users</p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-hidden rounded-lg">
            <div className="grid grid-cols-5 gap-4 border-b border-neutral-200 bg-neutral-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-text/60">
              <span>Username</span>
              <span>Email</span>
              <span>Role</span>
              <span>Posts</span>
              <span>Joined</span>
            </div>
            <div className="divide-y divide-neutral-100">
              {users.length === 0 ? (
                <div className="px-6 py-12 text-center text-text/50">
                  No users yet.
                </div>
              ) : (
                users.map((user: any) => (
                  <div key={user.id} className="grid grid-cols-5 gap-4 items-center px-6 py-4 hover:bg-neutral-50 transition-colors">
                    <span className="font-medium text-text">{user.username}</span>
                    <span className="text-sm text-text/70">{user.email || '—'}</span>
                    <span className="text-xs">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 font-medium ${
                        user.role === 'ADMIN' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {user.role}
                      </span>
                    </span>
                    <span className="text-sm text-text/60">{user._count.posts} posts</span>
                    <span className="text-xs text-text/50">
                      {new Date(user.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

