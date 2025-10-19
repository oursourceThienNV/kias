#!/bin/bash
# Hapas E-commerce Production Deployment Script
# Usage: ./deploy.sh [--backup] [--no-build] [--rollback]

set -e

# Configuration
PROJECT_DIR="/var/www/hapas_ecommerce"
BACKUP_DIR="/home/hapas/backups"
LOG_FILE="/var/www/hapas_ecommerce/logs/deployment.log"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    echo "[ERROR] $1" >> "$LOG_FILE"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    echo "[SUCCESS] $1" >> "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    echo "[WARNING] $1" >> "$LOG_FILE"
}

# Check if running as hapas user
if [ "$(whoami)" != "hapas" ]; then
    error "This script must be run as hapas user"
fi

# Parse arguments
BACKUP=false
NO_BUILD=false
ROLLBACK=false

for arg in "$@"; do
    case $arg in
        --backup)
            BACKUP=true
            shift
            ;;
        --no-build)
            NO_BUILD=true
            shift
            ;;
        --rollback)
            ROLLBACK=true
            shift
            ;;
        *)
            warning "Unknown argument: $arg"
            ;;
    esac
done

# Change to project directory
cd "$PROJECT_DIR" || error "Cannot change to project directory"

log "Starting Hapas E-commerce deployment..."

# Create backup if requested
if [ "$BACKUP" = true ] || [ "$ROLLBACK" = true ]; then
    log "Creating database backup..."
    BACKUP_NAME="hapas_backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    if docker exec hapas-ecommerce-db pg_dump -U hapas hapas_ecommerce > "$BACKUP_DIR/$BACKUP_NAME.sql" 2>/dev/null; then
        success "Database backup created: $BACKUP_NAME.sql"
    else
        warning "Database backup failed or database not running"
    fi
fi

# Handle rollback
if [ "$ROLLBACK" = true ]; then
    log "Performing rollback to previous version..."
    if [ -f "$BACKUP_DIR/last_working_backup.sql" ]; then
        docker exec -i hapas-ecommerce-db psql -U hapas -d hapas_ecommerce < "$BACKUP_DIR/last_working_backup.sql"
        success "Database rollback completed"
    else
        error "No rollback backup found"
    fi
    exit 0
fi

# Pull latest changes
log "Pulling latest code from repository..."
if git pull origin master; then
    success "Code updated successfully"
else
    error "Failed to pull latest code"
fi

# Load environment variables
if [ -f "$ENV_FILE" ]; then
    log "Loading environment variables..."
    set -o allexport
    source "$ENV_FILE"
    set +o allexport
    success "Environment variables loaded"
else
    warning "Environment file not found, using defaults"
fi

# Health check function
health_check() {
    local service=$1
    local max_attempts=30
    local attempt=1
    
    log "Performing health check for $service..."
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose -f "$COMPOSE_FILE" ps "$service" | grep -q "healthy\|Up"; then
            success "$service is healthy"
            return 0
        fi
        
        log "Health check attempt $attempt/$max_attempts for $service..."
        sleep 5
        ((attempt++))
    done
    
    error "Health check failed for $service after $max_attempts attempts"
}

# Stop existing containers gracefully
log "Stopping existing containers..."
if docker-compose -f "$COMPOSE_FILE" down --timeout 30; then
    success "Containers stopped successfully"
else
    warning "Some containers may not have stopped gracefully"
fi

# Build new images if needed
if [ "$NO_BUILD" != true ]; then
    log "Building application image..."
    if docker-compose -f "$COMPOSE_FILE" build --no-cache hapas-app; then
        success "Application image built successfully"
    else
        error "Failed to build application image"
    fi
fi

# Start database first
log "Starting database container..."
if docker-compose -f "$COMPOSE_FILE" up -d hapas-database; then
    success "Database container started"
    health_check "hapas-database"
else
    error "Failed to start database container"
fi

# Start application container
log "Starting application container..."
if docker-compose -f "$COMPOSE_FILE" up -d hapas-app; then
    success "Application container started"
    health_check "hapas-app"
else
    error "Failed to start application container"
fi

# Wait for application to be ready
log "Waiting for application to be ready..."
sleep 30

# Verify deployment
log "Verifying deployment..."
if curl -f -s http://localhost:3001/ > /dev/null; then
    success "Application is responding on port 3001"
else
    warning "Application health check failed - check logs"
fi

# Clean up old images
log "Cleaning up old Docker images..."
docker system prune -f > /dev/null 2>&1 || true

# Save current backup as last working
if [ -f "$BACKUP_DIR/$BACKUP_NAME.sql" ]; then
    cp "$BACKUP_DIR/$BACKUP_NAME.sql" "$BACKUP_DIR/last_working_backup.sql"
fi

success "Deployment completed successfully!"
log "Deployment summary:"
log "- Database: $(docker ps --filter 'name=hapas-ecommerce-db' --format '{{.Status}}')"
log "- Application: $(docker ps --filter 'name=hapas-ecommerce-app' --format '{{.Status}}')"
log "- Application URL: http://localhost:3001"
