# GPU Saviors Backend - VPS Deployment Guide

## Overview

This guide will help you deploy your GPU Saviors backend application on a VPS using:
- **External MySQL**: Your existing MySQL instance on port 3306
- **Caddy**: Reverse proxy with self-signed SSL for IP-based access
- **Load Balancing**: Dual app instances for high availability
- **Access**: VPS IP on port 8080

## Prerequisites

- VPS with Docker and Docker Compose installed
- MySQL 8.0+ running on VPS (port 3306)
- Root or sudo access to the VPS

## Step 1: Prepare Your VPS

### Install Docker and Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes to take effect
```

### Verify MySQL is Running

```bash
# Check MySQL status
sudo systemctl status mysql

# Test connection
mysql -u root -p -e "SELECT VERSION();"
```

## Step 2: Prepare MySQL Database

### Create Database and User

```sql
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE IF NOT EXISTS gpu_saviors_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create application user (replace with secure password)
CREATE USER 'gpu_saviors_user'@'%' IDENTIFIED BY 'your_secure_password_here';
GRANT ALL PRIVILEGES ON gpu_saviors_db.* TO 'gpu_saviors_user'@'%';
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

### Configure MySQL for Docker Access

```bash
# Edit MySQL configuration
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Update or add these lines:
bind-address = 0.0.0.0
mysqlx-bind-address = 0.0.0.0

# Restart MySQL
sudo systemctl restart mysql
```

## Step 3: Deploy Your Application

### Clone and Configure

```bash
# Clone your repository
git clone <your-repository-url>
cd gpu_saviors-be

# Copy environment template
cp .env.vps .env

# Edit environment variables
nano .env
```

### Configure Environment Variables

Update `.env` with your actual values:

```bash
# VPS Configuration
VPS_IP=123.456.789.123  # Your actual VPS IP
PORT=8080

# Database Configuration
DATABASE_URL=mysql://gpu_saviors_user:your_secure_password_here@host.docker.internal:3306/gpu_saviors_db

# JWT Secrets (generate secure ones)
JWT_ACCESS_KEY_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_KEY_SECRET=$(openssl rand -base64 32)

# CORS (allow all for IP access)
CORS_ORIGIN=*

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

FRONTEND_URL=frontend-url
```

### Configure Firewall

```bash
# Allow necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP (redirects to 8080)
sudo ufw allow 8080  # Application
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

## Step 4: Deploy with Docker Compose

### Build and Start Services

```bash
# Build and start all services
docker-compose up -d

# Check if containers are running
docker-compose ps

# View logs
docker-compose logs -f
```

### Run Database Migrations

```bash
# Run Prisma migrations
docker-compose exec app npm run migrate:prod

# If you need to generate Prisma client
docker-compose exec app npx prisma generate
```

## Step 5: Verify Deployment

### Check Application Health

```bash
# Test health endpoint
curl -k https://YOUR_VPS_IP:8080/health

# Example response:
# {
#   "status": "healthy",
#   "timestamp": "2024-01-01T12:00:00.000Z",
#   "uptime": 123.456,
#   "environment": "production"
# }
```

### Test Load Balancing

```bash
# Multiple requests should show different responses (round-robin)
for i in {1..5}; do
  curl -k https://YOUR_VPS_IP:8080/health | jq .uptime
done
```

### Check Database Connectivity

```bash
# Test database connection from container
docker-compose exec app node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect().then(() => {
  console.log('✅ Database connected successfully');
  process.exit(0);
}).catch(err => {
  console.error('❌ Database connection failed:', err);
  process.exit(1);
});
"
```

## Monitoring and Maintenance

### Check Service Status

```bash
# View container status
docker-compose ps

# Check logs for each service
docker-compose logs app
docker-compose logs app-replica
docker-compose logs caddy

# Monitor resource usage
docker stats
```

### View Caddy Logs

```bash
# Access logs
docker-compose exec caddy tail -f /var/log/caddy/vps_access.log

# Error logs
docker-compose logs caddy | grep -i error
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart app

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

## Scaling and Performance

### Scale Application Instances

```bash
# Scale to more instances
docker-compose up -d --scale app=2 --scale app-replica=1

# Or edit compose.yaml to add more replicas
```

### Performance Monitoring

```bash
# Monitor response times
curl -w "Response time: %{time_total}s\n" -o /dev/null -s -k https://YOUR_VPS_IP:8080/health

# Monitor database performance
docker-compose exec app node -e "
const start = Date.now();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect().then(() => {
  console.log('DB Response time:', Date.now() - start, 'ms');
  process.exit(0);
});
"
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

```bash
# Check if MySQL is accessible from Docker
docker run --rm mysql:8.0 mysql -h host.docker.internal -u gpu_saviors_user -p

# Verify Docker can reach host
docker-compose exec app ping host.docker.internal
```

#### 2. Container Won't Start

```bash
# Check detailed logs
docker-compose logs app

# Check environment variables
docker-compose exec app env | grep DATABASE_URL
```

#### 3. SSL Certificate Issues

```bash
# Caddy generates self-signed certificates for IP access
# Check Caddy logs for certificate issues
docker-compose logs caddy | grep -i cert
```

#### 4. Port Already in Use

```bash
# Check what's using port 8080
sudo netstat -tlnp | grep :8080

# Kill process if needed
sudo kill -9 <PID>
```

### Log Analysis

```bash
# Application errors
docker-compose logs app | grep -i error

# Database connection issues
docker-compose logs app | grep -i "database\|prisma"

# Load balancer issues
docker-compose logs caddy | grep -i "upstream\|backend"
```

## Backup and Updates

### Backup Application Data

```bash
# Backup logs
docker-compose exec app tar -czf /tmp/logs-backup.tar.gz /usr/src/app/logs
docker cp gpu-saviors-api:/tmp/logs-backup.tar.gz ./backups/

# Backup Caddy configuration
docker-compose exec caddy tar -czf /tmp/caddy-config.tar.gz /data /config
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Run new migrations if any
docker-compose exec app npm run migrate:prod
```

## Security Considerations

### Environment Security

```bash
# Secure .env file
chmod 600 .env

# Never commit .env to git
echo ".env" >> .gitignore
```

### Regular Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Update Docker images
docker-compose pull
docker-compose up -d

# Update Node.js dependencies
docker-compose exec app npm audit fix
```

### Monitor Logs

```bash
# Set up log rotation
sudo nano /etc/logrotate.d/docker-containers

# Monitor for suspicious activity
docker-compose logs app | grep -i "failed\|error\|unauthorized"
```

## Access Your Application

Once deployed, your application will be available at:

- **HTTPS**: `https://YOUR_VPS_IP:8080`
- **HTTP**: `http://YOUR_VPS_IP` (redirects to HTTPS on port 8080)
- **Health Check**: `https://YOUR_VPS_IP:8080/health`
- **API Endpoints**: `https://YOUR_VPS_IP:8080/api/*`

## Support

If you encounter issues:

1. Check service logs: `docker-compose logs [service-name]`
2. Verify environment configuration
3. Test database connectivity
4. Check firewall settings
5. Ensure MySQL is properly configured for Docker access

The setup provides high availability with load balancing, automatic SSL, and production-ready configuration for VPS deployment.