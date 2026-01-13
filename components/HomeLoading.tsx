'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type HomeLoadingProps = {
  /**
   * Whether to show the intro on this request.
   * We pass this from the server (cookie-gated) to avoid flicker/hydration mismatch.
   */
  showIntro?: boolean
}

export default function HomeLoading({ showIntro = true }: HomeLoadingProps) {
  const [isLoading, setIsLoading] = useState(showIntro)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    if (!showIntro) return

    // Hide body content and footer during loading
    document.body.style.overflow = 'hidden'
    document.body.classList.add('loading-active')
    
    // Mark intro as seen for the rest of this browser session.
    // (Session cookie: no Max-Age/Expires)
    document.cookie = 'nfass_intro_seen=1; Path=/; SameSite=Lax'

    // Sequence: blur-in (3s animation), stay visible (1s), fade out (300ms), then remove
    // Total: ~4.3 seconds
    const blurInDuration = 3000 // 3 seconds for blur-in animation (much faster)
    const stayDuration = 1000 // 1 second to stay visible after fully unblurred
    const fadeOutDuration = 300 // 300ms for fast fade out
    
    // Start fade-out after blur-in completes and stay period
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true)
      // Remove component after fade-out completes
      setTimeout(() => {
        setIsLoading(false)
        // Show body content and footer after loading completes
        document.body.style.overflow = ''
        document.body.classList.remove('loading-active')
      }, fadeOutDuration)
    }, blurInDuration + stayDuration)

    return () => {
      clearTimeout(fadeOutTimer)
      document.body.style.overflow = ''
      document.body.classList.remove('loading-active')
    }
  }, [showIntro])

  if (!isLoading) return null

  return (
    <div
      className={`fixed inset-0 bg-white flex items-center justify-center z-[9999] transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Large centered logo with faster blur-in animation */}
      <div className="relative">
        <Image
          src="/nfass-logo.JPG"
          alt="n/fäss"
          width={800}
          height={320}
          className="w-[600px] md:w-[800px] h-auto animate-blur-in-fast"
          priority
        />
      </div>
    </div>
  )
}

