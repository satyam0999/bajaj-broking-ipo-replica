const API_URL = 'https://www.bajajfinservsecurities.in/api/portals/Scrip/IPOList'
const DETAIL_URL = 'https://www.bajajfinservsecurities.in/api/portals/Ipo/IpoDetails'

// Fetch full details for a single IPO by its numeric id.
export async function fetchIPODetails(id) {
  const res = await fetch(`${DETAIL_URL}?ipoId=${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: { accept: 'application/json, text/plain, */*' },
  })
  if (!res.ok) throw new Error(`Details request failed (${res.status})`)
  const json = await res.json()
  if (json.statusCode !== 0) throw new Error(json.message || 'API returned an error')
  return json.data || {}
}

// The API returns ALL records in a single response (sum of buckets == totalcount),
// so limit/offset are effectively ignored. We still loop defensively: fetch pages
// until the total number of records collected reaches data.totalcount.
export async function fetchIPOList() {
  const limit = 100
  let offset = 1
  const buckets = {
    upcoming: [],
    current: [],
    closed: [],
    listed: [],
    performance: [],
  }
  const seen = { upcoming: new Set(), current: new Set(), closed: new Set(), listed: new Set(), performance: new Set() }
  let totalcount = Infinity
  let guard = 0

  const countAll = () =>
    Object.values(buckets).reduce((n, arr) => n + arr.length, 0)

  while (countAll() < totalcount && guard < 25) {
    guard++
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ipoType: 'a', limit, offset }),
    })
    if (!res.ok) throw new Error(`API request failed (${res.status})`)
    const json = await res.json()
    if (json.statusCode !== 0) throw new Error(json.message || 'API returned an error')

    const data = json.data || {}
    totalcount = typeof data.totalcount === 'number' ? data.totalcount : countAll()
    const ipoRes = (data.ipoRes && data.ipoRes[0]) || {}

    let addedThisPage = 0
    for (const key of Object.keys(buckets)) {
      const list = Array.isArray(ipoRes[key]) ? ipoRes[key] : []
      for (const item of list) {
        const uid = item.id ?? `${item.name || item.companyName}-${item.bidStartDt || ''}`
        if (!seen[key].has(uid)) {
          seen[key].add(uid)
          buckets[key].push(item)
          addedThisPage++
        }
      }
    }

    offset++
    // If a page added nothing new, the API isn't paginating — stop.
    if (addedThisPage === 0) break
  }

  return { buckets, totalcount }
}
