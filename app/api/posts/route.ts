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

    // Ensure date is valid, default to now if not provided
    const dateValue = date ? new Date(date) : new Date()

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
