'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface PostListFiltersProps {
  availableYearsMonths: { year: number; months: number[] }[]
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export default function PostListFilters({
  availableYearsMonths,
}: PostListFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedYear = searchParams.get('year')
  const selectedMonth = searchParams.get('month')

  const handleFilterChange = (year?: string, month?: string) => {
    const params = new URLSearchParams()
    if (year) params.set('year', year)
    if (month) params.set('month', month)
    const query = params.toString()
    router.push(query ? `?${query}` : '/')
  }

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <select
        value={selectedYear || ''}
        onChange={(e) => handleFilterChange(e.target.value || undefined, selectedMonth || undefined)}
        className="px-4 py-2 border border-muted-border rounded-lg bg-background text-text"
      >
        <option value="">All Years</option>
        {availableYearsMonths.map(({ year }) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      {selectedYear && (
        <select
          value={selectedMonth || ''}
          onChange={(e) => handleFilterChange(selectedYear, e.target.value || undefined)}
          className="px-4 py-2 border border-muted-border rounded-lg bg-background text-text"
        >
          <option value="">All Months</option>
          {availableYearsMonths
            .find((ym) => ym.year === Number(selectedYear))
            ?.months.map((month) => (
              <option key={month} value={month}>
                {monthNames[month - 1]}
              </option>
            ))}
        </select>
      )}
      {(selectedYear || selectedMonth) && (
        <button
          onClick={() => handleFilterChange()}
          className="px-4 py-2 text-text/70 hover:text-text underline"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}










