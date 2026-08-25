import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import type { MealPeriod } from '../types'
import { PERIOD_LABELS } from '../types'

interface MealModalProps {
  date: string
  period: MealPeriod
  onClose: () => void
}

export default function MealModal({ date, period, onClose }: MealModalProps) {
  const { meals, addMeal, addMealToDay } = useApp()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleOverlayKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    function handleTabTrap(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      const sheet = document.querySelector('.modal-sheet')
      if (!sheet) return
      const focusable = sheet.querySelectorAll<HTMLElement>(
        'input, button, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleOverlayKey)
    document.addEventListener('keydown', handleTabTrap)
    return () => {
      document.removeEventListener('keydown', handleOverlayKey)
      document.removeEventListener('keydown', handleTabTrap)
    }
  }, [onClose])

  const filtered = meals
    .filter(m => !m.isArchived && m.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))

  const exactMatch = meals.find(m => m.name.toLowerCase() === query.toLowerCase() && !m.isArchived)

  async function handleSelect(mealId: string) {
    await addMealToDay(date, period, mealId)
    onClose()
  }

  async function handleCreate() {
    if (!query.trim()) return
    const meal = await addMeal(query.trim())
    await addMealToDay(date, period, meal.id)
    onClose()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') onClose()
    if (e.key === 'Enter') {
      if (filtered.length === 1) {
        void handleSelect(filtered[0].id)
      } else if (!exactMatch && query.trim()) {
        void handleCreate()
      }
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-sheet"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Añadir comida a ${PERIOD_LABELS[period]}`}
      >
        <div className="modal-header">
          <span className="modal-title">Añadir a {PERIOD_LABELS[period]}</span>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="modal-search-wrap">
          <input
            ref={inputRef}
            className="modal-search"
            type="text"
            placeholder="Buscar comida..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="modal-results">
          {filtered.map(meal => (
            <button
              key={meal.id}
              className="modal-result-item"
              onClick={() => void handleSelect(meal.id)}
            >
              <span className="result-name">{meal.name}</span>
              <span className="result-add">+</span>
            </button>
          ))}

          {query.trim() && !exactMatch && (
            <button className="modal-create-btn" onClick={() => void handleCreate()}>
              <span className="create-icon">✦</span>
              Crear «{query.trim()}»
            </button>
          )}

          {filtered.length === 0 && !query.trim() && (
            <p className="modal-empty">Escribe para buscar o crear una comida</p>
          )}
        </div>
      </div>
    </div>
  )
}
