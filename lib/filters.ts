export interface FilterOptions {
  year?: number
  month?: number
}

export function getYearMonthFromDate(date: Date): { year: number; month: number } {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1, // 1-12
  }
}

export function getAvailableYearsMonths(
  posts: Array<{ year: number; month: number }>
): { year: number; months: number[] }[] {
  const map = new Map<number, Set<number>>()
  
  posts.forEach((post) => {
    if (!map.has(post.year)) {
      map.set(post.year, new Set())
    }
    map.get(post.year)!.add(post.month)
  })

  return Array.from(map.entries())
    .map(([year, months]) => ({
      year,
      months: Array.from(months).sort((a, b) => b - a),
    }))
    .sort((a, b) => b.year - a.year)
}



