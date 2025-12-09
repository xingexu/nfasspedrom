import { prisma } from '@/lib/prisma'
import JournalPostCard from '@/components/JournalPostCard'
import BlogSidebar from '@/components/BlogSidebar'
import LogoScrollBar from '@/components/LogoScrollBar'
import { getAvailableYearsMonths, getYearMonthFromDate } from '@/lib/filters'

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string; search?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const year = resolvedSearchParams.year ? parseInt(resolvedSearchParams.year) : undefined
  const month = resolvedSearchParams.month ? parseInt(resolvedSearchParams.month) : undefined
  const search = resolvedSearchParams.search

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

  let posts = []
  let allPosts = []
  try {
    posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Get all published posts to compute available years/months
    allPosts = await prisma.post.findMany({
      where: { published: true },
      select: { createdAt: true },
    })
  } catch (error: any) {
    console.error('Error fetching posts:', error?.message || error)
    // Continue with empty arrays if database query fails
  }

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

