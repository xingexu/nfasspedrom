'use client'

import { useState } from 'react'

interface BlurredImageProps {
  src: string
  alt?: string
  className?: string
  style?: React.CSSProperties
}

export default function BlurredImage({ src, alt = '', className = '', style }: BlurredImageProps) {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div 
      className={`relative inline-block ${className}`}
      style={style}
    >
      <img
        src={src}
        alt={alt}
        className={`transition-all duration-300 cursor-pointer select-none ${
          isRevealed 
            ? 'blur-none' 
            : 'blur-lg'
        }`}
        style={{
          filter: isRevealed ? 'none' : 'blur(20px)',
          userSelect: 'none',
          pointerEvents: isRevealed ? 'auto' : 'auto',
        }}
        onClick={() => setIsRevealed(true)}
        draggable={false}
      />
      {!isRevealed && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer hover:bg-black/30 transition-colors"
          onClick={() => setIsRevealed(true)}
        >
          <div className="text-white text-sm font-medium px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm">
            Click to reveal image
          </div>
        </div>
      )}
    </div>
  )
}



