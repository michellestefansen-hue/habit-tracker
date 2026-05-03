import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SWATCHES } from './constants/colors.js'
import { EMOJI_CATEGORIES, EMOJI_CATEGORY_IDS } from './constants/categories.js'
import { dateKey, subtractDays, formatMinutes, formatTimer } from './utils/date.js'
import { readStoredState, writeStoredState } from './utils/storage.js'

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
              onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); event.target.blur() } }}
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
              onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); event.target.blur() } }}
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

function WeeklyInsightGraph({ logs, color, allTimeTotal }) {
  const days = Array.from({ length: 7 }).map((_, index) => {
    const date = subtractDays(6 - index)
    const key = dateKey(date)
    return { key, label: date.toLocaleDateString('en-US', { weekday: 'short' })[0], minutes: logs[key] || 0 }
  })
  const totalMinutes = days.reduce((sum, day) => sum + day.minutes, 0)
  const maxStep = Math.max(1, ...days.map((day) => Math.max(day.minutes, 10)))
  const activeDays = days.filter(day => day.minutes > 0).length
  const avgMinutes = activeDays > 0 ? Math.round(totalMinutes / activeDays) : 0

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
        <div>
          <span className="meta-label">Total</span>
          <strong style={{ color: color }}>{formatMinutes(allTimeTotal)}</strong>
        </div>
      </div>
    </div>
  )
}

function formatDateNorwegian(key) {
  const [year, month, day] = key.split('-')
  return `${day}.${month}.${year.slice(2)}`
}

function ActivityCard({ activity, activityLogs, isRunning, now, onStart, onStop, onDelete, onUpdateLogs }) {
  const [showMenu, setShowMenu] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editedLogs, setEditedLogs] = useState({})
  const [newDate, setNewDate] = useState('')
  const [newMinutes, setNewMinutes] = useState('')

  const today = dateKey()
  const todayMinutes = activityLogs[today] || 0
  const allTimeTotal = Object.values(activityLogs).reduce((sum, value) => sum + value, 0)
  const swatch = SWATCHES.find((swatch) => swatch.id === activity.color) ?? SWATCHES[0]
  const elapsedSeconds = isRunning ? Math.max(0, Math.floor((now - activity.timerStart) / 1000)) : 0
  const formattedElapsed = isRunning ? formatTimer(elapsedSeconds) : '00:00'

  function openEditModal() {
    setEditedLogs(Object.fromEntries(Object.entries(activityLogs).map(([k, v]) => [k, String(v)])))
    setNewDate(today)
    setNewMinutes('')
    setShowEditModal(true)
    setShowMenu(false)
  }

  function openDeleteModal() {
    setConfirmingDelete(true)
    setShowMenu(false)
  }

  function handleEditMinutes(key, value) {
    setEditedLogs((prev) => ({ ...prev, [key]: value }))
  }

  function handleRemoveDay(key) {
    setEditedLogs((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function handleAddDay() {
    if (!newDate || !newMinutes) return
    const minutes = parseInt(newMinutes, 10)
    if (isNaN(minutes) || minutes <= 0) return
    setEditedLogs((prev) => ({ ...prev, [newDate]: String(minutes) }))
    setNewDate(today)
    setNewMinutes('')
  }

  function handleSaveLogs() {
    const cleaned = Object.fromEntries(
      Object.entries(editedLogs)
        .map(([k, v]) => [k, parseInt(v, 10)])
        .filter(([, v]) => !isNaN(v) && v > 0)
    )
    onUpdateLogs(activity.id, cleaned)
    setShowEditModal(false)
  }

  const sortedEditDays = Object.keys(editedLogs).sort((a, b) => b.localeCompare(a))

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
        <div className="activity-card-actions">
          <div className="card-menu-wrapper">
            <button
              type="button"
              className="button button-secondary card-menu-button"
              onClick={() => setShowMenu((v) => !v)}
              aria-label="Alternativer"
            >
              <svg width="16" height="4" viewBox="0 0 16 4" fill="currentColor" aria-hidden="true">
                <circle cx="2" cy="2" r="1.5" />
                <circle cx="8" cy="2" r="1.5" />
                <circle cx="14" cy="2" r="1.5" />
              </svg>
            </button>
            {showMenu && (
              <>
                <div className="card-menu-backdrop" onClick={() => setShowMenu(false)} />
                <div className="card-menu">
                  <button type="button" className="card-menu-item" onClick={openEditModal}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M11.5 1.5a1.5 1.5 0 0 1 2.12 2.12L5 12.25l-3 .75.75-3L11.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Rediger
                  </button>
                  <button type="button" className="card-menu-item danger" onClick={openDeleteModal}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M6 2h4a1 1 0 0 1 1 1H5a1 1 0 0 1 1-1Z" fill="currentColor" />
                      <path d="M2 4h12v1H3.5l.8 8.1A1 1 0 0 0 5.3 14h5.4a1 1 0 0 0 1-.9L12.5 5H14V4H2Z" fill="currentColor" />
                    </svg>
                    Slett
                  </button>
                </div>
              </>
            )}
          </div>
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
      <WeeklyInsightGraph logs={activityLogs} color={swatch.heat} allTimeTotal={allTimeTotal} />

      {confirmingDelete && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setConfirmingDelete(false) }}>
          <div className="modal-card delete-dialog">
            <h2>Slett aktivitet</h2>
            <p>Er du sikker på at du vil slette <strong>{activity.name}</strong>? All logget tid vil gå tapt.</p>
            <div className="modal-actions">
              <button type="button" className="button button-secondary" onClick={() => setConfirmingDelete(false)}>Avbryt</button>
              <button type="button" className="button button-stop" onClick={() => onDelete(activity.id)}>Slett</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowEditModal(false) }}>
          <div className="modal-card edit-logs-dialog">
            <div className="modal-header">
              <div>
                <h2>Rediger tider</h2>
                <p>{activity.name}</p>
              </div>
            </div>

            <div className="edit-logs-list">
              {sortedEditDays.length === 0 && (
                <p className="edit-logs-empty">Ingen registrerte dager ennå.</p>
              )}
              {sortedEditDays.map((key) => (
                <div key={key} className="edit-logs-row">
                  <span className="edit-logs-date">{formatDateNorwegian(key)}</span>
                  <div className="edit-logs-input-group">
                    <input
                      type="number"
                      className="pill-input edit-logs-input"
                      min="1"
                      value={editedLogs[key]}
                      onChange={(e) => handleEditMinutes(key, e.target.value)}
                    />
                    <span className="edit-logs-unit">min</span>
                  </div>
                  <button type="button" className="icon-button edit-logs-remove" onClick={() => handleRemoveDay(key)} aria-label="Fjern dag">×</button>
                </div>
              ))}
            </div>

            <div className="edit-logs-add">
              <span className="meta-label">Legg til dag</span>
              {newDate && parseInt(editedLogs[newDate], 10) > 0 && (
                <p className="edit-logs-overwrite-warning">
                  OBS: {formatDateNorwegian(newDate)} har allerede {editedLogs[newDate]} min — verdien blir overskrevet.
                </p>
              )}
              <div className="edit-logs-add-row">
                <input
                  type="date"
                  className="pill-input edit-logs-date-input"
                  value={newDate}
                  max={today}
                  onChange={(e) => setNewDate(e.target.value)}
                />
                <div className="edit-logs-input-group">
                  <input
                    type="number"
                    className="pill-input edit-logs-input"
                    min="1"
                    placeholder="min"
                    value={newMinutes}
                    onChange={(e) => setNewMinutes(e.target.value)}
                  />
                  <span className="edit-logs-unit">min</span>
                </div>
                <button type="button" className="button button-secondary" onClick={handleAddDay}>Legg til</button>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="button button-secondary" onClick={() => setShowEditModal(false)}>Avbryt</button>
              <button type="button" className="button button-primary" onClick={handleSaveLogs}>Lagre</button>
            </div>
          </div>
        </div>
      )}
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

  function updateLogs(activityId, newLogs) {
    setLogs((prev) => ({ ...prev, [activityId]: newLogs }))
  }

  function deleteActivity(activityId) {
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
                  onUpdateLogs={updateLogs}
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
