import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import LogoScrollBar from '@/components/LogoScrollBar'

export default async function AdminPostsPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-background">
      <LogoScrollBar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-text">Posts</h2>
          <Link
            href="/admin/posts/new"
            className="quote-button px-4 py-2"
          >
            NEW POST
          </Link>
        </div>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-text/60">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-surface border border-muted-border rounded-lg p-6 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-text mb-2">{post.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-text/60">
                    <span>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${
                        post.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="quote-button px-4 py-2"
                >
                  EDIT
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

