'use client'

import Image from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import React, { useState, useRef, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from './cropUtils'

interface EditableImageProps {
  node: any
  updateAttributes: (attrs: any) => void
  selected: boolean
}

const EditableImageComponent = ({ node, updateAttributes, selected }: EditableImageProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [imageSize, setImageSize] = useState({ 
    width: node.attrs.width || 500, 
    height: node.attrs.height || 'auto' 
  })
  // Parse position from style attribute
  const parsePositionFromStyle = (style: string | null | undefined): { x: number; y: number } => {
    if (!style) return { x: 0, y: 0 }
    
    // Match transform: translate(Xpx, Ypx)
    const transformMatch = style.match(/transform:\s*translate\(([-\d.]+)px,\s*([-\d.]+)px\)/)
    if (transformMatch) {
      const x = parseFloat(transformMatch[1]) || 0
      const y = parseFloat(transformMatch[2]) || 0
      // Clamp to reasonable values for inline positioning (like Google Docs)
      // Max 200px offset is reasonable for inline images
      return {
        x: Math.max(-200, Math.min(200, x)),
        y: Math.max(-200, Math.min(200, y)),
      }
    }
    
    return { x: 0, y: 0 }
  }

  // Merge styles, preserving existing styles like invert filter
  const mergeStyles = (existingStyle: string | null | undefined, position: { x: number; y: number }): string | null => {
    const styles: string[] = []
    
    // Add position/transform if needed
    if (position.x !== 0 || position.y !== 0) {
      styles.push(`transform: translate(${position.x}px, ${position.y}px)`)
      styles.push('position: relative')
    }
    
    // Preserve existing filter (like invert) if it exists
    if (existingStyle) {
      const filterMatch = existingStyle.match(/filter:\s*[^;]+/)
      if (filterMatch) {
        styles.push(filterMatch[0])
      }
    }
    
    return styles.length > 0 ? styles.join('; ') : null
  }

  const [position, setPosition] = useState(() => parsePositionFromStyle(node.attrs.style))
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null) // 'nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [isInverted, setIsInverted] = useState(() => {
    // Check if image is already inverted from node attributes
    const style = node.attrs.style || ''
    return style.includes('invert')
  })
  const [isSpoiler, setIsSpoiler] = useState(() => {
    // Check if image is marked as spoiler - ensure boolean
    // Accept 'true' string, true boolean, or presence of attribute
    const spoilerAttr = node.attrs['data-spoiler']
    return !!(spoilerAttr === 'true' || spoilerAttr === true || (typeof spoilerAttr === 'string' && spoilerAttr.toLowerCase() === 'true'))
  })
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync imageSize with node attributes when they change
  useEffect(() => {
    const width = node.attrs.width || 500
    const height = node.attrs.height || 'auto'
    setImageSize({ width, height })
    
    // Sync invert state
    const style = node.attrs.style || ''
    setIsInverted(style.includes('invert'))
    
    // Sync spoiler state - CRITICAL: Check both data-spoiler attribute and ensure proper boolean conversion
    // Accept 'true' string, true boolean, or presence of attribute
    const spoilerAttr = node.attrs['data-spoiler']
    const isSpoilerValue = spoilerAttr === 'true' || spoilerAttr === true || (typeof spoilerAttr === 'string' && spoilerAttr.toLowerCase() === 'true')
    setIsSpoiler(!!isSpoilerValue)
    
    // Sync position from style attribute
    const parsedPosition = parsePositionFromStyle(node.attrs.style)
    setPosition(parsedPosition)
  }, [node.attrs.width, node.attrs.height, node.attrs.style, node.attrs['data-spoiler'], node.attrs.class])

  // CRITICAL: Ensure style attribute is ALWAYS synced with position
  // This ensures the style is on the DOM element when TipTap serializes
  // Use flushSync to ensure this runs synchronously after React renders
  useEffect(() => {
    // Use setTimeout to ensure this runs after React's inline styles are applied
    const timeoutId = setTimeout(() => {
      if (imageRef.current) {
        // Build the style string from current state
        const styleParts: string[] = []
        
        // Add transform if position is set
        if (position.x !== 0 || position.y !== 0) {
          styleParts.push(`transform: translate(${position.x}px, ${position.y}px)`)
          styleParts.push('position: relative')
        }
        
        // Preserve filter from node attributes if it exists
        if (node.attrs.style) {
          const filterMatch = (node.attrs.style as string).match(/filter:\s*[^;]+/)
          if (filterMatch) {
            styleParts.push(filterMatch[0])
          }
        }
        
        // ALWAYS set the style attribute on DOM - this is what TipTap serializes
        const styleString = styleParts.length > 0 ? styleParts.join('; ') : ''
        if (styleString) {
          // Set on DOM element (for serialization) - this is CRITICAL
          // This will override React's inline styles in the attribute
          imageRef.current.setAttribute('style', styleString)
          // Update node attributes to ensure it's saved
          if (node.attrs.style !== styleString) {
            updateAttributes({ style: styleString })
          }
        } else {
          // Only remove if there's no style to preserve
          const currentAttr = imageRef.current.getAttribute('style') || ''
          if (currentAttr && !currentAttr.includes('filter:')) {
            imageRef.current.removeAttribute('style')
            if (node.attrs.style) {
              updateAttributes({ style: null })
            }
          }
        }
      }
    }, 0)
    
    return () => clearTimeout(timeoutId)
  }, [position.x, position.y, node.attrs.style, updateAttributes])

  const onCropComplete = (_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const applyCrop = async () => {
    if (!croppedAreaPixels || !imageRef.current) {
      setIsEditing(false)
      return
    }

    try {
      const croppedImageUrl = await getCroppedImg(
        node.attrs.src,
        croppedAreaPixels,
        rotation
      )
      
      updateAttributes({ 
        src: croppedImageUrl, 
        width: croppedAreaPixels.width, 
        height: croppedAreaPixels.height 
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error cropping image:', error)
      setIsEditing(false)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    
    // Check if clicking on resize handle
    const handle = target.closest('[data-resize-handle]')
    if (handle) {
      const handleType = (handle as HTMLElement).dataset.resizeHandle
      setIsResizing(true)
      setResizeHandle(handleType ?? null)
      const currentWidth = typeof imageSize.width === 'number' ? imageSize.width : (imageRef.current?.offsetWidth || 500)
      const currentHeight = typeof imageSize.height === 'number' ? imageSize.height : (imageRef.current?.offsetHeight || 500)
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: currentWidth,
        height: currentHeight,
      })
      e.preventDefault()
      e.stopPropagation()
    } else if (target.tagName === 'IMG' && selected) {
      // Allow dragging when image is selected, but constrain to editor bounds
      setIsDragging(true)
      setDragStart({ 
        x: e.clientX, 
        y: e.clientY 
      })
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const handleInvert = () => {
    const newInverted = !isInverted
    setIsInverted(newInverted)
    updateAttributes({ 
      style: newInverted ? 'filter: invert(1);' : '' 
    })
  }

  const handleSpoilerToggle = () => {
    const newSpoiler = !isSpoiler
    setIsSpoiler(newSpoiler)
    // CRITICAL: Always set as string 'true' or 'false' to ensure proper serialization
    updateAttributes({ 
      'data-spoiler': newSpoiler ? 'true' : 'false'
    })
    // Force immediate DOM update to ensure attribute is set
    if (imageRef.current) {
      if (newSpoiler) {
        imageRef.current.setAttribute('data-spoiler', 'true')
      } else {
        imageRef.current.removeAttribute('data-spoiler')
      }
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && resizeHandle) {
        const diffX = e.clientX - resizeStart.x
        const diffY = e.clientY - resizeStart.y
        
        let newWidth = resizeStart.width
        let newHeight = resizeStart.height
        
        // Handle different resize directions - smooth and responsive
        switch (resizeHandle) {
          case 'nw': // Top-left corner
            newWidth = Math.max(100, Math.min(2000, resizeStart.width - diffX))
            newHeight = Math.max(100, Math.min(2000, resizeStart.height - diffY))
            break
          case 'n': // Top edge
            newHeight = Math.max(100, Math.min(2000, resizeStart.height - diffY))
            break
          case 'ne': // Top-right corner
            newWidth = Math.max(100, Math.min(2000, resizeStart.width + diffX))
            newHeight = Math.max(100, Math.min(2000, resizeStart.height - diffY))
            break
          case 'e': // Right edge
            newWidth = Math.max(100, Math.min(2000, resizeStart.width + diffX))
            break
          case 'se': // Bottom-right corner
            newWidth = Math.max(100, Math.min(2000, resizeStart.width + diffX))
            newHeight = Math.max(100, Math.min(2000, resizeStart.height + diffY))
            break
          case 's': // Bottom edge
            newHeight = Math.max(100, Math.min(2000, resizeStart.height + diffY))
            break
          case 'sw': // Bottom-left corner
            newWidth = Math.max(100, Math.min(2000, resizeStart.width - diffX))
            newHeight = Math.max(100, Math.min(2000, resizeStart.height + diffY))
            break
          case 'w': // Left edge
            newWidth = Math.max(100, Math.min(2000, resizeStart.width - diffX))
            break
        }
        
        // Smooth update
        setImageSize({ width: newWidth, height: newHeight })
      } else if (isDragging && imageRef.current) {
        // Get the editor content area (ProseMirror editor)
        const editorElement = imageRef.current.closest('.ProseMirror')
        if (!editorElement) return
        
        const editorRect = (editorElement as HTMLElement).getBoundingClientRect()
        const imageRect = imageRef.current.getBoundingClientRect()
        
        // Calculate new position relative to where drag started
        const deltaX = e.clientX - dragStart.x
        const deltaY = e.clientY - dragStart.y
        
        // Use the current position state as base (not visual position) and add delta
        let newX = position.x + deltaX
        let newY = position.y + deltaY
        
        // CRITICAL: Constrain to reasonable values for inline positioning
        // Images should only be offset slightly from their natural position (like Google Docs)
        // Max offset of 200px in any direction is reasonable for inline images
        const maxReasonableOffset = 200
        
        // Constrain to editor bounds AND reasonable offset limits
        const maxX = Math.min(editorRect.width - imageRect.width, maxReasonableOffset)
        const maxY = Math.min(editorRect.height - imageRect.height, maxReasonableOffset)
        
        newX = Math.max(-maxReasonableOffset, Math.min(maxX, newX))
        newY = Math.max(-maxReasonableOffset, Math.min(maxY, newY))
        
        setPosition({ x: newX, y: newY })
        
        // Update drag start for next move
        setDragStart({ x: e.clientX, y: e.clientY })
      }
    }

    const handleMouseUp = () => {
      if (isResizing) {
        updateAttributes({ 
          width: imageSize.width, 
          height: imageSize.height 
        })
        setIsResizing(false)
        setResizeHandle(null)
      }
      if (isDragging) {
        // Save position as style attribute so it persists, merging with existing styles
        const mergedStyle = mergeStyles(node.attrs.style, position)
        // CRITICAL: Update attributes immediately and ensure DOM is synced
        updateAttributes({ 
          style: mergedStyle || undefined
        })
        // Also ensure the style is on the DOM element right away
        if (imageRef.current && mergedStyle) {
          imageRef.current.setAttribute('style', mergedStyle)
        }
        setIsDragging(false)
      }
    }

    if (isResizing || isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing, isDragging, resizeStart, dragStart, imageSize, updateAttributes])

  if (isEditing) {
    return (
      <NodeViewWrapper className="editable-image-editor">
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Simple Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Edit Image</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main Content - Simplified */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Image Preview */}
              <div className="relative w-full h-[450px] bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 mb-6">
                <Cropper
                  image={node.attrs.src}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={undefined}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                />
              </div>

              {/* Simple Controls - All in one section */}
              <div className="space-y-4">
                {/* Hide/Censor - Most Important */}
                <div className={`p-4 rounded-lg border-2 transition-all ${
                  isSpoiler 
                    ? 'bg-red-50 border-red-300' 
                    : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg className={`w-5 h-5 ${isSpoiler ? 'text-red-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <div>
                        <label className="font-semibold text-gray-900 cursor-pointer">Hide Image</label>
                        <p className="text-xs text-gray-600">Blur until clicked</p>
                      </div>
                    </div>
                    <button
                      onClick={handleSpoilerToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isSpoiler ? 'bg-red-500' : 'bg-neutral-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                          isSpoiler ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Simple Sliders */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Zoom</label>
                      <span className="text-sm text-gray-500">{Math.round(zoom * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Rotate</label>
                      <span className="text-sm text-gray-500">{rotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="1"
                      value={rotation}
                      onChange={(e) => setRotation(Number(e.target.value))}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>

                {/* Invert Colors - Simple Toggle */}
                <label className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-primary cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Invert Colors</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isInverted}
                    onChange={handleInvert}
                    className="w-5 h-5 rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Simple Footer */}
            <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2 text-gray-700 border border-neutral-300 rounded-lg hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyCrop}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper
      ref={containerRef}
      className={`editable-image-wrapper ${selected ? 'selected' : ''}`}
      style={{
        display: 'block',
        margin: '1rem 0',
        position: 'relative', // Relative is OK for transform context, but ensure no float
        overflow: 'visible',
        float: 'none', // CRITICAL: No float
        clear: 'both', // CRITICAL: Clear floats
        width: '100%',
        minHeight: typeof imageSize.height === 'number' ? `${imageSize.height}px` : 'auto',
      }}
      onMouseDown={handleMouseDown}
    >
      <img
        ref={(el) => {
          imageRef.current = el
          // CRITICAL: Set style attribute on DOM element immediately when ref is set
          // This ensures TipTap can serialize it when getHTML() is called
          if (el) {
            const styleParts: string[] = []
            
            // Add transform if position is set
            if (position.x !== 0 || position.y !== 0) {
              styleParts.push(`transform: translate(${position.x}px, ${position.y}px)`)
              styleParts.push('position: relative')
            }
            
            // Preserve filter from node attributes if it exists
            if (node.attrs.style) {
              const filterMatch = (node.attrs.style as string).match(/filter:\s*[^;]+/)
              if (filterMatch) {
                styleParts.push(filterMatch[0])
              }
            }
            
            // Set the style attribute on the DOM element
            if (styleParts.length > 0) {
              el.setAttribute('style', styleParts.join('; '))
            } else if (el.hasAttribute('style') && !el.getAttribute('style')?.includes('filter:')) {
              el.removeAttribute('style')
            }
          }
        }}
        src={node.attrs.src || ''}
        alt={node.attrs.alt || ''}
        style={{
          width: typeof imageSize.width === 'number' ? `${imageSize.width}px` : imageSize.width,
          height: typeof imageSize.height === 'number' ? `${imageSize.height}px` : imageSize.height === 'auto' ? 'auto' : `${imageSize.height}px`,
          maxWidth: '100%',
          display: 'block',
          cursor: isDragging ? 'move' : isResizing ? 'nwse-resize' : selected ? 'pointer' : 'default',
          border: selected ? '2px solid #FF003D' : isSpoiler ? '2px solid #ef4444' : '2px solid transparent',
          borderRadius: '4px',
          userSelect: 'none',
          transform: (isDragging || position.x !== 0 || position.y !== 0) ? `translate(${position.x}px, ${position.y}px)` : undefined,
          position: (position.x !== 0 || position.y !== 0) ? 'relative' : 'static',
          transition: isDragging || isResizing ? 'none' : 'width 0.1s, height 0.1s, transform 0.1s, filter 0.2s',
          filter: isInverted ? 'invert(1)' : isSpoiler ? 'blur(8px)' : undefined,
          opacity: isSpoiler ? 0.7 : 1,
          zIndex: (isDragging || position.x !== 0 || position.y !== 0) ? 1 : 'auto',
        }}
        draggable={false}
        onDoubleClick={() => setIsEditing(true)}
        onError={(e) => {
          console.error('Image failed to load:', node.attrs.src)
        }}
      />
      {/* Visual indicator for censored image in editor */}
      {isSpoiler && !selected && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 'bold',
            zIndex: 5,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          HIDDEN
        </div>
      )}
      {selected && (
        <>
          {/* Quick Action Toolbar - Top Right */}
          <div
            style={{
              position: 'absolute',
              top: '-50px',
              right: '0',
              display: 'flex',
              gap: '8px',
              zIndex: 20,
              pointerEvents: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quick Censorship Toggle */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleSpoilerToggle()
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-lg ${
                isSpoiler
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
              title={isSpoiler ? 'Unhide image' : 'Hide/Censor image'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {isSpoiler ? 'Hidden' : 'Hide'}
            </button>
            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsEditing(true)
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-lg transition-all"
              title="Edit image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          </div>
          
          {/* Improved Corner Handles - Larger and Smoother */}
          {['nw', 'ne', 'se', 'sw'].map((handle) => {
            const positions: Record<string, { top?: string; bottom?: string; left?: string; right?: string; cursor: string }> = {
              nw: { top: '-10px', left: '-10px', cursor: 'nwse-resize' },
              ne: { top: '-10px', right: '-10px', cursor: 'nesw-resize' },
              se: { bottom: '-10px', right: '-10px', cursor: 'nwse-resize' },
              sw: { bottom: '-10px', left: '-10px', cursor: 'nesw-resize' },
            }
            const pos = positions[handle]
            return (
              <div
                key={handle}
                data-resize-handle={handle}
                style={{
                  position: 'absolute',
                  ...pos,
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#FF003D',
                  border: '3px solid white',
                  borderRadius: '50%',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,0,61,0.2)',
                  pointerEvents: 'auto',
                  transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.2)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4), 0 0 0 2px rgba(255,0,61,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,0,61,0.2)'
                }}
              />
            )
          })}
          
          {/* Improved Side Handles - Larger and Smoother */}
          {['n', 's', 'e', 'w'].map((handle) => {
            const positions: Record<string, { top?: string; bottom?: string; left?: string; right?: string; cursor: string; transform?: string }> = {
              n: { top: '-10px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
              s: { bottom: '-10px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
              e: { right: '-10px', top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
              w: { left: '-10px', top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
            }
            const pos = positions[handle]
            return (
              <div
                key={handle}
                data-resize-handle={handle}
                style={{
                  position: 'absolute',
                  ...pos,
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#FF003D',
                  border: '3px solid white',
                  borderRadius: '50%',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,0,61,0.2)',
                  pointerEvents: 'auto',
                  transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = (pos.transform || '') + ' scale(1.2)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4), 0 0 0 2px rgba(255,0,61,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = pos.transform || 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,0,61,0.2)'
                }}
              />
            )
          })}
        </>
      )}
    </NodeViewWrapper>
  )
}

export const EditableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => {
          const width = element.getAttribute('width') || element.style.width
          return width ? parseInt(width.toString().replace('px', '')) : null
        },
        renderHTML: (attributes) => {
          if (!attributes.width) return {}
          return { width: attributes.width }
        },
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const height = element.getAttribute('height') || element.style.height
          return height ? parseInt(height.toString().replace('px', '')) : null
        },
        renderHTML: (attributes) => {
          if (!attributes.height) return {}
          return { height: attributes.height }
        },
      },
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute('style'),
        renderHTML: (attributes) => {
          if (!attributes.style) return {}
          return { style: attributes.style }
        },
      },
      'data-spoiler': {
        default: null,
        parseHTML: (element) => {
          const attr = element.getAttribute('data-spoiler')
          // Return 'true' if attribute exists and is truthy, null otherwise
          return attr === 'true' || attr === '' ? 'true' : null
        },
        renderHTML: (attributes) => {
          // Only render if explicitly 'true' - this ensures proper serialization
          if (attributes['data-spoiler'] === 'true' || attributes['data-spoiler'] === true) {
            return { 'data-spoiler': 'true' }
          }
          return {}
        },
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(EditableImageComponent, {
      contentDOMElementTag: 'div',
    })
  },
})

