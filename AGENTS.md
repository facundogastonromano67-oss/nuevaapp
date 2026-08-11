# Guía para agentes — SYSTEM / FACU OWNER

## Arquitectura

- `src/data.js`: catálogo inicial de habilidades, contenido, comidas, ejercicios y Arena.
- `src/engines.js`: reglas puras de G30, nivel/XP, rangos, misiones, reportes y PvE. Mantener testeable y sin DOM.
- `src/store.js`: estado canónico, migración inicial y persistencia LocalStorage. Toda mutación pasa por `setState`.
- `src/views.js`: vistas y controladores de interacción. Las cinco rutas principales deben seguir siendo exactamente General, Entrenamiento, Nutrición, Academia y Más.
- `src/styles.css`: sistema visual mobile-first. Dorado sólo para elite/recompensas.
- `supabase/schema.sql`: sincronización opcional. LocalStorage siempre debe continuar funcionando sin credenciales.

## Invariantes

1. XP/nivel RPG y habilidades reales son sistemas independientes.
2. Una habilidad sólo cambia por evidencia explícita (baseline, quiz o desempeño excepcional).
3. OWNER no contiene anuncios, paywall ni límites. La edición se selecciona con `VITE_APP_EDITION`.
4. Nunca exponer `service_role`; los entitlements son autoridad exclusiva del servidor.
5. Toda acción destructiva o importante del asistente exige confirmación visible.
6. No ocultar flujos diarios importantes en código o pantallas de configuración.

## Validación

```bash
pnpm install
pnpm test
pnpm run build
pnpm run dev
```

Probar manualmente onboarding, navegación a cinco destinos, CRUD de tareas, misiones, hábitos, sets de entrenamiento, recetas/comidas, quiz, Arena, export/import y recarga persistente.
