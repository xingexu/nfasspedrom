'use client'

export default function ContentWrapper({ children, showIntro }: { readonly children: React.ReactNode; readonly showIntro: boolean }) {
  // Always show content immediately - no delay
  return <>{children}</>
}
