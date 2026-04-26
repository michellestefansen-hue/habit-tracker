const STORAGE_KEY = 'habit-tracker-state-v1'

export async function readStoredState() {
  if (typeof window === 'undefined') return null
  try {
    if (window.storage?.local?.get) {
      const data = await window.storage.local.get([STORAGE_KEY])
      return data?.[STORAGE_KEY] ?? null
    }
  } catch (error) {
    console.warn('Failed to read from extension storage:', error)
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.warn('Failed to read from localStorage:', error)
    return null
  }
}

export async function writeStoredState(state) {
  if (typeof window === 'undefined') return
  try {
    if (window.storage?.local?.set) {
      await window.storage.local.set({ [STORAGE_KEY]: state })
      return
    }
  } catch (error) {
    console.warn('Failed to write to extension storage:', error)
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn('Failed to write to localStorage:', error)
  }
}