import { KVInitializer } from '@/components/KVInitializer'
import type { Datasheet } from '@/lib/types'

export function DatasheetsInitializer() {
  return (
    <KVInitializer<Datasheet[]>
      kvKey="datasheets"
      initialData={[]}
    />
  )
}
