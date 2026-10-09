import Avatar from './Avatar'
import { TypeBadge, EarlyAccessBadge } from './Badges'
import {
  getName,
  biddingPeriod,
  priceRange,
  ipoSize,
  fmtDate,
  subscription,
  money,
  listingGain,
} from '../format'

function Col({ label, value, valueClass = '' }) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className={`mt-0.5 truncate text-sm font-semibold text-slate-800 ${valueClass}`}>
        {value}
      </div>
    </div>
  )
}

function CTA({ label, variant = 'primary' }) {
  const styles =
    variant === 'ghost'
      ? 'border border-blue-600 text-blue-600 hover:bg-blue-50'
      : 'bg-blue-600 text-white hover:bg-blue-500'
  return (
    <button className={`w-full rounded-lg px-4 py-2 text-sm font-semibold transition md:w-auto ${styles}`}>
      {label}
    </button>
  )
}

function columnsFor(item, tab) {
  switch (tab) {
    case 'current':
      return {
        cols: [
          { label: 'Bidding Period', value: biddingPeriod(item) },
          { label: 'Price Range', value: priceRange(item) },
          { label: 'IPO Size', value: ipoSize(item) },
        ],
        cta: <CTA label="Apply Now" />,
      }
    case 'upcoming':
      return {
        cols: [
          { label: 'Bidding Period', value: biddingPeriod(item) },
          { label: 'Price Range', value: priceRange(item) },
          { label: 'IPO Size', value: ipoSize(item) },
        ],
        cta: <CTA label="View More" variant="ghost" />,
      }
    case 'closed': {
      const hasAllotment = !!item.allotDt
      return {
        cols: [
          { label: 'Subscription', value: subscription(item) },
          { label: 'Allotment Date', value: fmtDate(item.allotDt) || 'TBA' },
          { label: 'Listing Date', value: fmtDate(item.listedDt) || 'TBA' },
        ],
        cta: hasAllotment ? (
          <CTA label="View Allotment" variant="ghost" />
        ) : (
          <CTA label="Invest Now" />
        ),
      }
    }
    case 'performance': {
      const gain = listingGain(item)
      const up = gain != null && gain >= 0
      return {
        cols: [
          { label: 'Issue Price', value: money(item.issuePrice) },
          {
            label: 'Listing Day Close',
            value: (
              <span>
                {money(item.listingdayClose)}
                {gain != null && (
                  <span className={`ml-1.5 text-xs font-bold ${up ? 'text-green-600' : 'text-red-600'}`}>
                    {up ? '+' : ''}
                    {gain.toFixed(2)}%
                  </span>
                )}
              </span>
            ),
          },
        ],
        cta: <CTA label="Invest Now" />,
      }
    }
    default:
      return { cols: [], cta: null }
  }
}

function openDetails(item) {
  if (item.id == null) return
  // Open the IPO detail page in a NEW browser tab.
  window.open(`/ipo/detail/${item.id}`, '_blank', 'noopener,noreferrer')
}

export default function IPOCard({ item, tab }) {
  const { cols, cta } = columnsFor(item, tab)
  const gridCols = cols.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'
  const clickable = item.id != null

  return (
    <div
      onClick={() => openDetails(item)}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          openDetails(item)
        }
      }}
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md md:p-5 ${
        clickable ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Identity */}
        <div className="flex items-start gap-3 md:w-72 md:shrink-0">
          <Avatar item={item} />
          <div className="min-w-0">
            <h3 className="truncate font-bold text-navy hover:text-blue-600" title={getName(item)}>
              {getName(item)}
            </h3>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <TypeBadge item={item} />
              <EarlyAccessBadge item={item} />
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className={`grid flex-1 grid-cols-2 gap-4 ${gridCols}`}>
          {cols.map((c, i) => (
            <Col key={i} label={c.label} value={c.value} />
          ))}
        </div>

        {/* CTA — also opens the detail tab */}
        <div className="md:w-36 md:shrink-0 md:text-right" onClick={(e) => { e.stopPropagation(); openDetails(item) }}>
          {cta}
        </div>
      </div>
    </div>
  )
}
