'use client'

export default function Header() {
  return (
    <div className="relative mb-20">
      <div className="text-center">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-text mb-6 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          "WRITE"
        </h1>
        <div className="relative inline-block w-32 md:w-48">
          <div className="h-0.5 bg-primary"></div>
        </div>
      </div>
    </div>
  )
}

