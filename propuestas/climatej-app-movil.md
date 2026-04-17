# Propuesta: App Móvil Climatej — ARS 2.200.000

**Tipo:** App móvil iOS + Android
**Stack:** Expo (React Native) + Supabase + TypeScript
**Tiempo:** 6 semanas
**Precio:** ARS 2.200.000

---

Hola,

Leí toda la especificación y entiendo bien el proyecto: una app donde cada local funciona como contacto independiente, con materiales propios, historial de fotos organizadas por fecha, emergencias con un click, y control de actividad por técnico. Eso es exactamente lo que voy a construir.

**Mi solución:**

Voy a desarrollar Climatej en Expo (React Native) — una sola app que funciona en Android e iOS sin duplicar código. Esto significa desarrollo más rápido, menos bugs, y un único flujo de trabajo para mantener después.

- Backend en Supabase: auth con roles (admin/personal), DB relacional, storage para fotos con historial sin borrado, real-time para que emergencias se vean al instante en todos los devices.
- TypeScript: tipado completo, menos errores en producción.
- Maps integrado: ubicaciones clickeables directo en Google Maps.
- Notificaciones push: emergencias alertan al personal al instante.

**Qué voy a entregar:**

1. Módulo 1 — Usuarios, locales, roles, login seguro (semana 1-2)
2. Módulo 2 — Materiales por local, mantenimiento, instalaciones, emergencias (semana 2-3)
3. Módulo 3 — Galería de fotos con historial organizado, calendario de actividad (semana 3-4)
4. Módulo 4 — Testing, optimización, documentación, deployment a App Store y Play Store (semana 4-6)

**Detalles importantes:**

- Los datos nunca se borran — emergencias, instalaciones, fotos quedan en el historial completo.
- Cada técnico ve solo sus trabajos.
- El admin controla todo: crear/editar/eliminar locales, cambiar roles, activar emergencias con un botón.
- La app funciona offline (caché local) — los datos se sincronizan cuando hay conexión.

**Mi propuesta:**

- Precio: ARS 2.200.000
- Tiempo: 6 semanas (entrega progresiva por módulos)
- Incluye: 30 días de soporte post-entrega para ajustes

**Siguiente paso:**

Podemos hacer una videollamada corta (15 min) para alinear detalles finales.
Estoy listo para empezar esta semana.
