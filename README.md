# ⚽ Polla Mundialista — Web

Versión web (ReactJS) de la app móvil [`frontend_polla`](../frontend_polla), con la misma arquitectura (Clean Code + Zustand + servicios) y el design system **Pitch Kinetic Dark**.

## Stack
- **Vite + React 18**
- **Tailwind CSS v3** (tokens Pitch Kinetic Dark)
- **Zustand** (estado global, persistencia en `localStorage`)
- **Axios** (mismo backend que la app móvil)
- **React Router** (rutas protegidas por token)
- **lucide-react** (iconos)

## Estructura (idéntica conceptualmente a la app móvil)
```
src/
├── api/            # axiosConfig + services (auth, group, prediction)
├── store/          # useAuthStore, useGroupsStore, useMatchesStore
├── components/atoms/  # Avatar, TeamBadge
├── pages/          # Login, Register, Matches, Groups, GroupDetail, Profile
├── layout/         # AppLayout (contenedor móvil) + BottomNav
├── config/ theme/ utils/
```

## Pantallas
- **Login / Register** con validación.
- **Matches**: tabs Próximos / Finalizados; finalizados con drawer de **goleadores**.
- **Groups**: tabs Mis Grupos / Acciones (crear / unirse).
- **GroupDetail**: banner editable (solo admin), código copiable, **Ranking** (podio + lista, badge Admin) y **Mis Pronósticos** (predecir; bloqueado al iniciar el partido).
- **Profile**: avatar editable (subida + compresión), stats, logout.

## Correr
1. Levanta el backend (`../backend_polla`) en `http://localhost:3000`.
2. Instala y arranca:
   ```bash
   npm install
   npm run dev
   ```
3. Abre `http://localhost:5173`.

> La URL del backend se configura en [`src/config/env.js`](src/config/env.js).
> Las imágenes (grupo / avatar) se comprimen con canvas y se guardan como base64 (mismo flujo que la app móvil).
