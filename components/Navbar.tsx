import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-muted-border">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/nfass-logo.JPG"
              alt="n/fäss"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-text hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-text hover:text-primary transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

