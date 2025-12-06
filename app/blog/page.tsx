import { prisma } from '@/lib/prisma'
import JournalPostCard from '@/components/JournalPostCard'
import BlogSidebar from '@/components/BlogSidebar'
import LogoScrollBar from '@/components/LogoScrollBar'
import { getAvailableYearsMonths } from '@/lib/filters'

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { year?: string; month?: string; search?: string }
}) {
  const year = searchParams.year ? parseInt(searchParams.year) : undefined
  const month = searchParams.month ? parseInt(searchParams.month) : undefined
  const search = searchParams.search

  const where: any = { published: true }
  if (year) where.year = year
  if (month) where.month = month
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { content: { contains: search } },
    ]
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })

  const allPosts = await prisma.post.findMany({
    where: { published: true },
    select: { year: true, month: true },
  })

  const availableYearsMonths = getAvailableYearsMonths(allPosts)

  return (
    <div className="w-full relative min-h-screen flex flex-col">
      <LogoScrollBar />
      
      {/* Blog content with sidebar */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-6 py-12">
        <BlogSidebar availableYearsMonths={availableYearsMonths} />
        <div className="flex-1">
          <div className="space-y-6">
            {posts.length === 0 ? (
              <p className="text-text/60">No posts found.</p>
            ) : (
              posts.map((post) => (
                <JournalPostCard
                  key={post.id}
                  id={post.id}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  content={post.content}
                  createdAt={post.createdAt}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

