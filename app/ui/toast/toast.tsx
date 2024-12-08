'use client'

import { createContext, useContext, useState } from 'react'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/16/solid'
import { Toast, ToastType } from '@/app/lib/types'

interface ToastContextType {
  toast: (message: string, type: ToastType) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [activeToast, setActiveToast] = useState<Toast | null>(null)

  const toast = (message: string, type: ToastType) => {
    setActiveToast({ message, type })
    setTimeout(() => setActiveToast(null), 3000)
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {activeToast && (
        <div className="animate-fade-in fixed bottom-4 right-4 z-50">
          <div
            className={`rounded-lg p-4 shadow-lg ${
              activeToast.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            <div className="flex items-center">
              {activeToast.type === 'success' ? (
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-400" />
              )}
              <span className="ml-2">{activeToast.message}</span>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
