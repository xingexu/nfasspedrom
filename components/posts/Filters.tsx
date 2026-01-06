'use client'

import { useRouter } from 'next/navigation'

interface FiltersProps {
  years: number[]
  monthsByYear: Record<number, number[]>
  selectedYear?: number
  selectedMonth?: number
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

export default function Filters({
  years,
  monthsByYear,
  selectedYear,
  selectedMonth,
}: FiltersProps) {
  const router = useRouter()

  const handleFilterChange = (year?: string, month?: string) => {
    const params = new URLSearchParams()
    if (year) params.set('year', year)
    if (month) params.set('month', month)
    const query = params.toString()
    router.push(query ? `/posts?${query}` : '/posts')
  }

  return (
    <div className="bg-white rounded-xl p-6 ring-1 ring-neutral-200 shadow-sm mb-12">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Year Select */}
        <div className="md:w-40 relative">
          <select
            value={selectedYear || ''}
            onChange={(e) => handleFilterChange(e.target.value || undefined, selectedMonth?.toString() || undefined)}
            className="w-full px-4 py-3 pr-10 rounded-lg border border-neutral-200 bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all hover:border-neutral-300 appearance-none cursor-pointer"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Month Select */}
        <div className="md:w-40 relative">
          <select
            value={selectedMonth || ''}
            onChange={(e) => handleFilterChange(selectedYear?.toString() || undefined, e.target.value || undefined)}
            disabled={!selectedYear}
            className="w-full px-4 py-3 pr-10 rounded-lg border border-neutral-200 bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all hover:border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
          >
            <option value="">All Months</option>
            {selectedYear &&
              monthsByYear[selectedYear]?.map((month) => (
                <option key={month} value={month}>
                  {monthNames[month - 1]}
                </option>
              ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

