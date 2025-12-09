import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET - Get about content (public)
export async function GET() {
  try {
    const about = await prisma.about.findFirst({
      orderBy: { updatedAt: 'desc' },
    })

    if (!about) {
      return NextResponse.json({ content: '' })
    }

    return NextResponse.json({ content: about.content, id: about.id })
  } catch (error) {
    console.error('Error fetching about:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    )
  }
}

// PUT - Update about content (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { content } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Get existing about or create new one
    const existing = await prisma.about.findFirst({
      orderBy: { updatedAt: 'desc' },
    })

    let about
    if (existing) {
      // Update existing
      about = await prisma.about.update({
        where: { id: existing.id },
        data: { content },
      })
    } else {
      // Create new
      about = await prisma.about.create({
        data: { content },
      })
    }

    return NextResponse.json({ 
      success: true, 
      content: about.content,
      id: about.id 
    })
  } catch (error) {
    console.error('Error updating about:', error)
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    )
  }
}


