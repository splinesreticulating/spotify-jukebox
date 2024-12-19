'use client'

import React, { useState, useEffect } from 'react'
import type { NinetiesFilterProps } from '@/app/lib/types'

const NinetiesFilter: React.FC<NinetiesFilterProps> = ({ initialValue }) => {
  const [checked, setChecked] = useState(initialValue)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setChecked(params.has('nineties'))
  }, [])

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    setChecked(isChecked)

    const params = new URLSearchParams(window.location.search)

    if (isChecked) {
      params.set('nineties', 'true')
    } else {
      params.delete('nineties')
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, '', newUrl)
    window.location.reload() // Reload the page
  }

  return (
    <label className="flex items-center">
      <input type="checkbox" checked={checked} onChange={handleCheckboxChange} />
      <span className="ml-2">90s</span>
    </label>
  )
}

export default NinetiesFilter
