import * as React from "react"
import { cn } from "../../lib/utils"
import { User } from "lucide-react"

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    initials?: string;
  }
>(({ className, initials, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  >
    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-gray-500">
      <User className="h-5 w-5" />
    </div>
  </div>
))
Avatar.displayName = "Avatar"

export { Avatar } 