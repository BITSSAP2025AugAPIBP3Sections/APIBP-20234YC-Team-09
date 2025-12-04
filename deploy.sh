#!/bin/bash

# 🚀 FUSION ELECTRONICS - DEPLOYMENT SCRIPT
# Comprehensive deployment with health checks and rollback

set -e

# Configuration
PROJECT_NAME="fusion-electronics"
DOCKER_IMAGE="suryanshpandey7081/fusion-electronics:latest"
HEALTH_CHECK_URL="http://localhost:8000/api/products"
BACKUP_CONTAINER="${PROJECT_NAME}-backup"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Pre-deployment checks
pre_deployment_checks() {
    log "🔍 Running pre-deployment checks..."
    
    # Check Docker is running
    if ! docker info >/dev/null 2>&1; then
        error "Docker is not running!"
        exit 1
    fi
    
    # Check if image exists
    if ! docker image inspect $DOCKER_IMAGE >/dev/null 2>&1; then
        warn "Image $DOCKER_IMAGE not found locally, will pull from Docker Hub"
    fi
    
    # Check disk space
    DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ $DISK_USAGE -gt 90 ]; then
        error "Disk usage is ${DISK_USAGE}%, deployment aborted"
        exit 1
    fi
    
    log "✅ Pre-deployment checks passed"
}

# Backup current deployment
backup_current_deployment() {
    log "💾 Creating backup of current deployment..."
    
    # Check if container is running
    if docker ps -q -f name=$PROJECT_NAME | grep -q .; then
        # Create backup image
        docker commit $PROJECT_NAME ${PROJECT_NAME}-backup:$(date +%Y%m%d-%H%M%S)
        log "✅ Backup created successfully"
    else
        info "No running container to backup"
    fi
}

# Deploy new version
deploy() {
    log "🚀 Starting deployment..."
    
    # Pull latest image
    log "📥 Pulling latest Docker image..."
    docker pull $DOCKER_IMAGE
    
    # Stop existing container
    if docker ps -q -f name=$PROJECT_NAME | grep -q .; then
        log "🛑 Stopping existing container..."
        docker stop $PROJECT_NAME
    fi
    
    # Remove existing container
    if docker ps -aq -f name=$PROJECT_NAME | grep -q .; then
        log "🗑️ Removing existing container..."
        docker rm $PROJECT_NAME
    fi
    
    # Start new container
    log "🏁 Starting new container..."
    docker run -d \
        --name $PROJECT_NAME \
        -p 8000:8000 \
        -p 3000:3000 \
        --restart unless-stopped \
        --health-cmd="curl -f http://localhost:8000/api/products || exit 1" \
        --health-interval=30s \
        --health-timeout=10s \
        --health-retries=3 \
        $DOCKER_IMAGE
    
    log "✅ Container started successfully"
}

# Health check
health_check() {
    log "🏥 Running health checks..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        info "Health check attempt $attempt/$max_attempts"
        
        if curl -f -s $HEALTH_CHECK_URL >/dev/null 2>&1; then
            log "✅ Health check passed!"
            return 0
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            error "❌ Health check failed after $max_attempts attempts"
            return 1
        fi
        
        sleep 10
        ((attempt++))
    done
}

# Rollback function
rollback() {
    error "🔄 Initiating rollback..."
    
    # Stop failed container
    if docker ps -q -f name=$PROJECT_NAME | grep -q .; then
        docker stop $PROJECT_NAME
        docker rm $PROJECT_NAME
    fi
    
    # Find latest backup
    LATEST_BACKUP=$(docker images --format "table {{.Repository}}:{{.Tag}}" | grep "${PROJECT_NAME}-backup" | head -n1)
    
    if [ -n "$LATEST_BACKUP" ]; then
        log "🔄 Rolling back to: $LATEST_BACKUP"
        
        docker run -d \
            --name $PROJECT_NAME \
            -p 8000:8000 \
            -p 3000:3000 \
            --restart unless-stopped \
            $LATEST_BACKUP
        
        log "✅ Rollback completed"
    else
        error "❌ No backup found for rollback!"
        exit 1
    fi
}

# Post-deployment actions
post_deployment() {
    log "📊 Running post-deployment actions..."
    
    # Run comprehensive health check
    if command -v node >/dev/null 2>&1; then
        node health-check.js || warn "Health check script failed"
    fi
    
    # Send deployment notification to ELK
    if command -v curl >/dev/null 2>&1; then
        curl -X POST "http://34.132.244.48:9200/deployments/_doc" \
            -H "Content-Type: application/json" \
            -d "{
                \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)\",
                \"project\": \"$PROJECT_NAME\",
                \"version\": \"$DOCKER_IMAGE\",
                \"status\": \"success\",
                \"environment\": \"production\"
            }" 2>/dev/null || warn "Failed to send deployment log to ELK"
    fi
    
    log "✅ Post-deployment actions completed"
}

# Cleanup old images
cleanup() {
    log "🧹 Cleaning up old images..."
    
    # Remove dangling images
    docker image prune -f >/dev/null 2>&1 || true
    
    # Keep only last 3 backup images
    BACKUP_IMAGES=$(docker images --format "table {{.Repository}}:{{.Tag}}" | grep "${PROJECT_NAME}-backup" | tail -n +4)
    if [ -n "$BACKUP_IMAGES" ]; then
        echo "$BACKUP_IMAGES" | xargs docker rmi >/dev/null 2>&1 || true
    fi
    
    log "✅ Cleanup completed"
}

# Main deployment workflow
main() {
    log "🚀 FUSION ELECTRONICS - DEPLOYMENT STARTING"
    log "=============================================="
    
    # Run deployment steps
    pre_deployment_checks
    backup_current_deployment
    deploy
    
    # Check if deployment was successful
    if health_check; then
        post_deployment
        cleanup
        log "🎉 DEPLOYMENT SUCCESSFUL!"
        exit 0
    else
        error "💥 DEPLOYMENT FAILED!"
        rollback
        
        # Check rollback health
        if health_check; then
            warn "🔄 Rollback successful, but deployment failed"
            exit 1
        else
            error "💥 CRITICAL: Both deployment and rollback failed!"
            exit 2
        fi
    fi
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy"|"")
        main
        ;;
    "health")
        health_check
        ;;
    "rollback")
        rollback
        ;;
    "cleanup")
        cleanup
        ;;
    *)
        echo "Usage: $0 {deploy|health|rollback|cleanup}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Full deployment with health checks (default)"
        echo "  health   - Run health check only"
        echo "  rollback - Rollback to previous version"
        echo "  cleanup  - Clean up old Docker images"
        exit 1
        ;;
esac