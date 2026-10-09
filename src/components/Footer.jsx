const COLS = [
  { title: 'Products', links: ['Stocks', 'IPO', 'Mutual Funds', 'F&O', 'Commodities'] },
  { title: 'Company', links: ['About Us', 'Pricing', 'Careers', 'Contact Us', 'Blog'] },
  { title: 'Resources', links: ['Market Updates', 'Research', 'Stock Screener', 'Help & Support'] },
  { title: 'Legal', links: ['Terms & Conditions', 'Privacy Policy', 'Disclaimer', 'Investor Charter'] },
]

export default function Footer() {
  return (
    <footer className="mt-auto bg-navy text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-blue-700 font-extrabold text-white">B</span>
              <div className="leading-tight text-white">
                <div className="text-sm font-extrabold">BAJAJ</div>
                <div className="-mt-1 text-[11px] font-semibold tracking-widest text-blue-200">BROKING</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Invest in IPOs, Stocks &amp; Mutual Funds with a Bajaj Broking Demat account.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <h4 className="mb-3 text-sm font-semibold text-white">{c.title}</h4>
              <ul className="space-y-2 text-sm">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-blue-300">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-white/10 pt-5 text-xs text-slate-400">
          <p>
            This is a non-commercial demo UI built for testing. Not affiliated with Bajaj Broking.
            IPO data is fetched live from a public Bajaj API for demonstration only.
          </p>
          <p className="mt-2">© {`2026`} Bajaj Broking Replica · Demo</p>
        </div>
      </div>
    </footer>
  )
}
