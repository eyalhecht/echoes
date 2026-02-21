import { cn } from "@/lib/utils"

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-5 h-5 border-2",
  lg: "w-8 h-8 border-[3px]",
}

function Spinner({ className, size = "sm", ...props }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "rounded-full animate-spin",
        "border-amber-200 dark:border-amber-800",
        "border-t-amber-600 dark:border-t-amber-400",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}

export { Spinner }
