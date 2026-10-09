const CHIPS = [
  { key: 'all', label: 'All' },
  { key: 'mainboard', label: 'MainBoard' },
  { key: 'sme', label: 'SME' },
]

export default function FilterChips({ value, onChange, counts }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CHIPS.map((c) => {
        const active = value === c.key
        const count = counts?.[c.key]
        return (
          <button
            key={c.key}
            onClick={() => onChange(c.key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              active
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-slate-300 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600'
            }`}
          >
            {c.label}
            {typeof count === 'number' && (
              <span className={`ml-1.5 text-xs ${active ? 'text-blue-100' : 'text-slate-400'}`}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
