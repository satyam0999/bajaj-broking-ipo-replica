import { NavLink } from 'react-router-dom'

const TABS = [
  { label: 'Current IPOs', to: '/ipo/current-ipo' },
  { label: 'Upcoming IPOs', to: '/ipo/upcoming-ipo' },
  { label: 'Closed IPOs', to: '/ipo/closed-ipo' },
  { label: 'IPO Performance', to: '/ipo/ipo-performance' },
]

export default function Tabs() {
  return (
    <div className="border-b border-slate-200">
      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `relative whitespace-nowrap px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {t.label}
                {isActive && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-blue-600" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
