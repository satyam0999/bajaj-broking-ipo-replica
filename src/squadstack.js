// SquadStack Voice Agent — page -> bot events.
// Per the integration guide we only implement two events here:
//   Event 1: "ipo-page-loaded"  (first IPO list page load)
//   Event 3: "ipo-tab-switched" (user switches Current/Upcoming/Closed/Performance tab)
//
// Both are fire-and-forget. window.SquadStack?.sendPageEvent is optional-chained,
// so these are zero-crash no-ops when the widget bundle isn't loaded.

import {
  getName,
  getType,
  biddingPeriod,
  priceRange,
  ipoSize,
} from './format'

const DEBUG = true // logs each event to the console (guide's recommended verification aid)

function sendPageEvent(name, payload) {
  if (DEBUG) console.log('[SquadStack event]', name, payload)
  window.SquadStack?.sendPageEvent?.(name, payload)
}

// "SME" | "Mainboard" (short form the bot prompt expects)
function typeShort(item) {
  return getType(item) === 'sme' ? 'SME' : 'Mainboard'
}

// "fusion-klassroom-edutech-limited-ipo"
function slugify(item) {
  const base = getName(item)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base ? `${base}-ipo` : 'ipo'
}

// A human-readable status per bucket, refined with bid dates where we can.
function statusFor(item, bucket) {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  switch (bucket) {
    case 'current': {
      if (item.bidEndDt && item.bidEndDt === today) return 'Closing today'
      if (item.bidStartDt && item.bidStartDt > today) return 'Opening soon'
      return 'Active'
    }
    case 'upcoming':
      return 'Opening soon'
    case 'closed':
      return item.listedDt ? 'Listed' : 'Closed'
    case 'performance':
      return 'Listed'
    default:
      return ''
  }
}

// Map one API record -> the event IPO shape from the guide:
// { name, bidding, priceRange, size, status, type, slug }
export function mapIpo(item, bucket) {
  return {
    name: getName(item),
    bidding: biddingPeriod(item),
    priceRange: priceRange(item),
    size: ipoSize(item),
    status: statusFor(item, bucket),
    type: typeShort(item),
    slug: slugify(item),
  }
}

// --- Fire logic ----------------------------------------------------------
// Each tab is its own client-side route that remounts IPOPage, so a tab
// switch looks like a fresh render. We fire "ipo-page-loaded" for the very
// first list view and "ipo-tab-switched" for every subsequent tab view.
let firstLoadDone = false
let lastView = null // dedupes StrictMode double-mounts / re-renders of the same tab

export function notifyIPOView({ pageType, bucket, filter, items }) {
  if (lastView === pageType) return // same tab already reported this view
  lastView = pageType

  const ipos = (items || []).map((it) => mapIpo(it, bucket))

  if (!firstLoadDone) {
    firstLoadDone = true
    // Event 1 — Page load
    sendPageEvent('ipo-page-loaded', { pageType, filter, ipos })
  } else {
    // Event 3 — Tab switch
    sendPageEvent('ipo-tab-switched', { tab: pageType, ipos })
  }
}
