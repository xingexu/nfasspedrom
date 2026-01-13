'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(pathname !== '/')

  // Don't show footer on admin pages or home page (including after logout)
  const isAdminPage = pathname?.startsWith('/admin') ?? false
  const isHomePage = pathname === '/'

  useEffect(() => {
    // Don't render footer on admin pages or home page
    if (isAdminPage || isHomePage) {
      return
    }

    // On other pages, show footer immediately
    setShouldRender(true)
    setIsVisible(true)
  }, [pathname, isAdminPage, isHomePage])
  
  // Don't show footer on admin pages or home page
  if (isAdminPage || isHomePage || !shouldRender) return null
  
  // Show footer on all pages with fade-in
  return (
    <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Footer />
    </div>
  )
}

