'use client'

import Image from 'next/image'

export default function LogoScrollBar() {
  return (
    <>
      {/* Horizontal scrolling logo bar at the top */}
      <div className="w-full overflow-hidden relative bg-white z-10">
        <div className="flex items-center py-4">
          <div className="inline-flex items-center gap-8 animate-scroll">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 h-16">
                <Image
                  src="/nfass-logo.JPG"
                  alt="n/fäss"
                  width={200}
                  height={80}
                  className="h-16 w-auto object-contain"
                  priority={i < 3}
                />
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={`dup-${i}`} className="flex-shrink-0 h-16">
                <Image
                  src="/nfass-logo.JPG"
                  alt="n/fäss"
                  width={200}
                  height={80}
                  className="h-16 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Creative red underline */}
      <div className="w-full relative z-10 bg-white">
        <div className="h-0.5 bg-primary"></div>
      </div>
    </>
  )
}

