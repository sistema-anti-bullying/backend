import * as React from "react"

const Checkbox = React.forwardRef(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    className={`w-4 h-4 border border-gray-300 rounded ${className}`}
    {...props}
  />
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
