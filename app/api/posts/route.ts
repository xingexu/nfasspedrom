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

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        date: new Date(date)
      }
    })

    return NextResponse.json(newPost, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
