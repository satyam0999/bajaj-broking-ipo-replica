import { useState } from 'react'

const NAV = ['Products', 'Pricing', 'Markets', 'IPO', 'Research', 'Partners', 'Support']

function Icon({ path, className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 bg-navy text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-blue-700 font-extrabold">B</span>
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-wide">BAJAJ</div>
            <div className="-mt-1 text-[11px] font-semibold tracking-widest text-blue-200">BROKING</div>
          </div>
        </a>

        {/* Search */}
        <div className="relative hidden flex-1 md:block max-w-md">
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            path={<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>}
          />
          <input
            type="text"
            placeholder="Search across Bajaj Broking"
            className="w-full rounded-full border border-white/10 bg-white/95 py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Nav */}
        <nav className="ml-auto hidden items-center gap-5 text-sm font-medium lg:flex">
          {NAV.map((n) => (
            <a
              key={n}
              href="#"
              className={`transition hover:text-blue-300 ${n === 'IPO' ? 'text-blue-300' : 'text-slate-100'}`}
            >
              {n}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2 lg:ml-4">
          <button className="hidden items-center gap-1.5 text-sm font-medium text-slate-100 hover:text-blue-300 sm:flex">
            <Icon className="h-5 w-5" path={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>} />
            Login
          </button>
          <button className="hidden rounded-full border border-white/20 px-3 py-1.5 text-sm font-medium hover:bg-white/10 md:block">
            Stock Screener
          </button>
          <button className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold hover:bg-blue-500">
            Open Demat
          </button>
          <button className="hidden rounded-full border border-white/20 px-3 py-1.5 text-sm font-medium hover:bg-white/10 xl:block">
            Download App
          </button>
          <button className="lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            <Icon path={<><path d="M4 6h16M4 12h16M4 18h16" /></>} />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="border-t border-white/10 px-4 py-3 lg:hidden">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {NAV.map((n) => (
              <a key={n} href="#" className={n === 'IPO' ? 'text-blue-300' : 'text-slate-100'}>
                {n}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
