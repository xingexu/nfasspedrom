import React, { useState, useEffect } from 'react'
import Image from '@tiptap/extension-image'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'

const ResizableImageComponent = ({ node, updateAttributes, selected, editor }: NodeViewProps) => {
  const [isResizing, setIsResizing] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    setStartX(e.clientX)
    setStartWidth(node.attrs.width || 500)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return
    const diff = e.clientX - startX
    const newWidth = Math.max(100, Math.min(1200, startWidth + diff))
    updateAttributes({ width: newWidth })
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing, startX, startWidth])

  return (
    <NodeViewWrapper
      className={`resizable-image-wrapper ${selected ? 'selected' : ''}`}
      style={{ display: 'inline-block', margin: '1rem auto', position: 'relative' }}
    >
      <img
        src={node.attrs.src}
        alt={node.attrs.alt || ''}
        style={{
          width: node.attrs.width ? `${node.attrs.width}px` : 'auto',
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          cursor: isResizing ? 'col-resize' : 'pointer',
          border: selected ? '2px solid #ef4444' : '2px solid transparent',
          borderRadius: '4px',
        }}
        draggable={false}
      />
      {selected && (
        <div
          className="resize-handle"
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            right: '-8px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
            backgroundColor: '#ef4444',
            border: '2px solid white',
            borderRadius: '50%',
            cursor: 'col-resize',
            zIndex: 10,
          }}
        />
      )}
    </NodeViewWrapper>
  )
}

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute('width'),
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {}
          }
          return {
            width: attributes.width,
          }
        },
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent)
  },
})


