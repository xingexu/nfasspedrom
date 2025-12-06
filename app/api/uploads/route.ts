import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const extension = file.name.split('.').pop() || 'png'
    const filename = `${randomBytes(16).toString('hex')}.${extension}`

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    // Save file
    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    // Return URL
    const url = `/uploads/${filename}`
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
