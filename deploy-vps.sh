#!/bin/bash

# Task Manager - VPS Deployment Script
# This script automates deployment to a VPS with Nginx and PM2

set -e

echo "🚀 Task Manager - VPS Deployment"
echo "================================="
echo ""

# Configuration
APP_DIR="/var/www/task-manager"
DOMAIN="yourdomain.com"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

echo "📦 Installing dependencies..."

# Update system
apt update && apt upgrade -y

# Install Node.js 18
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi

# Install PM2
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Install Nginx
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    apt install -y nginx
fi

# Install Certbot
if ! command -v certbot &> /dev/null; then
    echo "Installing Certbot..."
    apt install -y certbot python3-certbot-nginx
fi

echo "✅ Dependencies installed"
echo ""

# Deploy Backend
echo "🔧 Deploying Backend..."
cd $APP_DIR/backend

# Install dependencies
npm install --production

# Create .env if not exists
if [ ! -f ".env" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    cat > .env << EOF
PORT=5000
NODE_ENV=production
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=24h
EOF
    echo "✅ Created .env file"
fi

# Start with PM2
pm2 delete taskmanager-backend 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u $SUDO_USER --hp /home/$SUDO_USER

echo "✅ Backend deployed"
echo ""

# Deploy Frontend
echo "🎨 Deploying Frontend..."
cd $APP_DIR/frontend

# Install dependencies and build
npm install
npm run build

# Copy to nginx directory
rm -rf /var/www/html/*
cp -r dist/* /var/www/html/

echo "✅ Frontend built and deployed"
echo ""

# Configure Nginx
echo "⚙️  Configuring Nginx..."

cat > /etc/nginx/sites-available/taskmanager << 'EOF'
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

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
EOF

# Replace domain placeholder
sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/sites-available/taskmanager

# Enable site
ln -sf /etc/nginx/sites-available/taskmanager /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart nginx
nginx -t
systemctl restart nginx

echo "✅ Nginx configured"
echo ""

# Setup SSL
echo "🔒 Setting up SSL..."
echo "Run the following command to get SSL certificate:"
echo "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""

echo "✅ Deployment Complete!"
echo ""
echo "📍 Your application should be accessible at:"
echo "   http://$DOMAIN"
echo ""
echo "🔒 Don't forget to run certbot for SSL!"
echo ""
echo "📊 Useful commands:"
echo "   pm2 status          - Check backend status"
echo "   pm2 logs            - View backend logs"
echo "   pm2 restart all     - Restart backend"
echo "   nginx -t            - Test nginx config"
echo "   systemctl status nginx - Check nginx status"
