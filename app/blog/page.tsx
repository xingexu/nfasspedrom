import { prisma } from '@/lib/prisma'
import JournalPostCard from '@/components/JournalPostCard'
import BlogSidebar from '@/components/BlogSidebar'
import LogoScrollBar from '@/components/LogoScrollBar'
import { getAvailableYearsMonths, getYearMonthFromDate } from '@/lib/filters'

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { year?: string; month?: string; search?: string }
}) {
  const year = searchParams.year ? parseInt(searchParams.year) : undefined
  const month = searchParams.month ? parseInt(searchParams.month) : undefined
  const search = searchParams.search

  const where: any = { published: true }
  
  // Filter by year and month using date fields
  if (year || month) {
    const startDate = new Date(year || 2000, (month || 1) - 1, 1)
    const endDate = new Date(year || 2099, month || 12, 0, 23, 59, 59, 999)
    where.createdAt = {
      gte: startDate,
      lte: endDate,
    }
  }
  
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

  // Get all published posts to compute available years/months
  const allPosts = await prisma.post.findMany({
    where: { published: true },
    select: { createdAt: true },
  })

  // Transform posts to include year/month for filtering
  const postsWithYearMonth = allPosts.map((post) => {
    const { year, month } = getYearMonthFromDate(post.createdAt)
    return { year, month }
  })

  const availableYearsMonths = getAvailableYearsMonths(postsWithYearMonth)

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

