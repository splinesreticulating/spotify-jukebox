'use client'
import React, { useState, useEffect } from 'react'
import type { ThisYearFilterProps } from '@/app/lib/types'

const currentYear = new Date().getFullYear()

const ThisYearFilter: React.FC<ThisYearFilterProps> = ({ initialValue }) => {
  const [checked, setChecked] = useState(initialValue)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setChecked(params.has('thisYear'))
  }, [])

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    setChecked(isChecked)

    const params = new URLSearchParams(window.location.search)

    if (isChecked) {
      params.set('thisYear', 'true')
    } else {
      params.delete('thisYear')
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, '', newUrl)
    window.location.reload()
  }

  return (
    <label className="flex items-center">
      <input type="checkbox" checked={checked} onChange={handleCheckboxChange} />
      <span className="ml-2">{currentYear}</span>
    </label>
  )
}

export default ThisYearFilter
