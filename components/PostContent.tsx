'use client'

import { useState, useEffect, useRef } from 'react'

interface PostContentProps {
  content: string
  maxLength?: number
}

export default function PostContent({ content, maxLength = 500 }: PostContentProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [textLength, setTextLength] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  
  // Check if content is HTML
  const isHTML = content.includes('<') && content.includes('>')
  
  useEffect(() => {
    if (isHTML && typeof window !== 'undefined') {
      // Extract text content from HTML to check length
      const div = document.createElement('div')
      div.innerHTML = content
      setTextLength((div.textContent || div.innerText || '').length)
    } else {
      setTextLength(content.length)
    }
  }, [content, isHTML])

  // Process all images - fix positioning and add spoiler functionality
  useEffect(() => {
    if (isHTML && typeof window !== 'undefined' && contentRef.current) {
      // First, fix all images to remove any problematic positioning
      const allImages = Array.from(contentRef.current.querySelectorAll('img'))
      allImages.forEach((img) => {
        // Remove any float, absolute positioning, or transform that might cause issues
        const imgElement = img as HTMLImageElement
        if (imgElement.style) {
          imgElement.style.float = 'none'
          imgElement.style.position = 'static'
          imgElement.style.transform = 'none'
          imgElement.style.left = ''
          imgElement.style.right = ''
          imgElement.style.top = ''
          imgElement.style.bottom = ''
        }
      })

      // Process spoiler images - add blur and reveal functionality
      const images = Array.from(contentRef.current.querySelectorAll('img[data-spoiler="true"]:not([data-spoiler-processed])'))
      images.forEach((img) => {
        img.setAttribute('data-spoiler-processed', 'true')
        const src = img.getAttribute('src') || ''
        const alt = img.getAttribute('alt') || ''
        const parent = img.parentNode
        
        if (!parent) return
        
        // Create wrapper
        const wrapper = document.createElement('div')
        wrapper.className = 'relative block w-full my-8'
        
        // Clone the image to avoid DOM manipulation issues
        const imgClone = img.cloneNode(true) as HTMLImageElement
        
        // Apply blur to cloned image
        imgClone.style.filter = 'blur(20px)'
        imgClone.style.opacity = '0.9'
        imgClone.style.transition = 'all 0.5s ease'
        imgClone.style.userSelect = 'none'
        imgClone.style.pointerEvents = 'none'
        imgClone.draggable = false
        
        // Create overlay with eye icon
        const overlay = document.createElement('div')
        overlay.className = 'absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm cursor-pointer hover:bg-black/40 transition-all duration-300'
        
        const button = document.createElement('button')
        button.className = 'flex flex-col items-center gap-3 px-6 py-4 bg-black/60 hover:bg-black/70 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-110 group'
        button.setAttribute('aria-label', 'Reveal image')
        
        button.innerHTML = `
          <svg class="w-8 h-8 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span class="text-white text-sm font-medium">Click to reveal</span>
        `
        
        const revealImage = () => {
          imgClone.style.filter = 'none'
          imgClone.style.opacity = '1'
          overlay.style.display = 'none'
        }
        
        button.addEventListener('click', revealImage)
        overlay.addEventListener('click', revealImage)
        overlay.appendChild(button)
        
        // Add cloned image and overlay to wrapper
        wrapper.appendChild(imgClone)
        wrapper.appendChild(overlay)
        
        // Replace the original image with the wrapper
        parent.replaceChild(wrapper, img)
      })
    }
  }, [isHTML, content])
  
  const shouldTruncate = textLength > maxLength && !isExpanded

  return (
    <div className="text-text w-full overflow-hidden">
      {isHTML ? (
        <div 
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: content }}
          className="prose prose-lg prose-neutral max-w-none w-full [&_*]:float-none [&_*]:clear-both [&_p]:mb-6 [&_p]:leading-7 [&_p]:text-base [&_p]:clear-both [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-10 [&_h1]:leading-tight [&_h1]:clear-both [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:leading-tight [&_h2]:clear-both [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:leading-tight [&_h3]:clear-both [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-6 [&_li]:mb-2 [&_li]:leading-7 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-lg [&_blockquote]:clear-both [&_code]:bg-neutral-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_pre]:bg-neutral-100 [&_pre]:p-6 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:border [&_pre]:border-neutral-200 [&_pre]:clear-both [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80 [&_a]:transition-colors [&_img]:max-w-full [&_img]:w-full [&_img]:h-auto [&_img]:object-contain [&_img]:my-8 [&_img]:rounded-lg [&_img]:shadow-lg [&_img]:mx-auto [&_img]:block [&_img]:clear-both [&_img]:float-none [&_img]:position-static [&_img]:transform-none [&_video]:max-w-full [&_video]:w-full [&_video]:h-auto [&_video]:object-contain [&_video]:my-8 [&_video]:rounded-lg [&_video]:shadow-lg [&_video]:mx-auto [&_video]:block [&_video]:clear-both [&_video]:float-none"
        />
      ) : (
        <div className="whitespace-pre-wrap leading-relaxed">
          {shouldTruncate ? content.substring(0, maxLength) + '...' : content}
        </div>
      )}
      
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(true)}
          className="quote-button px-4 py-2 mt-4"
        >
          READ MORE
        </button>
      )}
    </div>
  )
}
