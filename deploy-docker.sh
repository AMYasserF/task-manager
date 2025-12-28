#!/bin/bash

# Task Manager - Docker Deployment Script
# This script automates the Docker deployment process

set -e

echo "🚀 Task Manager - Docker Deployment"
echo "===================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env exists in backend
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Creating from template..."
    
    # Generate random JWT secret
    JWT_SECRET=$(openssl rand -base64 32)
    
    cat > backend/.env << EOF
PORT=5000
NODE_ENV=production
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=24h
EOF
    
    echo "✅ Created backend/.env with random JWT_SECRET"
    echo "⚠️  Please review backend/.env and update if needed"
    echo ""
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start containers
echo "🔨 Building containers..."
docker-compose build --no-cache

echo "🚀 Starting containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 5

# Check if containers are running
if [ "$(docker ps -q -f name=taskmanager-backend)" ] && [ "$(docker ps -q -f name=taskmanager-frontend)" ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📍 Access your application:"
    echo "   Frontend: http://localhost"
    echo "   Backend:  http://localhost:5000"
    echo ""
    echo "📊 View logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "🛑 Stop application:"
    echo "   docker-compose down"
else
    echo ""
    echo "❌ Deployment failed. Check logs:"
    echo "   docker-compose logs"
    exit 1
fi
