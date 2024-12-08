'use client'

import React, { useState } from 'react'
import type { InstrumentalFilterProps } from '@/app/lib/types'

const InstrumentalFilter: React.FC<InstrumentalFilterProps> = ({ initialValue }) => {
  const [checked, setChecked] = useState(initialValue >= 90)

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    setChecked(isChecked)

    const params = new URLSearchParams(window.location.search)
    if (isChecked) {
      params.set('instrumental', '90')
    } else {
      params.delete('instrumental')
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, '', newUrl)
    window.location.reload() // Reload the page
  }

  return (
    <label className="flex items-center">
      <input type="checkbox" checked={checked} onChange={handleCheckboxChange} />
      <span className="ml-2">Instrumental</span>
    </label>
  )
}

export default InstrumentalFilter
