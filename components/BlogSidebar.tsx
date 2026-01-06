'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

interface BlogSidebarProps {
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

export default function BlogSidebar({
  availableYearsMonths,
}: BlogSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const selectedYear = searchParams.get('year')
  const selectedMonth = searchParams.get('month')

  const handleFilterChange = (year?: string, month?: string) => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (year) params.set('year', year)
    if (month) params.set('month', month)
    const query = params.toString()
    router.push(query ? `?${query}` : '/blog')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (selectedYear) params.set('year', selectedYear)
    if (selectedMonth) params.set('month', selectedMonth)
    const query = params.toString()
    router.push(query ? `?${query}` : '/blog')
  }

  return (
    <div className="w-64 flex-shrink-0 pr-8">
      <h1 className="text-3xl font-bold text-text mb-6">Journal</h1>
      
      <Link
        href="/posts/new"
        className="quote-button w-full mb-8 px-4 py-3 flex items-center justify-center gap-2"
      >
        NEW ENTRY
      </Link>

      <form onSubmit={handleSearch} className="mb-6">
        <label htmlFor="search" className="block text-text mb-2 font-semibold">
          Search
        </label>
        <div className="relative">
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries..."
            className="w-full px-4 py-2 pl-10 border border-muted-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </form>

      <div className="mb-4">
        <label htmlFor="year" className="block text-text mb-2 font-semibold">
          Year
        </label>
        <select
          id="year"
          value={selectedYear || ''}
          onChange={(e) => handleFilterChange(e.target.value || undefined, selectedMonth || undefined)}
          className="w-full px-4 py-2 border border-muted-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Years</option>
          {availableYearsMonths.map(({ year }) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="month" className="block text-text mb-2 font-semibold">
          Month
        </label>
        <select
          id="month"
          value={selectedMonth || ''}
          onChange={(e) => handleFilterChange(selectedYear || undefined, e.target.value || undefined)}
          className="w-full px-4 py-2 border border-muted-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Months</option>
          {selectedYear &&
            availableYearsMonths
              .find((ym) => ym.year === Number(selectedYear))
              ?.months.map((month) => (
                <option key={month} value={month}>
                  {monthNames[month - 1]}
                </option>
              ))}
        </select>
      </div>
    </div>
  )
}

