export type State = {
  message: string
}

export type SongQueryParams = {
  query: string
  levelsArray: string[]
  instrumentalness: number | undefined
  keyRef?: string
  bpmRef?: string
  eighties?: boolean
  nineties?: boolean
  thisYear?: boolean
}

export type SongSelectFields = {
  [key: string]: boolean
}
