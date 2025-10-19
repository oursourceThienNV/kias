#!/bin/bash
# Database Admin với Supabase Studio

set -e

COMPOSE_FILE="docker-compose.supabase.yml"

case "$1" in
  start)
    echo "🚀 Starting Supabase Studio for database administration..."
    docker-compose -f "$COMPOSE_FILE" up -d
    echo ""
    echo "✅ Supabase Studio is running!"
    echo "📊 Access at: http://localhost:3001"
    echo ""
    echo "Database connection:"
    echo "  Host: host.docker.internal"
    echo "  Port: 5433"
    echo "  Database: hapas_ecommerce"
    echo "  User: hapas"
    ;;
    
  stop)
    echo "🛑 Stopping Supabase Studio..."
    docker-compose -f "$COMPOSE_FILE" down
    echo "✅ Stopped!"
    ;;
    
  logs)
    docker-compose -f "$COMPOSE_FILE" logs -f "$2"
    ;;
    
  restart)
    echo "🔄 Restarting Supabase Studio..."
    docker-compose -f "$COMPOSE_FILE" restart
    echo "✅ Restarted!"
    ;;
    
  status)
    docker-compose -f "$COMPOSE_FILE" ps
    ;;
    
  *)
    echo "Usage: $0 {start|stop|restart|logs|status}"
    echo ""
    echo "Commands:"
    echo "  start   - Start Supabase Studio"
    echo "  stop    - Stop Supabase Studio"
    echo "  restart - Restart services"
    echo "  logs    - View logs (optional: specify service)"
    echo "  status  - Check service status"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs studio"
    echo "  $0 stop"
    exit 1
    ;;
esac

