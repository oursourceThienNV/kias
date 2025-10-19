#!/bin/bash
# Hapas E-commerce Database Initialization Script

set -e

# Create necessary extensions
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    
    -- Grant privileges
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;
    
    -- Log initialization
    SELECT 'Hapas E-commerce database initialized successfully' AS status;
EOSQL

echo "Database initialization completed"
