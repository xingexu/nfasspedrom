import LogoScrollBar from '@/components/LogoScrollBar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      <LogoScrollBar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

