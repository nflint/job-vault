"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  onRatingChange?: (rating: number) => void
  editable?: boolean
}

export function StarRating({ rating, maxRating = 5, onRatingChange, editable = false }: StarRatingProps) {
  return (
    <div className="star-rating">
      {[...Array(maxRating)].map((_, index) => (
        <Star
          key={index}
          className={cn(
            "star",
            index < rating ? "star--filled" : "star--empty",
            editable && "star--interactive"
          )}
          onClick={() => {
            if (editable && onRatingChange) {
              onRatingChange(index + 1)
            }
          }}
        />
      ))}
    </div>
  )
}

