export type State = {
    message: string
}

export interface SongQueryParams {
    query: string
    levelsArray: string[]
    instrumental?: string
    keyMatch?: string
    keyCompatible?: string
    bpmRef?: string
    eighties?: boolean
    nineties?: boolean
    lastYear?: boolean
    thisYear?: boolean
    playable?: boolean
}

export type SongSelectFields = {
    [key: string]: boolean
}
