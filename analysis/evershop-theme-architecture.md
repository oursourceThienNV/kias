# 🏗️ EVERSHOP THEME ARCHITECTURE ANALYSIS

**Analysis Date**: September 22, 2025  
**EverShop Version**: 1.2.2  
**Purpose**: Understand theme customization for HAPAS implementation

---

## 📁 **THEME STRUCTURE OVERVIEW**

### **Core Architecture**
```
packages/evershop/src/
├── components/
│   ├── common/          # Shared components (Area, etc.)
│   ├── frontStore/      # Frontend components
│   └── admin/           # Admin components
├── modules/
│   ├── base/            # Core layout components
│   ├── catalog/         # Product/category components  
│   ├── checkout/        # Checkout flow
│   └── customer/        # User account components
└── lib/                 # Utilities and helpers
```

### **Theme Customization Locations**
```
themes/hapas/
├── components/          # Custom React components
├── assets/             # Static assets (images, fonts)
├── styles/             # SCSS/CSS files
└── theme.json          # Theme configuration
```

---

## 🧩 **COMPONENT SYSTEM**

### **Area-Based Layout System**
EverShop uses an **Area-based component system** where components are registered to specific areas:

```jsx
// Header.jsx - Layout structure
<div className="page-width flex justify-between items-center">
  <div className="flex items-center gap-4">
    <Area id="headerLeft" noOuter />    // Logo area
  </div>
  <div className="flex items-center gap-4">
    <Area id="headerRight" noOuter />   // Cart/Account area
  </div>
</div>
```

### **Component Registration**
Components register themselves to areas using `layout` export:

```jsx
// Logo.tsx
export const layout = {
  areaId: 'headerLeft',    // Target area
  sortOrder: 10            // Display order
};
```

### **Key Frontend Areas**
- **header**: Main header container
- **headerLeft**: Logo and navigation
- **headerRight**: Cart, account, search
- **content**: Main page content
- **footer**: Footer content

---

## 🎨 **STYLING SYSTEM**

### **CSS Architecture**
- **Tailwind CSS**: Primary styling framework
- **SCSS Support**: For custom styles
- **Component-level styles**: `.scss` files alongside components
- **Global styles**: In `tailwind.scss`

### **Theme Configuration**
The `theme.json` file controls:
- **Brand settings**: Logo, colors, typography
- **Layout options**: Container width, spacing
- **Component styling**: Buttons, cards, navigation
- **Page layouts**: Homepage, product, category pages
- **Responsive breakpoints**

---

## 🔧 **CUSTOMIZATION APPROACHES**

### **1. Component Override**
Create custom components in `themes/hapas/components/`:

```jsx
// themes/hapas/components/Header.jsx
import React from 'react';

export default function HapasHeader() {
  return (
    <header className="hapas-header">
      {/* Custom HAPAS header implementation */}
    </header>
  );
}

export const layout = {
  areaId: 'header',
  sortOrder: 1
};
```

### **2. Style Customization**
Override styles in `themes/hapas/styles/`:

```scss
// themes/hapas/styles/main.scss
@import 'variables';

.hapas-header {
  background: $hapas-white;
  border-bottom: 1px solid $hapas-border;
  
  .logo {
    max-width: 120px;
  }
}
```

### **3. Theme Configuration**
Modify `theme.json` for global settings:

```json
{
  "theme_config": {
    "colors": {
      "primary": "#000000",
      "secondary": "#ffffff"
    },
    "navigation": {
      "menu_items": [
        {"label": "Set Bộ", "url": "/set-bo"}
      ]
    }
  }
}
```

---

## 📄 **KEY COMPONENTS FOR HAPAS**

### **Header Components**
1. **Header.jsx**: Main header container
2. **Logo.tsx**: Logo component with theme config support
3. **MainNavigation.jsx**: Navigation menu
4. **SearchBox.tsx**: Search functionality

### **Product Components**
1. **ProductList.tsx**: Product grid display
2. **ProductCard**: Individual product display
3. **ProductView.tsx**: Product detail page
4. **ProductForm.tsx**: Add to cart form

### **Layout Components**
1. **Base.tsx**: Page wrapper
2. **Layout.scss**: Global layout styles
3. **Footer.tsx**: Footer component
4. **Breadcrumb.tsx**: Navigation breadcrumbs

---

## 🚀 **IMPLEMENTATION STRATEGY**

### **Phase 1: Core Theme Structure**
1. **Create HAPAS header component** matching HAPAS.VN design
2. **Implement navigation menu** with Vietnamese categories
3. **Style product cards** to match HAPAS aesthetic
4. **Configure theme colors and typography**

### **Phase 2: Advanced Customization**
1. **Custom product page layout**
2. **Vietnamese localization**
3. **HAPAS-specific styling**
4. **Mobile responsiveness**

### **Phase 3: Integration**
1. **Connect with KIAS products**
2. **Category page customization**
3. **Cart and checkout styling**
4. **Performance optimization**

---

## 🔍 **TECHNICAL DETAILS**

### **Component Props System**
Components receive data through GraphQL queries:

```jsx
// Logo.tsx query
export const query = `
  query query {
    themeConfig {
      logo {
        src
        alt
        width
        height
      }
    }
  }
`;
```

### **Styling Best Practices**
- **Use Tailwind classes** for common styling
- **Create SCSS files** for complex custom styles
- **Follow BEM methodology** for CSS class naming
- **Maintain responsive design** with Tailwind breakpoints

### **File Naming Conventions**
- **Components**: PascalCase (e.g., `HapasHeader.jsx`)
- **Styles**: kebab-case (e.g., `hapas-header.scss`)
- **Assets**: lowercase with hyphens (e.g., `hapas-logo.svg`)

---

## 📋 **HAPAS IMPLEMENTATION CHECKLIST**

### **Required Components**
- [ ] **HapasHeader.jsx** - Custom header with HAPAS navigation
- [ ] **HapasLogo.tsx** - HAPAS logo component
- [ ] **HapasNavigation.jsx** - Vietnamese menu items
- [ ] **HapasProductCard.jsx** - Product display matching HAPAS style
- [ ] **HapasFooter.jsx** - Footer with HAPAS branding

### **Required Styles**
- [ ] **hapas-variables.scss** - HAPAS color palette and fonts
- [ ] **hapas-header.scss** - Header styling
- [ ] **hapas-products.scss** - Product card and listing styles
- [ ] **hapas-responsive.scss** - Mobile responsiveness

### **Configuration Updates**
- [ ] **theme.json** - HAPAS brand configuration
- [ ] **Navigation menu** - Vietnamese categories
- [ ] **Color scheme** - HAPAS brand colors
- [ ] **Typography** - HAPAS font choices

---

## 🎯 **NEXT STEPS**

1. **Create HAPAS theme foundation** with basic structure
2. **Implement header component** matching HAPAS.VN design
3. **Style product components** for KIAS product display
4. **Test with imported KIAS products**
5. **Iterate based on visual comparison with HAPAS.VN**

---

*Analysis completed for HAPAS theme development*  
*Ready to begin implementation*
