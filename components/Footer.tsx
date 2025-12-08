import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-muted-border mt-16 py-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/about"
            className="text-text-muted hover:text-primary transition-colors text-sm font-medium"
          >
            About Pedrom
          </Link>
          <p className="text-text/60 text-sm text-center">
            © {new Date().getFullYear()} n/fäss by Pedrom Basidj
          </p>
        </div>
      </div>
    </footer>
  )
}










