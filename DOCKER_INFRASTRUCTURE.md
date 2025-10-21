# Docker Infrastructure

## Overview

This document describes the Docker infrastructure setup for the MAAS (Manufacturing as a Service) application, which consists of multiple services deployed across separate repositories.

## Architecture

```
Traefik (traefik repo) - Creates 'traefik' network
    ↓
Frontend (this repo) - Joins 'traefik' and 'backend' networks
    ├─→ / → Vue.js static files
    └─→ /api/v3/ → Backend service (via 'backend' network)

Backend (backend repo) - Joins 'backend' network
    └─→ Calculator (via 'backend' network)

Calculator (calculator repo) - Joins 'backend' network
```

## Networks

- `traefik` - Created by traefik repo, used for ingress routing
- `backend` - Created by backend repo, used for internal service communication

## Container Names

- `traefik` - Traefik reverse proxy (traefik repo)
- `maas-frontend` - Vue.js frontend (frontend repo)
- `maas-backend` - FastAPI backend (backend repo)
- `maas-calculator` - FastAPI calculator (calculator repo)

## Ports

- Traefik: 80, 443 (external)
- Frontend: 80 (internal)
- Backend: 8000 (internal)
- Calculator: 8001 (internal)

## Service Discovery

Services find each other by **container name** across shared networks:

- Frontend → Backend: `http://maas-backend:8000` (via `backend` network)
- Backend → Calculator: `http://maas-calculator:8001` (via `backend` network)
- Traefik → Frontend: `http://maas-frontend:80` (via `traefik` network)

## Deployment Order

1. **Create networks** (if not auto-created):
   ```bash
   docker network create traefik
   docker network create backend
   ```

2. **Deploy Traefik** (traefik repo):
   ```bash
   cd traefik-repo
   docker-compose up -d
   ```

3. **Deploy Calculator** (calculator repo):
   ```bash
   cd calculator-repo
   docker-compose up -d
   ```

4. **Deploy Backend** (backend repo):
   ```bash
   cd backend-repo
   docker-compose up -d
   ```

5. **Deploy Frontend** (this repo):
   ```bash
   cd frontend-repo
   docker-compose up -d
   ```

## API Routing

- **Development**: Frontend uses Vite proxy to route `/api/v3/*` to `http://localhost:8000/*`
- **Production**: Nginx in frontend container routes `/api/v3/*` to `http://maas-backend:8000/*`

## Environment Variables

### Frontend (.env files)

**Development (.env.development):**
```env
VITE_API_BASE=http://localhost:8000
VITE_BASE_PATH=/site-dev/
```

**Production (.env.production):**
```env
VITE_API_BASE=/api/v3
VITE_BASE_PATH=/site-dev/
```

## Testing Connectivity

1. **Check networks exist:**
   ```bash
   docker network ls | grep -E 'traefik|backend'
   ```

2. **Check service is on networks:**
   ```bash
   docker inspect maas-frontend | grep -A 20 Networks
   ```

3. **Test connectivity from frontend to backend:**
   ```bash
   docker exec maas-frontend wget -O- http://maas-backend:8000/health
   ```

4. **Check Traefik can reach frontend:**
   ```bash
   docker exec traefik wget -O- http://maas-frontend:80
   ```

5. **Test from browser:**
   - Frontend: `https://yourdomain.com/`
   - API: `https://yourdomain.com/api/v3/health`

## Troubleshooting

### Frontend can't reach backend

```bash
# Check both on same network
docker network inspect backend

# Test connectivity
docker exec maas-frontend ping maas-backend
docker exec maas-frontend wget -O- http://maas-backend:8000/health
```

### Traefik can't reach frontend

```bash
# Check both on traefik network
docker network inspect traefik

# Check Traefik logs
docker-compose logs traefik
```

### API requests return 502 Bad Gateway

1. Check if backend container is running: `docker ps | grep maas-backend`
2. Check if backend is on the `backend` network: `docker network inspect backend`
3. Check backend logs: `docker logs maas-backend`
4. Test direct connection: `docker exec maas-frontend wget -O- http://maas-backend:8000/health`

## Important Notes

1. **Container naming** - Use explicit `container_name` in all compose files
2. **Network creation** - Networks must exist before services can join them
3. **Service dependencies** - Can't use `depends_on` across repos
4. **Health checks** - Services should retry connections until other services are ready
5. **Documentation** - Keep this file updated when container names or networks change

## Security Considerations

- Calculator service is not exposed to external networks (internal only)
- Traefik handles SSL/TLS termination
- All internal communication happens over Docker networks
- No CORS issues since all requests go through the same domain

