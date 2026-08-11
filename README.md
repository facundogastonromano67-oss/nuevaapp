# Solo Leveling Real / Vida RPG G30 — FACU OWNER

Aplicación personal offline-first para progreso RPG, G30, tareas, hábitos, entrenamiento, nutrición, Academia, habilidades reales y Arena PvE.

## Inicio

```bash
cp .env.example .env
pnpm install
pnpm run dev
```

Abrí la dirección `http://localhost:5173` que muestra Vite. No abras `index.html` o `dist/index.html` con doble clic: los navegadores bloquean módulos JavaScript bajo el protocolo `file://`.

Para probar exactamente el build final:

```bash
pnpm run build
pnpm run preview
```

Si una instalación anterior muestra una pantalla de recuperación, usá **Limpiar caché y recargar**. Esa acción elimina únicamente archivos temporales de la PWA; no borra el progreso guardado en LocalStorage.

Supabase es opcional. Sin variables de entorno, todos los datos persisten localmente y pueden exportarse/importarse como JSON.

## Ediciones

`VITE_APP_EDITION=owner` mantiene todo desbloqueado. La arquitectura y el esquema dejan preparado un futuro modo `users`, donde los entitlements Premium deben provenir exclusivamente del servidor.
