'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(pathname !== '/')

  useEffect(() => {
    // On home page, check if we should show footer (after loading completes)
    if (pathname === '/') {
      // Wait for page to be fully loaded and rendered
      const handleLoad = () => {
        // Small delay to ensure everything is rendered
        setTimeout(() => {
          setShouldRender(true)
          // Small delay before fade in to avoid distraction
          setTimeout(() => {
            setIsVisible(true)
          }, 100)
        }, 100)
      }

      // Check if page is already loaded
      if (document.readyState === 'complete') {
        handleLoad()
      } else {
        // Wait for window load event (all resources loaded)
        window.addEventListener('load', handleLoad, { once: true })
        return () => {
          window.removeEventListener('load', handleLoad)
        }
      }
    } else {
      // On other pages, show footer immediately
      setShouldRender(true)
      setIsVisible(true)
    }
  }, [pathname])
  
  if (!shouldRender) return null
  
  // Show footer on all pages with fade-in
  return (
    <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Footer />
    </div>
  )
}

