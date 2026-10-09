import { useEffect, useMemo, useState } from 'react'
import Hero from '../components/Hero'
import SignupBox from '../components/SignupBox'
import Tabs from '../components/Tabs'
import FilterChips from '../components/FilterChips'
import IPOCard from '../components/IPOCard'
import { LoadingState, ErrorState, EmptyState } from '../components/States'
import { useIPO } from '../IPOContext'
import { getType } from '../format'
import { notifyIPOView } from '../squadstack'

export default function IPOPage({ tab, bucket, title, blurb, heading, emptyLabel }) {
  const { buckets, status, error, reload } = useIPO()
  const [filter, setFilter] = useState('all')

  const list = (buckets && buckets[bucket]) || []

  const counts = useMemo(
    () => ({
      all: list.length,
      mainboard: list.filter((i) => getType(i) === 'mainboard').length,
      sme: list.filter((i) => getType(i) === 'sme').length,
    }),
    [list]
  )

  const filtered = useMemo(
    () => (filter === 'all' ? list : list.filter((i) => getType(i) === filter)),
    [list, filter]
  )

  // SquadStack voice agent: fire "ipo-page-loaded" (first view) /
  // "ipo-tab-switched" (subsequent tabs) once the list for this tab is ready.
  useEffect(() => {
    if (status !== 'ready') return
    notifyIPOView({ pageType: tab, bucket, filter, items: list })
    // Intentionally keyed on tab + readiness only — filter changes don't refire
    // (the guide's ipo-filter-changed event is out of scope here).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, tab, bucket])

  return (
    <>
      <Hero title={title} blurb={blurb} />
      <SignupBox />

      <main className="mx-auto max-w-7xl px-4 pb-16">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy md:text-xl">Explore Other IPOs</h2>
          </div>

          <Tabs />

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <FilterChips value={filter} onChange={setFilter} counts={counts} />
            </div>

            {status === 'loading' && <LoadingState />}
            {status === 'error' && <ErrorState message={error} onRetry={reload} />}
            {status === 'ready' && filtered.length === 0 && <EmptyState label={emptyLabel} />}
            {status === 'ready' && filtered.length > 0 && (
              <div className="space-y-3">
                {filtered.map((item, i) => (
                  <IPOCard key={item.id ?? i} item={item} tab={tab} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
