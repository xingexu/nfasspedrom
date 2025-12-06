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
  const [position, setPosition] = useState({ x: 0, y: 0 })
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
  }, [node.attrs.width, node.attrs.height, node.attrs.style])

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
      setResizeHandle(handleType)
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && resizeHandle) {
        const diffX = e.clientX - resizeStart.x
        const diffY = e.clientY - resizeStart.y
        
        let newWidth = resizeStart.width
        let newHeight = resizeStart.height
        
        // Handle different resize directions
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
        
        // Get current position from image
        const currentLeft = imageRect.left - editorRect.left
        const currentTop = imageRect.top - editorRect.top
        
        // Calculate new position
        let newX = currentLeft + deltaX
        let newY = currentTop + deltaY
        
        // Constrain to editor bounds (accounting for image size)
        const maxX = editorRect.width - imageRect.width
        const maxY = editorRect.height - imageRect.height
        
        newX = Math.max(0, Math.min(maxX, newX))
        newY = Math.max(0, Math.min(maxY, newY))
        
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
        // Save position as style attribute so it persists
        if (position.x !== 0 || position.y !== 0) {
          updateAttributes({ 
            style: `transform: translate(${position.x}px, ${position.y}px); position: relative;` 
          })
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Edit Image</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-neutral-200 rounded hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  onClick={applyCrop}
                  className="px-4 py-2 bg-primary text-white rounded hover:opacity-90"
                >
                  Apply
                </button>
              </div>
            </div>
            <div className="relative w-full h-96 bg-neutral-100 rounded mb-4">
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Zoom: {Math.round(zoom * 100)}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Rotation: {rotation}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full"
                />
              </div>
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
        display: 'inline-block',
        margin: '1rem auto',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseDown={handleMouseDown}
    >
      <img
        ref={imageRef}
        src={node.attrs.src}
        alt={node.attrs.alt || ''}
        style={{
          width: typeof imageSize.width === 'number' ? `${imageSize.width}px` : imageSize.width,
          height: typeof imageSize.height === 'number' ? `${imageSize.height}px` : imageSize.height === 'auto' ? 'auto' : `${imageSize.height}px`,
          maxWidth: '100%',
          display: 'block',
          cursor: isDragging ? 'move' : isResizing ? 'nwse-resize' : selected ? 'pointer' : 'default',
          border: selected ? '2px solid #FF003D' : '2px solid transparent',
          borderRadius: '4px',
          userSelect: 'none',
          transform: isDragging ? `translate(${position.x}px, ${position.y}px)` : undefined,
          transition: isDragging || isResizing ? 'none' : 'width 0.1s, height 0.1s',
          filter: isInverted ? 'invert(1)' : undefined,
        }}
        draggable={false}
        onDoubleClick={() => setIsEditing(true)}
      />
      {selected && (
        <>
          {/* Corner handles */}
          <div
            data-resize-handle="nw"
            style={{
              position: 'absolute',
              top: '-8px',
              left: '-8px',
              width: '16px',
              height: '16px',
              backgroundColor: '#FF003D',
              border: '2px solid white',
              borderRadius: '50%',
              cursor: 'nwse-resize',
              zIndex: 10,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              pointerEvents: 'auto',
            }}
          />
          <div
            data-resize-handle="ne"
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '16px',
              height: '16px',
              backgroundColor: '#FF003D',
              border: '2px solid white',
              borderRadius: '50%',
              cursor: 'nesw-resize',
              zIndex: 10,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              pointerEvents: 'auto',
            }}
          />
          <div
            data-resize-handle="se"
            style={{
              position: 'absolute',
              bottom: '-8px',
              right: '-8px',
              width: '16px',
              height: '16px',
              backgroundColor: '#FF003D',
              border: '2px solid white',
              borderRadius: '50%',
              cursor: 'nwse-resize',
              zIndex: 10,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              pointerEvents: 'auto',
            }}
          />
          <div
            data-resize-handle="sw"
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '-8px',
              width: '16px',
              height: '16px',
              backgroundColor: '#FF003D',
              border: '2px solid white',
              borderRadius: '50%',
              cursor: 'nesw-resize',
              zIndex: 10,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              pointerEvents: 'auto',
            }}
          />
          
          {/* Side handles */}
          <div
            data-resize-handle="n"
            style={{
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '16px',
              height: '16px',
              backgroundColor: '#FF003D',
              border: '2px solid white',
              borderRadius: '50%',
              cursor: 'ns-resize',
              zIndex: 10,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              pointerEvents: 'auto',
            }}
          />
          <div
            data-resize-handle="s"
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '16px',
              height: '16px',
              backgroundColor: '#FF003D',
              border: '2px solid white',
              borderRadius: '50%',
              cursor: 'ns-resize',
              zIndex: 10,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              pointerEvents: 'auto',
            }}
          />
          <div
            data-resize-handle="e"
            style={{
              position: 'absolute',
              right: '-8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              backgroundColor: '#FF003D',
              border: '2px solid white',
              borderRadius: '50%',
              cursor: 'ew-resize',
              zIndex: 10,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              pointerEvents: 'auto',
            }}
          />
          <div
            data-resize-handle="w"
            style={{
              position: 'absolute',
              left: '-8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              backgroundColor: '#FF003D',
              border: '2px solid white',
              borderRadius: '50%',
              cursor: 'ew-resize',
              zIndex: 10,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              pointerEvents: 'auto',
            }}
          />
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
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(EditableImageComponent, {
      contentDOMElementTag: 'div',
    })
  },
})
