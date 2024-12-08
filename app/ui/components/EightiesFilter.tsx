'use client'

import React, { useState, useEffect } from 'react'
import type { EightiesFilterProps } from '@/app/lib/types'

const EightiesFilter: React.FC<EightiesFilterProps> = ({ initialValue }) => {
  const [checked, setChecked] = useState(initialValue)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setChecked(params.has('eighties'))
  }, [])

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    setChecked(isChecked)

    const params = new URLSearchParams(window.location.search)

    if (isChecked) {
      params.set('eighties', 'true')
    } else {
      params.delete('eighties')
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, '', newUrl)
    window.location.reload() // Reload the page
  }

  return (
    <label className="flex items-center">
      <input type="checkbox" checked={checked} onChange={handleCheckboxChange} />
      <span className="ml-2">80's</span>
    </label>
  )
}

export default EightiesFilter
