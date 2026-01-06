import Image from 'next/image'

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="relative">
          <Image
            src="/nfass-logo.JPG"
            alt="n/fäss"
            width={300}
            height={120}
            className="h-24 w-auto"
            priority
          />
        </div>
        
        {/* Loading Bar */}
        <div className="w-64 md:w-80 h-1 bg-neutral-200 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-loading-bar"></div>
        </div>
      </div>
    </div>
  )
}


