import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import PostEditor from '@/components/PostEditor'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME?.trim() || 'bigguy'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Check admin session first
  const session = await getSession()
  if (session?.username !== ADMIN_USERNAME) {
    redirect('/admin/login')
  }

  const { id } = await params

  const post = await prisma.post.findUnique({
    where: { id },
  })

  if (!post) {
    redirect('/admin/dashboard')
  }

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 md:py-24">
      <PostEditor
        post={{
          ...post,
          postDate: post.postDate
            ? post.postDate.toISOString().split('T')[0]
            : null,
        }}
        isAdmin={true}
      />
    </div>
  )
}

