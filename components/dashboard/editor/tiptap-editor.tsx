'use client'

import * as React from 'react'

import { EditorToolbar } from '@/components/dashboard/editor/editor-toolbar'
import { inputVariants } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Underline from '@tiptap/extension-underline'
import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export interface TiptapEditorProps {
  className?: string
  themeColor?: string
  editor?: Editor | null
  value?: string
  onChange?: (value: string) => void
  premium?: boolean
  children?: React.ReactNode
}

export function TiptapEditor({ value, onChange, premium = true, themeColor, className }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        listItem: {
          HTMLAttributes: {
            class: 'list-item list-disc',
          },
        },
        heading: {
          HTMLAttributes: {
            levels: [1, 2, 3],
          },
        },
        hardBreak: {
          keepMarks: false,
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      Underline,
      Link.configure({
        HTMLAttributes: {
          class: 'underline text-blue-500',
        },
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        isAllowedUri: (url, ctx) => {
          try {
            return true
          } catch (error) {
            return false
          }
        },
        shouldAutoLink: (url) => {
          try {
            return true
          } catch (error) {
            return false
          }
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'min-h-[50px] h-full overflow-y-auto border-none rounded-t-none p-2',
      },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getHTML())
    },
  })

  return (
    <div
      className={cn(
        inputVariants(),
        'tiptap focus:ring-primary/35 flex h-full flex-col justify-stretch overflow-hidden rounded-lg border px-0 py-0 focus:ring-[1px]',
        className,
      )}
      style={
        {
          '--theme-color': themeColor,
        } as React.CSSProperties
      }
    >
      <EditorToolbar editor={editor} premium={premium} />
      <EditorContent editor={editor} className="tiptap" />
    </div>
  )
}
