export function LoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 rounded bg-slate-200" />
              <div className="h-3 w-24 rounded bg-slate-100" />
            </div>
            <div className="hidden gap-8 md:flex">
              <div className="h-8 w-24 rounded bg-slate-100" />
              <div className="h-8 w-24 rounded bg-slate-100" />
            </div>
            <div className="h-9 w-28 rounded-lg bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="font-bold text-red-800">Couldn't load IPO data</h3>
      <p className="mt-1 text-sm text-red-600">{message || 'Something went wrong while fetching from the Bajaj API.'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ label }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 17H7A5 5 0 0 1 7 7h1m6 10h2a5 5 0 0 0 0-10h-1M8 12h8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="font-semibold text-slate-700">No {label} found</h3>
      <p className="mt-1 text-sm text-slate-500">Try a different filter or check back later.</p>
    </div>
  )
}
