import { useMemo } from 'react'
import { dateKey } from '../utils/date.js'
import { ACHIEVEMENTS } from '../constants/achievements.js'
import { EMOJI_CATEGORY_IDS } from '../constants/categories.js'

export function AchievementsShowcase({ activities, logs }) {
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
      const day = dateKey(new Date(Date.now() - i * 24 * 60 * 60 * 1000))
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