interface RadioOption {
  id: string
  value: number
  label: string
}

interface RadioButtonGroupProps {
  options: RadioOption[]
  name: string
  value?: number
  onChange?: (value: number) => void
}

export function RadioButtonGroup({ options, value, name, onChange }: RadioButtonGroupProps) {
  const handleChange = (newValue: number) => {
    onChange?.(newValue)
  }

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const isChecked = value === option.value

        return (
          <div key={`${name}-${option.id}`} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option.id}`}
              name={name}
              value={option.value}
              checked={isChecked}
              onChange={() => handleChange(option.value)}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label htmlFor={`${name}-${option.id}`} className="ml-2 text-sm font-medium text-gray-900">
              {option.label}
            </label>
          </div>
        )
      })}
    </div>
  )
}
