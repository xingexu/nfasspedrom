import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PostEditor from '@/components/PostEditor'
import LogoScrollBar from '@/components/LogoScrollBar'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const post = await prisma.post.findUnique({
    where: { id },
  })

  if (!post) {
    redirect('/admin/posts')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <LogoScrollBar />
      
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 md:py-24">
          <PostEditor
            post={{
              ...post,
              postDate: post.postDate
                ? post.postDate.toISOString().split('T')[0]
                : null,
            }}
          />
        </div>
      </div>
    </div>
  )
}

