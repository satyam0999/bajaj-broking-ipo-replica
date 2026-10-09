import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchIPODetails } from '../api'
import { fmtDate, money } from '../format'
import { LoadingState, ErrorState } from '../components/States'

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-800">{value ?? '—'}</div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-navy">{title}</h2>
      {children}
    </section>
  )
}

function cr(v) {
  const n = Number(v)
  if (!n) return null
  return `₹${n >= 100 ? Math.round(n) : n.toFixed(2)} Cr`
}

export default function IPODetailPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    setStatus('loading')
    fetchIPODetails(id)
      .then((d) => {
        if (!alive) return
        setData(d)
        setStatus('ready')
        const nm = d?.compInfo?.compName
        if (nm) document.title = `${nm} IPO | Bajaj Broking`
      })
      .catch((e) => {
        if (!alive) return
        setError(e.message || 'Unknown error')
        setStatus('error')
      })
    return () => {
      alive = false
    }
  }, [id])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 bg-navy text-white shadow-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <Link to="/ipo/current-ipo" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-blue-700 font-extrabold">B</span>
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-wide">BAJAJ</div>
              <div className="-mt-1 text-[11px] font-semibold tracking-widest text-blue-200">BROKING</div>
            </div>
          </Link>
          <span className="ml-2 text-sm text-blue-200">IPO Details</span>
          <button
            onClick={() => window.close()}
            className="ml-auto rounded-full border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10"
          >
            Close Tab
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
        {status === 'loading' && <LoadingState />}
        {status === 'error' && <ErrorState message={error} onRetry={() => window.location.reload()} />}
        {status === 'ready' && data && <DetailBody d={data} />}
      </main>
    </div>
  )
}

function DetailBody({ d }) {
  const info = d.compInfo || {}
  const det = d.ipoDetails || {}
  const tent = d.tentTime || {}
  const shp = d.shp || {}
  const reser = d.ipoReser || {}
  const lots = Array.isArray(d.ipoLotSize) ? d.ipoLotSize : []
  const leads = Array.isArray(d.ipoLeadMgr) ? d.ipoLeadMgr : []
  const strengths = Array.isArray(d.strength) ? d.strength : []
  const risks = Array.isArray(d.risks) ? d.risks : []
  const promoters = Array.isArray(d.promoterNames) ? d.promoterNames : []
  const reg = d.ipoReg || {}
  const listing = d.listingDet || {}

  const type = (det.subType || '').toLowerCase() === 'sme' ? 'SME IPO' : 'Mainboard IPO'
  const priceBand =
    det.lowLt || det.uppLt ? `₹${det.lowLt || 0} - ₹${det.uppLt || 0}` : 'To Be Announced'

  const timeline = [
    ['Open Date', tent.startDt],
    ['Close Date', tent.endDt],
    ['Allotment', tent.allotDt],
    ['Refund Initiation', tent.ior],
    ['Credit of Shares', tent.credit],
    ['Listing Date', tent.listingDt || det.listDt],
  ]

  return (
    <>
      {/* Hero card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          {info.logo ? (
            <img
              src={info.logo}
              alt={info.compName}
              className="h-16 w-16 rounded-lg border border-slate-200 object-contain p-1"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          ) : null}
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold text-navy md:text-2xl">{info.compName || 'IPO'}</h1>
            <p className="mt-0.5 text-sm text-slate-500">{info.ind || '—'}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
                {type}
              </span>
              {det.earlyAccess ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700 ring-1 ring-inset ring-green-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Early Access
                </span>
              ) : null}
              {det.issuetype ? (
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                  {det.issuetype}
                </span>
              ) : null}
            </div>
          </div>
          <button className="ml-auto hidden shrink-0 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 md:block">
            Apply Now
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <Stat label="Price Band" value={priceBand} />
          <Stat label="Lot Size" value={det.lotSize ? `${det.lotSize} shares` : '—'} />
          <Stat label="Min Investment" value={det.minInv?.amt ? money(det.minInv.amt) : '—'} />
          <Stat label="Issue Size" value={cr(det.totalIssSize)} />
          <Stat label="Face Value" value={det.fv ? `₹${det.fv}` : '—'} />
          <Stat label="Listing At" value={(det.lisitingAt || []).join(', ') || '—'} />
          <Stat label="Fresh Issue" value={cr(det.freshIss) || '—'} />
          <Stat label="Offer for Sale" value={cr(det.ofSale) || '—'} />
        </div>
      </div>

      {/* Timeline */}
      <Section title="IPO Timeline">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {timeline.map(([label, val]) => (
            <Stat key={label} label={label} value={fmtDate(val) || 'TBA'} />
          ))}
        </div>
      </Section>

      {/* Lot size table */}
      {lots.length > 0 && (
        <Section title="Lot Size & Investment">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="py-2 pr-4 font-semibold">Application</th>
                  <th className="py-2 pr-4 font-semibold">Lots</th>
                  <th className="py-2 pr-4 font-semibold">Shares</th>
                  <th className="py-2 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lots.map((l, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="py-2 pr-4 font-medium text-slate-700">{l.application}</td>
                    <td className="py-2 pr-4">{l.lots}</td>
                    <td className="py-2 pr-4">{l.shares}</td>
                    <td className="py-2 font-semibold text-slate-800">{money(l.amt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Reservation + Shareholding */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Investor Reservation">
          <div className="grid grid-cols-2 gap-3">
            <Stat label="QIB" value={reser.qibPer != null ? `${reser.qibPer}%` : '—'} />
            <Stat label="NII (HNI)" value={reser.niiPer != null ? `${reser.niiPer}%` : '—'} />
            <Stat label="Retail" value={reser.rtPer != null ? `${reser.rtPer}%` : '—'} />
            <Stat label="Anchor" value={reser.ancInvShr != null ? `${reser.ancInvShr}%` : '—'} />
          </div>
        </Section>
        <Section title="Shareholding Pattern">
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Promoter (Pre)" value={shp.promGrp ? `${shp.promGrp.preIss}%` : '—'} />
            <Stat label="Promoter (Post)" value={shp.promGrp ? `${shp.promGrp.postIss}%` : '—'} />
            <Stat label="Public (Pre)" value={shp.publicGrp ? `${shp.publicGrp.preIss}%` : '—'} />
            <Stat label="Public (Post)" value={shp.publicGrp ? `${shp.publicGrp.postIss}%` : '—'} />
          </div>
        </Section>
      </div>

      {/* Strengths & Risks */}
      {(strengths.length > 0 || risks.length > 0) && (
        <div className="grid gap-5 lg:grid-cols-2">
          {strengths.length > 0 && (
            <Section title="Strengths">
              <ul className="space-y-2 text-sm text-slate-600">
                {strengths.map((s) => (
                  <li key={s.id} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                    {s.desc}
                  </li>
                ))}
              </ul>
            </Section>
          )}
          {risks.length > 0 && (
            <Section title="Risks">
              <ul className="space-y-2 text-sm text-slate-600">
                {risks.map((r) => (
                  <li key={r.id} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    {r.desc}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      )}

      {/* Lead managers / registrar / promoters */}
      <div className="grid gap-5 lg:grid-cols-3">
        {leads.length > 0 && (
          <Section title="Lead Managers">
            <ul className="space-y-1.5 text-sm text-slate-600">
              {leads.map((l) => (
                <li key={l.id}>{l.name}</li>
              ))}
            </ul>
          </Section>
        )}
        {reg.name && (
          <Section title="Registrar">
            <div className="space-y-1 text-sm text-slate-600">
              <div className="font-medium text-slate-800">{reg.name}</div>
              {reg.phNo && <div>{reg.phNo}</div>}
              {reg.email && <div className="break-all">{reg.email}</div>}
              {reg.url && (
                <a href={reg.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                  {reg.url}
                </a>
              )}
              {listing.isin && listing.isin !== '' && (
                <div className="pt-1 text-xs text-slate-400">ISIN: {listing.isin}</div>
              )}
            </div>
          </Section>
        )}
        {promoters.length > 0 && (
          <Section title="Promoters">
            <ul className="space-y-1.5 text-sm text-slate-600">
              {promoters.slice(0, 10).map((p, i) => (
                <li key={i}>{p.promoterName}</li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      <p className="pb-6 text-center text-xs text-slate-400">
        Demo page · data fetched live from the Bajaj public IPO Details API.
      </p>
    </>
  )
}
