# ============================================================
# FIX: Production Dockerfile for Render
#
# PROBLEMS WITH OLD DOCKERFILE:
# 1. "mvnw missing" — Dockerfile used COPY . . then ran mvn,
#    but the Maven wrapper (mvnw) was not in the repo.
# 2. "jar not resolving" — used wildcard target/*.jar which
#    fails if multiple jars exist.
# 3. No .dockerignore — copied node_modules, target/, etc.
#    making image huge and slow.
#
# FIX: Use multi-stage build.
# Stage 1: Build with official Maven image (no mvnw needed).
# Stage 2: Run with slim JRE image.
# Result: fast build, small image, no missing mvnw.
# ============================================================

# Stage 1 — Build
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml first so Maven dependencies are cached as a layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build the JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2 — Run (slim image, ~200MB instead of ~600MB)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy only the built JAR from Stage 1
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Render injects PORT env var; default 8080 for local
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
