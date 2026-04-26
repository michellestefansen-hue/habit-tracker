export function pad2(value) {
  return String(value).padStart(2, '0')
}

export function dateKey(date = new Date()) {
  const d = new Date(date)
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export function weekKey(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const offset = (day + 6) % 7
  d.setDate(d.getDate() - offset)
  return dateKey(d)
}

export function subtractDays(count) {
  const d = new Date()
  d.setDate(d.getDate() - count)
  return d
}

export function formatMinutes(total) {
  if (!total) return '—'
  if (total < 60) return `${total}m`
  const hours = Math.floor(total / 60)
  const remainder = total % 60
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`
}

export function formatTimer(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainder = seconds % 60
  if (hours > 0) return `${hours}:${pad2(minutes)}:${pad2(remainder)}`
  return `${pad2(minutes)}:${pad2(remainder)}`
}