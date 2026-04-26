import { useEffect, useMemo, useRef, useState } from 'react'
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
  category: {
    fitness: [
      { id: 'fitness_5h', emoji: '💪', name: 'First Rep', threshold: 300, desc: 'Log your first 5 hours of fitness' },
      { id: 'fitness_20h', emoji: '🏃', name: 'Warming Up', threshold: 1200, desc: 'Reach 20 hours of physical activity' },
      { id: 'fitness_50h', emoji: '🏋️', name: 'Breaking Sweat', threshold: 3000, desc: 'Clock 50 hours of fitness' },
      { id: 'fitness_100h', emoji: '🥇', name: 'Iron Discipline', threshold: 6000, desc: 'Dedicate 100 hours to fitness' },
      { id: 'fitness_500h', emoji: '🏆', name: 'Gym Rat', threshold: 30000, desc: 'Log 500 hours of physical activity' },
      { id: 'fitness_1000h', emoji: '⚡', name: 'Elite Athlete', threshold: 60000, desc: 'Achieve 1000 hours of fitness' },
    ],
    wellness: [
      { id: 'wellness_5h', emoji: '🌿', name: 'First Breath', threshold: 300, desc: 'Log your first 5 hours of wellness practice' },
      { id: 'wellness_20h', emoji: '🌸', name: 'Finding Calm', threshold: 1200, desc: 'Reach 20 hours of mindfulness' },
      { id: 'wellness_50h', emoji: '🧘', name: 'Finding Stillness', threshold: 3000, desc: 'Clock 50 hours of wellness' },
      { id: 'wellness_100h', emoji: '🌬️', name: 'Zen Seeker', threshold: 6000, desc: 'Dedicate 100 hours to mental wellness' },
      { id: 'wellness_500h', emoji: '💎', name: 'Inner Peace', threshold: 30000, desc: 'Log 500 hours of wellness practice' },
      { id: 'wellness_1000h', emoji: '🌟', name: 'Enlightened', threshold: 60000, desc: 'Achieve 1000 hours of mindfulness' },
    ],
    learning: [
      { id: 'learning_5h', emoji: '📖', name: 'First Page', threshold: 300, desc: 'Log your first 5 hours of learning' },
      { id: 'learning_20h', emoji: '🔍', name: 'Getting Curious', threshold: 1200, desc: 'Reach 20 hours of study' },
      { id: 'learning_50h', emoji: '📚', name: 'Curious Mind', threshold: 3000, desc: 'Clock 50 hours of learning' },
      { id: 'learning_100h', emoji: '🔬', name: 'Scholar', threshold: 6000, desc: 'Dedicate 100 hours to learning' },
      { id: 'learning_500h', emoji: '👨‍🎓', name: 'Lifelong Learner', threshold: 30000, desc: 'Log 500 hours of study' },
      { id: 'learning_1000h', emoji: '🎓', name: 'Sage', threshold: 60000, desc: 'Achieve 1000 hours of learning' },
    ],
    creative: [
      { id: 'creative_5h', emoji: '✏️', name: 'First Stroke', threshold: 300, desc: 'Log your first 5 hours of creative work' },
      { id: 'creative_20h', emoji: '🖌️', name: 'Dabbling', threshold: 1200, desc: 'Reach 20 hours of creative practice' },
      { id: 'creative_50h', emoji: '🎨', name: 'Palette Tinkerer', threshold: 3000, desc: 'Clock 50 hours of creative arts' },
      { id: 'creative_100h', emoji: '🖼️', name: 'Artist in Progress', threshold: 6000, desc: 'Dedicate 100 hours to creative work' },
      { id: 'creative_500h', emoji: '🎭', name: 'Bob Ross', threshold: 30000, desc: 'Log 500 hours of creative practice' },
      { id: 'creative_1000h', emoji: '🏺', name: 'Master Artist', threshold: 60000, desc: 'Achieve 1000 hours of creative arts' },
    ],
    music: [
      { id: 'music_5h', emoji: '🎵', name: 'First Notes', threshold: 300, desc: 'Log your first 5 hours of music practice' },
      { id: 'music_20h', emoji: '🥁', name: 'Finding Rhythm', threshold: 1200, desc: 'Reach 20 hours of music' },
      { id: 'music_50h', emoji: '🎼', name: 'Jam Session', threshold: 3000, desc: 'Clock 50 hours of music practice' },
      { id: 'music_100h', emoji: '🎸', name: 'Maestro', threshold: 6000, desc: 'Dedicate 100 hours to music' },
      { id: 'music_500h', emoji: '🎻', name: 'Virtuoso', threshold: 30000, desc: 'Log 500 hours of music practice' },
      { id: 'music_1000h', emoji: '🌟', name: 'Rockstar', threshold: 60000, desc: 'Achieve 1000 hours of music' },
    ],
    cooking: [
      { id: 'cooking_5h', emoji: '🥄', name: 'First Taste', threshold: 300, desc: 'Log your first 5 hours in the kitchen' },
      { id: 'cooking_20h', emoji: '🍳', name: 'Getting Saucy', threshold: 1200, desc: 'Reach 20 hours of cooking' },
      { id: 'cooking_50h', emoji: '👨‍🍳', name: 'Sous Chef', threshold: 3000, desc: 'Clock 50 hours in the kitchen' },
      { id: 'cooking_100h', emoji: '🍽️', name: 'Kitchen Explorer', threshold: 6000, desc: 'Dedicate 100 hours to cooking' },
      { id: 'cooking_500h', emoji: '⭐', name: 'Gordon Ramsay', threshold: 30000, desc: 'Log 500 hours in the kitchen' },
      { id: 'cooking_1000h', emoji: '👑', name: 'Michelin Star', threshold: 60000, desc: 'Achieve 1000 hours of cooking' },
    ],
    home: [
      { id: 'home_5h', emoji: '🏠', name: 'Settling In', threshold: 300, desc: 'Log your first 5 hours on home and garden' },
      { id: 'home_20h', emoji: '🌱', name: 'Nesting', threshold: 1200, desc: 'Reach 20 hours of home care' },
      { id: 'home_50h', emoji: '🏡', name: 'Nester', threshold: 3000, desc: 'Clock 50 hours at home' },
      { id: 'home_100h', emoji: '🌻', name: 'Homemaker', threshold: 6000, desc: 'Dedicate 100 hours to your home' },
      { id: 'home_500h', emoji: '🌳', name: 'Sanctuary Keeper', threshold: 30000, desc: 'Log 500 hours on home and garden' },
      { id: 'home_1000h', emoji: '🏰', name: 'Castle Builder', threshold: 60000, desc: 'Achieve 1000 hours at home' },
    ],
    nature: [
      { id: 'nature_5h', emoji: '🌿', name: 'Fresh Air', threshold: 300, desc: 'Log your first 5 hours outdoors' },
      { id: 'nature_20h', emoji: '🥾', name: 'Trail Seeker', threshold: 1200, desc: 'Reach 20 hours in nature' },
      { id: 'nature_50h', emoji: '🏕️', name: 'Wanderer', threshold: 3000, desc: 'Clock 50 hours outdoors' },
      { id: 'nature_100h', emoji: '🦅', name: "Nature's Child", threshold: 6000, desc: 'Dedicate 100 hours to nature' },
      { id: 'nature_500h', emoji: '🌲', name: 'Wilderness Expert', threshold: 30000, desc: 'Log 500 hours outdoors' },
      { id: 'nature_1000h', emoji: '🏔️', name: 'Mountain Soul', threshold: 60000, desc: 'Achieve 1000 hours in nature' },
    ],
    crafts: [
      { id: 'crafts_5h', emoji: '✂️', name: 'First Stitch', threshold: 300, desc: 'Log your first 5 hours of crafting' },
      { id: 'crafts_20h', emoji: '🧶', name: 'Getting Crafty', threshold: 1200, desc: 'Reach 20 hours of crafts' },
      { id: 'crafts_50h', emoji: '🎀', name: 'Stitcher', threshold: 3000, desc: 'Clock 50 hours of crafting' },
      { id: 'crafts_100h', emoji: '🧵', name: 'Craft Master', threshold: 6000, desc: 'Dedicate 100 hours to crafts' },
      { id: 'crafts_500h', emoji: '🪡', name: 'Renaissance Maker', threshold: 30000, desc: 'Log 500 hours of crafting' },
      { id: 'crafts_1000h', emoji: '🏆', name: 'Master Crafter', threshold: 60000, desc: 'Achieve 1000 hours of crafts' },
    ],
    growth: [
      { id: 'growth_5h', emoji: '✏️', name: 'Getting Started', threshold: 300, desc: 'Log your first 5 hours of personal growth' },
      { id: 'growth_20h', emoji: '📓', name: 'Getting Better', threshold: 1200, desc: 'Reach 20 hours of self-development' },
      { id: 'growth_50h', emoji: '✍️', name: 'Getting Serious', threshold: 3000, desc: 'Clock 50 hours of personal growth' },
      { id: 'growth_100h', emoji: '📖', name: 'Getting Awesome', threshold: 6000, desc: 'Dedicate 100 hours to self-development' },
      { id: 'growth_500h', emoji: '💭', name: 'Outlier', threshold: 30000, desc: 'Log 500 hours of personal growth' },
      { id: 'growth_1000h', emoji: '🌟', name: 'Legend', threshold: 60000, desc: 'Achieve 1000 hours of self-development' },
    ],
  },
  streak: [
    { id: 'week_warrior', emoji: '🔥', name: 'Week Warrior', threshold: 7, desc: 'Log activity every day for 7 days straight' },
    { id: 'month_momentum', emoji: '🌪️', name: 'Month Momentum', threshold: 30, desc: 'Maintain a 30-day daily streak' },
    { id: 'unstoppable', emoji: '⚡', name: 'Unstoppable', threshold: 90, desc: 'Keep a 90-day streak going' },
  ],
  special: [
    { id: 'balanced_life', emoji: '🎯', name: 'Balanced Life', threshold: 5, desc: 'Stay active in at least 5 different categories' },
    { id: 'renaissance', emoji: '🌈', name: 'Renaissance', threshold: 10, desc: 'Explore all 10 activity categories' },
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
    const categoryTotals = {}

    activities.forEach((activity) => {
      const activityLogs = logs[activity.id] || {}
      const activityTotal = Object.values(activityLogs).reduce((sum, value) => sum + value, 0)
      if (!categoryTotals[activity.category]) categoryTotals[activity.category] = 0
      categoryTotals[activity.category] += activityTotal
      Object.entries(activityLogs).forEach(([day, minutes]) => {
        allDay[day] = (allDay[day] || 0) + minutes
      })
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

    return { categoryTotals, streak, daysWithLogs: daysWithLogs.length, categoriesActive, allCategoriesActive }
  }, [activities, logs])

  const unlockedAchievements = useMemo(() => {
    const unlocked = []

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
    const activeCategoryIds = new Set(activities.map((a) => a.category))

    // Find next category — only for categories the user has activities in
    Object.entries(ACHIEVEMENTS.category).forEach(([categoryId, categoryAchs]) => {
      if (!activeCategoryIds.has(categoryId)) return
      const nextCat = categoryAchs.find((ach) => (calculateTotals.categoryTotals[categoryId] || 0) < ach.threshold)
      if (nextCat && next.length < 3) {
        next.push({ ...nextCat, type: 'category', category: categoryId, progress: calculateTotals.categoryTotals[categoryId] || 0 })
      }
    })

    return next.slice(0, 3)
  }, [calculateTotals, activities])

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
              <span className="achievement-desc">{ach.desc}</span>
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
                  <span className="achievement-desc next-achievement-desc">{ach.desc}</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="progress-text">{ach.progress > 0 ? formatMinutes(ach.progress) : '0m'} / {formatMinutes(ach.threshold)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

function ActivityLineChart({ activities, logs }) {
  const [range, setRange] = useState(30)
  const [hiddenIds, setHiddenIds] = useState(new Set())
  const [hoverIndex, setHoverIndex] = useState(null)
  const svgRef = useRef(null)

  const W = 600, H = 160
  const PAD = { top: 12, right: 16, bottom: 28, left: 44 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  const days = useMemo(() =>
    Array.from({ length: range }).map((_, i) => {
      const date = subtractDays(range - 1 - i)
      return { key: dateKey(date), date }
    }), [range])

  const series = useMemo(() =>
    activities.map(activity => {
      const swatch = SWATCHES.find(s => s.id === activity.color) ?? SWATCHES[0]
      return {
        id: activity.id,
        name: activity.name,
        emoji: activity.emoji,
        color: swatch.heat,
        data: days.map(d => logs[activity.id]?.[d.key] || 0),
      }
    }), [activities, logs, days])

  const visibleSeries = useMemo(() =>
    series.filter(s => !hiddenIds.has(s.id)), [series, hiddenIds])

  const maxVal = useMemo(() =>
    Math.max(60, ...visibleSeries.flatMap(s => s.data)), [visibleSeries])

  const xPos = (i) => PAD.left + (days.length > 1 ? (i / (days.length - 1)) * innerW : innerW / 2)
  const yPos = (v) => PAD.top + innerH - (v / maxVal) * innerH

  function buildPath(data) {
    return data.map((v, i) => `${i === 0 ? 'M' : 'L'}${xPos(i).toFixed(1)},${yPos(v).toFixed(1)}`).join(' ')
  }

  const labelIndices = useMemo(() => {
    if (range === 7) return [0, 1, 2, 3, 4, 5, 6]
    if (range === 30) return [0, 6, 13, 20, 29]
    return [0, 14, 29, 44, 59, 74, 89]
  }, [range])

  const yTicks = [0, 0.5, 1].map(f => ({
    value: Math.round(maxVal * f),
    y: yPos(maxVal * f),
  }))

  function handleMouseMove(e) {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const svgX = ((e.clientX - rect.left) / rect.width) * W
    const i = Math.round(((svgX - PAD.left) / innerW) * (days.length - 1))
    setHoverIndex(Math.max(0, Math.min(days.length - 1, i)))
  }

  function toggleActivity(id) {
    setHiddenIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const tooltipX = hoverIndex !== null ? xPos(hoverIndex) : null
  const tooltipLeftPercent = tooltipX !== null ? Math.max(8, Math.min(92, (tooltipX / W) * 100)) : null

  return (
    <section className="dashboard-card line-chart-card">
      <div className="line-chart-header">
        <h3>Activity over time</h3>
        <div className="range-buttons">
          {[7, 30, 90].map(r => (
            <button
              key={r}
              type="button"
              className={`range-button ${range === r ? 'active' : ''}`}
              onClick={() => setRange(r)}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      <div className="activity-chips">
        {series.map(s => (
          <button
            key={s.id}
            type="button"
            className={`activity-chip ${hiddenIds.has(s.id) ? 'chip-hidden' : ''}`}
            onClick={() => toggleActivity(s.id)}
          >
            <span className="chip-dot" style={{ background: s.color }} />
            {s.emoji} {s.name}
          </button>
        ))}
      </div>

      <div className="svg-wrapper" onMouseLeave={() => setHoverIndex(null)}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height={H}
          preserveAspectRatio="none"
          className="line-chart-svg"
          onMouseMove={handleMouseMove}
        >
          {yTicks.map(tick => (
            <g key={tick.value}>
              <line
                x1={PAD.left} y1={tick.y.toFixed(1)}
                x2={W - PAD.right} y2={tick.y.toFixed(1)}
                stroke="var(--border)" strokeWidth="1"
              />
              <text
                x={PAD.left - 6} y={tick.y.toFixed(1)}
                textAnchor="end" dominantBaseline="middle"
                fontSize="10" fill="var(--muted)"
              >
                {tick.value === 0 ? '0' : formatMinutes(tick.value)}
              </text>
            </g>
          ))}

          {labelIndices.map(i => (
            <text
              key={i}
              x={xPos(i).toFixed(1)} y={H - PAD.bottom + 14}
              textAnchor="middle" fontSize="10" fill="var(--muted)"
            >
              {days[i]?.date.toLocaleDateString('no-NO', { month: 'short', day: 'numeric' })}
            </text>
          ))}

          {visibleSeries.map(s => (
            <path
              key={s.id}
              d={buildPath(s.data)}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}

          {hoverIndex !== null && (
            <>
              <line
                x1={tooltipX.toFixed(1)} y1={PAD.top}
                x2={tooltipX.toFixed(1)} y2={PAD.top + innerH}
                stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 3"
              />
              {visibleSeries.map(s => (
                <circle
                  key={s.id}
                  cx={tooltipX.toFixed(1)}
                  cy={yPos(s.data[hoverIndex]).toFixed(1)}
                  r="4"
                  fill={s.color}
                  stroke="white"
                  strokeWidth="1.5"
                />
              ))}
            </>
          )}
        </svg>

        {hoverIndex !== null && (
          <div className="chart-tooltip" style={{ left: `${tooltipLeftPercent}%` }}>
            <div className="tooltip-date">
              {days[hoverIndex]?.date.toLocaleDateString('no-NO', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
            {visibleSeries.filter(s => s.data[hoverIndex] > 0).map(s => (
              <div key={s.id} className="tooltip-row">
                <span className="tooltip-dot" style={{ background: s.color }} />
                <span>{s.name}: {formatMinutes(s.data[hoverIndex])}</span>
              </div>
            ))}
            {visibleSeries.every(s => s.data[hoverIndex] === 0) && (
              <div className="tooltip-row tooltip-empty">Ingen aktivitet</div>
            )}
          </div>
        )}
      </div>
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
          <p className="subhead">Outliers aren't born - they're built daily.</p>
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
            <ActivityLineChart activities={sortedActivities} logs={logs} />
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
