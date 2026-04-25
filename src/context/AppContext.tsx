import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Meal, DayLog, MealPeriod } from '../types'
import { MEAL_PERIODS } from '../types'
import * as db from '../db/indexedDB'

interface AppContextType {
  meals: Meal[]
  dayLogs: DayLog[]
  addMeal: (name: string) => Promise<Meal>
  updateMeal: (meal: Meal) => Promise<void>
  getMealById: (id: string) => Meal | undefined
  getDayLog: (date: string) => DayLog | undefined
  addMealToDay: (date: string, period: MealPeriod, mealId: string) => Promise<void>
  removeMealFromDay: (date: string, period: MealPeriod, mealId: string) => Promise<void>
  importCSV: (csv: string) => Promise<void>
  exportCSV: () => string
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [meals, setMeals] = useState<Meal[]>([])
  const [dayLogs, setDayLogs] = useState<DayLog[]>([])

  useEffect(() => {
    async function loadData() {
      const [allMeals, allDayLogs] = await Promise.all([
        db.getAllMeals(),
        db.getAllDayLogs(),
      ])
      setMeals(allMeals)
      setDayLogs(allDayLogs)
    }
    loadData()
  }, [])

  const addMeal = useCallback(async (name: string): Promise<Meal> => {
    const meal: Meal = {
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isArchived: false,
    }
    await db.addMeal(meal)
    setMeals(prev => [...prev, meal])
    return meal
  }, [])

  const updateMeal = useCallback(async (meal: Meal) => {
    const updated = { ...meal, updatedAt: Date.now() }
    await db.updateMeal(updated)
    setMeals(prev => prev.map(m => m.id === meal.id ? updated : m))
  }, [])

  const getMealById = useCallback((id: string) => {
    return meals.find(m => m.id === id)
  }, [meals])

  const getDayLog = useCallback((date: string) => {
    return dayLogs.find(d => d.date === date)
  }, [dayLogs])

  const getOrCreateDayLog = useCallback((date: string): DayLog => {
    const existing = dayLogs.find(d => d.date === date)
    if (existing) return existing
    return {
      date,
      entries: {
        desayuno: [],
        almuerzo: [],
        comida: [],
        merienda: [],
        cena: [],
      },
      updatedAt: Date.now(),
    }
  }, [dayLogs])

  const addMealToDay = useCallback(async (date: string, period: MealPeriod, mealId: string) => {
    const dayLog = getOrCreateDayLog(date)
    if (dayLog.entries[period].includes(mealId)) return
    const updated: DayLog = {
      ...dayLog,
      entries: {
        ...dayLog.entries,
        [period]: [...dayLog.entries[period], mealId],
      },
      updatedAt: Date.now(),
    }
    await db.saveDayLog(updated)
    setDayLogs(prev => {
      const exists = prev.find(d => d.date === date)
      if (exists) return prev.map(d => d.date === date ? updated : d)
      return [...prev, updated]
    })
  }, [getOrCreateDayLog])

  const removeMealFromDay = useCallback(async (date: string, period: MealPeriod, mealId: string) => {
    const dayLog = dayLogs.find(d => d.date === date)
    if (!dayLog) return
    const updated: DayLog = {
      ...dayLog,
      entries: {
        ...dayLog.entries,
        [period]: dayLog.entries[period].filter(id => id !== mealId),
      },
      updatedAt: Date.now(),
    }
    await db.saveDayLog(updated)
    setDayLogs(prev => prev.map(d => d.date === date ? updated : d))
  }, [dayLogs])

  const importCSV = useCallback(async (csv: string) => {
    const lines = csv.trim().split('\n')
    const header = lines[0].toLowerCase()
    if (!header.includes('date') || !header.includes('period') || !header.includes('meal')) {
      throw new Error('CSV inválido. Debe tener columnas: date,period,meal')
    }
    const dataLines = lines.slice(1)

    // Build meal name -> id map
    const mealMap = new Map<string, string>()
    const currentMeals = await db.getAllMeals()
    currentMeals.forEach(m => mealMap.set(m.name.toLowerCase(), m.id))

    const logsToSave = new Map<string, DayLog>()

    for (const line of dataLines) {
      if (!line.trim()) continue
      const [date, period, ...mealParts] = line.split(',')
      const mealName = mealParts.join(',').trim()
      const periodTrimmed = period?.trim() as MealPeriod

      if (!date || !periodTrimmed || !mealName) continue
      if (!MEAL_PERIODS.includes(periodTrimmed)) continue

      // Find or create meal
      let mealId = mealMap.get(mealName.toLowerCase())
      if (!mealId) {
        const newMeal: Meal = {
          id: crypto.randomUUID(),
          name: mealName,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isArchived: false,
        }
        await db.addMeal(newMeal)
        mealMap.set(mealName.toLowerCase(), newMeal.id)
        mealId = newMeal.id
        setMeals(prev => [...prev, newMeal])
      }

      // Get or create daylog
      const dateTrimmed = date.trim()
      if (!logsToSave.has(dateTrimmed)) {
        const existing = await db.getDayLog(dateTrimmed)
        logsToSave.set(dateTrimmed, existing ?? {
          date: dateTrimmed,
          entries: { desayuno: [], almuerzo: [], comida: [], merienda: [], cena: [] },
          updatedAt: Date.now(),
        })
      }

      const log = logsToSave.get(dateTrimmed)!
      if (!log.entries[periodTrimmed].includes(mealId)) {
        log.entries[periodTrimmed] = [...log.entries[periodTrimmed], mealId]
        log.updatedAt = Date.now()
      }
    }

    for (const log of logsToSave.values()) {
      await db.saveDayLog(log)
    }

    const allLogs = await db.getAllDayLogs()
    setDayLogs(allLogs)
  }, [])

  const exportCSV = useCallback(() => {
    const lines = ['date,period,meal']
    for (const log of dayLogs) {
      for (const period of MEAL_PERIODS) {
        for (const mealId of log.entries[period]) {
          const meal = meals.find(m => m.id === mealId)
          if (meal) {
            lines.push(`${log.date},${period},${meal.name}`)
          }
        }
      }
    }
    return lines.join('\n')
  }, [dayLogs, meals])

  return (
    <AppContext.Provider value={{
      meals,
      dayLogs,
      addMeal,
      updateMeal,
      getMealById,
      getDayLog,
      addMealToDay,
      removeMealFromDay,
      importCSV,
      exportCSV,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
