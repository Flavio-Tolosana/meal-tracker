export type MealPeriod = 'desayuno' | 'almuerzo' | 'comida' | 'merienda' | 'cena'

export const MEAL_PERIODS: MealPeriod[] = ['desayuno', 'almuerzo', 'comida', 'merienda', 'cena']

export const PERIOD_LABELS: Record<MealPeriod, string> = {
  desayuno: 'Desayuno',
  almuerzo: 'Almuerzo',
  comida: 'Comida',
  merienda: 'Merienda',
  cena: 'Cena',
}

export const PERIOD_ICONS: Record<MealPeriod, string> = {
  desayuno: '☀️',
  almuerzo: '🌤️',
  comida: '🌞',
  merienda: '🌅',
  cena: '🌙',
}

export type Meal = {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  isArchived: boolean
}

export type DayLog = {
  date: string // YYYY-MM-DD
  entries: {
    [key in MealPeriod]: string[]
  }
  updatedAt: number
}
