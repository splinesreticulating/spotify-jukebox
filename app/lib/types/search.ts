import { Song } from './songs'

export interface SearchState {
  query: string
  page: number
  filters: SearchFilters
}

export interface SearchFilters {
  levels: string[]
  instrumental: string | null
  keyRef: string | null
  bpmRef: string | null
  eighties: boolean
  nineties: boolean
  thisYear: boolean
}

export interface SearchResponse {
  songs: Song[]
  totalPages: number
  currentPage: number
}

export interface SearchError {
  message: string
  code: string
}
