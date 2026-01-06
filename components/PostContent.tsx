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

  // Process all images - add spoiler functionality and ensure they render
  useEffect(() => {
    if (isHTML && typeof window !== 'undefined' && contentRef.current) {
      // DEBUG: Check raw HTML for img tags and data-spoiler attributes
      if (content.includes('<img')) {
        const imgMatches = content.match(/<img[^>]*>/gi)
        console.log('IMG tags in HTML:', imgMatches?.length || 0)
        if (imgMatches) {
          imgMatches.forEach((tag, i) => {
            const hasSpoiler = tag.includes('data-spoiler') || tag.includes('data-spoiler="true"')
            console.log(`IMG tag ${i}:`, tag.substring(0, 200), hasSpoiler ? ' [HAS SPOILER]' : '')
          })
        }
      } else {
        console.warn('No <img> tags found in HTML content!')
      }
      
      // CRITICAL: Pre-process HTML to ensure data-spoiler attributes are preserved
      // Check if content has data-spoiler but images don't have the attribute in DOM
      const hasSpoilerInContent = content.includes('data-spoiler="true"') || content.includes("data-spoiler='true'")
      console.log('Content has data-spoiler:', hasSpoilerInContent)
      
      // Ensure all images are visible and handle base64/data URLs
      // IMPORTANT: Preserve transform styles for positioned images
      const allImages = Array.from(contentRef.current.querySelectorAll('img'))
      console.log('Found images in DOM:', allImages.length)
      allImages.forEach((img, idx) => {
        const imgElement = img as HTMLImageElement
        
        // DEBUG: Log image src to see what's being loaded
        console.log(`Image ${idx} src:`, imgElement.src || imgElement.getAttribute('src'))
        console.log(`Image ${idx} complete:`, imgElement.complete)
        console.log(`Image ${idx} naturalWidth:`, imgElement.naturalWidth)
        
        // Ensure image is visible
        imgElement.style.display = 'block'
        imgElement.style.visibility = 'visible'
        imgElement.style.opacity = '1'
        
        // Get style from attribute first (this is what was saved)
        let savedStyle = imgElement.getAttribute('style') || ''
        
        // If no style attribute, check inline style (might be set by React)
        if (!savedStyle && imgElement.style.cssText) {
          savedStyle = imgElement.style.cssText
        }
        
        const hasTransform = /transform:\s*translate\(/.test(savedStyle)
        
        // PRESERVE transform styles - but ensure they don't break flow
        // If image has a transform, check if values are reasonable
        if (hasTransform) {
          // Parse the transform to ensure it's valid
          const transformMatch = savedStyle.match(/transform:\s*translate\(([-\d.]+)px,\s*([-\d.]+)px\)/)
          if (transformMatch) {
            const x = parseFloat(transformMatch[1])
            const y = parseFloat(transformMatch[2])
            
            // CRITICAL: If transform values are too large, they're likely wrong
            // Large values (>200px) indicate the transform was calculated relative to wrong container
            // In this case, remove the transform and render inline normally
            // Google Docs style: images should be inline with text, max 200px offset
            const maxReasonableOffset = 200 // Max reasonable offset for inline positioning (like Google Docs)
            if (Math.abs(x) > maxReasonableOffset || Math.abs(y) > maxReasonableOffset) {
              console.warn(`Image ${idx} has extreme transform values (${x}px, ${y}px). Removing transform to render inline.`)
              // Remove transform from style - strip it out completely
              let cleanedStyle = savedStyle.replace(/transform:\s*[^;]+;?/g, '').replace(/position:\s*relative;?/g, '')
              cleanedStyle = cleanedStyle.replace(/;\s*;/g, ';').replace(/^;\s*|;\s*$/g, '').trim()
              
              // Update the style attribute without transform
              if (cleanedStyle) {
                imgElement.setAttribute('style', cleanedStyle)
                // Also clear inline styles
                imgElement.style.transform = 'none'
                imgElement.style.position = 'static'
              } else {
                imgElement.removeAttribute('style')
                imgElement.style.transform = 'none'
                imgElement.style.position = 'static'
              }
              
              // Fall through to non-positioned image handling below
            } else {
              // Values are reasonable, apply them but ensure proper flow
              // CRITICAL: Force block-level and flow behavior even with transform
              imgElement.style.display = 'block'
              imgElement.style.float = 'none'
              imgElement.style.clear = 'both'
              imgElement.style.position = 'relative' // Relative is OK for transform, but ensure no float
              imgElement.style.marginLeft = 'auto'
              imgElement.style.marginRight = 'auto'
              imgElement.style.maxWidth = '100%'
              imgElement.style.height = 'auto'
              
              // Apply transform with clamped values
              const clampedX = Math.max(-maxReasonableOffset, Math.min(maxReasonableOffset, x))
              const clampedY = Math.max(-maxReasonableOffset, Math.min(maxReasonableOffset, y))
              imgElement.style.transform = `translate(${clampedX}px, ${clampedY}px)`
              
              // Ensure proper vertical spacing
              if (!imgElement.style.marginTop && !imgElement.style.marginBottom) {
                imgElement.style.marginTop = '2rem'
                imgElement.style.marginBottom = '2rem'
              }
              
              // Build the final style string - preserve filter if exists
              let finalStyle = `display: block; float: none; clear: both; position: relative; margin-left: auto; margin-right: auto; max-width: 100%; height: auto; transform: translate(${clampedX}px, ${clampedY}px)`
              
              // Preserve filter from original style
              const filterMatch = savedStyle.match(/filter:\s*[^;]+/)
              if (filterMatch) {
                finalStyle += `; ${filterMatch[0]}`
              }
              
              // Set the full style attribute
              imgElement.setAttribute('style', finalStyle)
              
              // Mark as positioned so CSS doesn't override
              imgElement.setAttribute('data-positioned', 'true')
              imgElement.classList.add('positioned-image')
              
              // Ensure parent clears properly
              const parent = imgElement.parentElement
              if (parent) {
                const parentStyle = window.getComputedStyle(parent)
                // Ensure parent doesn't float
                if (parentStyle.float !== 'none') {
                  parent.style.float = 'none'
                }
                if (parentStyle.clear !== 'both') {
                  parent.style.clear = 'both'
                }
              }
              
              return // Exit early, image is handled
            }
          }
        }
        
        // If we get here, either no transform or transform was invalid/extreme
        // Render as normal inline image (fall through to non-positioned image handling)
        
        // For non-positioned images, apply standard styling
        // CRITICAL: Force block-level, no float, no absolute positioning
        imgElement.style.display = 'block'
        imgElement.style.float = 'none'
        imgElement.style.clear = 'both'
        imgElement.style.position = 'static' // Remove any absolute/fixed/relative that breaks flow
        imgElement.style.marginLeft = 'auto'
        imgElement.style.marginRight = 'auto'
        imgElement.style.maxWidth = '100%'
        imgElement.style.height = 'auto'
        imgElement.style.visibility = 'visible'
        imgElement.style.opacity = '1'
        
        // Ensure image has minimum dimensions so it doesn't collapse
        if (!imgElement.width && !imgElement.height && !imgElement.style.width && !imgElement.style.height) {
          // Wait for image to load, then ensure it has dimensions
          if (imgElement.complete && imgElement.naturalWidth > 0) {
            // Image already loaded, ensure it's visible
            imgElement.style.minHeight = '100px' // Temporary min height until image loads
          } else {
            // Image not loaded yet, set temporary dimensions
            imgElement.style.minHeight = '200px'
            imgElement.style.backgroundColor = '#f0f0f0' // Show placeholder
          }
        }
        
        // Ensure proper vertical spacing
        if (!imgElement.style.marginTop && !imgElement.style.marginBottom) {
          imgElement.style.marginTop = '2rem'
          imgElement.style.marginBottom = '2rem'
        }
        
        // Handle image loading - ensure it loads
        const src = imgElement.src || imgElement.getAttribute('src') || ''
        if (!src) {
          console.error(`Image ${idx} has no src attribute!`)
          // Don't hide it, just log the error
        } else {
          // Ensure src is set
          if (!imgElement.src) {
            imgElement.src = src
          }
          
          // Add error handler that logs but doesn't hide
          imgElement.onerror = (e) => {
            console.error(`Image ${idx} failed to load:`, src)
            console.error('Error event:', e)
            // Don't hide the image, just log
            // The image will show as broken, which is better than invisible
          }
          
          // Add load handler to confirm it loaded and remove placeholder
          imgElement.onload = () => {
            console.log(`Image ${idx} loaded successfully:`, src)
            // Remove placeholder background once loaded
            imgElement.style.backgroundColor = ''
            if (imgElement.naturalWidth > 0) {
              imgElement.style.minHeight = ''
            }
          }
        }
        
        // Ensure base64 and data URLs work
        if (src.startsWith('data:') || src.startsWith('blob:')) {
          // Base64 images should work natively
          imgElement.loading = 'lazy'
        }
      })

      // Process spoiler images - add blur and reveal functionality
      // CRITICAL: Check both the selector and also check raw HTML for data-spoiler attribute
      // Use a more robust approach that checks the actual HTML content
      
      // First, extract spoiler image info from raw content string BEFORE DOM parsing
      const spoilerImageSrcs = new Set<string>()
      const imgTagRegex = /<img[^>]*data-spoiler=["']?true["']?[^>]*>/gi
      const spoilerMatches = content.match(imgTagRegex) || []
      
      spoilerMatches.forEach((tag) => {
        const srcMatch = tag.match(/src=["']([^"']+)["']/i)
        if (srcMatch && srcMatch[1]) {
          spoilerImageSrcs.add(srcMatch[1])
          // Also try to match relative paths
          const relativeSrc = srcMatch[1].split('/').pop() || srcMatch[1]
          spoilerImageSrcs.add(relativeSrc)
        }
      })
      
      console.log('Spoiler images found in raw HTML:', spoilerMatches.length)
      console.log('Spoiler image srcs:', Array.from(spoilerImageSrcs))
      
      // Process images after a short delay to ensure DOM is ready
      const processSpoilerImages = () => {
        const allImages = Array.from(contentRef.current?.querySelectorAll('img:not([data-spoiler-processed])') || [])
        
        // Check DOM attributes AND match by src
        const spoilerImages = allImages.filter((img) => {
          const spoilerAttr = img.getAttribute('data-spoiler')
          const src = img.getAttribute('src') || img.src || ''
          const srcFileName = src.split('/').pop() || src
          
          // Check multiple ways the attribute might be set
          const isSpoiler = 
            spoilerAttr === 'true' || 
            spoilerAttr === '' ||
            spoilerImageSrcs.has(src) ||
            spoilerImageSrcs.has(srcFileName) ||
            spoilerImageSrcs.has(decodeURIComponent(src)) ||
            spoilerImageSrcs.has(decodeURIComponent(srcFileName))
          
          if (isSpoiler && !img.hasAttribute('data-spoiler')) {
            // Ensure attribute is set on DOM element
            img.setAttribute('data-spoiler', 'true')
          }
          
          return isSpoiler
        })
        
        console.log('Found spoiler images in DOM:', spoilerImages.length, 'out of', allImages.length)
      
        spoilerImages.forEach((img) => {
        // Skip if already processed
        if (img.hasAttribute('data-spoiler-processed')) return
        
        img.setAttribute('data-spoiler-processed', 'true')
        const src = img.getAttribute('src') || img.src || ''
        const alt = img.getAttribute('alt') || ''
        const parent = img.parentNode
        
        if (!parent) {
          console.warn('Spoiler image has no parent, skipping')
          return
        }
        
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
        try {
          parent.replaceChild(wrapper, img)
          console.log('Successfully wrapped spoiler image:', src.substring(0, 50))
        } catch (error) {
          console.error('Error replacing spoiler image:', error, src)
        }
      })
      
        // If no spoiler images were found but HTML contains data-spoiler, log for debugging
        if (spoilerImages.length === 0 && spoilerMatches.length > 0) {
          console.warn('Found data-spoiler in HTML but no matching images in DOM. HTML matches:', spoilerMatches.length)
        }
      }
      
      // Process immediately and also after a short delay to catch any async image loading
      processSpoilerImages()
      const timeoutId = setTimeout(processSpoilerImages, 100)
      const timeoutId2 = setTimeout(processSpoilerImages, 500)
      
      // Also use MutationObserver to catch images added later
      const observer = new MutationObserver((mutations) => {
        let shouldProcess = false
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) { // Element node
                const element = node as HTMLElement
                if (element.tagName === 'IMG' || element.querySelector('img')) {
                  shouldProcess = true
                }
              }
            })
          }
        })
        if (shouldProcess) {
          processSpoilerImages()
        }
      })
      
      if (contentRef.current) {
        observer.observe(contentRef.current, {
          childList: true,
          subtree: true,
        })
      }
      
      return () => {
        clearTimeout(timeoutId)
        clearTimeout(timeoutId2)
        observer.disconnect()
      }
    }
  }, [isHTML, content])
  
  const shouldTruncate = textLength > maxLength && !isExpanded

  return (
    <div className="text-text w-full">
      {isHTML ? (
        <div 
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: content }}
          className="w-full max-w-full [&_*]:float-none [&_*]:clear-both [&_p]:mb-6 [&_p]:leading-7 [&_p]:text-base [&_p]:clear-both [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-10 [&_h1]:leading-tight [&_h1]:clear-both [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:leading-tight [&_h2]:clear-both [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:leading-tight [&_h3]:clear-both [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-6 [&_li]:mb-2 [&_li]:leading-7 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-lg [&_blockquote]:clear-both [&_code]:bg-neutral-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_pre]:bg-neutral-100 [&_pre]:p-6 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:border [&_pre]:border-neutral-200 [&_pre]:clear-both [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80 [&_a]:transition-colors [&_img]:!block [&_img]:!float-none [&_img]:!clear-both [&_img]:!mx-auto [&_img]:!max-w-full [&_img]:!h-auto [&_img]:!my-8 [&_img]:!object-contain [&_img]:rounded-lg [&_img]:shadow-lg [&_figure]:!block [&_figure]:!float-none [&_figure]:!clear-both [&_figure]:!mx-auto [&_figure]:!max-w-full [&_video]:max-w-full [&_video]:w-full [&_video]:h-auto [&_video]:object-contain [&_video]:my-8 [&_video]:rounded-lg [&_video]:shadow-lg [&_video]:mx-auto [&_video]:block [&_video]:clear-both [&_video]:float-none"
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
