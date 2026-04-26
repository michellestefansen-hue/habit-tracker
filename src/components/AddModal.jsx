import { useState } from 'react'
import { SWATCHES } from '../constants/colors.js'
import { EMOJI_CATEGORIES, EMOJI_CATEGORY_IDS } from '../constants/categories.js'

export function AddModal({ onAdd, onClose }) {
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
                      aria-label={`Select category: ${category.label}`}
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
                    aria-label={`Select ${swatch.id} color`}
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