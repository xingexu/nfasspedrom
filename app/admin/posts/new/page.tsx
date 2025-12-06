import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import PostEditor from '@/components/PostEditor'
import LogoScrollBar from '@/components/LogoScrollBar'

export default async function NewPostPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LogoScrollBar />
      
      <div className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <PostEditor />
        </div>
      </div>
    </div>
  )
}

