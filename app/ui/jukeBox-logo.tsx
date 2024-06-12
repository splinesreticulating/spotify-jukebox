import { MusicalNoteIcon } from '@heroicons/react/24/outline'
import { openSans } from '@/app/ui/fonts'

export default function JukeBoxLogo() {
  return (
    <div
      className={`${openSans.className} flex flex-row items-center leading-none text-white`}
    >
      <MusicalNoteIcon className="h-20 w-20 rotate-[333deg]" />
      <p className="text-[33px]">Squirrel Radio</p>
    </div>
  )
}
