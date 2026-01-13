import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { date: "desc" }
  })
  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  try {
    const { title, content, date } = await req.json()

    // Parse date string to avoid timezone issues
    // If date is provided as YYYY-MM-DD, create date at local midnight to preserve the date
    let dateValue: Date
    if (date) {
      const dateStr = date.toString()
      // If it's in YYYY-MM-DD format, parse it to avoid timezone conversion
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-').map(Number)
        dateValue = new Date(year, month - 1, day) // month is 0-indexed
      } else {
        dateValue = new Date(date)
      }
    } else {
      dateValue = new Date()
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        date: dateValue,
        postDate: dateValue, // Also set postDate field
      }
    })

    return NextResponse.json(newPost, { status: 201 })
  } catch (err) {
    console.error('Error creating post:', err)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
