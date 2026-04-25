import { useState } from 'react'
import { useApp } from '../context/AppContext'

interface CalendarViewProps {
  onSelectDay: (date: string) => void
}

function toLocalDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function todayString(): string {
  const now = new Date()
  return toLocalDateString(now.getFullYear(), now.getMonth(), now.getDate())
}

export default function CalendarView({ onSelectDay }: CalendarViewProps) {
  const { dayLogs } = useApp()
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const datesWithData = new Set(dayLogs.filter(d => {
    return Object.values(d.entries).some(arr => arr.length > 0)
  }).map(d => d.date))

  const firstDay = new Date(viewYear, viewMonth, 1)
  const lastDay = new Date(viewYear, viewMonth + 1, 0)
  const startDow = (firstDay.getDay() + 6) % 7 // Monday = 0
  const daysInMonth = lastDay.getDate()

  const monthName = firstDay.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const todayStr = todayString()

  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="calendar-view">
      <div className="cal-nav">
        <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
        <span className="cal-month-label">{monthName}</span>
        <button className="cal-nav-btn" onClick={nextMonth}>›</button>
      </div>

      <div className="cal-grid">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
          <div key={d} className="cal-dow">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} className="cal-cell empty" />
          const dateStr = toLocalDateString(viewYear, viewMonth, day)
          const hasData = datesWithData.has(dateStr)
          const isToday = dateStr === todayStr
          return (
            <button
              key={dateStr}
              className={`cal-cell ${hasData ? 'has-data' : ''} ${isToday ? 'is-today' : ''}`}
              onClick={() => onSelectDay(dateStr)}
            >
              <span className="cal-day-num">{day}</span>
              {hasData && <span className="cal-dot" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
