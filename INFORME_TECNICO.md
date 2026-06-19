# Informe Técnico — Desarrollo Ágil Asistido por IA

## 1. Tu Arsenal

- **Claude** (Anthropic, vía claude.ai / Claude Code) — copiloto principal de
  desarrollo: scaffolding, diseño de esquema de datos, generación de endpoints,
  debugging, documentación.
- _(completar si usás algo más: Cursor, GitHub Copilot, etc.)_

## 2. Sinergia con la IA

> Completar a medida que avances. Algunos ejemplos de arranque, basados en
> decisiones que ya tomamos juntos en este proyecto:

- **Elección de stack**: se evaluó mantener un backend separado (PHP) vs.
  unificar todo en Next.js full-stack. Se optó por unificar para simplificar
  el deploy gratuito (Vercel) y reducir superficie de bugs de integración
  frontend-backend.
- **Diseño del modelo de datos**: el esquema de Prisma (`Company`, `Job`,
  `Applicant`, `Application`) se diseñó previniendo de entrada un bug real
  que había ocurrido en un proyecto anterior similar: el endpoint de stats
  del dashboard contaba mal porque sumaba sobre una lista ya paginada en
  vez de contar contra la base. Acá el endpoint `/api/dashboard/stats` usa
  `prisma.count()` / `groupBy()` directo contra la DB, evitando esa clase
  de error desde el diseño.
- _(agregar: prompts concretos que usaste, qué generó bien la IA a la
  primera, qué tuviste que corregir, capturas de pantalla si suma)_

## 3. Lecciones Aprendidas

- _¿Qué prompt funcionó mejor?_ — completar.
- _¿En qué falló la IA?_ — completar (ej: necesitó contexto del bug
  anterior para no repetir el mismo error de diseño en el endpoint de stats).
- _¿Qué harías distinto la próxima vez?_ — completar.

## 4. Checklist de evidencia

- [ ] Capturas o links de prompts representativos.
- [ ] Al menos un caso de debugging real documentado paso a paso.
- [ ] Reflexión final sobre el flujo ágil con IA (qué tan rápido fue vs. un
      desarrollo "tradicional").
