'use client'

import React, { useState, useEffect } from 'react'

interface MaybeFilterProps {
  initialValue: string | undefined
}

const MaybeFilter: React.FC<MaybeFilterProps> = ({ initialValue }) => {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setChecked(params.has('keyRef'))
  }, [])

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    setChecked(isChecked)

    const params = new URLSearchParams(window.location.search)
    
    if (isChecked) {
      params.set('keyRef', initialValue || 'undefined')
    } else {
      params.delete('keyRef')
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, '', newUrl)
    window.location.reload() // Reload the page
  }

  return (
    <label className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
      />
      <span className="ml-2">Maybe</span>
    </label>
  )
}

export default MaybeFilter
