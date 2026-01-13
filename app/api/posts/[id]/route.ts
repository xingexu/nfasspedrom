import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const post = await prisma.post.findUnique({
    where: { id }
  })

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  return NextResponse.json(post)
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const { title, content, date } = await request.json()

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
    
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        date: dateValue,
        postDate: dateValue, // Also update postDate field
      }
    })

    // Revalidate the home page so updated dates show immediately
    revalidatePath('/')

    return NextResponse.json(updatedPost)
  } catch (err) {
    console.error('Error updating post:', err)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await prisma.post.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
