import React, { useState, useEffect, type ReactElement, cloneElement } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil } from "lucide-react"

interface InlineEditProps<T> {
  value: T
  onSave: (value: T) => void
  children?: ReactElement
}

export function InlineEdit<T>({ value: initialValue, onSave, children }: InlineEditProps<T>) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState<T>(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleSave = () => {
    onSave(value)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setValue(initialValue)
    setIsEditing(false)
  }

  if (isEditing) {
    if (children) {
      return (
        <div className="space-y-2">
          {cloneElement(children, {
            rating: value as number,
            onRatingChange: setValue as (rating: number) => void,
            editable: true,
          })}
          <div className="flex justify-end space-x-2">
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )
    } else {
      return (
        <div className="space-y-2">
          <Input value={value as string} onChange={(e) => setValue(e.target.value as T)} className="w-full" />
          <div className="flex justify-end space-x-2">
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="flex items-center justify-between group">
      <span>{children ? children : (value as string)}</span>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  )
}

