# Quick Deployment Reference

## 🚀 Choose Your Deployment Method

### 1. Local Testing (Fastest)
```bash
# Backend
cd backend && npm install && npm start

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```
**Access:** http://localhost:5173

---

### 2. Docker (Recommended for Quick Deploy)
```bash
./deploy-docker.sh
# OR
docker-compose up --build
```
**Access:** http://localhost

---

### 3. Free Cloud (No Server Needed)

#### Vercel (Frontend) + Railway (Backend)

**Backend on Railway:**
1. Go to railway.app
2. New Project → Deploy from GitHub
3. Select `backend` folder
4. Add env vars: `JWT_SECRET`, `PORT=5000`
5. Copy your Railway URL

**Frontend on Vercel:**
1. Go to vercel.com
2. Import repository
3. Root: `frontend`
4. Add env: `VITE_API_URL=<your-railway-url>`
5. Deploy!

**Time:** ~10 minutes
**Cost:** FREE

---

### 4. VPS (Full Control)

```bash
# On your VPS
git clone <your-repo>
cd task-manager
sudo ./deploy-vps.sh
```

**Requirements:**
- Ubuntu/Debian VPS
- Domain name
- Root access

**Time:** ~30 minutes
**Cost:** $5-10/month

---

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
JWT_SECRET=<generate-with: openssl rand -base64 32>
JWT_EXPIRES_IN=24h
NODE_ENV=production
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.com
```

---

## ✅ Post-Deployment Checklist

- [ ] Change JWT_SECRET to random value
- [ ] Set up SSL/HTTPS
- [ ] Configure CORS for your domain
- [ ] Test user registration
- [ ] Test task creation
- [ ] Set up database backups
- [ ] Configure monitoring

---

## 🆘 Quick Troubleshooting

**Backend won't start:**
```bash
pm2 logs
# Check for port conflicts
sudo lsof -i :5000
```

**Frontend can't reach backend:**
- Check VITE_API_URL in .env.production
- Verify CORS settings
- Check nginx proxy config

**Database errors:**
```bash
# Check permissions
ls -la backend/tasks.db
# Restart
pm2 restart all
```

---

## 📚 Full Documentation

- **Complete Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Docker Details:** [DOCKER.md](./DOCKER.md)
- **API Reference:** [README.md](./README.md#api-documentation)
