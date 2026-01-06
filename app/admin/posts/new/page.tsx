import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import PostEditor from '@/components/PostEditor'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME?.trim() || 'bigguy'

export default async function NewPostPage() {
  // Check admin session
  const session = await getSession()
  if (session?.username !== ADMIN_USERNAME) {
    redirect('/admin/login')
  }

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 md:py-24">
      <PostEditor isAdmin={true} />
    </div>
  )
}

