import { typeLabel, hasEarlyAccess } from '../format'

export function TypeBadge({ item }) {
  return (
    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
      {typeLabel(item)}
    </span>
  )
}

export function EarlyAccessBadge({ item }) {
  if (!hasEarlyAccess(item)) return null
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700 ring-1 ring-inset ring-green-200">
      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
      Early Access
    </span>
  )
}
