import { dateKey, formatMinutes, formatTimer } from '../utils/date.js'
import { SWATCHES } from '../constants/colors.js'
import { WeeklyInsightGraph } from './WeeklyInsightGraph.jsx'

export function ActivityCard({ activity, activityLogs, isRunning, now, onStart, onStop, onDelete }) {
  const today = dateKey()
  const todayMinutes = activityLogs[today] || 0
  const totalMinutes = Object.values(activityLogs).reduce((sum, value) => sum + value, 0)
  const swatch = SWATCHES.find((swatch) => swatch.id === activity.color) ?? SWATCHES[0]
  const elapsedSeconds = isRunning ? Math.max(0, Math.floor((now - activity.timerStart) / 1000)) : 0
  const formattedElapsed = isRunning ? formatTimer(elapsedSeconds) : '00:00'

  return (
    <article className={`activity-card ${isRunning ? 'timer-active' : ''}`} style={{ borderColor: isRunning ? swatch.heat : 'var(--border)' }}>
      <div className="activity-card-header">
        <div className="activity-summary">
          <div className="activity-icon" style={{ background: `${swatch.bg}55`, borderColor: `${swatch.bg}` }}>
            {activity.emoji}
          </div>
          <div>
            <div className="activity-name">{activity.name}</div>
            {activity.why ? <div className="activity-why">{activity.why}</div> : null}
          </div>
        </div>
        <div className="activity-total">
          <span className="meta-label">Total</span>
          <span className="meta-value" style={{ color: swatch.heat }}>{formatMinutes(totalMinutes)}</span>
        </div>
      </div>
      <div className="timer-panel">
        <div className="timer-status">
          {isRunning ? <span className="pulse-dot" /> : null}
          <div>
            <span className="timer-label">Session</span>
            <div className="timer-value">{formattedElapsed}</div>
          </div>
        </div>
        <button
          type="button"
          className={`button timer-button ${isRunning ? 'button-stop' : 'button-primary'}`}
          onClick={() => (isRunning ? onStop() : onStart(activity.id))}
          aria-label={isRunning ? 'Stop timer and log time' : 'Start timer'}
        >
          {isRunning ? 'Stop & log' : 'Start timer'}
        </button>
      </div>
      <div className="activity-footer">
        <div>
          <span className="meta-label">Today</span>
          <div className="meta-value">{formatMinutes(todayMinutes)}</div>
        </div>
      </div>
      <WeeklyInsightGraph logs={activityLogs} color={swatch.heat} />
    </article>
  )
}