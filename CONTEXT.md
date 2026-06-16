# 🧠 Contexto — `frontend_polla_web` (App web)

> Documento para que otra IA/dev continúe. Refleja el estado actual.

## ¿Qué es?
Versión web (**ReactJS + Vite**) de la Polla Mundialista. Port de la app móvil [`frontend_polla`](../frontend_polla): misma arquitectura, mismo backend y mismo design system, con idioms web. Contenedor estilo móvil (`max-w-md`). Desplegada en **Netlify** (`pollamundialista2026cop.netlify.app`).

## Stack
- **Vite + React 18**, **Tailwind CSS v3** (tokens "Pitch Kinetic Dark", cian eléctrico).
- **Zustand** (estado, persistencia en `localStorage`), **React Router v6** (rutas protegidas por token).
- **Axios** + **lucide-react**. `@react-oauth/google` instalado (botones ocultos por ahora).

## Arquitectura (espejo de la móvil)
```
src/
├── api/            # axiosConfig (token de localStorage) + services (auth, group, prediction)
├── store/          # useAuthStore, useGroupsStore, useMatchesStore, useDialog
├── components/     # Avatar(uri), TeamBadge, DialogHost, GoogleAuthButton
├── pages/          # Login, Register, Matches, Groups, GroupDetail, Profile
├── layout/         # AppLayout (contenedor móvil) + BottomNav
├── config/ theme/ utils/
```

## Funcionalidades actuales (paridad con la móvil)
- **Auth**: login/registro por correo. Endpoint Google existe; **botones de Google ocultos** (se reactivan con `GoogleAuthButton` + `VITE_GOOGLE_CLIENT_ID`).
- **Matches**: sección **"En vivo ahora"** (status `live`, marcador actual + badge pulsante) + tabs Próximos/Finalizados; finalizados con **drawer de goleadores**. **Auto-refresh** (polling 30s) mientras haya partidos en vivo.
- **Groups**: tabs Mis Grupos / Acciones. Crear (**checkbox Público/Privado**), unirse por código, **explorar y unirse a grupos públicos**.
- **GroupDetail**: banner **editable solo admin** (imagen base64) con **código de invitación inmerso**; **Ranking** con **fotos** + badge Admin; **tocar podio o filas** abre **modal con sus pronósticos** (partidos cerrados, **scroll interno** tras ~3, modal centrado); **Mis Pronósticos** (predecir; bloqueado al iniciar).
- **Profile**: avatar editable (file input + compresión por canvas), stats, logout.
- **Diálogos**: `useDialog` + `DialogHost` (alert/confirm) en vez de `alert()/confirm()` nativos.

## Routing en producción (SPA)
Al recargar rutas como `/matches` el server da 404 si no se redirige a `index.html`. Configurado:
- **Netlify**: [`public/_redirects`](public/_redirects) + [`netlify.toml`](netlify.toml) (`/* /index.html 200`).
- **Vercel**: [`vercel.json`](vercel.json) con rewrite a `/index.html`.

## Config / env (Vite, prefijo `VITE_`)
- [`.env`](.env): `VITE_API_BASE_URL` (backend Vercel), `VITE_REQUEST_TIMEOUT`, `VITE_GOOGLE_CLIENT_ID`.
- En **Netlify**: definir esas `VITE_*` en Site settings → Environment variables (Vite las incrusta al build) y reconstruir.
- Imágenes: compresión por **canvas** ([`utils/image.js`](src/utils/image.js)).

## Diferencias vs. móvil (intencionales)
| Tema | Móvil | Web |
|---|---|---|
| Navegación | React Navigation | React Router (URLs) |
| Sesión | AsyncStorage | localStorage |
| Imágenes | expo-image-picker/manipulator | `<input type=file>` + canvas |
| Iconos | lucide-react-native | lucide-react |

## Correr
```bash
npm install
npm run dev          # http://localhost:5173
```
Requiere el `backend_polla` accesible (por defecto el de Vercel). Cambia `VITE_API_BASE_URL` para apuntar a local.

## Pendientes / ideas
- Reactivar botones de Google (poner `VITE_GOOGLE_CLIENT_ID` y autorizar el dominio en Google Cloud).
- PWA / mejoras responsive para escritorio.

## Relación
Cliente web del `backend_polla`, hermano de `frontend_polla` (misma lógica y diseño).
