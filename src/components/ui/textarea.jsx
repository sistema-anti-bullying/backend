import * as React from "react"

const Textarea = React.forwardRef(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={`px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${className}`}
    {...props}
  />
))
Textarea.displayName = "Textarea"

export { Textarea }
