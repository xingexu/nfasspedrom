import Link from 'next/link'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

type CommentWithRelations = Awaited<ReturnType<typeof prisma.comment.findMany<{
  include: {
    post: {
      select: {
        id: true
        title: true
      }
    }
    author: {
      select: {
        id: true
        username: true
      }
    }
  }
}>>>[number]

export default async function AdminCommentsPage() {
  const session = await getSession()
  if (!session) {
    redirect('/admin/login')
  }

  let comments: CommentWithRelations[] = []
  try {
    comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        post: {
          select: {
            id: true,
            title: true,
          },
        },
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })
  } catch (error) {
    console.warn('Comments unavailable', error)
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
            Comments
          </h1>
          <p className="text-text/60">Manage and moderate all comments</p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-text">All Comments ({comments.length})</h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {comments.length === 0 ? (
              <div className="px-6 py-12 text-center text-text/50">
                No comments yet.
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="px-6 py-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-text">
                          {comment.author?.username || 'Anonymous'}
                        </span>
                        <span className="text-xs text-text/40">•</span>
                        <span className="text-xs text-text/50">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-text/80 mb-2">{comment.content}</p>
                      <Link
                        href={`/posts/${comment.postId}?from=/admin/comments`}
                        className="text-xs text-primary hover:underline"
                      >
                        View post: {comment.post?.title || 'Untitled'}
                      </Link>
                    </div>
                    <div className="text-xs text-text/40">
                      {comment.likes} likes
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

