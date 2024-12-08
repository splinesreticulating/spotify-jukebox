'use client'

import React, { useState, useEffect } from 'react'
import type { BPMFilterProps } from '@/app/lib/types'

const BPMFilter: React.FC<BPMFilterProps> = ({ initialValue }) => {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setChecked(params.has('bpmRef'))
  }, [])

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    setChecked(isChecked)

    const params = new URLSearchParams(window.location.search)

    if (isChecked && initialValue) {
      params.set('bpmRef', `${initialValue}`)
    } else {
      params.delete('bpmRef')
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, '', newUrl)
    window.location.reload() // Reload the page
  }

  return (
    <label className="flex items-center">
      <input type="checkbox" checked={checked} onChange={handleCheckboxChange} />
      <span className="ml-2">Similar BPM</span>
    </label>
  )
}

export default BPMFilter
