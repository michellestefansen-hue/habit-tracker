import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'habit-tracker-state-v1'

const SWATCHES = [
  { id: 'rose', bg: 'oklch(75% 0.07 10)', heat: 'oklch(65% 0.12 10)' },
  { id: 'clay', bg: 'oklch(68% 0.09 38)', heat: 'oklch(55% 0.12 38)' },
  { id: 'amber', bg: 'oklch(76% 0.09 68)', heat: 'oklch(64% 0.13 68)' },
  { id: 'sage', bg: 'oklch(68% 0.07 150)', heat: 'oklch(55% 0.1 150)' },
  { id: 'moss', bg: 'oklch(60% 0.08 130)', heat: 'oklch(48% 0.11 130)' },
  { id: 'slate', bg: 'oklch(62% 0.05 220)', heat: 'oklch(50% 0.08 220)' },
  { id: 'dusk', bg: 'oklch(66% 0.06 270)', heat: 'oklch(54% 0.09 270)' },
  { id: 'plum', bg: 'oklch(60% 0.08 320)', heat: 'oklch(48% 0.12 320)' },
  { id: 'sand', bg: 'oklch(80% 0.06 80)', heat: 'oklch(68% 0.09 80)' },
  { id: 'stone', bg: 'oklch(58% 0.03 60)', heat: 'oklch(42% 0.05 60)' },
]

const EMOJI_CATEGORIES = {
  fitness: { label: 'Physical Fitness', emoji: '💪' },
  wellness: { label: 'Mental Wellness', emoji: '🧘' },
  learning: { label: 'Learning & Study', emoji: '📖' },
  creative: { label: 'Creative Arts', emoji: '🎨' },
  music: { label: 'Music & Sound', emoji: '🎸' },
  cooking: { label: 'Cooking & Food', emoji: '🍳' },
  home: { label: 'Home & Garden', emoji: '🏡' },
  nature: { label: 'Nature & Outdoors', emoji: '🌊' },
  crafts: { label: 'Crafts & Making', emoji: '🧵' },
  growth: { label: 'Personal Growth', emoji: '✏️' },
}

const EMOJI_CATEGORY_IDS = Object.keys(EMOJI_CATEGORIES)

const ACHIEVEMENTS = {
  overall: [
    { id: 'seedling', emoji: '🌱', name: 'Seedling', threshold: 10 },
    { id: 'green_thumb', emoji: '🌿', name: 'Green Thumb', threshold: 50 },
    { id: 'oak_tree', emoji: '🌳', name: 'Oak Tree', threshold: 100 },
    { id: 'mountain_peak', emoji: '🏔️', name: 'Mountain Peak', threshold: 250 },
    { id: 'explorer', emoji: '🌍', name: 'Explorer', threshold: 500 },
    { id: 'master', emoji: '👑', name: 'Master', threshold: 1000 },
  ],
  category: {
    fitness: [
      { id: 'fitness_25', emoji: '💪', name: 'Breaking Sweat', threshold: 25 },
      { id: 'fitness_50', emoji: '🏋️', name: 'Iron Discipline', threshold: 50 },
      { id: 'fitness_100', emoji: '🥇', name: 'Gym Rat', threshold: 100 },
    ],
    wellness: [
      { id: 'wellness_25', emoji: '🧘', name: 'Finding Stillness', threshold: 25 },
      { id: 'wellness_50', emoji: '🌬️', name: 'Zen Seeker', threshold: 50 },
      { id: 'wellness_100', emoji: '💎', name: 'Inner Peace', threshold: 100 },
    ],
    learning: [
      { id: 'learning_25', emoji: '📚', name: 'Curious Mind', threshold: 25 },
      { id: 'learning_50', emoji: '🔬', name: 'Scholar', threshold: 50 },
      { id: 'learning_100', emoji: '👨‍🎓', name: 'Lifelong Learner', threshold: 100 },
    ],
    creative: [
      { id: 'creative_25', emoji: '🎨', name: 'Palette Tinkerer', threshold: 25 },
      { id: 'creative_50', emoji: '🖌️', name: 'Artist in Progress', threshold: 50 },
      { id: 'creative_100', emoji: '🎭', name: 'Bob Ross', threshold: 100 },
    ],
    music: [
      { id: 'music_25', emoji: '🎵', name: 'First Notes', threshold: 25 },
      { id: 'music_50', emoji: '🎼', name: 'Jam Session', threshold: 50 },
      { id: 'music_100', emoji: '🎸', name: 'Maestro', threshold: 100 },
    ],
    cooking: [
      { id: 'cooking_25', emoji: '👨‍🍳', name: 'Sous Chef', threshold: 25 },
      { id: 'cooking_50', emoji: '🍽️', name: 'Kitchen Explorer', threshold: 50 },
      { id: 'cooking_100', emoji: '👨‍🍳', name: 'Gordon Ramsay', threshold: 100 },
    ],
    home: [
      { id: 'home_25', emoji: '🏠', name: 'Nester', threshold: 25 },
      { id: 'home_50', emoji: '🏡', name: 'Homemaker', threshold: 50 },
      { id: 'home_100', emoji: '🌻', name: 'Sanctuary Keeper', threshold: 100 },
    ],
    nature: [
      { id: 'nature_25', emoji: '🥾', name: 'Trail Seeker', threshold: 25 },
      { id: 'nature_50', emoji: '🏕️', name: 'Wanderer', threshold: 50 },
      { id: 'nature_100', emoji: '🦅', name: 'Nature\'s Child', threshold: 100 },
    ],
    crafts: [
      { id: 'crafts_25', emoji: '🧶', name: 'Stitcher', threshold: 25 },
      { id: 'crafts_50', emoji: '🎀', name: 'Craft Master', threshold: 50 },
      { id: 'crafts_100', emoji: '🧵', name: 'Renaissance Maker', threshold: 100 },
    ],
    growth: [
      { id: 'growth_25', emoji: '✍️', name: 'Reflector', threshold: 25 },
      { id: 'growth_50', emoji: '📖', name: 'Philosopher', threshold: 50 },
      { id: 'growth_100', emoji: '💭', name: 'Wisdom Keeper', threshold: 100 },
    ],
  },
  streak: [
    { id: 'week_warrior', emoji: '🔥', name: 'Week Warrior', threshold: 7 },
    { id: 'month_momentum', emoji: '🌪️', name: 'Month Momentum', threshold: 30 },
    { id: 'unstoppable', emoji: '⚡', name: 'Unstoppable', threshold: 90 },
  ],
  special: [
    { id: 'balanced_life', emoji: '🎯', name: 'Balanced Life', threshold: 5 },
    { id: 'renaissance', emoji: '🌈', name: 'Renaissance', threshold: 10 },
  ],
}

function pad2(value) {
  return String(value).padStart(2, '0')
}

function dateKey(date = new Date()) {
  const d = new Date(date)
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function weekKey(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const offset = (day + 6) % 7
  d.setDate(d.getDate() - offset)
  return dateKey(d)
}

function subtractDays(count) {
  const d = new Date()
  d.setDate(d.getDate() - count)
  return d
}

function formatMinutes(total) {
  if (!total) return '—'
  if (total < 60) return `${total}m`
  const hours = Math.floor(total / 60)
  const remainder = total % 60
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`
}

function formatTimer(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainder = seconds % 60
  if (hours > 0) return `${hours}:${pad2(minutes)}:${pad2(remainder)}`
  return `${pad2(minutes)}:${pad2(remainder)}`
}

async function readStoredState() {
  if (typeof window === 'undefined') return null
  try {
    if (window.storage?.local?.get) {
      const data = await window.storage.local.get([STORAGE_KEY])
      return data?.[STORAGE_KEY] ?? null
    }
  } catch {
    // ignore and fallback
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

async function writeStoredState(state) {
  if (typeof window === 'undefined') return
  try {
    if (window.storage?.local?.set) {
      await window.storage.local.set({ [STORAGE_KEY]: state })
      return
    }
  } catch {
    // ignore and fallback
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

function AddModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [why, setWhy] = useState('')
  const [swatchId, setSwatchId] = useState(SWATCHES[0].id)
  const [categoryId, setCategoryId] = useState(EMOJI_CATEGORY_IDS[0])

  function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) return
    const category = EMOJI_CATEGORIES[categoryId]
    onAdd({
      id: String(Date.now()),
      name: name.trim(),
      why: why.trim(),
      color: swatchId,
      category: categoryId,
      emoji: category.emoji,
    })
  }

  return (
    <div className="modal-overlay" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2>New activity</h2>
            <p>Choose a color and an icon that feels calm and inviting.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            <span>Activity name</span>
            <input
              className="pill-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Piano practice, Weekend cooking"
              autoFocus
            />
          </label>
          <label>
            <span>Why does it matter? (optional)</span>
            <input
              className="pill-input"
              value={why}
              onChange={(event) => setWhy(event.target.value)}
              placeholder="e.g. To feel more grounded at home"
            />
          </label>
          <div className="modal-row">
            <div>
              <span>Category</span>
              <div className="category-grid">
                {EMOJI_CATEGORY_IDS.map((catId) => {
                  const category = EMOJI_CATEGORIES[catId]
                  return (
                    <button
                      key={catId}
                      type="button"
                      className={`category-button ${catId === categoryId ? 'selected' : ''}`}
                      onClick={() => setCategoryId(catId)}
                      title={category.label}
                    >
                      <span className="category-emoji">{category.emoji}</span>
                      <span className="category-label">{category.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="modal-row">
            <div>
              <span>Color</span>
              <div className="swatch-grid">
                {SWATCHES.map((swatch) => (
                  <button
                    type="button"
                    key={swatch.id}
                    className={`color-swatch ${swatch.id === swatchId ? 'selected' : ''}`}
                    style={{ background: swatch.bg }}
                    onClick={() => setSwatchId(swatch.id)}
                    aria-label={`Select ${swatch.id}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button-primary" disabled={!name.trim()}>
              Add activity
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function WeeklyInsightGraph({ logs, color }) {
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

function ActivityCard({ activity, activityLogs, isRunning, now, onStart, onStop }) {
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

function AchievementsShowcase({ activities, logs }) {
  const calculateTotals = useMemo(() => {
    const allDay = {}
    let grandTotal = 0
    const categoryTotals = {}

    activities.forEach((activity) => {
      const activityLogs = logs[activity.id] || {}
      const activityTotal = Object.values(activityLogs).reduce((sum, value) => sum + value, 0)
      if (!categoryTotals[activity.category]) categoryTotals[activity.category] = 0
      categoryTotals[activity.category] += activityTotal
      Object.entries(activityLogs).forEach(([day, minutes]) => {
        allDay[day] = (allDay[day] || 0) + minutes
      })
      grandTotal += activityTotal
    })

    const daysWithLogs = Object.keys(allDay).filter((k) => allDay[k] > 0)
    let streak = 0
    for (let i = 0; i < 365; i++) {
      const day = dateKey(subtractDays(i))
      if (allDay[day] && allDay[day] > 0) streak++
      else break
    }

    const categoriesActive = Object.values(categoryTotals).filter((total) => total > 0).length
    const allCategoriesActive = categoriesActive === EMOJI_CATEGORY_IDS.length

    return { grandTotal, categoryTotals, streak, daysWithLogs: daysWithLogs.length, categoriesActive, allCategoriesActive }
  }, [activities, logs])

  const unlockedAchievements = useMemo(() => {
    const unlocked = []

    // Overall achievements
    ACHIEVEMENTS.overall.forEach((ach) => {
      if (calculateTotals.grandTotal >= ach.threshold) {
        unlocked.push({ ...ach, type: 'overall' })
      }
    })

    // Category achievements
    Object.entries(ACHIEVEMENTS.category).forEach(([categoryId, categoryAchs]) => {
      categoryAchs.forEach((ach) => {
        if ((calculateTotals.categoryTotals[categoryId] || 0) >= ach.threshold) {
          unlocked.push({ ...ach, type: 'category', category: categoryId })
        }
      })
    })

    // Streak achievements
    ACHIEVEMENTS.streak.forEach((ach) => {
      if (calculateTotals.streak >= ach.threshold) {
        unlocked.push({ ...ach, type: 'streak' })
      }
    })

    // Special achievements
    if (calculateTotals.categoriesActive >= 5) {
      const balancedLife = ACHIEVEMENTS.special.find((a) => a.id === 'balanced_life')
      unlocked.push({ ...balancedLife, type: 'special' })
    }
    if (calculateTotals.allCategoriesActive) {
      const renaissance = ACHIEVEMENTS.special.find((a) => a.id === 'renaissance')
      unlocked.push({ ...renaissance, type: 'special' })
    }

    return unlocked
  }, [calculateTotals])

  const nextAchievements = useMemo(() => {
    const next = []

    // Find next overall
    const nextOverall = ACHIEVEMENTS.overall.find((ach) => calculateTotals.grandTotal < ach.threshold)
    if (nextOverall) next.push({ ...nextOverall, type: 'overall', progress: calculateTotals.grandTotal })

    // Find next category
    Object.entries(ACHIEVEMENTS.category).forEach(([categoryId, categoryAchs]) => {
      const nextCat = categoryAchs.find((ach) => (calculateTotals.categoryTotals[categoryId] || 0) < ach.threshold)
      if (nextCat && next.length < 3) {
        next.push({ ...nextCat, type: 'category', category: categoryId, progress: calculateTotals.categoryTotals[categoryId] || 0 })
      }
    })

    return next.slice(0, 3)
  }, [calculateTotals])

  return (
    <section className="dashboard-card achievements-showcase">
      <div className="achievements-header">
        <h3>Your Achievements</h3>
        <span className="achievement-count">{unlockedAchievements.length} unlocked</span>
      </div>
      {unlockedAchievements.length > 0 ? (
        <div className="achievements-grid">
          {unlockedAchievements.map((ach) => (
            <div key={ach.id} className="achievement-badge unlocked">
              <span className="achievement-emoji">{ach.emoji}</span>
              <span className="achievement-name">{ach.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="achievements-empty">
          <p>Log some time and unlock your first achievement!</p>
        </div>
      )}

      {nextAchievements.length > 0 && (
        <div className="achievements-next">
          <h4>Next Achievements</h4>
          <div className="next-achievements-list">
            {nextAchievements.map((ach) => {
              const progress = Math.min(100, Math.round((ach.progress / ach.threshold) * 100))
              return (
                <div key={ach.id} className="next-achievement-item">
                  <div className="next-achievement-header">
                    <span className="achievement-emoji">{ach.emoji}</span>
                    <span className="achievement-name">{ach.name}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="progress-text">{ach.progress}h / {ach.threshold}h</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

function EmptyState({ onAdd }) {
  return (
    <section className="empty-state">
      <div className="empty-icon">🌱</div>
      <h2>Nothing here yet</h2>
      <p className="empty-copy">Add an activity you'd like to spend more time on. Time is the measurement, not the objective.</p>
      <button type="button" className="button button-primary" onClick={onAdd}>
        Add your first activity
      </button>
    </section>
  )
}

function App() {
  const [activities, setActivities] = useState([])
  const [logs, setLogs] = useState({})
  const [notes, setNotes] = useState({})
  const [activeTimer, setActiveTimer] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    async function load() {
      const saved = await readStoredState()
      if (saved) {
        setActivities(saved.activities || [])
        setLogs(saved.logs || {})
        setNotes(saved.notes || {})
        if (saved.activeTimer?.activityId && typeof saved.activeTimer.startAt === 'number') {
          setActiveTimer(saved.activeTimer)
        }
      }
      setLoaded(true)
    }
    load()
  }, [])

  useEffect(() => {
    if (!activeTimer) return undefined
    const tick = () => setNow(Date.now())
    const interval = window.setInterval(tick, 1000)
    document.addEventListener('visibilitychange', tick)
    window.addEventListener('focus', tick)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', tick)
      window.removeEventListener('focus', tick)
    }
  }, [activeTimer])

  useEffect(() => {
    if (!loaded) return
    writeStoredState({ activities, logs, notes, activeTimer })
  }, [activities, logs, notes, activeTimer, loaded])

  function logTime(activityId, date, minutes) {
    setLogs((previousLogs) => ({
      ...previousLogs,
      [activityId]: {
        ...(previousLogs[activityId] || {}),
        [date]: Math.max(0, minutes),
      },
    }))
  }

  function stopTimer() {
    if (!activeTimer) return
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - activeTimer.startAt) / 1000))
    if (elapsedSeconds >= 60) {
      const minutes = Math.round(elapsedSeconds / 60)
      logTime(activeTimer.activityId, dateKey(), (logs[activeTimer.activityId]?.[dateKey()] || 0) + minutes)
    }
    setActiveTimer(null)
  }

  function startTimer(activityId) {
    if (activeTimer?.activityId === activityId) return
    if (activeTimer) {
      stopTimer()
    }
    setActiveTimer({ activityId, startAt: Date.now() })
  }

  function addActivity(activity) {
    setActivities((prev) => [...prev, activity])
    setShowModal(false)
  }

  function deleteActivity(activityId) {
    if (!window.confirm('Remove this activity? Your logged time will be lost.')) return
    setActivities((prev) => prev.filter((activity) => activity.id !== activityId))
    setLogs((prev) => {
      const next = { ...prev }
      delete next[activityId]
      return next
    })
    if (activeTimer?.activityId === activityId) {
      setActiveTimer(null)
    }
  }

  function saveNote(week, text) {
    setNotes((prev) => ({ ...prev, [week]: text }))
  }

  const sortedActivities = useMemo(
    () => [...activities].sort((a, b) => (a.name || '').localeCompare(b.name || '')),
    [activities],
  )

  if (!loaded) {
    return null
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div>
          <p className="eyebrow">Daily practice</p>
          <h1>Habit Tracker</h1>
          <p className="subhead">Build a quieter rhythm by tracking minutes spent on the things that matter.</p>
        </div>
        <button type="button" className="button button-primary" onClick={() => setShowModal(true)}>
          + Add activity
        </button>
      </header>

      <main className="page-content">
        {sortedActivities.length === 0 ? (
          <EmptyState onAdd={() => setShowModal(true)} />
        ) : (
          <>
            <div className="activity-grid">
              {sortedActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={{ ...activity, timerStart: activeTimer?.activityId === activity.id ? activeTimer.startAt : null }}
                  activityLogs={logs[activity.id] || {}}
                  isRunning={activeTimer?.activityId === activity.id}
                  now={now}
                  onStart={startTimer}
                  onStop={stopTimer}
                  onDelete={deleteActivity}
                />
              ))}
            </div>
            <div className="section-stack">
              <AchievementsShowcase activities={sortedActivities} logs={logs} />
            </div>
          </>
        )}
      </main>

      {showModal && <AddModal onAdd={addActivity} onClose={() => setShowModal(false)} />}
    </div>
  )
}

export default App
