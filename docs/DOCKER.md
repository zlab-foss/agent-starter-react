

# Docker Documentation – Frontend (agent-starter-react)

Short guide for building and running the Next.js frontend using Docker.

---

## 🧱 Dockerfile Summary

Location: `agent-starter-react/Dockerfile`

The project uses a **multi-stage build** to keep the final image small:

### **1️⃣ Builder Stage**
- Base: `node:18-bullseye-slim`
- Installs dependencies via **pnpm**
- Builds the Next.js app (`pnpm build`)
- Produces `.next`, `public`, and production `node_modules`

### **2️⃣ Runner Stage**
- Fresh `node:18-bullseye-slim` image
- Copies only:
  - `.next/`
  - `public/`
  - `package.json`
  - `node_modules`
- Exposes port **3000**
- Starts the app with:

```dockerfile
CMD ["pnpm", "start"]
````

---

## 🛠️ Build the Image

```bash
docker build -t agent-starter-react:latest .
```

With Docker Compose:

```bash
docker compose build frontend
```

---

## 🚀 Run the Container

### Standalone

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_LIVEKIT_URL=ws://localhost:7880 \
  -e LIVEKIT_URL=ws://livekit:7880 \
  -e LIVEKIT_API_KEY=devkey \
  -e LIVEKIT_API_SECRET=secret \
  agent-starter-react:latest
```

### With Docker Compose (recommended)

```bash
docker compose up frontend
```

Check logs:

```bash
docker compose logs -f frontend
```

---

## 🔧 Environment Variables

### Required

| Variable                  | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| `LIVEKIT_URL`             | Server-side LiveKit URL (`ws://livekit:7880`) |
| `NEXT_PUBLIC_LIVEKIT_URL` | Browser LiveKit URL (`ws://localhost:7880`)   |
| `LIVEKIT_API_KEY`         | LiveKit key                                   |
| `LIVEKIT_API_SECRET`      | LiveKit secret                                |

### Important Note

* **Browser** must use `NEXT_PUBLIC_*` env vars
* **Server-side** code uses internal Docker URLs (`livekit`, `backend`, etc.)

---

## 🏗️ Docker Compose Example

```yaml
frontend:
  build:
    context: ./agent-starter-react
    dockerfile: Dockerfile
  ports:
    - "3000:3000"
  environment:
    NEXT_PUBLIC_LIVEKIT_URL: ws://localhost:7880
    LIVEKIT_URL: ws://livekit:7880
    LIVEKIT_API_KEY: devkey
    LIVEKIT_API_SECRET: secret
  depends_on:
    - backend
    - livekit
```

---

## 🐛 Common Issues

### ❌ Browser can't connect to LiveKit

Use:

```
NEXT_PUBLIC_LIVEKIT_URL=ws://localhost:7880
```

### ❌ Backend/API route tries localhost inside container

Use:

```
LIVEKIT_URL=ws://livekit:7880
```

### ❌ Updated NEXT_PUBLIC_ variables not applied

Rebuild image:

```bash
docker compose up --build frontend
```

---

## 📌 Summary

* Multi-stage Dockerfile → small, optimized image
* Browser and server use **different LiveKit URLs**
* Recommended: run via **docker-compose**

