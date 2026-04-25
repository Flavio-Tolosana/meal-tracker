import { useState } from 'react'
import { AppProvider } from './context/AppContext'
import CalendarView from './components/CalendarView'
import DayView from './components/DayView'
import LibraryView from './components/LibraryView'
import SettingsView from './components/SettingsView'
import './App.css'

type Tab = 'calendar' | 'library' | 'settings'

function AppInner() {
  const [tab, setTab] = useState<Tab>('calendar')
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-logo">🍽 Meals</h1>
      </header>

      <main className="app-main">
        {selectedDay ? (
          <DayView date={selectedDay} onBack={() => setSelectedDay(null)} />
        ) : (
          <>
            {tab === 'calendar' && <CalendarView onSelectDay={setSelectedDay} />}
            {tab === 'library' && <LibraryView />}
            {tab === 'settings' && <SettingsView />}
          </>
        )}
      </main>

      {!selectedDay && (
        <nav className="app-nav">
          <button className={`nav-btn ${tab === 'calendar' ? 'active' : ''}`} onClick={() => setTab('calendar')}>
            <span className="nav-icon">📅</span>
            <span className="nav-label">Calendario</span>
          </button>
          <button className={`nav-btn ${tab === 'library' ? 'active' : ''}`} onClick={() => setTab('library')}>
            <span className="nav-icon">📚</span>
            <span className="nav-label">Biblioteca</span>
          </button>
          <button className={`nav-btn ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Ajustes</span>
          </button>
        </nav>
      )}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
