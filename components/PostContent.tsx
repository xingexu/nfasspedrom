'use client'

import { useState, useEffect } from 'react'

interface PostContentProps {
  content: string
  maxLength?: number
}

export default function PostContent({ content, maxLength = 500 }: PostContentProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [textLength, setTextLength] = useState(0)
  
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
  
  const shouldTruncate = textLength > maxLength && !isExpanded

  return (
    <div className="text-text">
      {isHTML ? (
        <div 
          dangerouslySetInnerHTML={{ __html: content }}
          className="[&_p]:mb-4 [&_p]:leading-relaxed [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_code]:bg-neutral-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_pre]:bg-neutral-100 [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre]:my-4 [&_a]:text-primary [&_a]:underline [&_a]:hover:opacity-70 [&_img]:max-w-full [&_img]:h-auto [&_img]:my-4 [&_img]:rounded [&_video]:max-w-full [&_video]:h-auto [&_video]:my-4 [&_video]:rounded"
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
