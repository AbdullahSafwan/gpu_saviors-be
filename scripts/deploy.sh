#!/bin/bash

# Simple GPU Saviors API Deployment Script
# Usage: ./scripts/deploy.sh

set -e

PROJECT_DIR="/opt/gpu_saviors-be"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log "Starting deployment..."

# Navigate to project directory
cd "$PROJECT_DIR"

# Pull latest code
log "Pulling latest code..."
git pull origin docker

# Stop existing containers
log "Stopping existing containers..."
docker-compose -f docker-compose.ip.yml down

# Build and start new containers
log "Building and starting containers..."
docker-compose -f docker-compose.ip.yml --env-file .env.production up -d --build

# Wait for services to be ready
log "Waiting for services to start..."
sleep 30

# Health check
log "Performing health check..."
if curl -f -s http://localhost:8080/health > /dev/null; then
    success "Deployment completed successfully!"
    echo "Application is running at http://$(hostname -I | awk '{print $1}'):8080"
else
    echo "Health check failed!"
    exit 1
fi