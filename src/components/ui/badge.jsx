import * as React from "react"

const Badge = ({ className = "", children, ...props }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 ${className}`} {...props}>
    {children}
  </span>
)

export { Badge }
