#!/bin/bash
# Hapas E-commerce Health Check Script

# Configuration
APP_URL="http://localhost:3001"
DB_CONTAINER="hapas-ecommerce-db"
APP_CONTAINER="hapas-ecommerce-app"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Exit codes
EXIT_OK=0
EXIT_WARNING=1
EXIT_CRITICAL=2
EXIT_UNKNOWN=3

print_status() {
    local service=$1
    local status=$2
    local message=$3
    
    case $status in
        "OK")
            echo -e "${service}: ${GREEN}OK${NC} - $message"
            ;;
        "WARNING")
            echo -e "${service}: ${YELLOW}WARNING${NC} - $message"
            ;;
        "CRITICAL")
            echo -e "${service}: ${RED}CRITICAL${NC} - $message"
            ;;
        "UNKNOWN")
            echo -e "${service}: ${BLUE}UNKNOWN${NC} - $message"
            ;;
    esac
}

# Check Docker containers
check_containers() {
    echo "=== Docker Container Status ==="
    
    # Check database container
    if docker ps --filter "name=$DB_CONTAINER" --format "{{.Status}}" | grep -q "healthy\|Up"; then
        local db_status=$(docker ps --filter "name=$DB_CONTAINER" --format "{{.Status}}")
        print_status "Database Container" "OK" "$db_status"
        DB_OK=true
    else
        print_status "Database Container" "CRITICAL" "Container not running or unhealthy"
        DB_OK=false
    fi
    
    # Check application container
    if docker ps --filter "name=$APP_CONTAINER" --format "{{.Status}}" | grep -q "healthy\|Up"; then
        local app_status=$(docker ps --filter "name=$APP_CONTAINER" --format "{{.Status}}")
        print_status "Application Container" "OK" "$app_status"
        APP_OK=true
    else
        print_status "Application Container" "CRITICAL" "Container not running or unhealthy"
        APP_OK=false
    fi
}

# Check database connectivity
check_database() {
    echo -e "\n=== Database Connectivity ==="
    
    if [ "$DB_OK" = true ]; then
        if docker exec $DB_CONTAINER pg_isready -U hapas -d hapas_ecommerce > /dev/null 2>&1; then
            print_status "Database Connection" "OK" "PostgreSQL is accepting connections"
        else
            print_status "Database Connection" "CRITICAL" "Cannot connect to database"
        fi
        
        # Check database size
        local db_size=$(docker exec $DB_CONTAINER psql -U hapas -d hapas_ecommerce -t -c "SELECT pg_size_pretty(pg_database_size('hapas_ecommerce'));" 2>/dev/null | xargs)
        if [ ! -z "$db_size" ]; then
            print_status "Database Size" "OK" "$db_size"
        else
            print_status "Database Size" "WARNING" "Could not retrieve database size"
        fi
    else
        print_status "Database Connection" "CRITICAL" "Database container not running"
    fi
}

# Check application response
check_application() {
    echo -e "\n=== Application Health ==="
    
    # HTTP response check
    if curl -f -s -m 10 "$APP_URL" > /dev/null 2>&1; then
        local response_time=$(curl -o /dev/null -s -w "%{time_total}" -m 10 "$APP_URL")
        print_status "HTTP Response" "OK" "Responding in ${response_time}s"
    else
        print_status "HTTP Response" "CRITICAL" "Application not responding on $APP_URL"
        return
    fi
    
    # Check specific endpoints
    if curl -f -s -m 5 "$APP_URL/api/health" > /dev/null 2>&1; then
        print_status "Health Endpoint" "OK" "/api/health responding"
    else
        print_status "Health Endpoint" "WARNING" "/api/health not available"
    fi
}

# Check system resources
check_resources() {
    echo -e "\n=== System Resources ==="
    
    # Disk space
    local disk_usage=$(df /var/www/hapas_ecommerce | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$disk_usage" -lt 80 ]; then
        print_status "Disk Usage" "OK" "${disk_usage}% used"
    elif [ "$disk_usage" -lt 90 ]; then
        print_status "Disk Usage" "WARNING" "${disk_usage}% used"
    else
        print_status "Disk Usage" "CRITICAL" "${disk_usage}% used"
    fi
    
    # Memory usage
    local memory_usage=$(free | awk 'NR==2{printf "%.1f", $3*100/$2}')
    local memory_usage_int=${memory_usage%.*}
    if [ "$memory_usage_int" -lt 80 ]; then
        print_status "Memory Usage" "OK" "${memory_usage}% used"
    elif [ "$memory_usage_int" -lt 90 ]; then
        print_status "Memory Usage" "WARNING" "${memory_usage}% used"
    else
        print_status "Memory Usage" "CRITICAL" "${memory_usage}% used"
    fi
    
    # Docker stats
    if command -v docker >/dev/null 2>&1; then
        local running_containers=$(docker ps --filter "name=hapas-" --format "{{.Names}}" | wc -l)
        print_status "Running Containers" "OK" "$running_containers Hapas containers"
    fi
}

# Check network connectivity
check_network() {
    echo -e "\n=== Network Connectivity ==="
    
    # Check if ports are listening
    if netstat -tuln | grep -q ":3001 "; then
        print_status "Port 3001" "OK" "Application port listening"
    else
        print_status "Port 3001" "CRITICAL" "Application port not listening"
    fi
    
    if netstat -tuln | grep -q ":5433 "; then
        print_status "Port 5433" "OK" "Database port listening"
    else
        print_status "Port 5433" "CRITICAL" "Database port not listening"
    fi
}

# Check logs for errors
check_logs() {
    echo -e "\n=== Recent Logs ==="
    
    if [ "$APP_OK" = true ]; then
        local error_count=$(docker logs $APP_CONTAINER --since="1h" 2>&1 | grep -i "error\|exception\|fail" | wc -l)
        if [ "$error_count" -eq 0 ]; then
            print_status "Application Logs" "OK" "No errors in last hour"
        elif [ "$error_count" -lt 5 ]; then
            print_status "Application Logs" "WARNING" "$error_count errors in last hour"
        else
            print_status "Application Logs" "CRITICAL" "$error_count errors in last hour"
        fi
    fi
    
    if [ "$DB_OK" = true ]; then
        local db_error_count=$(docker logs $DB_CONTAINER --since="1h" 2>&1 | grep -i "error\|fail\|fatal" | wc -l)
        if [ "$db_error_count" -eq 0 ]; then
            print_status "Database Logs" "OK" "No errors in last hour"
        elif [ "$db_error_count" -lt 3 ]; then
            print_status "Database Logs" "WARNING" "$db_error_count errors in last hour"
        else
            print_status "Database Logs" "CRITICAL" "$db_error_count errors in last hour"
        fi
    fi
}

# Main execution
main() {
    echo "Hapas E-commerce Health Check - $(date)"
    echo "============================================"
    
    check_containers
    check_database
    check_application
    check_resources
    check_network
    check_logs
    
    echo -e "\n============================================"
    echo "Health check completed - $(date)"
    
    # Determine exit code based on critical issues
    if [ "$DB_OK" = false ] || ! curl -f -s -m 10 "$APP_URL" > /dev/null 2>&1; then
        echo -e "${RED}Overall Status: CRITICAL${NC}"
        exit $EXIT_CRITICAL
    else
        echo -e "${GREEN}Overall Status: OK${NC}"
        exit $EXIT_OK
    fi
}

# Initialize variables
DB_OK=false
APP_OK=false

# Run main function
main "$@"
