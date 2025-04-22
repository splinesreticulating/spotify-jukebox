import React from 'react'

interface RadioButtonGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  options: Array<{ id: string; value: number; label: string }>
  error?: string
}

export const RadioButtonGroup = React.forwardRef<HTMLInputElement, RadioButtonGroupProps>(
  ({ label, options, error, onChange, value, ...props }, ref) => {
    return (
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.id} className="flex items-center">
              <input
                type="radio"
                id={option.id}
                value={option.value}
                checked={Number(value) === option.value}
                onChange={onChange}
                ref={ref}
                {...props}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={option.id} className="ml-2 text-sm text-gray-700">
                {option.label}
              </label>
            </div>
          ))}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  },
)

RadioButtonGroup.displayName = 'RadioButtonGroup'
