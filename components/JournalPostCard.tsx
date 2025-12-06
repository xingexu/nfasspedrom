import Link from 'next/link'

interface JournalPostCardProps {
  id: string
  slug: string | null
  title: string
  excerpt: string | null
  content: string
  createdAt: Date
}

export default function JournalPostCard({
  id,
  slug,
  title,
  excerpt,
  content,
  createdAt,
}: JournalPostCardProps) {
  const date = new Date(createdAt)
  const formattedDate = date.toISOString().split('T')[0] // YYYY-MM-DD format
  
  // Get preview text (use excerpt if available, otherwise first 300 chars of content)
  const previewText = excerpt || content.replace(/<[^>]*>/g, '').substring(0, 300)

  return (
    <article className="bg-background rounded-lg p-6 border border-muted-border shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link href={`/blog/${slug}`}>
            <h2 className="text-3xl font-bold text-primary mb-3 hover:opacity-80 transition-opacity">
              {title}
            </h2>
          </Link>
          <div className="flex items-center gap-2 text-text/60 text-sm">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <time>{formattedDate}</time>
          </div>
        </div>
        <div className="flex items-center gap-3">
        </div>
      </div>
      
      <div className="text-text/80 leading-relaxed mb-4">
        <p className="line-clamp-4">{previewText}</p>
      </div>
      
      <Link
        href={`/blog/${slug}`}
        className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity font-semibold"
      >
        <span>View more</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Link>
    </article>
  )
}

