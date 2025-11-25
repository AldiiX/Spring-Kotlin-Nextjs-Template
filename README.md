# Spring Kotlin + Next.js Template

This repository is a full‑stack template that combines a **Kotlin/Spring Boot** backend with a **Next.js** frontend and serves everything through a single **Nginx** entrypoint.

The goal of the template is to give you a ready‑to‑use structure for building modern web applications where:

- the **backend** exposes a REST API (e.g. under `/api/...`) using Spring Boot,
- the **frontend** is a React/Next.js app that consumes that API,
- the whole app can be built and run as **one container** with a single exposed port.

---

## What this template provides

### 1. Kotlin / Spring Boot backend

- Opinionated setup for a Spring Boot application written in Kotlin.
- Gradle (Kotlin DSL) build setup, ready for `bootRun` / `bootJar`.
- Place for your domain logic, services, controllers and database integration.
- Intended to serve JSON APIs that will be consumed by the Next.js frontend.

Typical dev usage (outside Docker):

```bash
cd backend
./gradlew bootRun
# exposed on http://localhost:41520
```

---

### 2. Next.js frontend

- Next.js application for building the UI in React.
- Ready to call the backend API (e.g. `fetch("/api/...")` when proxied via Nginx).
- Standard Next.js scripts: `npm run dev`, `npm run build`, `npm run start`.

Typical dev usage (outside Docker):

```bash
cd frontend
npm install
npm run dev
# exposed on http://localhost:3000
```

---

### 3. Unified Docker setup (single port)

The repository includes:

- a **multi‑stage `Dockerfile`** that:
  - builds the Spring Boot JAR,
  - builds the Next.js production bundle,
  - assembles a final image with:
    - Java runtime,
    - Node.js runtime,
    - Nginx as a reverse proxy.
- a **`start.sh`** script that:
  - starts the Spring Boot backend,
  - starts the Next.js server,
  - runs Nginx in the foreground.
- an **`nginx.conf`** that:
  - routes `/api/...` to the backend,
  - routes everything else to the Next.js app,
  - serves Next.js static assets.

From the outside you only expose **one port** (default 80), while internally:

- Spring Boot listens on port (e.g.) `41520`,
- Next.js listens on port `3000`,
- Nginx listens on `80` and proxies to them.

Example run:

```bash
docker build -t spring-kotlin-nextjs-template .
docker run --rm -p 80:80 spring-kotlin-nextjs-template
# open http://localhost in the browser
```

---

## Directory overview

High‑level structure (names may vary slightly, but the idea stays the same):

```text
.
├─ backend/              # Kotlin / Spring Boot backend
│  ├─ src/main/kotlin    # backend source code
│  ├─ src/main/resources # application config, etc.
│  └─ build.gradle.kts   # backend Gradle configuration
│
├─ frontend/             # Next.js frontend
│  ├─ package.json
│  ├─ next.config.*      # Next.js configuration
│  └─ src/               # pages, components, etc.
│
├─ Dockerfile            # multi-stage build (backend + frontend + nginx)
├─ nginx.conf            # Nginx reverse proxy configuration
└─ start.sh              # startup script for the container
```

---

## What you can use this template for

- Building a new full‑stack app without having to wire Spring Boot and Next.js together from scratch.
- Keeping **API** and **UI** in one repository while still having a clear separation of concerns.
- Deploying a single container that exposes only one HTTP port to the outside world.
- Quickly experimenting with Kotlin/Spring on the backend and React/Next.js on the frontend.

You can extend this template with your own:

- database integration (JPA, R2DBC, etc.),
- authentication & authorization,
- CI/CD pipelines,
- environment‑specific configuration,
- monitoring and logging.