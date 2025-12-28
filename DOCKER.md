# Task Manager - Docker Setup

## Quick Start

### Prerequisites
- Docker installed on your system
- Docker Compose installed

### Running the Application

1. **Clone the repository** (if not already done)
   ```bash
   cd task-manager
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000

### Stopping the Application

```bash
docker-compose down
```

### Rebuild After Changes

```bash
docker-compose up --build
```

## Docker Configuration

### Services

#### Backend
- **Port**: 5000
- **Technology**: Node.js
- **Container**: `taskmanager-backend`

#### Frontend
- **Port**: 80
- **Technology**: React + Nginx
- **Container**: `taskmanager-frontend`

### Environment Variables

You can customize the backend by setting environment variables in `docker-compose.yml`:

```yaml
environment:
  - JWT_SECRET=your-secret-key-here
  - PORT=5000
```

## Development

### Running Individual Services

**Backend only:**
```bash
cd backend
docker build -t taskmanager-backend .
docker run -p 5000:5000 taskmanager-backend
```

**Frontend only:**
```bash
cd frontend
docker build -t taskmanager-frontend .
docker run -p 80:80 taskmanager-frontend
```

### Logs

View logs for all services:
```bash
docker-compose logs -f
```

View logs for specific service:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Production Deployment

For production deployment, make sure to:

1. Change the JWT_SECRET in docker-compose.yml
2. Update the backend URL in the frontend if needed
3. Use proper SSL certificates with nginx
4. Set NODE_ENV to production

## Troubleshooting

**Port already in use:**
```bash
# Change ports in docker-compose.yml
ports:
  - "8080:80"  # Frontend
  - "5001:5000"  # Backend
```

**Clear all containers and rebuild:**
```bash
docker-compose down -v
docker-compose up --build
```
