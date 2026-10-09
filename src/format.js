// --- Field normalization & formatting helpers ---

export function getName(item) {
  return item.name || item.companyName || 'Unknown Company'
}

// subType is "mainboard" or "sme" -> normalized to 'mainboard' | 'sme'
export function getType(item) {
  const t = (item.subType || '').toLowerCase()
  return t === 'sme' ? 'sme' : 'mainboard'
}

export function typeLabel(item) {
  return getType(item) === 'sme' ? 'SME IPO' : 'Mainboard IPO'
}

export function hasEarlyAccess(item) {
  return !!(item.earlyAccess && String(item.earlyAccess).trim())
}

export function getLogo(item) {
  return item.companyIcon && item.companyIcon.trim() ? item.companyIcon : null
}

export function initials(name) {
  const words = String(name)
    .replace(/limited|ltd\.?|private|pvt\.?/gi, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  const first = words[0]?.[0] || ''
  const second = words[1]?.[0] || ''
  return (first + second).toUpperCase() || 'IPO'
}

// Format a date string "2026-10-13" -> "13 Oct 2026"
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export function fmtDate(d) {
  if (!d) return null
  const parts = String(d).split('-')
  if (parts.length !== 3) return d
  const [y, m, day] = parts
  const mi = parseInt(m, 10) - 1
  if (mi < 0 || mi > 11) return d
  return `${parseInt(day, 10)} ${MONTHS[mi]} ${y}`
}

export function biddingPeriod(item) {
  const start = fmtDate(item.bidStartDt)
  const end = fmtDate(item.bidEndDt)
  if (!start && !end) return 'To Be Announced'
  if (start && end) return `${start} - ${end}`
  return start || end
}

export function priceRange(item) {
  if (item.priceRange && item.priceRange.trim()) {
    // API gives "RS 258-271" -> prettify
    return item.priceRange.replace(/^RS\s*/i, '₹')
  }
  const lo = Number(item.lowLt) || 0
  const hi = Number(item.uppLt) || 0
  if (!lo && !hi) return 'To Be Announced'
  if (lo && hi) return `₹${lo} - ₹${hi}`
  return `₹${lo || hi}`
}

// Issue size in crores, from rupees
export function ipoSize(item) {
  const v = Number(item.ipoSize) || 0
  if (!v) return '₹0'
  const cr = v / 1e7
  if (cr >= 1) return `₹${cr >= 100 ? Math.round(cr) : cr.toFixed(2)} Cr`
  const lakh = v / 1e5
  return `₹${lakh.toFixed(2)} L`
}

export function subscription(item) {
  const sub = Number(item.totalSubscribed)
  if (sub && sub > 0) return `${sub.toFixed(2)}x`
  return 'Not Available'
}

export function money(v) {
  const n = Number(v) || 0
  return `₹${n.toLocaleString('en-IN')}`
}

// Listing gain % for performance bucket
export function listingGain(item) {
  const g = Number(item.listingdayRes)
  if (Number.isNaN(g)) return null
  return g
}
