import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  
  // Allow access to login page without auth
  if (!session) {
    return <>{children}</>
  }

  return <>{children}</>
}

