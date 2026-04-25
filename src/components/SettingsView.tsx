import { useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { downloadCSV, readFileAsText } from '../utils/csv'

export default function SettingsView() {
  const { exportCSV, importCSV } = useApp()
  const fileRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  function handleExport() {
    const csv = exportCSV()
    const date = new Date().toISOString().split('T')[0]
    downloadCSV(csv, `meal-tracker-${date}.csv`)
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    setMessage(null)
    try {
      const text = await readFileAsText(file)
      await importCSV(text)
      setMessage({ type: 'ok', text: '¡Importado correctamente!' })
    } catch (err) {
      setMessage({ type: 'err', text: String(err) })
    } finally {
      setImporting(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="settings-view">
      <h2 className="settings-title">Ajustes</h2>

      <div className="settings-section">
        <h3 className="settings-section-title">Datos</h3>

        <button className="settings-btn export-btn" onClick={handleExport}>
          <span>📥</span> Exportar CSV
        </button>

        <button
          className="settings-btn import-btn"
          onClick={() => fileRef.current?.click()}
          disabled={importing}
        >
          <span>📤</span> {importing ? 'Importando...' : 'Importar CSV'}
        </button>

        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          style={{ display: 'none' }}
          onChange={handleImport}
        />

        {message && (
          <div className={`settings-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="settings-hint">
          <strong>Formato CSV:</strong>
          <pre>{`date,period,meal\n2026-04-23,desayuno,cafe\n2026-04-23,comida,pollo`}</pre>
          <p>Periodos: desayuno, almuerzo, comida, merienda, cena</p>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-section-title">Instalar app</h3>
        <p className="settings-hint-text">En iPhone: abre en Safari → Compartir → Añadir a pantalla de inicio</p>
        <p className="settings-hint-text">En Android: menú del navegador → Instalar app</p>
      </div>
    </div>
  )
}
