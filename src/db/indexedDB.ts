import { openDB } from 'idb'
import type { DBSchema, IDBPDatabase } from 'idb'
import type { Meal, DayLog } from '../types'
import { MEAL_PERIODS } from '../types'

interface MealTrackerDB extends DBSchema {
  meals: {
    key: string
    value: Meal
  }
  dayLogs: {
    key: string
    value: DayLog
  }
}

// Migration strategy:
// - Version 1: Initial schema (meals, dayLogs stores)
// - To add a new migration: increment the version number in getDB()
//   and add an upgrade handler that alters the relevant store.
// - Never remove or rename existing stores/fields — only add.

function validateMeal(data: unknown): data is Meal {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>
  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.createdAt === 'number' &&
    typeof obj.updatedAt === 'number' &&
    typeof obj.isArchived === 'boolean'
  )
}

function validateDayLog(data: unknown): data is DayLog {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>
  if (typeof obj.date !== 'string' || typeof obj.updatedAt !== 'number') return false
  if (typeof obj.entries !== 'object' || obj.entries === null) return false
  const entries = obj.entries as Record<string, unknown>
  for (const period of MEAL_PERIODS) {
    if (!Array.isArray(entries[period])) return false
    if (!entries[period].every((id: unknown) => typeof id === 'string')) return false
  }
  return true
}

let db: IDBPDatabase<MealTrackerDB> | null = null

async function getDB() {
  if (!db) {
    db = await openDB<MealTrackerDB>('meal-tracker', 1, {
      upgrade(db) {
        db.createObjectStore('meals', { keyPath: 'id' })
        db.createObjectStore('dayLogs', { keyPath: 'date' })
      },
    })
  }
  return db
}

export async function getAllMeals(): Promise<Meal[]> {
  const database = await getDB()
  const data = await database.getAll('meals')
  return data.filter(validateMeal)
}

export async function addMeal(meal: Meal): Promise<void> {
  if (!validateMeal(meal)) throw new Error('Invalid meal data')
  const database = await getDB()
  await database.put('meals', meal)
}

export async function updateMeal(meal: Meal): Promise<void> {
  if (!validateMeal(meal)) throw new Error('Invalid meal data')
  const database = await getDB()
  await database.put('meals', meal)
}

export async function getDayLog(date: string): Promise<DayLog | undefined> {
  const database = await getDB()
  const data = await database.get('dayLogs', date)
  if (data && !validateDayLog(data)) return undefined
  return data
}

export async function getAllDayLogs(): Promise<DayLog[]> {
  const database = await getDB()
  const data = await database.getAll('dayLogs')
  return data.filter(validateDayLog)
}

export async function saveDayLog(dayLog: DayLog): Promise<void> {
  if (!validateDayLog(dayLog)) throw new Error('Invalid day log data')
  const database = await getDB()
  await database.put('dayLogs', dayLog)
}
