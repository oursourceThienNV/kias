# Hapas E-Commerce Deployment Guide

## 📋 Overview
Hướng dẫn triển khai dự án Hapas E-Commerce lên Ubuntu Server sử dụng Docker và Nginx reverse proxy.

## 🎯 Deployment Strategy
- **Architecture**: Isolated deployment với Docker containers riêng biệt
- **Location**: `/var/www/hapas_ecommerce/`
- **Ports**: Tách biệt khỏi các dự án khác trên server
- **Database**: PostgreSQL container riêng
- **Reverse Proxy**: Nginx system-level với virtual hosts

## 🔧 Server Environment
- **OS**: Ubuntu Linux
- **Existing Services**: 
  - Nginx (ports 80, 443)
  - Docker containers cho dự án khác (idol.dating)
  - PostgreSQL containers
- **Users**: `root`, `fe_user`, `be_user`

## 🔐 Git Setup Process

### Step 1: SSH Key Generation
```bash
# Generate SSH key for Git authentication
ssh-keygen -t ed25519 -C "hapas-server-$(date +%Y%m%d)" -f /root/.ssh/hapas_git_key -N ""

# Display public key for adding to Git provider
cat /root/.ssh/hapas_git_key.pub
```

**Generated Public Key:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIF1Z5eDjEo2cvX8n1n5og9sPCj7wQGgDZOnC6rv+TvZu hapas-server-20250930
```

### Step 2: SSH Configuration
```bash
# Create SSH config for multiple Git providers
cat > /root/.ssh/config << 'EOL'
# Hapas Git Configuration
Host github.com
    HostName github.com
    User git
    IdentityFile /root/.ssh/hapas_git_key
    IdentitiesOnly yes
    StrictHostKeyChecking no

Host gitlab.com
    HostName gitlab.com
    User git
    IdentityFile /root/.ssh/hapas_git_key
    IdentitiesOnly yes
    StrictHostKeyChecking no

Host bitbucket.org
    HostName bitbucket.org
    User git
    IdentityFile /root/.ssh/hapas_git_key
    IdentitiesOnly yes
    StrictHostKeyChecking no
EOL

# Set proper permissions
chmod 600 /root/.ssh/hapas_git_key /root/.ssh/config
chmod 644 /root/.ssh/hapas_git_key.pub
```

### Step 3: Add SSH Key to Git Provider
1. Copy the public key above
2. Go to your Git provider:
   - **GitHub**: Settings → SSH and GPG keys → New SSH key
   - **GitLab**: Preferences → SSH Keys → Add key
   - **Bitbucket**: Personal settings → SSH keys → Add key
3. Paste the key and save

### Step 4: Test Connection
```bash
# Test GitHub connection
ssh -T git@github.com
# Expected output: "Hi username! You've successfully authenticated..."

# Test GitLab connection
ssh -T git@gitlab.com
# Expected output: "Welcome to GitLab, username!"
```

### Step 5: Create Project Directory
```bash
# Create project directory
mkdir -p /var/www/hapas_ecommerce
cd /var/www/hapas_ecommerce
```

## 📂 Project Structure (Planned)
```
/var/www/hapas_ecommerce/
├── backend/                 # Backend application
├── frontend/               # Frontend application
├── docker-compose.yml      # Docker services configuration
├── nginx/                  # Nginx configuration files
│   ├── hapas.conf         # Main site config
│   └── api.hapas.conf     # API config
├── .env                   # Environment variables
├── .env.example           # Environment template
├── scripts/               # Deployment scripts
│   ├── deploy.sh         # Main deployment script
│   └── backup.sh         # Backup script
└── docs/                  # Documentation
    ├── DEPLOYMENT_GUIDE.md # This file
    └── API_DOCS.md        # API documentation
```

## 🚀 Deployment Steps

### Step 1: Clone Repository
```bash
cd /var/www/hapas_ecommerce
git clone git@github.com:xingcorp/hapas_ecommerce.git .
```

### Step 2: Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### Step 3: Docker Configuration
```bash
# Review docker-compose.yml for port conflicts
# Ensure ports don't conflict with existing services:
# - idol.dating uses: 3000, 4854, 5050, 5432
# - hapas should use: 3001, 3002, 5433, etc.
```

### Step 4: Database Setup
```bash
# Start database container first
docker-compose up -d postgres

# Wait for database to be ready
sleep 10

# Run migrations (if applicable)
docker-compose exec backend npm run migration:run
```

### Step 5: Application Deployment
```bash
# Build and start all services
docker-compose up -d

# Check container status
docker-compose ps

# View logs if needed
docker-compose logs -f
```

### Step 6: Nginx Configuration
```bash
# Create nginx virtual host configuration
# File: /etc/nginx/sites-available/hapas.domain.com

# Enable the site
ln -s /etc/nginx/sites-available/hapas.domain.com /etc/nginx/sites-enabled/

# Test nginx configuration
nginx -t

# Reload nginx
systemctl reload nginx
```

### Step 7: SSL Setup (Optional)
```bash
# Install certbot if not already installed
apt update && apt install certbot python3-certbot-nginx

# Generate SSL certificate
certbot --nginx -d hapas.domain.com -d api.hapas.domain.com
```

## 🔍 Port Allocation Plan
```
Service               Port    Purpose
------------------   ------   ------------------------
Hapas Backend        3001     Node.js/NestJS API
Hapas Frontend       3002     React/Next.js App  
Hapas Database       5433     PostgreSQL
Hapas Redis          6380     Redis Cache (if needed)
Hapas Admin          3003     Admin Panel (if needed)

# Existing services (do not use):
Idol Dating Backend  3000     Existing project
Idol Dating Nginx    4854     Existing project  
Idol Dating PgAdmin  5050     Existing project
Idol Dating DB       5432     Existing project
```

## 🔧 Useful Commands

### Docker Management
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Restart service
docker-compose restart [service_name]

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Git Operations
```bash
# Pull latest changes
git pull origin main

# Check status
git status

# View commit history
git log --oneline -10
```

### System Monitoring
```bash
# Check port usage
netstat -tulpn | grep -E ':3001|:3002|:5433'

# Check disk space
df -h

# Check memory usage
free -h

# Check container resource usage
docker stats
```

## 🚨 Troubleshooting

### SSH Key Issues
```bash
# Check SSH key permissions
ls -la /root/.ssh/

# Test specific key
ssh -i /root/.ssh/hapas_git_key -T git@github.com

# Debug SSH connection
ssh -vT git@github.com
```

### Docker Issues
```bash
# Check Docker daemon
systemctl status docker

# Clean up unused containers/images
docker system prune

# Check container logs
docker-compose logs [service_name]
```

### Nginx Issues
```bash
# Test nginx configuration
nginx -t

# Check nginx status
systemctl status nginx

# View nginx error logs
tail -f /var/log/nginx/error.log
```

## 📊 Monitoring & Maintenance

### Health Checks
- Application endpoints
- Database connectivity  
- Container resource usage
- Disk space monitoring
- Log file rotation

### Backup Strategy
- Database backups
- Application code backups
- Environment configurations
- SSL certificates

### Security Considerations
- Regular security updates
- SSH key rotation
- Environment variable protection
- Database access restrictions
- Nginx security headers

## 📝 Notes
- This deployment is isolated from existing `idol.dating` project
- All ports are carefully chosen to avoid conflicts
- SSH keys are specific to this server and project
- Consider setting up monitoring and alerting
- Regular backups are essential for production

---
**Created**: 2025-09-30
**Server**: Ubuntu Linux 
**Git Account**: xingcorp
**SSH Key**: hapas-server-20250930
