'use client'

import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import React from 'react'

interface VideoComponentProps {
  node: any
  updateAttributes: (attrs: any) => void
  selected: boolean
}

const VideoComponent = ({ node, selected }: VideoComponentProps) => {
  return (
    <NodeViewWrapper
      className={`video-wrapper ${selected ? 'selected' : ''}`}
      style={{
        display: 'block',
        margin: '1rem auto',
        position: 'relative',
        maxWidth: '100%',
      }}
    >
      <video
        src={node.attrs.src}
        controls
        style={{
          width: node.attrs.width ? `${node.attrs.width}px` : '100%',
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          border: selected ? '2px solid #FF003D' : '2px solid transparent',
          borderRadius: '4px',
        }}
      />
    </NodeViewWrapper>
  )
}

export const Video = Node.create({
  name: 'video',

  addOptions() {
    return {
      inline: false,
      allowBase64: true,
      HTMLAttributes: {},
    }
  },

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      ...this.parent?.(),
    }
  },

  parseHTML() {
    return [
      {
        tag: 'video[src]',
        getAttrs: (element) => {
          if (typeof element === 'string') return false
          return {
            src: element.getAttribute('src'),
            width: element.getAttribute('width'),
            height: element.getAttribute('height'),
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', { controls: '', ...HTMLAttributes }]
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoComponent)
  },

  addCommands() {
    return {
      setVideo: (options: { src: string; width?: number; height?: number }) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },
})
