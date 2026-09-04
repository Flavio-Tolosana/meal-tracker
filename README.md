# Meal Tracker

Aplicación web para registrar tus comidas diarias. Mobile-first, funciona como PWA con soporte offline.

App en: https://Flavio-Tolosana.github.io/meal-tracker/

## Características

- **Vista calendario** — navegación mensual con indicadores de días con registros.
- **Registro por período** — cinco comidas diarias: desayuno, almuerzo, comida, merienda y cena.
- **Biblioteca de comidas** — crear, editar, buscar y archivar comidas reutilizables.
- **Importar/exportar CSV** — respaldo y migración de datos en formato estándar.
- **PWA offline-first** — funciona sin conexión, datos almacenados localmente en IndexedDB.

## Tech Stack

| Capa | Tecnología |
|------|------------|
| Framework | React 19 + TypeScript (strict) |
| Bundler | Vite 5 |
| PWA | vite-plugin-pwa + Workbox |
| Base de datos | IndexedDB via `idb` |
| Testing | Vitest + Testing Library |
| Linting | ESLint + typescript-eslint |
| Deploy | GitHub Pages via `gh-pages` |

## Instalación

```bash
git clone https://github.com/Flavio-Tolosana/meal-tracker.git
cd meal-tracker
npm install
```

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa del build |
| `npm run lint` | Linting con ESLint |
| `npm test` | Tests con Vitest |
| `npm run deploy` | Build + deploy a GitHub Pages |

## Estructura del proyecto

```
src/
├── main.tsx              # Punto de entrada
├── App.tsx               # Shell principal (SPA con tabs)
├── types/                # Modelo de datos
├── db/                   # Capa de persistencia (IndexedDB)
├── context/              # Estado global (React Context)
├── components/           # Componentes de UI
│   ├── CalendarView.tsx  # Calendario mensual
│   ├── DayView.tsx       # Registro diario de comidas
│   ├── MealModal.tsx     # Modal para agregar comidas
│   ├── LibraryView.tsx   # Biblioteca de comidas
│   └── SettingsView.tsx  # Ajustes e import/export CSV
└── utils/                # Utilidades (CSV helpers)
```

## Modelo de datos

- **Meal** — comida con nombre, fechas y estado de archivo.
- **DayLog** — registro diario con cinco arrays de IDs de comidas (uno por período).
- **MealPeriod** — `desayuno | almuerzo | comida | merienda | cena`.

## Deploy

```bash
npm run deploy
```

Compila el proyecto y publica el resultado en la rama `gh-pages`.
