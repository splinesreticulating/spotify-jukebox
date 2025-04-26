import type { Theme } from "./ThemeContext"

type ThemeElement =
    | "background"
    | "logo"
    | "button"
    | "nav"
    | "pagination"
    | "level-filter"

type NavConfig = {
    base: string
    active: string
}

type PaginationConfig = {
    active: string
    hover: string
}

type LevelFilterConfig = {
    selected: string
    unselected: string
}

interface ThemeClassConfig {
    background: string
    logo: string
    button: string
    nav: NavConfig
    pagination: PaginationConfig
    "level-filter": LevelFilterConfig
}

const themeClasses: Record<Theme, ThemeClassConfig> = {
    ocean: {
        background: "bg-ocean-background",
        logo: "bg-ocean-primary",
        button: "bg-ocean-background hover:bg-ocean-accent hover:text-ocean-primary",
        nav: {
            base: "bg-ocean-background hover:bg-ocean-accent hover:text-ocean-primary",
            active: "bg-ocean-accent text-ocean-primary",
        },
        pagination: {
            active: "bg-ocean-primary text-white",
            hover: "hover:bg-ocean-accent hover:text-ocean-primary",
        },
        "level-filter": {
            selected: "bg-ocean-primary text-white",
            unselected: "bg-white text-ocean-primary border-ocean-primary",
        },
    },
    forest: {
        background: "bg-forest-background",
        logo: "bg-forest-primary",
        button: "bg-forest-background hover:bg-forest-accent hover:text-forest-primary",
        nav: {
            base: "bg-forest-background hover:bg-forest-accent hover:text-forest-primary",
            active: "bg-forest-accent text-forest-primary",
        },
        pagination: {
            active: "bg-forest-primary text-white",
            hover: "hover:bg-forest-accent hover:text-forest-primary",
        },
        "level-filter": {
            selected: "bg-forest-primary text-white",
            unselected: "bg-white text-forest-primary border-forest-primary",
        },
    },
    sunset: {
        background: "bg-sunset-background",
        logo: "bg-sunset-primary",
        button: "bg-sunset-background hover:bg-sunset-accent hover:text-sunset-primary",
        nav: {
            base: "bg-sunset-background hover:bg-sunset-accent hover:text-sunset-primary",
            active: "bg-sunset-accent text-sunset-primary",
        },
        pagination: {
            active: "bg-sunset-primary text-white",
            hover: "hover:bg-sunset-accent hover:text-sunset-primary",
        },
        "level-filter": {
            selected: "bg-sunset-primary text-white",
            unselected: "bg-white text-sunset-primary border-sunset-primary",
        },
    },
    purple: {
        background: "bg-purple-background",
        logo: "bg-purple-primary",
        button: "bg-purple-background hover:bg-purple-accent hover:text-purple-primary",
        nav: {
            base: "bg-purple-background hover:bg-purple-accent hover:text-purple-primary",
            active: "bg-purple-accent text-purple-primary",
        },
        pagination: {
            active: "bg-purple-primary text-white",
            hover: "hover:bg-purple-accent hover:text-purple-primary",
        },
        "level-filter": {
            selected: "bg-purple-primary text-white",
            unselected: "bg-white text-purple-primary border-purple-primary",
        },
    },
    midnight: {
        background: "bg-midnight-background",
        logo: "bg-midnight-primary",
        button: "bg-midnight-background hover:bg-midnight-accent hover:text-midnight-primary",
        nav: {
            base: "bg-midnight-background hover:bg-midnight-accent hover:text-midnight-primary",
            active: "bg-midnight-accent text-midnight-primary",
        },
        pagination: {
            active: "bg-midnight-primary text-white",
            hover: "hover:bg-midnight-accent hover:text-midnight-primary",
        },
        "level-filter": {
            selected: "bg-midnight-primary text-white",
            unselected:
                "bg-white text-midnight-primary border-midnight-primary",
        },
    },
    christmas: {
        background: "bg-christmas-background",
        logo: "bg-christmas-primary",
        button: "bg-christmas-background hover:bg-christmas-accent hover:text-christmas-primary",
        nav: {
            base: "bg-christmas-background hover:bg-christmas-accent hover:text-christmas-primary",
            active: "bg-christmas-accent text-christmas-primary",
        },
        pagination: {
            active: "bg-christmas-primary text-white",
            hover: "hover:bg-christmas-accent hover:text-christmas-primary",
        },
        "level-filter": {
            selected: "bg-christmas-primary text-white",
            unselected:
                "bg-white text-christmas-primary border-christmas-primary",
        },
    },
}

type ElementVariant<T extends ThemeElement> = T extends "nav"
    ? keyof NavConfig
    : T extends "pagination"
      ? keyof PaginationConfig
      : T extends "level-filter"
        ? keyof LevelFilterConfig
        : never

export function getThemeClasses<T extends ThemeElement>(
    theme: Theme,
    element: T,
    variant?: T extends "nav" | "pagination" | "level-filter"
        ? ElementVariant<T>
        : never,
): string {
    const config = themeClasses[theme]

    if (!config) {
        console.error(`Theme ${theme} not found`)
        return ""
    }

    const elementConfig = config[element]

    if (!elementConfig) {
        console.error(`Element ${element} not found for theme ${theme}`)
        return ""
    }

    if (typeof elementConfig === "string") {
        return elementConfig
    }

    if (variant && typeof elementConfig === "object") {
        return (elementConfig as Record<string, string>)[variant] || ""
    }

    return ""
}
