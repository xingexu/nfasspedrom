import prisma from '../lib/prisma'

async function findAndFixPost() {
  try {
    // Find the post by title
    const posts = await prisma.post.findMany({
      where: {
        title: {
          contains: 'retrospect',
          mode: 'insensitive'
        }
      }
    })

    if (posts.length === 0) {
      console.log('No post found with "retrospect" in title')
      // Try to find all posts
      const allPosts = await prisma.post.findMany({
        select: {
          id: true,
          title: true,
          content: true
        },
        orderBy: { date: 'desc' },
        take: 10
      })
      console.log('\nRecent posts:')
      allPosts.forEach(p => {
        console.log(`- ${p.title} (${p.id})`)
      })
      return
    }

    const post = posts[0]
    console.log(`Found post: "${post.title}" (${post.id})`)
    console.log(`\nCurrent content length: ${post.content.length} chars`)
    
    // Clean up the HTML - remove extreme transforms and ensure proper formatting
    let cleanedContent = post.content
    
    // Remove extreme transform values from images (like translate(2000px, 1500px))
    cleanedContent = cleanedContent.replace(
      /style="([^"]*transform:\s*translate\([-\d.]+px,\s*[-\d.]+px\)[^"]*)"/g,
      (match, styleContent) => {
        const transformMatch = styleContent.match(/transform:\s*translate\(([-\d.]+)px,\s*([-\d.]+)px\)/)
        if (transformMatch) {
          const x = parseFloat(transformMatch[1])
          const y = parseFloat(transformMatch[2])
          
          // If values are extreme (>500px), remove transform entirely
          if (Math.abs(x) > 500 || Math.abs(y) > 500) {
            console.log(`Removing extreme transform: translate(${x}px, ${y}px)`)
            // Remove transform and position:relative from style
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
    
    // Ensure all images have proper inline styles (block, no float, centered)
    cleanedContent = cleanedContent.replace(
      /<img([^>]*)>/g,
      (match, attributes) => {
        // Check if style attribute exists
        if (!attributes.includes('style=')) {
          // Add basic inline styles
          return `<img${attributes} style="display: block; margin-left: auto; margin-right: auto; max-width: 100%; height: auto;">`
        }
        
        // If style exists, ensure it has proper flow properties
        const styleMatch = attributes.match(/style="([^"]*)"/)
        if (styleMatch) {
          let style = styleMatch[1]
          
          // Ensure block display, no float, centered
          if (!style.includes('display:')) {
            style = `display: block; ${style}`
          }
          if (!style.includes('float:')) {
            style = `${style}; float: none`
          }
          if (!style.includes('clear:')) {
            style = `${style}; clear: both`
          }
          if (!style.includes('margin-left:') && !style.includes('margin:')) {
            style = `${style}; margin-left: auto`
          }
          if (!style.includes('margin-right:') && !style.includes('margin:')) {
            style = `${style}; margin-right: auto`
          }
          if (!style.includes('max-width:')) {
            style = `${style}; max-width: 100%`
          }
          if (!style.includes('height:')) {
            style = `${style}; height: auto`
          }
          
          // Clean up semicolons
          style = style.replace(/;\s*;/g, ';').replace(/^;\s*|;\s*$/g, '').trim()
          
          return attributes.replace(/style="[^"]*"/, `style="${style}"`)
        }
        
        return match
      }
    )
    
    // Update the post
    if (cleanedContent !== post.content) {
      await prisma.post.update({
        where: { id: post.id },
        data: { content: cleanedContent }
      })
      console.log('\n✅ Post updated successfully!')
      console.log(`Content length after cleanup: ${cleanedContent.length} chars`)
    } else {
      console.log('\n✅ Post content is already clean!')
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

findAndFixPost()

