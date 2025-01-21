import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  maxRating?: number
  onRatingChange?: (rating: number) => void
  editable?: boolean
}

export function StarRating({ rating, maxRating = 5, onRatingChange, editable = false }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {[...Array(maxRating)].map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < rating ? "fill-primary stroke-primary" : "fill-muted stroke-muted-foreground"
          } ${editable ? "cursor-pointer" : ""}`}
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

