import { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { Meal } from '../types'

export default function LibraryView() {
  const { meals, updateMeal, loading } = useApp()
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const filtered = meals
    .filter(m => !m.isArchived && m.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))

  const archived = meals.filter(m => m.isArchived)
    .sort((a, b) => a.name.localeCompare(b.name))

  function startEdit(meal: Meal) {
    setEditingId(meal.id)
    setEditName(meal.name)
  }

  async function saveEdit(meal: Meal) {
    if (!editName.trim()) return
    await updateMeal({ ...meal, name: editName.trim() })
    setEditingId(null)
  }

  async function archiveMeal(meal: Meal) {
    await updateMeal({ ...meal, isArchived: true })
  }

  async function restoreMeal(meal: Meal) {
    await updateMeal({ ...meal, isArchived: false })
  }

  return (
    <div className="library-view">
      <div className="library-search-wrap">
        <input
          className="library-search"
          type="text"
          placeholder="Buscar en biblioteca..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Buscar en biblioteca"
        />
      </div>

      {loading ? (
        <p className="loading-message">Cargando...</p>
      ) : (
      <div className="library-list">
        {filtered.map(meal => (
          <div key={meal.id} className="library-item">
            {editingId === meal.id ? (
              <div className="library-edit-row">
                <input
                  className="library-edit-input"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') void saveEdit(meal)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  autoFocus
                  aria-label="Nombre de la comida"
                />
                <button className="lib-save-btn" onClick={() => void saveEdit(meal)}>✓</button>
                <button className="lib-cancel-btn" onClick={() => setEditingId(null)}>✕</button>
              </div>
            ) : (
              <div className="library-item-row">
                <span className="library-item-name">{meal.name}</span>
                <div className="library-item-actions">
                  <button className="lib-edit-btn" onClick={() => startEdit(meal)} aria-label="Editar">✎</button>
                  <button className="lib-archive-btn" onClick={() => void archiveMeal(meal)} aria-label="Archivar">⊘</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="library-empty">No hay comidas{query ? ' que coincidan' : ''}</p>
        )}
      </div>
      )}

      {archived.length > 0 && (
        <div className="library-archived-section">
          <h3 className="archived-title">Archivadas ({archived.length})</h3>
          {archived.map(meal => (
            <div key={meal.id} className="library-item archived">
              <span className="library-item-name">{meal.name}</span>
              <button className="lib-restore-btn" onClick={() => void restoreMeal(meal)} aria-label="Restaurar">↩</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
