import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME?.trim() || 'bigguy'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (session?.username !== ADMIN_USERNAME) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }

    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    let cleanedContent = post.content

    // Remove extreme transform values from images
    cleanedContent = cleanedContent.replace(
      /style="([^"]*transform:\s*translate\([-\d.]+px,\s*[-\d.]+px\)[^"]*)"/g,
      (match, styleContent) => {
        const transformMatch = styleContent.match(/transform:\s*translate\(([-\d.]+)px,\s*([-\d.]+)px\)/)
        if (transformMatch) {
          const x = parseFloat(transformMatch[1])
          const y = parseFloat(transformMatch[2])
          
          // If values are extreme (>500px), remove transform entirely
          if (Math.abs(x) > 500 || Math.abs(y) > 500) {
            let cleaned = styleContent
              .replace(/transform:\s*[^;]+;?/g, '')
              .replace(/position:\s*relative;?/g, '')
              .replace(/;\s*;/g, ';')
              .replace(/^;\s*|;\s*$/g, '')
              .trim()
            
            // Preserve filter if exists
            const filterMatch = styleContent.match(/filter:\s*[^;]+/)
            if (filterMatch && cleaned) {
              cleaned = `${cleaned}; ${filterMatch[0]}`
            } else if (filterMatch) {
              cleaned = filterMatch[0]
            }
            
            return cleaned ? `style="${cleaned}"` : ''
          }
        }
        return match
      }
    )

    // Ensure all images have proper inline styles
    cleanedContent = cleanedContent.replace(
      /<img([^>]*)>/g,
      (match, attributes) => {
        if (!attributes.includes('style=')) {
          return `<img${attributes} style="display: block; margin-left: auto; margin-right: auto; max-width: 100%; height: auto;">`
        }
        
        const styleMatch = attributes.match(/style="([^"]*)"/)
        if (styleMatch) {
          let style = styleMatch[1]
          
          // Ensure proper flow properties
          const requiredStyles = [
            'display: block',
            'float: none',
            'clear: both',
            'margin-left: auto',
            'margin-right: auto',
            'max-width: 100%',
            'height: auto'
          ]
          
          requiredStyles.forEach(reqStyle => {
            const [prop] = reqStyle.split(':')
            if (!style.includes(`${prop}:`)) {
              style = `${style}; ${reqStyle}`
            }
          })
          
          style = style.replace(/;\s*;/g, ';').replace(/^;\s*|;\s*$/g, '').trim()
          
          return attributes.replace(/style="[^"]*"/, `style="${style}"`)
        }
        
        return match
      }
    )

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { content: cleanedContent }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Post images fixed',
      post: updatedPost 
    })
  } catch (error: any) {
    console.error('Error fixing post:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fix post' },
      { status: 500 }
    )
  }
}

