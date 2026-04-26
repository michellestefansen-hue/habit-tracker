import { subtractDays, dateKey, formatMinutes } from '../utils/date.js'

export function WeeklyInsightGraph({ logs, color }) {
  const days = Array.from({ length: 7 }).map((_, index) => {
    const date = subtractDays(6 - index)
    const key = dateKey(date)
    return { key, label: date.toLocaleDateString('en-US', { weekday: 'short' })[0], minutes: logs[key] || 0 }
  })
  const totalMinutes = days.reduce((sum, day) => sum + day.minutes, 0)
  const maxStep = Math.max(1, ...days.map((day) => Math.max(day.minutes, 10)))
  const avgMinutes = Math.round(totalMinutes / 7)

  return (
    <div className="weekly-insight">
      <div className="weekly-bar-row">
        {days.map((day) => {
          const height = day.minutes ? Math.max(20, (day.minutes / maxStep) * 84) : 10
          const isToday = day.key === dateKey()
          return (
            <div key={day.key} className="weekly-bar-cell">
              <div
                className={`weekly-bar ${isToday ? 'weekly-bar-today' : ''}`}
                style={{
                  height: `${Math.min(90, height)}px`,
                  background: day.minutes ? color : 'var(--surface-muted)',
                  opacity: day.minutes ? 1 : 0.3,
                }}
                title={`${day.label}: ${formatMinutes(day.minutes)}`}
              />
              <span className="weekly-bar-label">{day.label}</span>
            </div>
          )
        })}
      </div>
      <div className="weekly-summary">
        <div>
          <span className="meta-label">This week</span>
          <strong>{formatMinutes(totalMinutes)}</strong>
        </div>
        <div>
          <span className="meta-label">Avg / day</span>
          <strong>{formatMinutes(avgMinutes)}</strong>
        </div>
      </div>
    </div>
  )
}