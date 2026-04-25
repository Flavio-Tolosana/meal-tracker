import { openDB } from 'idb'
import type { DBSchema, IDBPDatabase } from 'idb'
import type { Meal, DayLog } from '../types'

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
  const db = await getDB()
  return db.getAll('meals')
}

export async function addMeal(meal: Meal): Promise<void> {
  const db = await getDB()
  await db.put('meals', meal)
}

export async function updateMeal(meal: Meal): Promise<void> {
  const db = await getDB()
  await db.put('meals', meal)
}

export async function getDayLog(date: string): Promise<DayLog | undefined> {
  const db = await getDB()
  return db.get('dayLogs', date)
}

export async function getAllDayLogs(): Promise<DayLog[]> {
  const db = await getDB()
  return db.getAll('dayLogs')
}

export async function saveDayLog(dayLog: DayLog): Promise<void> {
  const db = await getDB()
  await db.put('dayLogs', dayLog)
}
