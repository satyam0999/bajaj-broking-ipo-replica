export default function SignupBox() {
  return (
    <section className="mx-auto max-w-7xl px-4">
      <div className="my-6 flex flex-col items-center gap-4 rounded-2xl bg-blue-50 p-5 ring-1 ring-blue-100 md:flex-row md:justify-between md:p-6">
        <div className="flex items-center gap-4">
          <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white sm:flex">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2v20M2 12h20" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-navy">Open Free Demat Account</h3>
            <p className="text-sm text-slate-600">Start investing in IPOs, Stocks &amp; Mutual Funds in minutes.</p>
          </div>
        </div>
        <form
          className="flex w-full max-w-md gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-1 items-center overflow-hidden rounded-lg border border-slate-300 bg-white">
            <span className="px-3 text-sm font-medium text-slate-500">+91</span>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="Enter Mobile Number"
              className="w-full bg-transparent py-2.5 pr-3 text-sm focus:outline-none"
            />
          </div>
          <button className="shrink-0 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">
            Sign Up
          </button>
        </form>
      </div>
    </section>
  )
}
