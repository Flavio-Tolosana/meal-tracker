import { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { MealPeriod } from '../types'
import { MEAL_PERIODS, PERIOD_LABELS, PERIOD_ICONS } from '../types'
import MealModal from './MealModal'

interface DayViewProps {
  date: string
  onBack: () => void
}

export default function DayView({ date, onBack }: DayViewProps) {
  const { getDayLog, getMealById, removeMealFromDay, loading } = useApp()
  const [modalPeriod, setModalPeriod] = useState<MealPeriod | null>(null)

  const dayLog = getDayLog(date)

  const [year, month, day] = date.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)
  const formatted = dateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  function getMealsForPeriod(period: MealPeriod) {
    if (!dayLog) return []
    return dayLog.entries[period]
      .map(id => getMealById(id))
      .filter(Boolean) as NonNullable<ReturnType<typeof getMealById>>[]
  }

  return (
    <div className="day-view">
      <div className="day-header">
        <button className="back-btn" onClick={onBack}>
          ← Volver
        </button>
        <h2 className="day-title">{formatted}</h2>
      </div>

      {loading ? (
        <p className="loading-message">Cargando...</p>
      ) : (
      <div className="periods-list">
        {MEAL_PERIODS.map(period => {
          const periodMeals = getMealsForPeriod(period)
          return (
            <div key={period} className="period-block">
              <div className="period-header">
                <span className="period-icon">{PERIOD_ICONS[period]}</span>
                <span className="period-label">{PERIOD_LABELS[period]}</span>
                <button
                  className="add-meal-btn"
                  onClick={() => setModalPeriod(period)}
                  aria-label={`Añadir comida a ${PERIOD_LABELS[period]}`}
                >
                  +
                </button>
              </div>
              <div className="period-meals">
                {periodMeals.length === 0 ? (
                  <span className="period-empty">Sin registros</span>
                ) : (
                  periodMeals.map(meal => (
                    <div key={meal.id} className="meal-chip">
                      <span className="meal-chip-name">{meal.name}</span>
                      <button
                        className="meal-chip-remove"
                        onClick={() => void removeMealFromDay(date, period, meal.id)}
                        aria-label={`Eliminar ${meal.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
      )}

      {modalPeriod && (
        <MealModal
          date={date}
          period={modalPeriod}
          onClose={() => setModalPeriod(null)}
        />
      )}
    </div>
  )
}
