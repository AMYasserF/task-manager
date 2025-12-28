# Deployment Guide

Complete guide for deploying the Task Manager application to production.

## 📋 Table of Contents

- [Deployment Options Comparison](#deployment-options-comparison)
- [Option 1: Docker Deployment](#option-1-docker-deployment)
- [Option 2: VPS Deployment](#option-2-vps-deployment)
- [Option 3: Cloud Platforms](#option-3-cloud-platforms)
- [Production Checklist](#production-checklist)
- [Environment Variables](#environment-variables)
- [SSL/HTTPS Setup](#sslhttps-setup)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## 🔍 Deployment Options Comparison

| Feature | Docker | VPS | Vercel + Railway | Railway/Render |
|---------|--------|-----|------------------|----------------|
| **Difficulty** | ⭐ Easy | ⭐⭐⭐ Medium | ⭐⭐ Easy | ⭐⭐ Easy |
| **Cost** | Server cost | $5-10/month | Free tier available | Free tier available |
| **Setup Time** | 10 minutes | 30-60 minutes | 15 minutes | 15 minutes |
| **Scalability** | Manual | Manual | Automatic | Automatic |
| **SSL** | Manual | Manual (Let's Encrypt) | Automatic | Automatic |
| **Best For** | Quick deployment | Full control | Hobby projects | Small-medium apps |

---

## Option 1: Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- Server with public IP (VPS, cloud instance, or local)
- Domain name (optional, for SSL)

### Quick Deployment

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd task-manager
   ```

2. **Configure environment**
   ```bash
   # Create backend .env
   cd backend
   cat > .env << EOF
   PORT=5000
   JWT_SECRET=$(openssl rand -base64 32)
   JWT_EXPIRES_IN=24h
   NODE_ENV=production
   EOF
   cd ..
   ```

3. **Build and run**
   ```bash
   docker-compose up -d --build
   ```

4. **Access your application**
   - Frontend: `http://your-server-ip`
   - Backend: `http://your-server-ip:5000`

### Production Docker Setup

For production, update `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: taskmanager-backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./backend/tasks.db:/app/tasks.db
    networks:
      - taskmanager-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: taskmanager-frontend
    restart: always
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
    networks:
      - taskmanager-network

networks:
  taskmanager-network:
    driver: bridge
```

---

## Option 2: VPS Deployment

Deploy on DigitalOcean, Linode, AWS EC2, or any VPS.

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx
```

### Step 2: Deploy Backend

```bash
# Clone repository
cd /var/www
sudo git clone <your-repo-url> task-manager
cd task-manager/backend

# Install dependencies
npm install --production

# Create .env file
sudo nano .env
```

Add:
```env
PORT=5000
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=24h
NODE_ENV=production
```

```bash
# Start with PM2
pm2 start src/index.js --name taskmanager-backend
pm2 save
pm2 startup
```

### Step 3: Deploy Frontend

```bash
cd /var/www/task-manager/frontend

# Update API URL in .env
echo "VITE_API_URL=https://yourdomain.com/api" > .env.production

# Build
npm install
npm run build

# Copy build to nginx
sudo cp -r dist/* /var/www/html/
```

### Step 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/taskmanager
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/taskmanager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Setup SSL

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Option 3: Cloud Platforms

### A. Vercel (Frontend) + Railway (Backend)

#### Deploy Backend to Railway

1. **Sign up at [Railway.app](https://railway.app)**

2. **Create New Project** → **Deploy from GitHub**

3. **Add environment variables:**
   ```
   PORT=5000
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=24h
   NODE_ENV=production
   ```

4. **Configure start command:**
   - Root Directory: `backend`
   - Start Command: `npm start`

5. **Note your backend URL:** `https://your-app.railway.app`

#### Deploy Frontend to Vercel

1. **Sign up at [Vercel.com](https://vercel.com)**

2. **Import your repository**

3. **Configure build settings:**
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add environment variable:**
   ```
   VITE_API_URL=https://your-app.railway.app
   ```

5. **Deploy!**

### B. Render (Full Stack)

1. **Sign up at [Render.com](https://render.com)**

2. **Deploy Backend:**
   - New → Web Service
   - Connect repository
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables

3. **Deploy Frontend:**
   - New → Static Site
   - Connect repository
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Add environment variable: `VITE_API_URL`

---

## 🔐 Production Checklist

### Security
- [ ] Change JWT_SECRET to a strong random value
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for your domain only
- [ ] Set secure cookie flags
- [ ] Add rate limiting
- [ ] Enable security headers
- [ ] Regular security updates

### Performance
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Optimize database queries
- [ ] Monitor memory usage

### Reliability
- [ ] Set up automated backups
- [ ] Configure error logging
- [ ] Set up uptime monitoring
- [ ] Configure auto-restart on crash
- [ ] Test disaster recovery

---

## 🔧 Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=production

# JWT
JWT_SECRET=your-super-secret-key-min-32-characters
JWT_EXPIRES_IN=24h

# Database (if using external DB)
# DATABASE_URL=postgresql://user:pass@host:5432/dbname

# CORS (optional)
# ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Frontend (.env.production)

```env
VITE_API_URL=https://api.yourdomain.com
```

---

## 🔒 SSL/HTTPS Setup

### With Let's Encrypt (Free)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal (runs twice daily)
sudo systemctl enable certbot.timer
```

### With Cloudflare (Free)

1. Add your domain to Cloudflare
2. Update nameservers
3. Enable "Full (strict)" SSL mode
4. Enable "Always Use HTTPS"

---

## 📊 Monitoring & Maintenance

### PM2 Monitoring

```bash
# View logs
pm2 logs taskmanager-backend

# Monitor resources
pm2 monit

# Restart app
pm2 restart taskmanager-backend

# View status
pm2 status
```

### Database Backup

```bash
# Create backup script
cat > /home/user/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp /var/www/task-manager/backend/tasks.db /backups/tasks_$DATE.db
# Keep only last 7 days
find /backups -name "tasks_*.db" -mtime +7 -delete
EOF

chmod +x /home/user/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/user/backup-db.sh
```

### Uptime Monitoring

Free services:
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://www.pingdom.com)
- [StatusCake](https://www.statuscake.com)

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check logs
pm2 logs taskmanager-backend

# Check if port is in use
sudo lsof -i :5000

# Restart
pm2 restart taskmanager-backend
```

### Frontend shows API errors

1. Check VITE_API_URL is correct
2. Verify CORS settings in backend
3. Check nginx proxy configuration
4. Verify SSL certificates

### Database locked error

```bash
# Stop all processes
pm2 stop all

# Remove lock file
rm /var/www/task-manager/backend/tasks.db-shm
rm /var/www/task-manager/backend/tasks.db-wal

# Restart
pm2 restart all
```

### High memory usage

```bash
# Check memory
free -h

# Restart PM2
pm2 restart all

# Enable cluster mode
pm2 start src/index.js -i max --name taskmanager-backend
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)

---

## 💡 Cost Estimates

| Option | Monthly Cost | Notes |
|--------|-------------|-------|
| **Docker on VPS** | $5-10 | DigitalOcean/Linode basic droplet |
| **Railway Free Tier** | $0 | 500 hours/month, $5 credit |
| **Render Free Tier** | $0 | Sleeps after 15min inactivity |
| **Vercel + Railway** | $0-5 | Free for hobby projects |
| **AWS/GCP** | $10-20 | More expensive but scalable |

---

## 🎯 Recommended Deployment Path

**For Learning/Testing:**
→ Docker on local machine

**For Hobby Projects:**
→ Vercel (Frontend) + Railway (Backend)

**For Production:**
→ VPS with Nginx + PM2 + SSL

**For Scale:**
→ AWS/GCP with load balancing
