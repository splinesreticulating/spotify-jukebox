import { useState } from 'react'

interface TimeOffDropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
}

export function TimeOffDropdown({ label, className = '', ...props }: TimeOffDropdownProps) {
  const options = [
    ['12 hours', 12],
    ['1 day', 24],
    ['2 days', 48],
    ['3 days', 72],
    ['4 days', 96],
    ['5 days', 120],
    ['1 week', 168],
    ['2 weeks', 336],
    ['3 weeks', 504],
    ['1 month', 730],
    ['2 months', 1460],
    ['3 months', 2190],
    ['4 months', 2920],
    ['5 months', 3650],
    ['6 months', 4368],
    ['1 year', 8760],
    ['longer...', 9999],
  ].map(([label, value]) => ({ label, value }))

  return (
    <div>
      <label htmlFor={props.id || props.name} className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        {...props}
        className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 ${className}`}
      >
        <option value="">Select time off</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
