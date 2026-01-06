'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { EditableImage } from './EditableImage'
import { Video } from './Video'
import TextStyle from '@tiptap/extension-text-style'
// Color extension - inline implementation since package might not be installed
import { Extension } from '@tiptap/core'

const Color = Extension.create({
  name: 'color',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          color: {
            default: null,
            parseHTML: (element) => element.style.color || null,
            renderHTML: (attributes) => {
              if (!attributes.color) {
                return {}
              }
              return {
                style: `color: ${attributes.color}`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setColor:
        (color: string) =>
        ({ chain }: any) => {
          return chain().setMark('textStyle', { color }).run()
        },
      unsetColor:
        () =>
        ({ chain }: any) => {
          return chain().setMark('textStyle', { color: null }).removeEmptyTextStyle().run()
        },
    } as any
  },
})
import { FontSize } from './FontSize'
import { useEffect, useState, useRef } from 'react'

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const [fontSize, setFontSize] = useState('16')
  const [fontColor, setFontColor] = useState('#111111')
  const [fontFamily, setFontFamily] = useState('Inter')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontSize,
      EditableImage.configure({
        inline: true,
        allowBase64: true,
      }),
      Video.configure({
        allowBase64: true,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // CRITICAL: Before getting HTML, ensure all image styles are synced to DOM
      // ReactNodeViewRenderer serializes from actual DOM, so styles must be on elements
      if (typeof window !== 'undefined') {
        const editorElement = editor.view.dom as HTMLElement
        const images = editorElement.querySelectorAll('img')
        images.forEach((img) => {
          const imgElement = img as HTMLImageElement
          // Get the computed transform from React inline styles
          const computedStyle = window.getComputedStyle(imgElement)
          const transform = computedStyle.transform
          const position = computedStyle.position
          
          // If there's a transform, ensure it's in the style attribute
          if (transform && transform !== 'none' && position === 'relative') {
            // Extract translate values - transform might be matrix() or translate()
            // We need to preserve the actual transform value
            let styleString = imgElement.getAttribute('style') || ''
            
            // Check if transform is already in style attribute
            if (!styleString.includes('transform:')) {
              // Get the actual transform value from computed style
              // If it's a matrix, we need to extract translate values
              // For now, use the computed transform directly
              if (styleString) {
                styleString = `${styleString}; transform: ${transform}; position: relative`
              } else {
                styleString = `transform: ${transform}; position: relative`
              }
              imgElement.setAttribute('style', styleString)
            } else {
              // Ensure position is relative
              if (!styleString.includes('position:')) {
                styleString = `${styleString}; position: relative`
                imgElement.setAttribute('style', styleString)
              }
            }
          }
        })
      }
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
        style: 'user-select: text; -webkit-user-select: text;',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files?.[0]) {
          const file = event.dataTransfer.files[0]
          
          // Handle image files (including GIFs)
          if (file.type.startsWith('image/')) {
            event.preventDefault()
            const reader = new FileReader()
            reader.onload = (e) => {
              const src = e.target?.result as string
              if (src && editor) {
                try {
                  editor.chain().focus().setImage({ src }).run()
                } catch (error) {
                  console.error('Error inserting image:', error)
                }
              }
            }
            reader.onerror = () => console.error('Error reading image file')
            reader.readAsDataURL(file)
            return true
          }
          
          // Handle video files
          if (file.type.startsWith('video/')) {
            event.preventDefault()
            const reader = new FileReader()
            reader.onload = (e) => {
              const src = e.target?.result as string
              if (src && editor) {
                try {
                  ;(editor.chain().focus() as any).setVideo({ src }).run()
                } catch (error) {
                  console.error('Error inserting video:', error)
                }
              }
            }
            reader.onerror = () => console.error('Error reading video file')
            reader.readAsDataURL(file)
            return true
          }
        }
        return false
      },
      handlePaste: (view, event, slice) => {
        const items = Array.from(event.clipboardData?.items || [])
        for (const item of items) {
          // Handle images (including GIFs)
          if (item.type.startsWith('image/')) {
            event.preventDefault()
            const file = item.getAsFile()
            if (file && editor) {
              const reader = new FileReader()
              reader.onload = (e) => {
                const src = e.target?.result as string
                if (src && editor) {
                  try {
                    editor.chain().focus().setImage({ src }).run()
                  } catch (error) {
                    console.error('Error pasting image:', error)
                  }
                }
              }
              reader.onerror = () => console.error('Error reading pasted image')
              reader.readAsDataURL(file)
              return true
            }
          }
          // Handle videos
          if (item.type.startsWith('video/')) {
            event.preventDefault()
            const file = item.getAsFile()
            if (file && editor) {
              const reader = new FileReader()
              reader.onload = (e) => {
                const src = e.target?.result as string
                if (src && editor) {
                  try {
                    ;(editor.chain().focus() as any).setVideo({ src }).run()
                  } catch (error) {
                    console.error('Error pasting video:', error)
                  }
                }
              }
              reader.onerror = () => console.error('Error reading pasted video')
              reader.readAsDataURL(file)
              return true
            }
          }
        }
        return false
      },
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  // Apply heading styles
  useEffect(() => {
    if (editor) {
      const style = document.createElement('style')
      style.textContent = `
        .ProseMirror h1 {
          font-size: 24pt !important;
          color: #FF003D !important;
          font-weight: bold;
        }
        .ProseMirror h2 {
          font-size: 20pt !important;
          color: #FF003D !important;
          font-weight: bold;
        }
        .ProseMirror h3 {
          font-size: 18pt !important;
          color: #FF003D !important;
          font-weight: bold;
        }
      `
      document.head.appendChild(style)
      return () => {
        document.head.removeChild(style)
      }
    }
  }, [editor])

  if (!editor) {
    return null
  }

  const fontSizes = ['10', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48']
  const colors = [
    { name: 'Black', value: '#111111' },
    { name: 'Red', value: '#FF003D' },
    { name: 'Blue', value: '#0066CC' },
    { name: 'Green', value: '#00AA44' },
    { name: 'Gray', value: '#666666' },
  ]
  const fonts = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times', value: 'Times New Roman, serif' },
    { name: 'Courier', value: 'Courier New, monospace' },
  ]

  return (
    <div className="border-none">
      {/* Simplified Toolbar */}
      <div className="flex items-center justify-between gap-2 p-2 border-b border-neutral-200 mb-4 bg-neutral-50 rounded-t-lg overflow-x-auto">
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Font Family */}
          <div className="flex items-center gap-1">
            <label className="text-xs text-text-muted whitespace-nowrap">Font:</label>
            <select
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(e.target.value)
                editor.chain().focus().setMark('textStyle', { fontFamily: e.target.value }).run()
              }}
              className="px-1.5 py-1 text-xs border border-neutral-200 rounded bg-white focus:outline-none focus:border-primary"
            >
              {fonts.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-px h-5 bg-neutral-300"></div>

          {/* Font Size */}
          <div className="flex items-center gap-1">
            <label className="text-xs text-text-muted whitespace-nowrap">Size:</label>
            <select
              value={fontSize}
              onChange={(e) => {
                setFontSize(e.target.value)
                ;(editor.chain().focus() as any).setFontSize(`${e.target.value}pt`).run()
              }}
              className="px-1.5 py-1 text-xs border border-neutral-200 rounded bg-white focus:outline-none focus:border-primary"
            >
              {fontSizes.map((size) => (
                <option key={size} value={size}>
                  {size}pt
                </option>
              ))}
            </select>
          </div>

          <div className="w-px h-5 bg-neutral-300"></div>

          {/* Font Color */}
          <div className="flex items-center gap-1">
            <label className="text-xs text-text-muted whitespace-nowrap">Color:</label>
            <input
              type="color"
              value={fontColor}
              onChange={(e) => {
                setFontColor(e.target.value)
                ;(editor.chain().focus() as any).setColor(e.target.value).run()
              }}
              className="w-7 h-7 border border-neutral-200 rounded cursor-pointer"
              title="Text Color"
            />
            <select
              value={fontColor}
              onChange={(e) => {
                setFontColor(e.target.value)
                ;(editor.chain().focus() as any).setColor(e.target.value).run()
              }}
              className="px-1.5 py-1 text-xs border border-neutral-200 rounded bg-white focus:outline-none focus:border-primary"
            >
              {colors.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-px h-5 bg-neutral-300"></div>

          {/* Upload Media Button */}
          <button
            type="button"
            onClick={() => {
              if (!editor) {
                alert('Editor is not ready. Please wait a moment and try again.')
                return
              }
              fileInputRef.current?.click()
            }}
            disabled={!editor}
            className="p-1.5 rounded hover:bg-neutral-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="Upload Media (Images, GIFs, Videos)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              
              if (!editor) {
                alert('Editor is not ready. Please wait a moment and try again.')
                e.target.value = ''
                return
              }

              const reader = new FileReader()
              reader.onload = (event) => {
                const src = event.target?.result as string
                if (src && editor) {
                  try {
                    if (file.type.startsWith('image/')) {
                      editor.chain().focus().setImage({ src }).run()
                    } else if (file.type.startsWith('video/')) {
                      ;(editor.chain().focus() as any).setVideo({ src }).run()
                    }
                  } catch (error) {
                    console.error('Error inserting media:', error)
                    alert('Failed to insert media. Please try again.')
                  }
                }
              }
              reader.onerror = () => {
                console.error('Error reading file')
                alert('Failed to read file. Please try again.')
              }
              reader.readAsDataURL(file)
              // Reset input
              e.target.value = ''
            }}
          />

          <div className="w-px h-5 bg-neutral-300"></div>

          {/* Bold, Italic, Underline */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-1.5 rounded hover:bg-neutral-200 font-bold text-sm ${
              editor.isActive('bold') ? 'bg-primary/10 text-primary' : ''
            }`}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded hover:bg-neutral-200 italic text-sm ${
              editor.isActive('italic') ? 'bg-primary/10 text-primary' : ''
            }`}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded hover:bg-neutral-200 underline text-sm ${
              editor.isActive('underline') ? 'bg-primary/10 text-primary' : ''
            }`}
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </button>

          <div className="w-px h-5 bg-neutral-300"></div>

          {/* Title buttons - automatically apply 24pt and red */}
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 1 }).run()
              // Apply red color to heading
              setTimeout(() => {
                ;(editor.chain().focus() as any).setColor('#FF003D').run()
              }, 10)
            }}
            className={`px-2 py-1.5 rounded hover:bg-neutral-200 font-bold text-xs whitespace-nowrap ${
              editor.isActive('heading', { level: 1 }) ? 'bg-primary/10 text-primary' : ''
            }`}
            title="Title (24pt, Red)"
          >
            Title
          </button>
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 2 }).run()
              setTimeout(() => {
                ;(editor.chain().focus() as any).setColor('#FF003D').run()
              }, 10)
            }}
            className={`px-2 py-1.5 rounded hover:bg-neutral-200 font-bold text-xs whitespace-nowrap ${
              editor.isActive('heading', { level: 2 }) ? 'bg-primary/10 text-primary' : ''
            }`}
            title="Subtitle (20pt, Red)"
          >
            Subtitle
          </button>
        </div>

        {/* Alignment - moved to the right */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <label className="text-xs text-text-muted whitespace-nowrap">Align:</label>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-1.5 rounded hover:bg-neutral-200 ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-primary/10 text-primary' : ''
            }`}
            title="Align Left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h8" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-1.5 rounded hover:bg-neutral-200 ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-primary/10 text-primary' : ''
            }`}
            title="Align Center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h8M4 18h16" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-1.5 rounded hover:bg-neutral-200 ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-primary/10 text-primary' : ''
            }`}
            title="Align Right"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M12 18h8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[400px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
