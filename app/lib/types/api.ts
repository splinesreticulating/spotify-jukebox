export type State = {
  message: string
}

export interface SongQueryParams {
  query: string
  levelsArray: string[]
  instrumental?: string
  keyRef?: string
  bpmRef?: string
  eighties?: boolean
  nineties?: boolean
  thisYear?: boolean
}

export type SongSelectFields = {
  [key: string]: boolean
}
