import { useState } from 'react'
import { getLogo, getName, initials } from '../format'

const COLORS = ['#0b5fff', '#0a1f44', '#1a73e8', '#5b2bd9', '#0f766e', '#b45309', '#be123c']

export default function Avatar({ item }) {
  const [broken, setBroken] = useState(false)
  const name = getName(item)
  const logo = getLogo(item)
  const color = COLORS[(name.charCodeAt(0) + name.length) % COLORS.length]

  if (logo && !broken) {
    return (
      <div className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden">
        <img
          src={logo}
          alt={name}
          loading="lazy"
          onError={() => setBroken(true)}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    )
  }

  return (
    <div
      className="h-12 w-12 shrink-0 rounded-lg flex items-center justify-center text-white font-bold text-sm"
      style={{ backgroundColor: color }}
    >
      {initials(name)}
    </div>
  )
}
