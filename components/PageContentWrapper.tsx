'use client'

import { useEffect, useState } from 'react'

export default function PageContentWrapper({ children }: { children: React.ReactNode }) {
  const [showContent, setShowContent] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Hide content initially, then show as loading screen starts to fade out
    // HomeLoading: 3s blur-in + 1s stay = 4s before fade starts
    // Show content slightly before fade completes for smooth transition
    const showTimer = setTimeout(() => {
      setShowContent(true)
      // Start fade-in animation after a tiny delay to ensure DOM is ready
      setTimeout(() => {
        setIsVisible(true)
      }, 10)
    }, 4000) // Show content when fade-out starts (300ms fade will complete while content appears)

    return () => clearTimeout(showTimer)
  }, [])

  if (!showContent) {
    return null
  }

  return (
    <div className={`transition-opacity duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  )
}

