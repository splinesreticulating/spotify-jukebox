export interface ShowSchedule {
    id: number
    show_name: string
    rules: ShowRule[]
    level_lock?: number
    genre_lock?: string
    roboticness_lock?: number
    year_min?: number
    year_max?: number
}

export interface ShowRule {
    days?: number[]
    start_time: string
    end_time: string
}
