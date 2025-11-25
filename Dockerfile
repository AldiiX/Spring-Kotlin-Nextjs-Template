# syntax=docker/dockerfile:1

# ---- backend build stage ----
FROM eclipse-temurin:24-jdk-alpine AS backend-build
WORKDIR /app

# gradle wrapper + config
COPY build.gradle.kts settings.gradle.kts gradlew gradlew.bat ./
COPY gradle ./gradle
COPY backend ./backend

RUN chmod +x gradlew

# build spring boot jar
RUN ./gradlew bootJar --no-daemon

# ---- frontend build stage ----
FROM node:24-alpine AS frontend-build
WORKDIR /app/frontend

# cache
COPY frontend/package*.json ./

RUN npm ci

# frontend source
COPY frontend ./

# build next app
RUN npm run build

# ---- final image ----
FROM eclipse-temurin:24-jdk-alpine

# install nginx and nodejs (for nextjs static files)
RUN apk add --no-cache nginx nodejs npm

WORKDIR /app
RUN mkdir -p /app/backend /app/frontend /run/nginx

# backend jar
COPY --from=backend-build /app/build/libs/*.jar /app/backend/app.jar

# frontend (build + node_modules)
COPY --from=frontend-build /app/frontend /app/frontend

# nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 80

CMD ["/app/start.sh"]