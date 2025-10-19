# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Hapas E-commerce is a modern e-commerce platform built on **EverShop v1.2.2**, using TypeScript, React, GraphQL, Express.js, and PostgreSQL. The platform follows a modular architecture with support for themes and extensions.

## Common Development Commands

### Essential Build and Development Commands

```bash
# Install dependencies
npm install

# Compile TypeScript code (required before first run)
npm run compile       # Compile EverShop core using SWC (fast)
npm run compile:db    # Compile database query builder
npm run compile:tsc   # Alternative: compile with TypeScript compiler (slower)

# Run installation wizard (first-time setup)
npm run setup

# Development mode with hot reloading
npm run dev

# Production build and run
npm run build
npm run start

# Debug mode
npm run start:debug
```

### Database Management

```bash
# Using Docker for PostgreSQL (recommended)
docker-compose -f docker-compose.dev.yml up -d     # Start database
docker-compose -f docker-compose.dev.yml logs database  # View logs
docker-compose -f docker-compose.dev.yml down      # Stop database

# Database connection details for Docker setup:
# Host: localhost
# Port: 5433 (development) or 5432 (production)
# Database: evershop
# User: postgres
# Password: postgres
```

### Testing Commands

```bash
# Run unit tests with Jest
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests with Cypress
npm run test:e2e

# Run tests in watch mode
npm run test:watch

# Run a single test file
npx jest path/to/test.test.js
```

### Code Quality

```bash
# Lint code with ESLint
npm run lint

# Format code with Prettier
npm run format

# Type checking
npm run type-check
```

### KIAS Data Migration (Hapas-specific)

```bash
# Import categories from KIAS.vn
npm run migrate:categories

# Import products from KIAS
npm run import:kias-products

# Download and optimize product images
npm run download:product-images

# Verify imported products
npm run verify:products
```

### User Management

```bash
# Create admin user
npm run user:create

# Change user password
node packages/evershop/dist/bin/user/changePassword.js --email admin@admin.com --password newpassword123
```

## Architecture and Code Structure

### Directory Structure

```
hapas_ecommerce/
├── packages/
│   ├── evershop/                 # Core EverShop platform
│   │   ├── src/
│   │   │   ├── components/       # Shared React components
│   │   │   ├── modules/          # Business logic modules
│   │   │   │   ├── auth/         # Authentication & authorization
│   │   │   │   ├── catalog/      # Product catalog management
│   │   │   │   ├── checkout/     # Checkout flow and cart
│   │   │   │   ├── customer/     # Customer accounts
│   │   │   │   ├── cms/          # Content management
│   │   │   │   ├── oms/          # Order management system
│   │   │   │   ├── promotion/    # Discounts and coupons
│   │   │   │   ├── setting/      # Store settings
│   │   │   │   └── tax/          # Tax calculation
│   │   │   ├── lib/              # Core utilities
│   │   │   └── bin/              # CLI tools
│   │   └── dist/                 # Compiled JavaScript (generated)
│   ├── postgres-query-builder/   # Custom database abstraction layer
│   └── create-evershop-app/      # Project scaffolding tool
├── extensions/                   # Modular extensions
│   ├── agegate/                 # Age verification
│   ├── google_login/            # Google OAuth integration
│   ├── product_review/          # Product reviews system
│   ├── s3_file_storage/         # AWS S3 storage
│   ├── azure_file_storage/     # Azure blob storage
│   ├── sendgrid/                # SendGrid email
│   └── resend/                  # Resend email service
├── themes/                       # Custom themes (create here)
├── config/                       # Configuration files
│   └── default.json             # Main configuration
├── media/                        # Uploaded files
├── public/                       # Static assets
└── .evershop/                   # Build artifacts (auto-generated)
```

### Module Architecture

Each module in `packages/evershop/src/modules/` follows this structure:

```
module_name/
├── pages/                   # React pages and routes
│   ├── admin/              # Admin panel pages
│   └── frontStore/         # Customer-facing pages
├── api/                     # REST API endpoints
├── graphql/                 # GraphQL schema and resolvers
│   └── types/              # GraphQL type definitions
├── services/                # Business logic services
├── migration/               # Database migrations
├── subscribers/             # Event subscribers
└── validators/              # Input validation schemas
```

### Page and Routing System

- **Page Structure**: Each page is a directory in `pages/admin/` or `pages/frontStore/`
- **Route Definition**: `route.json` defines the URL path and HTTP methods
- **Components**: React components with `export const layout` for area placement
- **Middleware**: Lowercase files (e.g., `index.js`, `[context].js`) run before rendering
- **SSR GraphQL**: Components can export GraphQL queries as string literals

Example page structure:
```
pages/frontStore/productView/
├── route.json           # {"methods": ["GET"], "path": "/product/:url_key"}
├── index.js            # Middleware to load product data
├── General.jsx         # Main component
└── Images.jsx          # Product images component
```

### GraphQL Integration

- **Schema-first approach**: Define types in `.graphql` files
- **Resolvers**: TypeScript resolvers in `Type.resolvers.ts`
- **Context system**: Pass data from middleware to GraphQL via `setContextValue()`
- **SSR queries**: Components export queries for server-side data fetching

### Extension System

Extensions add functionality without modifying core:

1. Create extension in `extensions/` directory
2. Add to `config/default.json`:
   ```json
   {
     "system": {
       "extensions": [
         {
           "name": "my_extension",
           "resolve": "extensions/my_extension",
           "enabled": true,
           "priority": 10
         }
       ]
     }
   }
   ```
3. Extension can contain pages, APIs, GraphQL types, migrations, etc.

### Theme System

Themes override UI components:

1. Create theme in `themes/` directory
2. Set in `config/default.json`: `"theme": "my_theme"`
3. Theme components override core components by path matching

## Configuration

### Main Configuration (`config/default.json`)

```json
{
  "shop": {
    "currency": "VND",
    "language": "vi",
    "weightUnit": "kg",
    "timezone": "Asia/Ho_Chi_Minh"
  },
  "system": {
    "database": {
      "host": "localhost",
      "port": 5432,
      "database": "evershop",
      "user": "postgres",
      "password": "postgres"
    },
    "theme": "default",
    "extensions": [],
    "session": {
      "cookieName": "sid",
      "secret": "your-session-secret"
    }
  }
}
```

### Environment Variables

Override config with environment variables:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `NODE_ENV` (development/production)
- `PORT` (default: 3000)
- `SESSION_SECRET`

## Development Workflow Tips

### Hot Module Replacement

In development mode (`npm run dev`), the server watches for:
- Component changes (instant reload)
- GraphQL schema changes (automatic merge)
- Route changes (requires restart)
- Configuration changes (requires restart)

### Database Migrations

Migrations run automatically on startup. To create new migration:

1. Create file in `module/migration/Version-X.X.X.js`
2. Export `up()` and `down()` functions
3. Use query builder or raw SQL

### Event System

Subscribe to system events in extensions:

```javascript
// extensions/my_extension/subscribers/order_placed.js
module.exports = async function orderPlacedHandler(data) {
  // Handle order.placed event
};
```

Available events:
- `order.placed`, `order.updated`, `order.cancelled`
- `product.created`, `product.updated`, `product.deleted`
- `customer.registered`, `customer.loggedIn`
- `cart.item.added`, `cart.item.removed`

### GraphQL Development

Access GraphQL playground in development:
- Admin: http://localhost:3000/admin/graphql
- Frontend: http://localhost:3000/graphql

### Error Handling

- Development: Detailed error pages with stack traces
- Production: Generic error pages, logs in `.log/` directory
- Debug mode: `npm run start:debug` for verbose logging

## Troubleshooting Common Issues

### TypeScript Compilation Errors
```bash
# Clean and recompile
rm -rf packages/evershop/dist packages/postgres-query-builder/dist
npm run compile
npm run compile:db
```

### Port Already in Use
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Or use different port
$env:PORT=3001; npm run dev
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker-compose -f docker-compose.dev.yml ps

# Reset database
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
npm run setup
```

### Module Not Found Errors
```bash
# Clear Node.js cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run compile
npm run compile:db
```

## Performance Optimization

### Build Performance
- Use `npm run compile` (SWC) instead of `npm run compile:tsc` (TypeScript) for faster builds
- SWC is ~20x faster than TypeScript compiler

### Runtime Performance
- Enable Redis for session storage in production
- Use CDN for static assets (`/assets/`, `/media/`)
- Enable HTTP/2 in reverse proxy (Nginx/Apache)
- Use PM2 cluster mode for multi-core utilization

### Database Performance
- Create indexes on frequently queried columns
- Use connection pooling (built-in with pg library)
- Monitor slow queries in PostgreSQL logs

## Security Considerations

### Session Security
- Always set strong `SESSION_SECRET` in production
- Use HTTPS in production
- Configure secure cookies in `config/production.json`

### File Upload Security
- Validate file types in upload handlers
- Scan uploaded files for malware
- Store uploads outside web root when possible

### SQL Injection Prevention
- Use query builder instead of raw SQL
- If using raw SQL, always use parameterized queries
- Never concatenate user input into SQL strings

## Integration Points

### Payment Gateways
- Stripe: Built-in support, configure in admin panel
- PayPal: Available via extension
- COD (Cash on Delivery): Built-in

### Email Services
- SendGrid: Available via extension
- Resend: Available via extension
- SMTP: Configure in settings

### Storage Services
- Local filesystem: Default
- AWS S3: Via s3_file_storage extension
- Azure Blob: Via azure_file_storage extension

### Analytics and Monitoring
- Google Analytics: Add tracking code in theme
- Sentry: Configure error tracking in production
- Custom events: Use event system for tracking

## Hapas-Specific Implementation

### KIAS.vn Product Import
The platform is configured to import products from KIAS.vn with:
- 4 main categories: Set Bộ, Váy & Đầm, Quần, Áo
- Price range: 580,000₫ - 2,780,000₫
- Total: ~53 products

### Theme Customization
Hapas theme should follow:
- Minimalist white/black color scheme
- Fashion-focused grid layouts
- Elegant typography
- Mobile-first responsive design

### Localization
- Primary language: Vietnamese (vi)
- Currency: VND (Vietnamese Dong)
- Timezone: Asia/Ho_Chi_Minh
- Date format: DD/MM/YYYY