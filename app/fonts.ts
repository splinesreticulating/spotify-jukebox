import { Inter, Open_Sans } from "next/font/google"
import {
    Caesar_Dressing,
    Caveat,
    Chicle,
    Crafty_Girls,
    Damion,
    Delius_Swash_Caps,
    Gluten,
    Kranky,
    Lakki_Reddy,
    Love_Ya_Like_A_Sister,
    Nanum_Brush_Script,
    Nothing_You_Could_Do,
    Pacifico,
    Rubik_Glitch,
    Rubik_Iso,
    Rubik_Puddles,
    Rubik_Vinyl,
    Sunshiney,
    Unkempt,
} from "next/font/google"

export const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    preload: false,
    variable: "--font-inter",
})

export const openSans = Open_Sans({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap",
    preload: false,
    variable: "--font-open-sans",
})

export const rubikPuddles = Rubik_Puddles({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    preload: false,
    variable: "--font-rubik-puddles",
})

export const rubikIso = Rubik_Iso({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    preload: false,
    variable: "--font-rubik-iso",
})

export const rubikGlitch = Rubik_Glitch({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    preload: false,
    variable: "--font-rubik-glitch",
})

export const chicle = Chicle({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    preload: false,
    variable: "--font-chicle",
})

export const lakkiReddy = Lakki_Reddy({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    preload: false,
    variable: "--font-lakki-reddy",
})

export const unkempt = Unkempt({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap",
    preload: false,
    variable: "--font-unkempt",
})

export const kranky = Kranky({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    preload: false,
    variable: "--font-kranky",
})

export const loveYaLikeASister = Love_Ya_Like_A_Sister({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    preload: false,
    variable: "--font-love-ya-like-a-sister",
})

export const pacifico = Pacifico({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    preload: false,
    variable: "--font-pacifico",
})

export const damion = Damion({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    preload: false,
    variable: "--font-damion",
})

export const rubikVinyl = Rubik_Vinyl({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    preload: false,
    variable: "--font-rubik-vinyl",
})

export const craftyGirls = Crafty_Girls({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    preload: false,
    variable: "--font-crafty-girls",
})

export const deliusSwashCaps = Delius_Swash_Caps({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    preload: false,
    variable: "--font-delius-swash-caps",
})

export const caveat = Caveat({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    preload: false,
    variable: "--font-caveat",
})

export const nanumBrushScript = Nanum_Brush_Script({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    preload: false,
    variable: "--font-nanum-brush-script",
})

export const sunshiney = Sunshiney({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    preload: false,
    variable: "--font-sunshiney",
})

export const caesarDressing = Caesar_Dressing({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    preload: false,
    variable: "--font-caesar-dressing",
})

export const gluten = Gluten({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    preload: false,
    variable: "--font-gluten",
})

export const nothingYouCouldDo = Nothing_You_Could_Do({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
    preload: false,
    variable: "--font-nothing-you-could-do",
})

export const fontMap = {
    [rubikPuddles.className]: "Rubik Puddles",
    [rubikIso.className]: "Rubik Iso",
    [rubikGlitch.className]: "Rubik Glitch",
    [chicle.className]: "Chicle",
    [lakkiReddy.className]: "Lakki Reddy",
    [unkempt.className]: "Unkempt",
    [kranky.className]: "Kranky",
    [loveYaLikeASister.className]: "Love Ya Like A Sister",
    [pacifico.className]: "Pacifico",
    [damion.className]: "Damion",
    [rubikVinyl.className]: "Rubik Vinyl",
    [craftyGirls.className]: "Crafty Girls",
    [deliusSwashCaps.className]: "Delius Swash Caps",
    [caveat.className]: "Caveat",
    [nanumBrushScript.className]: "Nanum Brush Script",
    [sunshiney.className]: "Sunshiney",
    [caesarDressing.className]: "Caesar Dressing",
    [gluten.className]: "Gluten",
    [nothingYouCouldDo.className]: "Nothing You Could Do",
}
