'use client'

import { useState } from 'react'

interface SpoilerImageProps {
  src: string
  alt?: string
  className?: string
  style?: React.CSSProperties
}

export default function SpoilerImage({ src, alt = '', className = '', style }: SpoilerImageProps) {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div 
      className={`relative inline-block max-w-full ${className}`}
      style={style}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-auto transition-all duration-500 select-none ${
          isRevealed 
            ? 'blur-none opacity-100' 
            : 'blur-xl opacity-90'
        }`}
        style={{
          filter: isRevealed ? 'none' : 'blur(20px)',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        draggable={false}
      />
      {!isRevealed && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm cursor-pointer hover:bg-black/40 transition-all duration-300"
          onClick={() => setIsRevealed(true)}
        >
          <button
            className="flex flex-col items-center gap-3 px-6 py-4 bg-black/60 hover:bg-black/70 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-110 group"
            onClick={(e) => {
              e.stopPropagation()
              setIsRevealed(true)
            }}
            aria-label="Reveal image"
          >
            <svg
              className="w-8 h-8 text-white group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="text-white text-sm font-medium">Click to reveal</span>
          </button>
        </div>
      )}
    </div>
  )
}

