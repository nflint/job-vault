"use client"

import { useState, useRef, useEffect, ReactNode } from "react"
import { Input } from "@/components/ui/input"

interface InlineEditProps {
  value: string | number
  onSave: (value: string) => void
  children?: ReactNode
}

/**
 *
 * @param root0
 * @param root0.value
 * @param root0.onSave
 * @param root0.children
 */
export function InlineEdit({ value, onSave, children }: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value.toString())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  /**
   *
   * @param e
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false)
      onSave(editValue)
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setEditValue(value.toString())
    }
  }

  /**
   *
   */
  const handleBlur = () => {
    setIsEditing(false)
    setEditValue(value.toString())
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="w-full"
      />
    )
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:bg-accent hover:text-accent-foreground p-1 rounded"
    >
      {children || value}
    </div>
  )
}

