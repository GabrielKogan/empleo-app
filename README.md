# Empleo App 🧑‍💼

Plataforma de gestión de ofertas de empleo: empresas publican vacantes, postulantes
aplican, y un dashboard centraliza las métricas clave (ofertas activas, postulaciones
por estado, etc.).

> Proyecto desarrollado como TP integrador de **Desarrollo Ágil Asistido por IA**.

## ✨ ¿Qué resuelve?

Centraliza en un solo lugar lo que normalmente se gestiona a mano por planillas o
mail: publicación de ofertas, recepción de postulaciones y métricas de seguimiento
para el equipo de RR.HH.

## 🛠 Stack

- **Next.js 15 (App Router) + TypeScript** — frontend y backend (API routes) en un solo proyecto.
- **Prisma ORM** + **PostgreSQL** (Neon) — persistencia.
- **Tailwind CSS** — estilos.
- **Vercel** — deploy y CI/CD automático en cada push a `main`.
- **GitHub Actions** — lint y build en cada Pull Request.

## 🤖 Agente autónomo (bonus)

Además de usar a Claude como copiloto de desarrollo, el repo tiene un **agente
autónomo de revisión de código**: en cada Pull Request, [`.github/workflows/ai-pr-review.yml`](./.github/workflows/ai-pr-review.yml)
dispara [`scripts/ai-review.mjs`](./scripts/ai-review.mjs), que lee el diff,
le pide a la API de Claude una revisión enfocada en bugs/seguridad/casos
borde, y publica el resultado como comentario directo en el PR — sin
intervención humana.

> Requiere un secret `ANTHROPIC_API_KEY` configurado en
> **Settings → Secrets and variables → Actions** del repo.

## 🤖 Hicimos equipo con IA

Este proyecto se desarrolló con **Claude** (Anthropic) como copiloto de desarrollo:
scaffolding del proyecto, diseño del esquema de datos, generación de endpoints,
debugging y redacción de documentación. El detalle completo de la dinámica de
trabajo está en [`INFORME_TECNICO.md`](./INFORME_TECNICO.md).

## 🚀 Cómo correrlo localmente

```bash
git clone <url-del-repo>
cd empleo-app
npm install

cp .env.example .env
# completar DATABASE_URL con tu instancia de Postgres (ej. Neon free tier)

npx prisma generate
npx prisma db push

npm run dev
```

Abrí http://localhost:3000

## 📡 Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| GET/POST | `/api/jobs` | Listar / crear ofertas |
| GET/PUT/DELETE | `/api/jobs/[id]` | Detalle / editar / borrar una oferta |
| GET/POST | `/api/companies` | Listar / crear empresas |
| GET/POST | `/api/applicants` | Listar / crear postulantes |
| GET/POST | `/api/applications` | Listar / crear postulaciones |
| GET | `/api/dashboard/stats` | Métricas agregadas |

## 🌐 Demo

🔗 **[https://empleo-app-vercel.vercel.app](https://empleo-app-vercel.vercel.app)**

| Página | URL |
|---|---|
| Listado de ofertas | `/` |
| Crear empresa | `/companies/new` |
| Crear oferta | `/jobs/new` |
| Crear postulante | `/applicants/new` |
| Dashboard de métricas | `/dashboard` |

## 📄 Licencia

MIT
