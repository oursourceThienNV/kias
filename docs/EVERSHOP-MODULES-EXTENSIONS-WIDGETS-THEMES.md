# EverShop Deep Dive: Modules, Extensions, Widgets, and Themes

**Comprehensive Technical Reference for Senior Engineers**

This document provides complete, in-depth coverage of EverShop v1.x architecture. Every concept is explained with technical details, code examples, and real-world patterns drawn from official documentation and production implementations.

> **Audience**: Senior/lead engineers building EverShop features, extensions, and themes  
> **Scope**: Architecture fundamentals → Advanced customization → Production deployment  
> **Last Updated**: October 2025

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Modules System](#2-modules-system)
3. [Extensions Development](#3-extensions-development)
4. [Widgets System](#4-widgets-system)
5. [Theme Development](#5-theme-development)
6. [The Area System](#6-the-area-system)
7. [Routing and Middleware](#7-routing-and-middleware)
8. [Data Fetching with GraphQL](#8-data-fetching-with-graphql)
9. [Database Migrations](#9-database-migrations)
10. [Advanced Patterns](#10-advanced-patterns)
11. [Production Considerations](#11-production-considerations)
12. [Troubleshooting Guide](#12-troubleshooting-guide)

---

## 1. Architecture Overview

### 1.1 Core Principles

EverShop follows a **modular monolith** architecture with these foundational principles:

#### Module Independence
- Each module encapsulates one business domain
- Minimal coupling between modules
- Communication via events, hooks, and service contracts

#### Extension-First Design
- Core functionality can be extended without modifying source
- Extensions live outside core codebase
- Theme overrides provide UI customization

#### Server-Side Rendering (SSR)
- React components render on server
- HTML sent to client for fast first paint
- Client-side hydration for interactivity
- Automatic code splitting per route

#### Area-Based Composition
- Pages are composed of named "areas"
- Components register into areas via `layout` export
- Sorting via `sortOrder` property
- Dynamic composition at build/runtime

#### Convention over Configuration
- File structure determines routing
- Naming conventions control discovery
- Minimal boilerplate, maximum productivity

### 1.2 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   EverShop Application                      │
├─────────────────────────────────────────────────────────────┤
│  Node.js + Express.js                                       │
│  ├── Middleware Pipeline                                    │
│  ├── Route Discovery & Matching                             │
│  ├── GraphQL API (Apollo Server)                            │
│  └── SSR Engine (React)                                     │
├─────────────────────────────────────────────────────────────┤
│  Core Modules (Read-Only)                                   │
│  └── node_modules/@evershop/evershop/dist/modules/          │
│      ├── catalog/   ├── cms/       ├── customer/            │
│      ├── checkout/  ├── order/     ├── promotion/           │
│      └── base/                                              │
├─────────────────────────────────────────────────────────────┤
│  Extensions (Custom)                                        │
│  └── extensions/*/src/                                      │
│      ├── api/       ├── pages/     ├── services/            │
│      ├── migration/ ├── graphql/   └── bootstrap.ts         │
├─────────────────────────────────────────────────────────────┤
│  Active Theme                                               │
│  └── themes/[active]/src/                                   │
│      ├── pages/all/         ← Global components             │
│      ├── pages/[route]/     ← Route-specific components     │
│      ├── components/        ← Reusable UI primitives        │
│      └── styles/            ← Global styles                 │
├─────────────────────────────────────────────────────────────┤
│  Database (PostgreSQL)                                      │
│  └── Tables managed via migrations                          │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Request Lifecycle

```
1. HTTP Request
   ↓
2. Express Middleware Chain
   ├── Authentication
   ├── Session Management
   ├── Global Middleware (from modules/extensions)
   └── Route-Specific Middleware
   ↓
3. Route Matching
   ├── Scan route.json files
   ├── Match HTTP method + path pattern
   └── Load associated middleware + components
   ↓
4. Data Fetching
   ├── Execute GraphQL query (if `export const query`)
   ├── Merge results into component props
   └── Pass to SSR engine
   ↓
5. Server-Side Rendering
   ├── Resolve areas and components
   ├── Sort by sortOrder
   ├── Render React tree to HTML
   └── Inject props as window.__INITIAL_STATE__
   ↓
6. Response
   ├── Send HTML to client
   └── Browser hydrates React with client bundle
   ↓
7. Client-Side Hydration
   ├── Download JavaScript chunks
   ├── Rehydrate React tree
   └── App becomes fully interactive
```

---

## 2. Modules System

### 2.1 What is a Module?

A **module** is the primary organizational unit in EverShop. It packages:

- **API routes** (`api/*`) - REST endpoints with middleware
- **Pages** (`pages/*`) - SSR React components for admin/storefront
- **Services** (`services/*`) - Business logic, validators, utilities
- **Migrations** (`migration/*`) - Database schema changes
- **Bootstrap** (`bootstrap.ts`) - Initialization code
- **GraphQL** (`graphql/*`) - Type definitions and resolvers

**Philosophy**: One module = one business capability (catalog, checkout, CMS, etc.)

### 2.2 Module Locations

#### Core Modules (Read-Only)

Located in `node_modules/@evershop/evershop/dist/modules/`:

| Module      | Purpose                                      |
|-------------|----------------------------------------------|
| `catalog`   | Products, categories, attributes, inventory  |
| `cms`       | Pages, blocks, content management            |
| `customer`  | Accounts, addresses, authentication          |
| `checkout`  | Shopping cart, checkout flow                 |
| `order`     | Order processing, invoices, shipments        |
| `promotion` | Discounts, coupons, price rules              |
| `setting`   | System configuration, admin settings         |
| `base`      | Foundation (layout, navigation, core UI)     |

**⚠️ CRITICAL**: Never edit core modules. They are:
- Overwritten on every `npm install`
- Compiled from TypeScript source
- Updated by platform upgrades

#### Custom Modules (Extensions)

Located in `extensions/*/src/`:

```
extensions/
├── stripe_payment/
├── fedex_shipping/
├── custom_reviews/
└── hapas_homepage/
```

These are **your modules**—safe to edit, version control, and deploy.

### 2.3 Module Structure (Complete)

```
modules/catalog/
└── src/
    ├── api/                          # REST API endpoints
    │   ├── global/                   # Global middleware (all routes)
    │   │   └── authMiddleware.ts
    │   └── createProduct/            # Specific endpoint
    │       ├── route.json            # Route definition
    │       ├── validateProduct.ts    # Middleware 1
    │       └── [validateProduct]saveProduct.ts  # Middleware 2 (depends on 1)
    │
    ├── pages/                        # SSR pages
    │   ├── admin/                    # Admin panel pages
    │   │   └── productEdit/
    │   │       ├── route.json        # Admin route
    │   │       ├── Form.tsx          # Component
    │   │       ├── General.tsx       # Component
    │   │       └── index.ts          # Middleware/loader
    │   ├── global/                   # Middleware for all pages
    │   │   └── authMiddleware.ts
    │   └── frontStore/               # Storefront pages
    │       └── productView/
    │           ├── route.json        # Storefront route
    │           ├── ProductView.tsx   # Main component
    │           ├── Price.tsx         # Sub-component
    │           └── index.ts          # Page middleware
    │
    ├── services/                     # Business logic
    │   ├── ProductValidator.ts
    │   ├── InventoryManager.ts
    │   └── PriceCalculator.ts
    │
    ├── graphql/                      # GraphQL API
    │   ├── types/
    │   │   ├── Product.graphql       # Type definitions
    │   │   └── Category.graphql
    │   └── resolvers/
    │       ├── productResolver.ts
    │       └── categoryResolver.ts
    │
    ├── migration/                    # Database migrations
    │   ├── Version_1.0.0.ts          # Initial schema
    │   ├── Version_1.1.0.ts          # Add columns
    │   └── Version_1.2.0.ts          # Indexes
    │
    └── bootstrap.ts                  # Module initialization
```

### 2.4 Module Components Explained

#### A. API Routes (`api/*`)

**Purpose**: RESTful endpoints for mutations, file uploads, webhooks, etc.

**Structure**:
```
api/
├── global/                 # Runs on every API request
│   └── corsMiddleware.ts
└── createProduct/          # POST /api/product/create
    ├── route.json
    ├── validateProduct.ts
    └── [validateProduct]saveProduct.ts
```

**route.json**:
```json
{
  "methods": ["POST"],
  "path": "/api/product/create",
  "access": "private"
}
```

**Middleware Chaining**: Square brackets denote dependencies:
```
[validateProduct]saveProduct.ts
```
means: run `validateProduct.ts` first, then `saveProduct.ts`

**Example Middleware**:
```typescript
// validateProduct.ts
export default function validateProduct(request, response, next) {
  const { name, price } = request.body;
  
  if (!name || price < 0) {
    response.status(400).json({ 
      error: 'Invalid product data' 
    });
    return;
  }
  
  next(); // Continue to next middleware
}

// [validateProduct]saveProduct.ts
export default async function saveProduct(request, response) {
  const product = await saveProductToDb(request.body);
  response.json({ success: true, product });
}
```

#### B. Pages (`pages/*`)

**Purpose**: Server-rendered pages for admin and storefront

**Three Sections**:
- `admin/` - Admin panel pages (protected)
- `frontStore/` - Customer-facing pages (public)
- `global/` - Middleware for all pages

**route.json**:
```json
{
  "path": "/product/:slug",
  "method": "GET",
  "exact": true
}
```

**Page Component** (ProductView.tsx):
```tsx
export default function ProductView({ product }) {
  return (
    <div className="product-detail">
      <h1>{product.name}</h1>
      <div className="price">${product.price}</div>
    </div>
  );
}

// Register in area
export const layout = {
  areaId: 'content',
  sortOrder: 10
};

// Fetch data
export const query = `
  query GetProduct($slug: String!) {
    product(slug: $slug) {
      productId
      name
      price
      description
    }
  }
`;
```

#### C. Services (`services/*`)

**Purpose**: Reusable business logic

**Example**:
```typescript
// services/ProductValidator.ts
export class ProductValidator {
  static validatePrice(price: number): boolean {
    return price > 0 && price < 1000000;
  }
  
  static validateSKU(sku: string): boolean {
    return /^[A-Z0-9-]{3,20}$/.test(sku);
  }
}

// Use in middleware
import { ProductValidator } from '../services/ProductValidator';

export default function validateProduct(req, res, next) {
  if (!ProductValidator.validatePrice(req.body.price)) {
    return res.status(400).json({ error: 'Invalid price' });
  }
  next();
}
```

#### D. Migrations (`migration/*`)

**Purpose**: Database schema versioning

**Naming**: `Version_X.Y.Z.ts` where X.Y.Z is semantic version

**Example**:
```typescript
// migration/Version_1.0.0.ts
import { pool } from '@evershop/evershop/lib/postgres';

export async function up() {
  await pool.query(`
    CREATE TABLE custom_review (
      review_id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL,
      customer_id INTEGER,
      rating INTEGER CHECK (rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX idx_review_product ON custom_review(product_id);
  `);
}

export async function down() {
  await pool.query(`DROP TABLE IF EXISTS custom_review CASCADE;`);
}
```

#### E. Bootstrap (`bootstrap.ts`)

**Purpose**: Run initialization code when app starts

**Use Cases**:
- Register event listeners
- Initialize services
- Add hooks
- Register widgets

**Example**:
```typescript
// bootstrap.ts
import { registerWidget } from '@evershop/evershop';
import { on } from '@evershop/evershop/lib/event';

// Register a widget
registerWidget({
  name: 'ProductReviewWidget',
  component: ProductReviewWidget,
  settingsComponent: ReviewSettings,
  description: 'Display product reviews'
});

// Listen to events
on('product.created', async (data) => {
  console.log('New product created:', data.productId);
  // Send notification, update cache, etc.
});
```

### 2.5 Module Lifecycle

```
1. Installation
   ├── npm install (if published)
   ├── Add to config (extensions)
   └── Run migrations (Version_*.ts up())
   
2. Initialization (on app start)
   ├── Execute bootstrap.ts
   ├── Discover routes
   ├── Register GraphQL types
   └── Register widgets
   
3. Operation (serving requests)
   ├── Route matching
   ├── Middleware execution
   ├── Data fetching
   └── SSR rendering
   
4. Deactivation
   ├── Set enabled: false in config
   ├── Restart app
   └── Module routes/components no longer active
   
5. Uninstallation
   ├── Run migrations (down())
   ├── Remove from extensions/
   └── Remove from config
```

---

## 3. Extensions Development

### 3.1 Extensions vs Core Modules

| Aspect          | Core Modules                  | Extensions                    |
|-----------------|-------------------------------|-------------------------------|
| Location        | `node_modules/@evershop/`     | `extensions/*/src/`           |
| Editable        | ❌ No                         | ✅ Yes                        |
| Version Control | Platform version              | Your repository               |
| Lifecycle       | Always active                 | Enable/disable via config     |
| Dependencies    | Shared workspace              | Own `package.json`            |
| Publishing      | Platform maintainers          | You (npm, marketplace)        |

### 3.2 Setting Up Extension Development

#### Step 1: Configure Workspace

Add to root `package.json`:

```json
{
  "workspaces": [
    "extensions/*"
  ]
}
```

This enables:
- Dependency hoisting
- Cross-workspace linking
- Shared `node_modules`

#### Step 2: Create Extension Directory

```bash
mkdir -p extensions/my_extension/src
cd extensions/my_extension
```

#### Step 3: Initialize `package.json`

```json
{
  "name": "my_extension",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "compile": "tsc && copyfiles -u 1 \"src/**/*.{graphql,scss,json}\" dist"
  },
  "description": "My custom EverShop extension",
  "keywords": ["evershop", "extension"],
  "dependencies": {
    "some-library": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "copyfiles": "^2.4.1"
  }
}
```

#### Step 4: Add `tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### Step 5: Enable in Configuration

Add to `config/default.json`:

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

**Priority**: Lower number loads first (1 before 10)

### 3.3 Extension Structure (Complete Example)

```
extensions/stripe_payment/
├── dist/                    # Compiled output (git-ignored)
├── src/
│   ├── api/
│   │   ├── createPaymentIntent/
│   │   │   ├── route.json
│   │   │   └── handler.ts
│   │   └── webhook/
│   │       ├── route.json
│   │       └── stripeWebhook.ts
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   └── stripeSettings/
│   │   │       ├── route.json
│   │   │       ├── SettingsForm.tsx
│   │   │       └── index.ts
│   │   └── frontStore/
│   │       └── checkout/
│   │           └── StripePaymentForm.tsx
│   │
│   ├── graphql/
│   │   ├── types/
│   │   │   └── StripePayment.graphql
│   │   └── resolvers/
│   │       └── paymentResolver.ts
│   │
│   ├── services/
│   │   ├── StripeClient.ts
│   │   └── PaymentValidator.ts
│   │
│   ├── migration/
│   │   └── Version_1.0.0.ts
│   │
│   └── bootstrap.ts
│
├── package.json
└── tsconfig.json
```

### 3.4 Extension Naming Conventions

**Valid Names**:
- Lowercase letters: `a-z`
- Underscores: `_`
- Numbers: `0-9`

**Examples**:
- ✅ `stripe_payment`
- ✅ `vendor_custom_feature`
- ✅ `my_extension_v2`
- ❌ `StripePayment` (uppercase)
- ❌ `stripe-payment` (hyphens)
- ❌ `stripe.payment` (dots)

**Recommendation**: Use vendor prefix to avoid conflicts:
```
vendor_feature_name
```

### 3.5 Publishing Extensions

#### Prepare for Publishing

1. **Clean package.json**:
```json
{
  "name": "@mycompany/evershop-stripe",
  "version": "1.0.0",
  "description": "Stripe payment gateway for EverShop",
  "keywords": ["evershop", "payment", "stripe"],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/mycompany/evershop-stripe"
  },
  "peerDependencies": {
    "@evershop/evershop": "^1.0.0"
  }
}
```

2. **Add README.md**:
```markdown
# EverShop Stripe Payment

Stripe payment integration for EverShop.

## Installation

\`\`\`bash
npm install @mycompany/evershop-stripe
\`\`\`

## Configuration

Add to `config/default.json`:
\`\`\`json
{
  "system": {
    "extensions": [
      {
        "name": "stripe_payment",
        "resolve": "node_modules/@mycompany/evershop-stripe",
        "enabled": true
      }
    ]
  },
  "stripe": {
    "publishableKey": "pk_test_...",
    "secretKey": "sk_test_..."
  }
}
\`\`\`
```

3. **Publish to npm**:
```bash
npm publish --access public
```

#### Installing Published Extension

```bash
npm install @mycompany/evershop-stripe
```

Update config:
```json
{
  "system": {
    "extensions": [
      {
        "name": "stripe_payment",
        "resolve": "node_modules/@mycompany/evershop-stripe",
        "enabled": true,
        "priority": 10
      }
    ]
  }
}
```

---

## 4. Widgets System

### 4.1 What is a Widget?

A **widget** is a self-contained, reusable UI component that can be:
- Managed from admin panel (CMS)
- Placed in any area on any page
- Configured by non-technical users
- Moved, enabled, disabled without code changes

**Use Cases**:
- Promotional banners
- Newsletter signup forms
- Product carousels
- Social media feeds
- Custom content blocks

### 4.2 Widgets vs Regular Components

| Feature               | Regular Component    | Widget                        |
|-----------------------|----------------------|-------------------------------|
| Placement             | Hardcoded in theme   | Admin-configurable            |
| Configuration         | Code changes         | Admin UI                      |
| Discovery             | `export const layout`| `registerWidget()`            |
| Multi-instance        | No                   | Yes (multiple copies)         |
| Non-tech management   | No                   | Yes                           |

### 4.3 Widget Architecture

```
Widget Registration (bootstrap.ts)
  ↓
Widget Manager (stores config)
  ↓
Admin Panel (CMS → Widgets)
  ├── Create widget instance
  ├── Configure settings
  ├── Assign to areas
  └── Set sort order
  ↓
Runtime Rendering
  ├── Load widget instances for page
  ├── Inject into target areas
  └── Render with saved settings
```

### 4.4 Creating a Widget Extension

#### Step 1: Extension Structure

```
extensions/greeting_widget/
├── src/
│   ├── components/
│   │   └── widgets/
│   │       ├── GreetingWidget.tsx          # Frontend display
│   │       └── GreetingWidgetSetting.tsx   # Admin config form
│   └── bootstrap.ts                        # Registration
└── package.json
```

#### Step 2: Display Component

```tsx
// src/components/widgets/GreetingWidget.tsx
import React from 'react';

export default function GreetingWidget({ greeting = 'Hello', name = 'World' }) {
  return (
    <div className="greeting-widget" style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h2>{greeting}, {name}!</h2>
    </div>
  );
}
```

#### Step 3: Settings Component

```tsx
// src/components/widgets/GreetingWidgetSetting.tsx
import React from 'react';
import { Field } from '@evershop/evershop/components/common/form/Field';
import { Card } from '@evershop/evershop/components/admin/cms/Card';

export default function GreetingWidgetSetting() {
  return (
    <Card title="Greeting Widget Settings">
      <Card.Session>
        <Field
          type="text"
          name="greeting"
          label="Greeting Text"
          placeholder="e.g., Hello, Welcome, Hi"
          validationRules={['notEmpty']}
        />
        <Field
          type="text"
          name="name"
          label="Name to Greet"
          placeholder="e.g., Visitor, Friend"
          validationRules={['notEmpty']}
        />
      </Card.Session>
    </Card>
  );
}
```

#### Step 4: Register Widget

```typescript
// src/bootstrap.ts
import { registerWidget } from '@evershop/evershop';
import GreetingWidget from './components/widgets/GreetingWidget';
import GreetingWidgetSetting from './components/widgets/GreetingWidgetSetting';

registerWidget({
  name: 'GreetingWidget',
  component: GreetingWidget,
  settingsComponent: GreetingWidgetSetting,
  description: 'Displays a customizable greeting message',
  previewImage: '/assets/greeting-widget-preview.png', // Optional
  category: 'General' // Optional grouping
});
```

#### Step 5: Enable Extension

```json
{
  "system": {
    "extensions": [
      {
        "name": "greeting_widget",
        "resolve": "extensions/greeting_widget",
        "enabled": true,
        "priority": 5
      }
    ]
  }
}
```

#### Step 6: Use in Admin

1. Navigate to **CMS → Widgets**
2. Click **Create Widget**
3. Select **GreetingWidget** from dropdown
4. Configure settings:
   - Greeting: "Welcome"
   - Name: "Shopper"
5. Assign to area: `content` or `homepage`
6. Set sort order: `10`
7. Save

Widget now appears on storefront with configured values!

### 4.5 Widget Instance Management

Widgets are stored in database (`widget` table):

```sql
CREATE TABLE widget (
  widget_id SERIAL PRIMARY KEY,
  type VARCHAR(255),        -- 'GreetingWidget'
  name VARCHAR(255),        -- 'Homepage Welcome Banner'
  status BOOLEAN,           -- enabled/disabled
  area VARCHAR(255)[],      -- ['homepage', 'content']
  sort_order INTEGER,
  settings JSON,            -- {"greeting": "Welcome", "name": "Shopper"}
  created_at TIMESTAMP
);
```

Multiple instances allowed:
```
Widget #1: GreetingWidget → area: ['homepage'], settings: {greeting: 'Welcome', name: 'Visitor'}
Widget #2: GreetingWidget → area: ['footer'], settings: {greeting: 'Thanks', name: 'Customer'}
```

---

## 5. Theme Development

### 5.1 Theme Overview

A **theme** controls:
- Visual appearance (colors, typography, layout)
- Component composition (which areas, what order)
- Storefront UX (navigation, product display, checkout flow)

**Themes are NOT**:
- Business logic (use extensions/services)
- Data models (use modules/migrations)
- Admin panel UI (admin theme separate)

### 5.2 Theme Structure

```
themes/hapas/
├── dist/                    # Compiled output (production)
├── src/
│   ├── pages/
│   │   ├── all/             # Global components (every page)
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── homepage/        # Homepage-specific
│   │   │   └── HeroBanner.tsx
│   │   ├── productView/     # Product detail page
│   │   │   ├── ProductImages.tsx
│   │   │   └── ProductInfo.tsx
│   │   └── categoryView/    # Category listing
│   │       └── CategoryHeader.tsx
│   │
│   ├── components/          # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   │
│   ├── styles/              # Global styles
│   │   ├── theme.scss
│   │   ├── variables.css
│   │   └── typography.css
│   │
│   └── assets/              # Images, fonts
│       ├── images/
│       └── fonts/
│
├── package.json
└── tsconfig.json
```

### 5.3 The View System

#### Pages are Composed of Areas

Every page has named "areas" where components can be placed:

```
┌─────────────────────────────────────┐
│           area: "head"              │  ← Meta tags, CSS
├─────────────────────────────────────┤
│         area: "header"              │  ← Logo, cart, search
├─────────────────────────────────────┤
│       area: "headerBottom"          │  ← Main navigation
├─────────────────────────────────────┤
│         area: "content"             │  ← Main page content
├─────────────────────────────────────┤
│         area: "sidebar"             │  ← Filters, widgets
├─────────────────────────────────────┤
│         area: "footer"              │  ← Footer links
└─────────────────────────────────────┘
```

#### Component Registration

Components declare which area they belong to:

```tsx
// themes/hapas/src/pages/all/Header.tsx
export default function Header() {
  return (
    <header className="site-header">
      {/* header content */}
    </header>
  );
}

export const layout = {
  areaId: 'header',
  sortOrder: 10
};
```

#### Multiple Components in Same Area

```tsx
// Component A
export const layout = { areaId: 'content', sortOrder: 10 };

// Component B
export const layout = { areaId: 'content', sortOrder: 20 };

// Component C
export const layout = { areaId: 'content', sortOrder: 15 };
```

**Render order**: A (10) → C (15) → B (20)

### 5.4 Component Discovery

EverShop discovers components via file structure:

#### Global Components
```
themes/hapas/src/pages/all/
├── Layout.tsx          → Renders on every page
├── Header.tsx          → Renders on every page
└── Footer.tsx          → Renders on every page
```

#### Route-Specific Components
```
themes/hapas/src/pages/productView/
├── ProductGallery.tsx  → Only on /product/:slug
└── AddToCart.tsx       → Only on /product/:slug
```

#### Naming Pattern
```
pages/[route]/ComponentName.tsx
```

Where `[route]` matches route.json path:
- `homepage` → `/`
- `productView` → `/product/:slug`
- `categoryView` → `/category/:slug`
- `cartPage` → `/cart`

### 5.5 Overriding Core Components

To customize a core component, create override in theme with same structure:

**Core Component**:
```
node_modules/@evershop/evershop/dist/modules/catalog/pages/frontStore/productView/Price.tsx
```

**Theme Override**:
```
themes/hapas/src/pages/productView/Price.tsx
```

EverShop prioritizes theme version over core.

**Example Override**:
```tsx
// themes/hapas/src/pages/productView/Price.tsx
export default function Price({ product }) {
  const discount = product.originalPrice - product.price;
  const savings = ((discount / product.originalPrice) * 100).toFixed(0);
  
  return (
    <div className="product-price">
      {discount > 0 && (
        <>
          <span className="original-price">${product.originalPrice}</span>
          <span className="savings">Save {savings}%</span>
        </>
      )}
      <span className="current-price">${product.price}</span>
    </div>
  );
}

export const layout = {
  areaId: 'productInfo',
  sortOrder: 5
};
```

### 5.6 Styling

#### CSS Variables (Recommended)

Define once, use everywhere:

```css
/* themes/hapas/src/styles/variables.css */
:root {
  --color-primary: #111827;
  --color-accent: #ef4444;
  --color-background: #ffffff;
  --color-text: #1f2937;
  
  --font-body: 'Inter', sans-serif;
  --font-heading: 'Playfair Display', serif;
  
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

Import once in global component:

```tsx
// themes/hapas/src/pages/all/GlobalStyles.tsx
import '../../styles/variables.css';
import '../../styles/typography.css';

export const layout = {
  areaId: 'head',
  sortOrder: 1
};

export default function GlobalStyles() {
  return null; // Just loads CSS
}
```

Use in components:

```css
/* ProductCard.scss */
.product-card {
  background: var(--color-background);
  color: var(--color-text);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.product-card__title {
  font-family: var(--font-heading);
  color: var(--color-primary);
}
```

#### SCSS Module Pattern

```tsx
// Component.tsx
import styles from './Component.module.scss';

export default function Component() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hello</h1>
    </div>
  );
}
```

```scss
// Component.module.scss
.container {
  padding: var(--spacing-lg);
}

.title {
  font-family: var(--font-heading);
  color: var(--color-primary);
}
```

#### Tailwind CSS (If Configured)

```tsx
export default function Hero() {
  return (
    <div className="bg-gray-900 text-white py-16 px-8">
      <h1 className="text-4xl font-bold mb-4">Welcome</h1>
      <p className="text-lg opacity-90">Shop the latest collection</p>
    </div>
  );
}
```

**⚠️ AVOID**: SCSS `@import` for variables (doesn't work in theme compilation)

### 5.7 Templating Patterns

#### Layout Component

```tsx
// themes/hapas/src/pages/all/Layout.tsx
import React from 'react';
import { Area } from '@evershop/evershop/components/common';

export default function Layout() {
  return (
    <>
      <Area id="head" noOuter />
      <div className="site-wrapper">
        <Area id="header" className="site-header" />
        <Area id="headerBottom" className="header-nav" />
        
        <main className="main-content">
          <Area id="content" className="page-content" />
        </main>
        
        <Area id="footer" className="site-footer" />
      </div>
    </>
  );
}

export const layout = {
  areaId: 'body',
  sortOrder: 1
};
```

#### Conditional Rendering

```tsx
export default function PromoBar({ promoText, isActive }) {
  if (!isActive) return null;
  
  return (
    <div className="promo-bar">
      {promoText}
    </div>
  );
}

export const layout = {
  areaId: 'headerTop',
  sortOrder: 1
};
```

#### Data-Driven Components

```tsx
export default function CategoryNav({ categories }) {
  return (
    <nav className="category-nav">
      {categories.map(cat => (
        <a key={cat.id} href={cat.url} className="nav-link">
          {cat.name}
        </a>
      ))}
    </nav>
  );
}

export const layout = {
  areaId: 'headerBottom',
  sortOrder: 10
};

export const query = `
  query {
    categories(filters: [
      { key: "status", operation: eq, value: "1" },
      { key: "include_in_nav", operation: eq, value: "1" }
    ]) {
      items {
        categoryId
        name
        url
      }
    }
  }
`;
```

---

## 6. The Area System

### 6.1 How Areas Work

**Definition**: An area is a named placeholder where components are dynamically inserted.

**Core Concept**:
```tsx
<Area id="header" />
```
becomes:
```tsx
<div>
  <Component1 sortOrder={5} />   {/* Logo */}
  <Component2 sortOrder={10} />  {/* Search */}
  <Component3 sortOrder={15} />  {/* Cart */}
</div>
```

### 6.2 Area Resolution Process

```
1. Build Time
   ├── Scan all modules/extensions/theme
   ├── Find components with `export const layout`
   ├── Parse areaId and sortOrder
   └── Build area map per route
   
2. Runtime
   ├── Request for /product/:slug
   ├── Load area map for productView route
   ├── Merge with global areas (pages/all)
   ├── Add widget instances from database
   ├── Sort by sortOrder (ascending)
   └── Render component tree
```

### 6.3 Internal Implementation

From `packages/evershop/src/lib/webpack/loaders/AreaLoader.js`:

```javascript
// Regex to find layout export
const layoutRegex = /export\s+const\s+layout\s*=\s*{\s*areaId\s*:\s*['"]([^'"]+)['"],\s*sortOrder\s*:\s*(\d+)\s*,*\s*}/;

const match = source.match(layoutRegex);
if (match) {
  const layout = {
    areaId: match[1],    // e.g., "header"
    sortOrder: match[2]  // e.g., 10
  };
  
  areas[layout.areaId] = areas[layout.areaId] || {};
  areas[layout.areaId][componentId] = {
    id: componentId,
    sortOrder: layout.sortOrder,
    component: importedComponent
  };
}
```

From `packages/evershop/src/components/common/Area.tsx`:

```typescript
function Area({ id, components }) {
  // Get components for this area
  const areaComponents = components[id] || [];
  
  // Sort by sortOrder
  const sorted = areaComponents.sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  );
  
  // Render each component
  return (
    <div className={`area-${id}`}>
      {sorted.map(comp => (
        <comp.component key={comp.id} {...comp.props} />
      ))}
    </div>
  );
}
```

### 6.4 Common Areas

| Area ID          | Purpose                              | Typical Components                    |
|------------------|--------------------------------------|---------------------------------------|
| `head`           | HTML `<head>` tags                   | Meta tags, CSS links, fonts           |
| `body`           | Page wrapper                         | Layout component                      |
| `header`         | Site header                          | Logo, search, cart, account           |
| `headerBottom`   | Main navigation                      | Category menu, mega menu              |
| `content`        | Main page content                    | Product list, product detail, CMS     |
| `sidebar`        | Filters/widgets                      | Faceted search, category tree         |
| `footer`         | Site footer                          | Links, newsletter, social             |
| `*` (wildcard)   | Widget placement area                | Admin-managed widgets                 |

### 6.5 Creating Custom Areas

Define in layout:

```tsx
// themes/hapas/src/pages/all/Layout.tsx
export default function Layout() {
  return (
    <div className="page">
      <Area id="head" noOuter />
      <Area id="header" />
      <Area id="customPromoBar" className="promo-section" />
      <Area id="content" />
      <Area id="customTestimonials" className="testimonials" />
      <Area id="footer" />
    </div>
  );
}
```

Use in components:

```tsx
// themes/hapas/src/pages/homepage/PromoStrip.tsx
export const layout = {
  areaId: 'customPromoBar',
  sortOrder: 10
};
```

---

## 7. Routing and Middleware

### 7.1 Route Definition

Every route requires `route.json`:

```json
{
  "path": "/product/:slug",
  "method": "GET",
  "exact": true,
  "id": "productView"
}
```

**Fields**:
- `path`: Express-style path pattern
- `method`: HTTP method (GET, POST, PUT, DELETE, etc.)
- `exact`: Exact match or allow sub-paths
- `id`: Unique route identifier (used for component discovery)

### 7.2 Middleware Chain

Middleware files in route folder execute in dependency order:

```
pages/frontStore/productView/
├── route.json
├── loadProduct.ts              # Runs first
└── [loadProduct]trackView.ts   # Runs after loadProduct
```

**Middleware Example**:

```typescript
// loadProduct.ts
export default async function loadProduct(request, response, next, stack, app) {
  const { slug } = request.params;
  
  const product = await pool.query(
    'SELECT * FROM product WHERE url_key = $1',
    [slug]
  );
  
  if (!product.rows[0]) {
    response.status(404);
    next(); // 404 handler will catch
    return;
  }
  
  // Add to response locals
  response.locals.product = product.rows[0];
  next();
}
```

```typescript
// [loadProduct]trackView.ts
export default async function trackView(request, response, next) {
  const { product } = response.locals;
  
  // Increment view count
  await pool.query(
    'UPDATE product SET view_count = view_count + 1 WHERE product_id = $1',
    [product.product_id]
  );
  
  next();
}
```

### 7.3 Global Middleware

Place in `pages/global/` or `api/global/`:

```
pages/global/
└── authMiddleware.ts  # Runs on every page request
```

```typescript
// authMiddleware.ts
export default function authMiddleware(request, response, next) {
  // Check authentication
  const user = request.session?.user;
  response.locals.isAuthenticated = !!user;
  response.locals.currentUser = user;
  next();
}
```

---

## 8. Data Fetching with GraphQL

### 8.1 Query Export Pattern

Components can declare data requirements:

```tsx
export default function ProductView({ product }) {
  return <div>{product.name}</div>;
}

export const query = `
  query GetProduct($slug: String!) {
    product(slug: $slug) {
      productId
      name
      price
      description
      images {
        url
        alt
      }
    }
  }
`;

export const layout = {
  areaId: 'content',
  sortOrder: 10
};
```

**How It Works**:
1. EverShop extracts `query` at build time
2. Before rendering, executes GraphQL query
3. Passes results as props to component
4. Component receives fully hydrated data

### 8.2 Query Variables

Route params automatically passed as variables:

```
Route: /product/:slug
Component gets: { slug: "blue-t-shirt" } as query variables
```

### 8.3 Custom Resolvers

Define in extension:

```typescript
// extensions/my_ext/src/graphql/resolvers/productResolver.ts
export default {
  Query: {
    relatedProducts: async (_, { productId }, { pool }) => {
      const result = await pool.query(
        `SELECT * FROM product 
         WHERE category_id = (SELECT category_id FROM product WHERE product_id = $1)
         AND product_id != $1
         LIMIT 4`,
        [productId]
      );
      return result.rows;
    }
  }
};
```

Use in component:

```tsx
export const query = `
  query {
    relatedProducts(productId: $productId) {
      productId
      name
      price
      image
    }
  }
`;
```

---

## 9. Database Migrations

### 9.1 Migration Files

**Location**: `src/migration/Version_X.Y.Z.ts`

**Structure**:

```typescript
import { pool } from '@evershop/evershop/lib/postgres';

export async function up() {
  // Create tables, add columns, etc.
  await pool.query(`
    CREATE TABLE custom_table (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function down() {
  // Rollback changes
  await pool.query(`DROP TABLE IF EXISTS custom_table;`);
}
```

### 9.2 Versioning

Use semantic versioning:
- `Version_1.0.0.ts` - Initial schema
- `Version_1.1.0.ts` - Add feature (new table/column)
- `Version_1.1.1.ts` - Fix/patch
- `Version_2.0.0.ts` - Breaking changes

### 9.3 Running Migrations

```bash
npm run migrate up
```

EverShop:
1. Checks `migration_version` table
2. Finds un-executed migrations
3. Runs `up()` functions in version order
4. Records version in database

### 9.4 Best Practices

```typescript
export async function up() {
  // ✅ Idempotent - safe to run multiple times
  await pool.query(`
    CREATE TABLE IF NOT EXISTS custom_review (
      review_id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES product(product_id),
      rating INTEGER CHECK (rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_review_product 
    ON custom_review(product_id);
  `);
  
  // ❌ NOT idempotent - fails on second run
  // await pool.query(`CREATE TABLE custom_review (...);`);
}
```

---

## 10. Advanced Patterns

### 10.1 Event System

Listen to platform events:

```typescript
// bootstrap.ts
import { on } from '@evershop/evershop/lib/event';

on('product.created', async (data) => {
  console.log('New product:', data.productId);
  // Send notification, update cache, etc.
});

on('order.placed', async (data) => {
  // Trigger fulfillment, send email
});
```

Dispatch custom events:

```typescript
import { emit } from '@evershop/evershop/lib/event';

await emit('custom.event', { 
  userId: 123, 
  action: 'something' 
});
```

### 10.2 Service Injection

```typescript
// services/EmailService.ts
export class EmailService {
  async sendWelcome(email: string) {
    // Implementation
  }
}

// middleware
import { EmailService } from '../services/EmailService';

export default async function registerUser(req, res) {
  const emailService = new EmailService();
  await emailService.sendWelcome(req.body.email);
  res.json({ success: true });
}
```

### 10.3 Custom Hooks

```typescript
// bootstrap.ts
import { hookable } from '@evershop/evershop/lib/util/hookable';

hookable.addHook('priceCalculation', (price, context) => {
  // Apply custom pricing logic
  if (context.customerGroup === 'wholesale') {
    return price * 0.8; // 20% discount
  }
  return price;
});
```

Use in code:

```typescript
import { hookable } from '@evershop/evershop/lib/util/hookable';

const finalPrice = await hookable.executeHook('priceCalculation', basePrice, {
  customerGroup: 'wholesale'
});
```

---

## 11. Production Considerations

### 11.1 Build Process

```bash
# Development
npm run dev         # Watch mode, hot reload

# Production
npm run build       # Compile all modules + theme
npm run start       # Start production server
```

**What Build Does**:
1. Compile TypeScript to JavaScript
2. Bundle React components per route
3. Copy static assets (SCSS, images, GraphQL)
4. Generate client hydration bundles
5. Optimize and minify

### 11.2 Performance

**Lazy Loading**:
- Components loaded only for active route
- Automatic code splitting by webpack

**SSR Benefits**:
- Fast first contentful paint
- SEO-friendly HTML
- Progressive enhancement

**Caching**:
- Static assets with cache headers
- GraphQL query caching (in-memory)
- CDN for media files

### 11.3 Deployment Checklist

- [ ] Run `npm run build`
- [ ] Set `NODE_ENV=production`
- [ ] Configure database connection
- [ ] Run migrations: `npm run migrate up`
- [ ] Set secure session secret
- [ ] Enable HTTPS
- [ ] Configure file storage (S3/Azure)
- [ ] Set up logging and monitoring
- [ ] Test all extensions enabled
- [ ] Verify theme compiled correctly

---

## 12. Troubleshooting Guide

### 12.1 Extension Not Loading

**Symptoms**: Extension components/routes not working

**Checklist**:
1. ✅ Extension in `config/default.json`?
   ```json
   { "name": "my_ext", "resolve": "extensions/my_ext", "enabled": true }
   ```
2. ✅ Run `npm install` (workspace dependencies)
3. ✅ Compile extension: `npm run build`
4. ✅ Restart dev server
5. ✅ Check logs for errors

### 12.2 Component Not Rendering

**Symptoms**: Component with `layout` export doesn't appear

**Checklist**:
1. ✅ Correct file location?
   - Global: `pages/all/Component.tsx`
   - Route-specific: `pages/[routeId]/Component.tsx`
2. ✅ `export const layout` present and valid?
   ```tsx
   export const layout = { areaId: "content", sortOrder: 10 };
   ```
3. ✅ Area exists in Layout?
   ```tsx
   <Area id="content" />
   ```
4. ✅ Rebuild: `npm run build`

### 12.3 GraphQL Query Fails

**Symptoms**: Component receives no data or errors

**Checklist**:
1. ✅ Query syntax valid? Test in GraphQL playground
2. ✅ Resolver registered in `graphql/resolvers/`?
3. ✅ Type definitions in `graphql/types/*.graphql`?
4. ✅ Query variables match route params?
5. ✅ Check server logs for GraphQL errors

### 12.4 Styling Issues

**Symptoms**: CSS not applied or variables undefined

**Common Issues**:
- ❌ Using `@import` for variables (doesn't work)
  
  **Fix**: Use CSS variables
  ```css
  :root { --color: blue; }
  .elem { color: var(--color); }
  ```

- ❌ SCSS file not imported
  
  **Fix**: Import in component
  ```tsx
  import './Component.scss';
  ```

- ❌ Global styles not loaded
  
  **Fix**: Create global style component
  ```tsx
  // pages/all/GlobalStyles.tsx
  import '../../styles/theme.css';
  export const layout = { areaId: 'head', sortOrder: 1 };
  export default () => null;
  ```

### 12.5 Migration Errors

**Symptoms**: `npm run migrate up` fails

**Solutions**:
- Check SQL syntax
- Ensure idempotent (use `IF NOT EXISTS`)
- Verify table/column names
- Check foreign key references
- Review `migration_version` table for state

### 12.6 Build Failures

**Common Causes**:
- TypeScript errors → Fix type issues
- Missing dependencies → Run `npm install`
- Malformed `route.json` → Validate JSON
- Circular imports → Refactor dependencies

---

## References

**Official Documentation**:
- [Module Overview](https://evershop.io/docs/development/module/module-overview)
- [Extension Development](https://evershop.io/docs/development/module/extension-development)
- [Widget Development](https://evershop.io/docs/development/module/widget-development)
- [Create Your First Extension](https://evershop.io/docs/development/module/create-your-first-extension)
- [Theme Overview](https://evershop.io/docs/development/theme/theme-overview)
- [The View System](https://evershop.io/docs/development/theme/view-system)
- [Styling](https://evershop.io/docs/development/theme/styling)
- [Templating](https://evershop.io/docs/development/theme/templating)

**Community Resources**:
- [EverShop GitHub](https://github.com/evershopcommerce/evershop)
- [Discord Community](https://discord.gg/evershop)
- [Marketplace](https://evershop.io/marketplace)

---

**Document Version**: 2.0  
**Last Updated**: October 2025  
**Maintained by**: HAPAS E-commerce Engineering Team
