// SquadStack Voice Agent — page <-> bot wiring.
//
// PAGE -> BOT (we send):
//   "ipo-page-loaded"  — current screen, sent on page load AND again the moment
//                        the WebRTC call connects (onCallStarted), so the bot
//                        always has the on-screen IPOs when the conversation starts.
//   "ipo-tab-switched" — sent when the user (or the bot) switches tab.
//
// BOT -> PAGE (we listen, via the SDK's "squadstack:agent-event" DOM event):
//   "switch-tab"       — bot navigates the page to a tab (renders that component).
//   "apply-filter"     — bot applies the All/MainBoard/SME filter.
//   "request-ipo-data" — bot asks for the current screen; we reply with it.

import {
  getName,
  getType,
  biddingPeriod,
  priceRange,
  ipoSize,
  slugify,
} from './format'

const DEBUG = true // logs each event to the console (guide's recommended verification aid)

// Exactly how Bajaj's site does it: always call sendPageEvent, unconditionally.
// The widget itself decides the transport — during a live call it rides the
// WebRTC/RTVI data channel. We don't gate on call state (an earlier gate using
// getConversationId() could wrongly suppress a real mid-call send). try/catch
// just stops a pre-call "bot not initialized" throw from bubbling into React.
function sendPageEvent(name, payload) {
  try {
    window.SquadStack?.sendPageEvent?.(name, payload)
    if (DEBUG) console.log('[SquadStack event] sent →', name, payload)
  } catch (e) {
    if (DEBUG) console.log('[SquadStack event] not delivered (start a call first) →', name, '·', e?.message)
  }
}

// "SME" | "Mainboard" (short form the bot prompt expects)
function typeShort(item) {
  return getType(item) === 'sme' ? 'SME' : 'Mainboard'
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

// Snapshot of whatever IPO screen is currently open. Kept up to date on every
// page/tab render so we can hand it to the bot the instant a call connects.
let currentView = null

export function notifyIPOView({ pageType, bucket, filter, items }) {
  const ipos = (items || []).map((it) => mapIpo(it, bucket))
  currentView = { pageType, filter, ipos }

  if (lastView === pageType) return // same tab already reported this view
  lastView = pageType

  if (!firstLoadDone) {
    firstLoadDone = true
    // Event 1 — Page load (delivered to the bot only if a call is already live;
    // otherwise harmlessly dropped — onCallStarted re-sends it on connect).
    sendPageEvent('ipo-page-loaded', { pageType, filter, ipos })
  } else {
    // Event 3 — Tab switch
    sendPageEvent('ipo-tab-switched', { tab: pageType, ipos })
  }
}

// --- Call connect: hand the bot the current screen -----------------------
// Fired by the widget (callbacks.onCallStarted) the moment the WebRTC call is
// live and the bot is ready — i.e. the first instant sendPageEvent is actually
// delivered. We resend the current screen as "ipo-page-loaded" so the bot opens
// the conversation already knowing which IPOs are on screen.
function handleCallStarted(conversationId) {
  if (DEBUG) console.log('[SquadStack] call connected →', conversationId, '· sending current screen')
  const v = currentView
  if (v) sendPageEvent('ipo-page-loaded', { pageType: v.pageType, filter: v.filter, ipos: v.ipos })
}

// --- Bot -> page control -------------------------------------------------
// The SDK dispatches a DOM CustomEvent ("squadstack:agent-event", and the
// legacy "conversationalagent:agent-event") whenever the bot wants the page to
// do something. We drive the real UI by clicking the matching tab/filter
// element (tagged with data-tab / data-filter), exactly as the guide suggests.
function handleAgentEvent(e) {
  const d = e?.detail || {}
  const eventName = d.eventName || d.name || d.type
  const payload = d.payload || d.data || {}
  if (DEBUG) console.log('[SquadStack] agent-event ←', eventName, payload)

  if (eventName === 'switch-tab' && payload.tab) {
    const el = document.querySelector(`[data-tab="${payload.tab}"]`)
    if (el) el.click()
    return
  }
  if (eventName === 'apply-filter' && payload.filter) {
    const el = document.querySelector(`[data-filter="${payload.filter}"]`)
    if (el) el.click()
    return
  }
  if (eventName === 'request-ipo-data') {
    const v = currentView
    if (v) sendPageEvent('ipo-data', { pageType: v.pageType, ipos: v.ipos })
  }
}

// Wire the bridge once. Called from <App> on mount.
let bridgeReady = false
export function initSquadStackBridge() {
  if (bridgeReady || typeof window === 'undefined') return
  bridgeReady = true
  // onCallStarted is invoked from the config callback in index.html.
  window.__ssOnCallStarted = handleCallStarted
  document.addEventListener('squadstack:agent-event', handleAgentEvent)
  document.addEventListener('conversationalagent:agent-event', handleAgentEvent)
  if (DEBUG) console.log('[SquadStack] bridge ready (onCallStarted + agent-event listeners)')
}
