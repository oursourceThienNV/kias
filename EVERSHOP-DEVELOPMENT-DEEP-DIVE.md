# 🚀 EverShop Development Deep Dive

**Comprehensive Guide for HAPAS E-commerce Platform Development**

---

## 📋 **EverShop Architecture Overview**

### **Core Technology Stack**
- **Backend**: Node.js with TypeScript
- **Database**: PostgreSQL 13+
- **Frontend**: React with Server-Side Rendering (SSR)
- **API**: GraphQL + RESTful endpoints
- **Styling**: TailwindCSS + SCSS support
- **Build System**: Webpack with Hot Module Replacement

### **Modular Architecture**
EverShop is built on a **modular architecture** where all functionality is delivered through components called **modules**.

```
EverShop Application
├── Core Modules (node_modules/@evershop/evershop/dist/modules)
│   ├── catalog/     # Product management
│   ├── customer/    # Customer accounts
│   ├── cms/         # Content management
│   └── checkout/    # Order processing
└── Extensions (extensions/)
    └── custom-modules/  # Third-party modules
```

---

## 🧩 **Module Development System**

### **Module Structure**
```
modules/catalog/
├── src/
│   ├── api/           # RESTful API endpoints
│   │   ├── global/    # Global middleware
│   │   └── createProduct/
│   │       ├── route.json
│   │       └── middleware.ts
│   ├── pages/         # Frontend pages
│   │   ├── admin/     # Admin panel pages
│   │   ├── frontStore/ # Customer-facing pages
│   │   └── global/    # Shared middleware
│   ├── migration/     # Database migrations
│   ├── services/      # Business logic
│   └── bootstrap.ts   # Module initialization
├── package.json       # Module dependencies
└── tsconfig.json      # TypeScript config
```

### **Module Development Best Practices**
1. **Single Responsibility**: Each module focuses on one business domain
2. **Minimal Dependencies**: Reduce inter-module dependencies
3. **Proper Namespacing**: Avoid conflicts with other modules
4. **Complete Documentation**: Document functionality and events
5. **Coding Standards**: Follow EverShop conventions

### **Module Lifecycle**
1. **Installation**: Migration scripts setup database structures
2. **Initialization**: bootstrap.ts executes on startup
3. **Operation**: Components handle requests and provide functionality
4. **Deactivation**: Module can be disabled without removal
5. **Uninstallation**: Cleanup tasks remove resources

---

## 🎨 **Theme Development System**

### **Theme Architecture**
Themes provide visual design and user experience customization by overriding the view layer of modules.

```
themes/hapas/
├── src/               # Development source
│   ├── components/    # Shared React components
│   ├── pages/         # Page-specific components
│   │   ├── all/       # Global components
│   │   ├── homepage/  # Homepage components
│   │   └── categoryView/ # Category page components
│   └── styles/        # SCSS stylesheets
├── public/            # Static assets
│   ├── images/
│   ├── fonts/
│   └── css/
├── dist/              # Compiled files (auto-generated)
├── package.json       # Theme metadata
└── tsconfig.json      # TypeScript configuration
```

### **Component Override Mechanism**
EverShop uses an **Area-based component system** for flexible layouts:

```jsx
// Core module component
<div className="header">
  <Area id="headerLeft" />   // Logo area
  <Area id="headerRight" />  // Actions area
</div>

// Theme override
export const layout = {
  areaId: 'headerLeft',
  sortOrder: 1
};
```

### **Theme Activation Process**
1. **Configuration**: Set theme in `config/default.json`
2. **File Structure**: Ensure proper src/, public/, dist/ directories
3. **Build Process**: Compile theme files to dist/
4. **Component Registration**: Register components with Area system
5. **Asset Loading**: Serve static files from public/

---

## 🛠️ **Database Schema Customization**

### **Migration System**
```typescript
// Version_1.0.0.ts
export default class Version_1_0_0 {
  async up(connection: Connection): Promise<void> {
    await connection.query(`
      CREATE TABLE hapas_products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  async down(connection: Connection): Promise<void> {
    await connection.query('DROP TABLE IF EXISTS hapas_products;');
  }
}
```

### **Database Best Practices**
- Use migrations for schema changes
- Follow PostgreSQL naming conventions
- Index frequently queried columns
- Use proper data types for Vietnamese text (UTF-8)
- Implement foreign key constraints

---

## 🔌 **API Extension Patterns**

### **RESTful API Extension**
```typescript
// api/hapas/products/route.json
{
  "methods": ["GET", "POST"],
  "path": "/api/hapas/products",
  "middleware": [
    "validateHapasProduct",
    "saveHapasProduct"
  ]
}

// middleware implementation
export default async function validateHapasProduct(request, response, next) {
  // Validation logic for HAPAS products
  next();
}
```

### **GraphQL Extension**
```typescript
// graphql/types/HapasProduct/HapasProduct.resolvers.js
export default {
  Query: {
    hapasProducts: async (parent, args, context) => {
      // Fetch HAPAS products with Vietnamese support
      return await getHapasProducts(args);
    }
  },
  Mutation: {
    createHapasProduct: async (parent, args, context) => {
      // Create new HAPAS product
      return await createHapasProduct(args.input);
    }
  }
};
```

---

## 🎯 **HAPAS-Specific Implementation**

### **Vietnamese Localization Extension**
```typescript
// extensions/hapas-vietnamese/
├── src/
│   ├── services/
│   │   └── VietnameseTextProcessor.ts
│   ├── middleware/
│   │   └── vietnameseValidation.ts
│   └── bootstrap.ts
└── package.json
```

### **KIAS Product Integration**
```typescript
// services/KiasProductService.ts
export class KiasProductService {
  async importKiasProducts(products: KiasProduct[]) {
    for (const product of products) {
      await this.createEverShopProduct({
        name: product.vietnameseName,
        description: product.vietnameseDescription,
        price: this.convertVndToUsd(product.priceVnd),
        images: product.images,
        categories: await this.mapKiasCategories(product.categories)
      });
    }
  }
}
```

### **HAPAS Theme Components**
```jsx
// themes/hapas/src/components/HapasProductCard.jsx
import React from 'react';
import { ComponentLayout } from '@evershop/evershop';

export default function HapasProductCard({ product }) {
  return (
    <div className="hapas-product-card">
      <img src={product.image} alt={product.name} />
      <h3 className="vietnamese-text">{product.name}</h3>
      <p className="price">{formatVndPrice(product.price)}</p>
    </div>
  );
}

export const layout: ComponentLayout = {
  areaId: 'productCard',
  sortOrder: 1
};
```

---

## 🔧 **Development Workflow**

### **Extension Development Process**
1. **Planning**: Define module scope and dependencies
2. **Structure**: Create proper folder structure
3. **Implementation**: Develop components, services, and API endpoints
4. **Testing**: Unit tests and integration tests
5. **Documentation**: API docs and usage examples
6. **Deployment**: Package and distribute extension

### **Theme Development Process**
1. **Design Analysis**: Study target design (HAPAS.VN)
2. **Component Planning**: Identify required components
3. **Implementation**: Create React components and styles
4. **Integration**: Register components with Area system
5. **Testing**: Cross-browser and responsive testing
6. **Optimization**: Performance and accessibility improvements

### **Build and Deployment**
```bash
# Development mode
npm run dev

# Production build
npm run build

# Theme compilation
npm run build:theme

# Database migration
npm run migration:run
```

---

## 📊 **Performance Optimization**

### **Frontend Optimization**
- **Code Splitting**: Lazy load components
- **Image Optimization**: WebP format and responsive images
- **CSS Optimization**: Minimize and compress stylesheets
- **JavaScript Optimization**: Tree shaking and minification

### **Backend Optimization**
- **Database Indexing**: Optimize query performance
- **Caching**: Redis for session and data caching
- **API Optimization**: Efficient GraphQL queries
- **Asset Delivery**: CDN for static files

---

## 🧪 **Testing Strategies**

### **Unit Testing**
```typescript
// tests/services/KiasProductService.test.ts
describe('KiasProductService', () => {
  test('should convert VND to USD correctly', () => {
    const service = new KiasProductService();
    expect(service.convertVndToUsd(24000)).toBe(1.00);
  });
});
```

### **Integration Testing**
```typescript
// tests/api/hapas-products.test.ts
describe('HAPAS Products API', () => {
  test('should create product with Vietnamese name', async () => {
    const response = await request(app)
      .post('/api/hapas/products')
      .send({
        name: 'Túi xách HAPAS',
        price: 1000000
      });
    expect(response.status).toBe(201);
  });
});
```

---

## 🚀 **Next Steps for HAPAS Platform**

### **Immediate Priorities**
1. **Fix KIAS Product Display**: Investigate frontend visibility issues
2. **Implement HAPAS Styling**: Apply proper visual design
3. **Vietnamese Content**: Ensure proper text rendering
4. **Image Loading**: Fix 404 errors and optimize delivery
5. **Category Structure**: Create proper product categorization

### **Advanced Features**
1. **Search Enhancement**: Vietnamese text search
2. **Payment Integration**: Vietnamese payment gateways
3. **Mobile App**: React Native application
4. **Analytics**: Vietnamese user behavior tracking
5. **SEO Optimization**: Vietnamese market optimization

---

**© 2025 HAPAS Development Team**  
*Comprehensive EverShop development guide for Vietnamese e-commerce excellence*
