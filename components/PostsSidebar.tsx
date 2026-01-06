'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

interface PostsSidebarProps {
  years: number[]
  monthsByYear: Record<number, number[]>
  selectedYear?: number
  selectedMonth?: number
  searchQuery?: string
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

export default function PostsSidebar({
  years,
  monthsByYear,
  selectedYear,
  selectedMonth,
  searchQuery,
}: PostsSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchQuery || '')

  const handleFilterChange = (year?: string, month?: string) => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (year) params.set('year', year)
    if (month) params.set('month', month)
    const query = params.toString()
    router.push(query ? `/posts?${query}` : '/posts')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (selectedYear) params.set('year', selectedYear.toString())
    if (selectedMonth) params.set('month', selectedMonth.toString())
    const query = params.toString()
    router.push(query ? `/posts?${query}` : '/posts')
  }

  return (
    <div className="w-72 flex-shrink-0">
      <div className="sticky top-8">
        <div className="mb-8">
          <Link
            href="/posts/new"
            className="w-full flex items-center justify-center mb-8"
            title="New Post"
          >
            <button className="w-14 h-14 rounded-full bg-primary text-white hover:opacity-90 transition-all flex items-center justify-center text-3xl font-light hover:scale-110 hover:shadow-lg">
              +
            </button>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <label htmlFor="search" className="block text-text/70 mb-3 text-sm font-medium">
            Search
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts..."
              className="w-full px-4 py-3 pl-11 border-2 border-muted-border rounded-xl bg-background text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text/40"
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

        <div className="space-y-6">
          <div>
            <label htmlFor="year" className="block text-text/70 mb-3 text-sm font-medium">
              Year
            </label>
            <select
              id="year"
              value={selectedYear || ''}
              onChange={(e) => handleFilterChange(e.target.value || undefined, selectedMonth?.toString() || undefined)}
              className="w-full px-4 py-3 border-2 border-muted-border rounded-xl bg-background text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="month" className="block text-text/70 mb-3 text-sm font-medium">
              Month
            </label>
            <select
              id="month"
              value={selectedMonth || ''}
              onChange={(e) => handleFilterChange(selectedYear?.toString() || undefined, e.target.value || undefined)}
              className="w-full px-4 py-3 border-2 border-muted-border rounded-xl bg-background text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="">All Months</option>
              {selectedYear &&
                monthsByYear[selectedYear]?.map((month) => (
                  <option key={month} value={month}>
                    {monthNames[month - 1]}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

