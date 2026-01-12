/**
 * Format a date without timezone issues
 * When dates are stored as "YYYY-MM-DD" strings, JavaScript's Date constructor
 * interprets them as UTC midnight, which can shift the date by a day in local time.
 * This function extracts the date components from the ISO string or uses UTC methods
 * to get the date components and creates a local date to avoid timezone shift.
 */
export function formatDateLocal(date: Date | string | null | undefined): string {
  if (!date) {
    return 'No date'
  }

  try {
    let year: number, month: number, day: number
    
    // If it's a string like "2024-12-05" or "2024-12-05T00:00:00.000Z"
    if (typeof date === 'string') {
      // Extract date components from string (YYYY-MM-DD format)
      const dateStr = date.split('T')[0] // Get just the date part
      const parts = dateStr.split('-')
      if (parts.length === 3) {
        year = parseInt(parts[0], 10)
        month = parseInt(parts[1], 10) - 1 // Month is 0-indexed
        day = parseInt(parts[2], 10)
      } else {
        return 'Invalid date'
      }
    } else {
      // It's a Date object - use UTC methods to get the date components
      // This ensures we get the actual date without timezone conversion
      year = date.getUTCFullYear()
      month = date.getUTCMonth()
      day = date.getUTCDate()
    }

    // Create a new date in local time with the extracted components
    const localDate = new Date(year, month, day)
    
    return localDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

/**
 * Format a date in short format (e.g., "Dec 5, 2024") without timezone issues
 */
export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) {
    return 'No date'
  }

  try {
    let year: number, month: number, day: number
    
    // If it's a string like "2024-12-05" or "2024-12-05T00:00:00.000Z"
    if (typeof date === 'string') {
      // Extract date components from string (YYYY-MM-DD format)
      const dateStr = date.split('T')[0] // Get just the date part
      const parts = dateStr.split('-')
      if (parts.length === 3) {
        year = parseInt(parts[0], 10)
        month = parseInt(parts[1], 10) - 1 // Month is 0-indexed
        day = parseInt(parts[2], 10)
      } else {
        return 'Invalid date'
      }
    } else {
      // It's a Date object - use UTC methods to get the date components
      year = date.getUTCFullYear()
      month = date.getUTCMonth()
      day = date.getUTCDate()
    }

    // Create a new date in local time with the extracted components
    const localDate = new Date(year, month, day)
    
    return localDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

