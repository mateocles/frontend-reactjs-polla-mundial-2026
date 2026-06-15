# 🧠 Contexto — `frontend_polla_web` (App web)

## ¿Qué es?
La **versión web** (navegador) de la Polla Mundialista, hecha con **ReactJS (Vite)**. Es un port de la app móvil [`frontend_polla`](../frontend_polla): misma arquitectura, mismo backend y mismo design system, pero con idioms web. Pensada como una PWA estilo móvil (contenedor centrado `max-w-md`).

## Stack
- **Vite + React 18**.
- **Tailwind CSS v3** (tokens "Pitch Kinetic Dark", reales de web — los mockups originales eran Tailwind web, así que el calce es muy fiel).
- **Zustand** — estado global, persistencia en **`localStorage`**.
- **React Router v6** — navegación por URL con **rutas protegidas** por token.
- **Axios** (mismo backend) + **lucide-react** (iconos).

## Arquitectura (espejo de la app móvil)
```
src/
├── api/            # axiosConfig (token desde localStorage) + services
├── store/          # useAuthStore, useGroupsStore, useMatchesStore
├── components/atoms/  # Avatar, TeamBadge
├── pages/          # Login, Register, Matches, Groups, GroupDetail, Profile
├── layout/         # AppLayout (contenedor móvil) + BottomNav
├── config/ theme/ utils/
```

## Pantallas (paridad con la móvil)
- **Login / Register** con validación.
- **Matches**: tabs Próximos / Finalizados; finalizados con **drawer de goleadores**.
- **Groups**: tabs Mis Grupos / Acciones (crear / unirse, código copiable).
- **GroupDetail**: banner **editable solo admin**, código, **Ranking** (podio + lista + badge Admin) y **Mis Pronósticos** (predecir; bloqueado al iniciar el partido).
- **Profile**: avatar editable, stats, logout.

## Diferencias intencionales vs. la app móvil
| Tema | Móvil (`frontend_polla`) | Web (`frontend_polla_web`) |
|---|---|---|
| Navegación | React Navigation (tabs nativos) | React Router (URLs) |
| Sesión | AsyncStorage | localStorage |
| Estilos | NativeWind | Tailwind CSS web |
| Imágenes | expo-image-picker/manipulator | `<input type=file>` + **canvas** |
| Iconos | lucide-react-native | lucide-react |

> La lógica (stores, services, reglas, compresión a base64, banderas flagcdn) es **equivalente** a la móvil.

## Correr
```bash
npm install
npm run dev          # http://localhost:5173
```
Requiere el `backend_polla` en `http://localhost:3000` (CORS habilitado). URL configurable en [`src/config/env.js`](src/config/env.js).

## Relación
Cliente web del `backend_polla`, hermano de la app móvil `frontend_polla`. Comparten backend, modelo mental y diseño.
