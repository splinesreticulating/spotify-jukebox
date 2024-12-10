import Search from '@/app/ui/search'
import { LevelFilters } from '@/app/lib/components/LevelFilters'
import InstrumentalFilter from '@/app/ui/components/InstrumentalFilter'
import KeyFilter from '@/app/ui/components/KeyFilter'
import BPMFilter from '@/app/ui/components/BPMFilter'
import EightiesFilter from '@/app/ui/components/EightiesFilter'
import NinetiesFilter from '@/app/ui/components/NinetiesFilter'
import ThisYearFilter from '@/app/ui/components/ThisYearFilter'

type SearchFiltersProps = {
  initialValues: Record<string, string>
  nowPlayingKey?: string
  nowPlayingBPM?: number
}

export default function SearchFilters({ initialValues, nowPlayingKey, nowPlayingBPM }: SearchFiltersProps) {
  return (
    <>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="title, artist, key, year, genre" />
      </div>
      <div className="flex items-center justify-between gap-2 pt-5">
        <div>
          <LevelFilters levels={initialValues.levels || ''} />
        </div>
        <div>
          <InstrumentalFilter initialValue={Number(initialValues.instrumental) || 0} />
          <KeyFilter initialValue={nowPlayingKey} />
          <BPMFilter initialValue={nowPlayingBPM} />
          <EightiesFilter initialValue={Boolean(initialValues.eighties)} />
          <NinetiesFilter initialValue={Boolean(initialValues.nineties)} />
          <ThisYearFilter initialValue={Boolean(initialValues.thisYear)} />
        </div>
      </div>
    </>
  )
}
