import * as React from "react"

const Card = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`bg-white rounded-lg shadow border border-gray-200 ${className}`} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className = "", ...props }, ref) => (
  <h2 ref={ref} className={`text-2xl font-bold ${className}`} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`px-6 py-4 ${className}`} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
