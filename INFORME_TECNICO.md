# Informe Técnico — Desarrollo Ágil Asistido por IA

## 1. Tu Arsenal

- **Claude** (Anthropic, vía claude.ai) — copiloto principal de desarrollo: scaffolding
  del proyecto completo, diseño del esquema de datos, generación de endpoints,
  debugging de errores de build/deploy en tiempo real, y redacción de esta
  documentación.

## 2. Sinergia con la IA

### Decisión de stack
Se evaluó mantener un backend separado (PHP, como en un proyecto previo) vs.
unificar todo en Next.js full-stack. Se optó por unificar para simplificar el
deploy gratuito en Vercel y reducir la superficie de bugs de integración
frontend-backend. La IA generó el scaffold completo (Next.js + TypeScript +
Prisma + Tailwind) en minutos, incluyendo el esquema de datos (`Company`,
`Job`, `Applicant`, `Application`) con sus relaciones.

### Diseño preventivo del endpoint de stats
El endpoint `/api/dashboard/stats` se diseñó desde el principio usando
`prisma.count()` y `groupBy()` directo contra la base, en vez de traer una
lista paginada y contar su longitud en memoria. Esta decisión se tomó
explícitamente para evitar repetir un bug real de un proyecto anterior, donde
el dashboard undercounted por contar sobre datos ya recortados por paginación.

### Debugging de la cadena de deploy (el caso más rico de esta sesión)
Surgieron varios problemas en cascada al desplegar en Vercel, todos
diagnosticados con ayuda de la IA leyendo los logs de build:

1. **Cambio de API en Next.js 16**: los route handlers dinámicos
   (`/api/jobs/[id]`) cambiaron la firma de `params` de objeto síncrono a
   `Promise`. El build fallaba en el type-check de TypeScript con un error
   específico de `RouteHandlerConfig`. Se corrigió tipando `params` como
   `Promise<{ id: string }>` y usando `await params` en cada handler.
2. **Breaking change de Prisma 7**: la versión instalada por defecto (7.8.0)
   eliminó el soporte de `url` directo en `schema.prisma`, exigiendo migrar a
   `prisma.config.ts` con adapters. Para no asumir esa migración bajo presión
   de tiempo, se optó por fijar la versión en `6.19.3` (exacta, sin `^`) tanto
   en `package.json` como regenerando el lockfile.
3. **Pre-renderizado estático con dependencia de DB**: Next.js intentaba
   generar `/dashboard` y `/` como páginas estáticas en build time, lo que
   requería `DATABASE_URL` disponible durante el build. Se resolvió agregando
   `export const dynamic = "force-dynamic"` en ambas páginas.
4. **Confusión de repos/proyectos duplicados**: a lo largo del proceso de
   conectar GitHub con Vercel se generaron, sin intención, tres repos
   distintos (`empleo-app`, `empleo-app2`, `empleo-app-vercel`) y dos
   proyectos de Vercel apuntando a repos distintos. Esto causaba que los
   fixes pusheados a un repo no se reflejaran en el deploy, porque Vercel
   seguía mirando otro repo. Se diagnosticó comparando `git remote -v` local
   contra "Settings → Git" en cada proyecto de Vercel, y se resolvió
   consolidando todo en un solo proyecto conectado al repo real.
5. **Variable de entorno con valor de ejemplo pegado literalmente**: al copiar
   instrucciones con un placeholder de `DATABASE_URL` de ejemplo, se pegó el
   texto ilustrativo en lugar de la connection string real de Neon, generando
   un error de autenticación. Se resolvió señalando explícitamente que el
   string de ejemplo nunca era una credencial válida.

## 3. Lecciones Aprendidas

- **¿Qué funcionó mejor?** Pegar el log de build completo y textual de Vercel.
  Los mensajes de error de Next.js/Prisma son lo bastante específicos como
  para que la IA identifique la causa exacta sin necesidad de inspeccionar el
  código fuente cada vez.
- **¿En qué falló o se quedó corta la IA?** No puede ver el estado real de
  paneles externos (Vercel, Neon) — depende de que el usuario copie/pegue o
  describa lo que ve en pantalla. Varios de los problemas más largos de
  resolver (repos duplicados, proyecto equivocado) fueron de **estado externo
  desincronizado**, no de código, y requirieron varias rondas de preguntas
  dirigidas para aislar la causa.
- **¿Qué haríamos distinto la próxima vez?** Fijar las versiones de
  dependencias clave (Prisma, Next.js) desde el primer commit, en vez de
  dejar que `npm install` tome la última versión disponible — eso hubiera
  evitado el breaking change de Prisma 7 por completo. También: verificar
  `git remote -v` y la pestaña "Settings → Git" de Vercel *antes* del primer
  deploy, no después de varios intentos fallidos.

## 4. Checklist de evidencia

- [x] Caso de debugging real documentado paso a paso (sección 2, punto 4).
- [x] Reflexión final sobre el flujo ágil con IA.
- [ ] Agregar capturas de pantalla del dashboard funcionando con datos reales.
