import Link from 'next/link'
import Image from 'next/image'

interface PostCardProps {
  slug: string
  title: string
  excerpt: string
  coverImageUrl?: string | null
  createdAt: Date
}

export default function PostCard({
  slug,
  title,
  excerpt,
  coverImageUrl,
  createdAt,
}: PostCardProps) {
  const date = new Date(createdAt)
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link href={`/blog/${slug}`}>
      <article className="bg-surface rounded-lg p-6 hover:shadow-lg transition-shadow border border-muted-border">
        {coverImageUrl && (
          <div className="mb-4 -mx-6 -mt-6 rounded-t-lg overflow-hidden">
            <Image
              src={coverImageUrl}
              alt={title}
              width={800}
              height={400}
              className="w-full h-48 object-cover"
            />
          </div>
        )}
        <h2 className="text-2xl font-bold text-text mb-2 hover:text-primary transition-colors">
          {title}
        </h2>
        {excerpt && (
          <p className="text-text/70 mb-4 line-clamp-2">{excerpt}</p>
        )}
        <time className="text-sm text-text/50">{formattedDate}</time>
      </article>
    </Link>
  )
}




