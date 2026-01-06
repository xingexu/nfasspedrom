import LogoScrollBar from '@/components/LogoScrollBar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Session protection is handled by middleware.ts
  // Individual pages also check sessions for extra security
  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <LogoScrollBar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

