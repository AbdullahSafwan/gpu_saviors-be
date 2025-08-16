# GPU Saviors API - Simple Docker Deployment

Simple deployment guide for GPU Saviors API using Docker on VPS with IP access.

## Quick Setup

### 1. Essential Files Created

- **`Dockerfile`** - Production Docker image
- **`docker-compose.ip.yml`** - Docker services for IP access
- **`nginx/nginx-ip.conf`** - Nginx config for port 8080
- **`.env.production`** - Production environment variables
- **`.github/workflows/deploy.yml`** - Simple CI/CD pipeline
- **`scripts/deploy.sh`** - Manual deployment script

### 2. VPS Setup

Install Docker on your VPS:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create project directory
sudo mkdir -p /opt/gpu-saviors-api
sudo chown $USER:$USER /opt/gpu-saviors-api

# Clone your repository
cd /opt
git clone https://github.com/YOUR_USERNAME/gpu_saviors-be.git gpu-saviors-api
cd gpu-saviors-api
```

### 3. Database Setup

Create MySQL database and user:

```sql
# Connect to your existing MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE gpu_saviors_db;
CREATE USER 'gpu_saviors_user'@'%' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON gpu_saviors_db.* TO 'gpu_saviors_user'@'%';
FLUSH PRIVILEGES;
EXIT;
```

### 4. Environment Configuration

Update `.env.production` with your values:

```bash
# Edit production environment
cp .env.production .env.production.backup
nano .env.production

# Update these required values:
DATABASE_URL=mysql://gpu_saviors_user:your_secure_password@host.docker.internal:3306/gpu_saviors_db
DB_PASSWORD=your_secure_password
JWT_ACCESS_SECRET=your_32_char_secret_here
JWT_REFRESH_SECRET=your_32_char_secret_here
```

Generate secure secrets:
```bash
# Generate JWT secrets
openssl rand -base64 32  # Use for JWT_ACCESS_SECRET
openssl rand -base64 32  # Use for JWT_REFRESH_SECRET
```

### 5. Manual Deployment

Deploy manually first to test:

```bash
# Navigate to project directory
cd /opt/gpu-saviors-api

# Deploy
./scripts/deploy.sh
```

Your API will be available at: `http://YOUR_VPS_IP:8080`

### 6. GitHub CI/CD Setup

For automated deployment, add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

```
VPS_HOST=your.vps.ip.address
VPS_USERNAME=your_username
VPS_SSH_KEY=your_private_ssh_key_content
VPS_PROJECT_PATH=/opt/gpu-saviors-api
```

Now when you push to `main` branch, it will automatically deploy to your VPS.

## Usage

### API Endpoints

- **Health Check**: `http://YOUR_VPS_IP:8080/health`
- **API Documentation**: `http://YOUR_VPS_IP:8080/docs`
- **Main API**: `http://YOUR_VPS_IP:8080/api/`

### Management Commands

```bash
# Check status
docker-compose -f docker-compose.ip.yml ps

# View logs
docker-compose -f docker-compose.ip.yml logs -f

# Stop services
docker-compose -f docker-compose.ip.yml down

# Restart services
docker-compose -f docker-compose.ip.yml --env-file .env.production up -d

# Manual deployment
./scripts/deploy.sh
```

### Troubleshooting

```bash
# Check if services are running
curl http://localhost:8080/health

# Check Docker logs
docker-compose -f docker-compose.ip.yml logs gpu-saviors-api

# Check system resources
docker stats

# Restart everything
docker-compose -f docker-compose.ip.yml down
docker-compose -f docker-compose.ip.yml --env-file .env.production up -d
```

That's it! Simple Docker deployment with automated CI/CD for your GPU Saviors API.