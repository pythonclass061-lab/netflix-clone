# Docker and Docker Compose Guide

## What Docker Does

Docker packages an application with the runtime it needs. A Docker image is a blueprint. A Docker container is a running instance of that image.

For this project:

- `backend/Dockerfile` builds the Node.js API image.
- `frontend/Dockerfile` builds the React app and serves it with Nginx.
- `database/Dockerfile` builds the MongoDB image with an init script.
- `docker-compose.yml` starts all three containers together.

## Dockerfile Concept

A Dockerfile is a set of build instructions.

Example backend flow:

1. Start from `node:22-alpine`.
2. Copy `package.json`.
3. Install dependencies.
4. Copy source code.
5. Run TypeScript build.
6. Copy only production output into the final image.
7. Expose port `5000`.
8. Start the API with `npm start`.

Example frontend flow:

1. Start from `node:22-alpine`.
2. Install dependencies.
3. Build React into static files.
4. Start from `nginx:1.27-alpine`.
5. Copy static files into Nginx.
6. Expose port `80`.

## Docker Compose Concept

Docker Compose manages multiple containers from one file.

Instead of running separate commands for MongoDB, backend, and frontend, Compose reads `docker-compose.yml` and handles:

- building each Dockerfile
- creating a shared Docker network
- creating containers
- connecting services by name, for example `mongodb://database:27017/netflix_clone`
- mapping container ports to your computer
- creating volumes for persistent database data
- startup order with health checks

In this project:

```yaml
database -> backend -> frontend
```

The backend waits until the database is healthy. The frontend waits until the backend is healthy.

## Important Commands

Build and start everything:

```bash
docker compose up -d --build
```

Check running containers:

```bash
docker compose ps
```

Check built images:

```bash
docker images
```

Follow logs:

```bash
docker compose logs -f
```

Stop containers:

```bash
docker compose down
```

Stop and delete database volume:

```bash
docker compose down -v
```

## Port Mapping

Port syntax:

```txt
HOST_PORT:CONTAINER_PORT
```

This project uses:

```txt
5173:80     frontend, browser opens localhost:5173
5000:5000   backend API
27017:27017 MongoDB
```

Check published ports:

```bash
docker ps
```

or:

```bash
docker compose ps
```

## AWS Server Flow

On an AWS server, after cloning the repo:

```bash
git clone <your-repo-url>
cd netflix-clone-2026
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env`:

```bash
nano backend/.env
```

Start:

```bash
docker compose up -d --build
```

Check:

```bash
docker images
docker ps
docker compose ps
docker compose logs -f
```

Open required AWS security-group inbound ports:

- `80` if using Nginx reverse proxy on the host
- `5173` if exposing this Compose frontend directly
- `5000` only if you intentionally want the API public

For production, place a host-level Nginx reverse proxy in front and expose only port `80` or `443`.
