export type SearchResultsProps = {
    searchParams: {
        query?: string
        page?: string
        levels?: string
        instrumental?: string
        keyMatch?: string
        bpmRef?: string
        eighties?: string
        nineties?: string
        thisYear?: string
        totalPages: number
    }
}

export interface TimeOffDropdownProps
    extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value"> {
    label: string
    value?: number | null
}

export type CardType =
    | "artists"
    | "songs"
    | "moments"
    | "incoming"
    | "unprocessed"

export interface CardProps {
    title: string
    value: number | string
    type: CardType
    children?: React.ReactNode
}

export interface InputFieldProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    className?: string
}

export interface SongsTableProps {
    query: string
    currentPage: number
    levels: string
    instrumental: number
    keyMatch: string
    keyCompatible: string
    bpmRef: string
    eighties?: boolean
    nineties?: boolean
    lastYear?: boolean
    thisYear?: boolean
}
