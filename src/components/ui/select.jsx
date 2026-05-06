import * as React from "react"

const Select = ({ children, onValueChange, value, ...props }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

const SelectTrigger = React.forwardRef(({ className = "", ...props }, ref) => (
  <button ref={ref} className={`w-full px-3 py-2 border border-gray-300 rounded ${className}`} {...props} />
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder }) => <span>{placeholder}</span>

const SelectContent = ({ children }) => <div>{children}</div>

const SelectItem = ({ value, children }) => <option value={value}>{children}</option>

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
