export type ToastType = 'success' | 'error'

export type Toast = {
  message: string
  type: ToastType
}

export type Theme = 'ocean' | 'forest' | 'sunset' | 'purple' | 'midnight'

export type SearchResultsProps = {
  searchParams: {
    query?: string
    page?: string
    levels?: string
    instrumental?: string
    keyRef?: string
    bpmRef?: string
    eighties?: string
    nineties?: string
    totalPages: number
  }
}

export interface TimeOffDropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
}

export type CardType = 'songs' | 'artists'

export interface CardProps {
  title: string
  value: number | string
  type: CardType
}

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  className?: string
}

export interface SongsTableProps {
  query: string
  currentPage: number
  levels: string
  instrumental: number
  keyRef?: string
  bpmRef?: string
  eighties?: boolean
  nineties?: boolean
}

// Filter Components
export interface KeyFilterProps {
  initialValue: string | undefined
}

export interface BPMFilterProps {
  initialValue: number | undefined
}

export interface EightiesFilterProps {
  initialValue: boolean
}

export interface NinetiesFilterProps {
  initialValue: boolean
}

export interface InstrumentalFilterProps {
  initialValue: number
}
