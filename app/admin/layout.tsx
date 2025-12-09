import { AdminLogoutButton } from '@/components/AdminLogoutButton'
import LogoScrollBar from '@/components/LogoScrollBar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <LogoScrollBar />
      <div className="border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-text" style={{ fontFamily: 'var(--font-heading)' }}>
            Admin Panel
          </h1>
          <AdminLogoutButton />
        </div>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

