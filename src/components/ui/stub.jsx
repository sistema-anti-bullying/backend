// Stub UI components - create basic versions
export const Button = ({ children, className, ...props }) => (
  <button className={`px-4 py-2 bg-blue-600 text-white rounded ${className || ''}`} {...props}>
    {children}
  </button>
)

export const Input = ({ className, ...props }) => (
  <input className={`px-3 py-2 border border-gray-300 rounded ${className || ''}`} {...props} />
)

export const Label = ({ children, className, ...props }) => (
  <label className={`block text-sm font-medium mb-1 ${className || ''}`} {...props}>
    {children}
  </label>
)

export const Card = ({ children, className, ...props }) => (
  <div className={`bg-white rounded-lg shadow ${className || ''}`} {...props}>
    {children}
  </div>
)

export const CardHeader = ({ children, className, ...props }) => (
  <div className={`px-6 py-4 border-b ${className || ''}`} {...props}>
    {children}
  </div>
)

export const CardTitle = ({ children, className, ...props }) => (
  <h2 className={`text-2xl font-bold ${className || ''}`} {...props}>
    {children}
  </h2>
)

export const CardContent = ({ children, className, ...props }) => (
  <div className={`px-6 py-4 ${className || ''}`} {...props}>
    {children}
  </div>
)
