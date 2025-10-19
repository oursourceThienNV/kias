# 🧪 HAPAS Theme Integration Testing Plan

**Comprehensive Testing Guide for HAPAS Theme Activation in EverShop**

---

## 📋 **Testing Overview**

### **Test Environment**
- **EverShop Version**: 1.2.2
- **Theme**: HAPAS Fashion Theme v1.0.0
- **Database**: PostgreSQL with 25 products (6 KIAS products)
- **Server**: http://localhost:3000
- **Language**: Vietnamese (vi)
- **Currency**: VND (₫)

### **Testing Scope**
- ✅ Theme activation and configuration
- ✅ Component rendering and functionality
- ✅ Vietnamese localization
- ✅ Database integration with KIAS products
- ✅ Responsive design across devices
- ✅ Performance and accessibility

---

## 🎯 **Test Categories**

### **1. Theme Activation Tests**

#### **1.1 Configuration Verification**
```bash
# Test theme configuration
cat config/default.json | grep -A 20 "theme"

# Expected Results:
# - "theme": "hapas"
# - themeConfig with HAPAS logo and branding
# - Vietnamese language (vi)
# - VND currency
```

#### **1.2 File Structure Verification**
```bash
# Verify theme structure
ls -la themes/hapas/
ls -la themes/hapas/src/
ls -la themes/hapas/public/

# Expected Results:
# - src/ directory with components and styles
# - public/ directory with logo and assets
# - package.json and theme.json files
```

#### **1.3 Server Startup Test**
```bash
# Start development server
npm run dev

# Expected Results:
# - Server starts without errors
# - Theme compilation successful
# - No missing file warnings
```

---

### **2. Component Integration Tests**

#### **2.1 Header Component Test**
**URL**: http://localhost:3000
**Test Steps**:
1. Load homepage
2. Verify HAPAS header renders
3. Check Vietnamese navigation menu
4. Test mobile hamburger menu
5. Verify logo displays correctly

**Expected Results**:
- Header with HAPAS branding
- Vietnamese menu items: MỚI, SET BỘ, VÁY & ĐẦM, QUẦN, ÁO
- Responsive mobile menu
- HAPAS logo with tagline

#### **2.2 Logo Component Test**
**Test Steps**:
1. Check logo image loads: `/themes/hapas/public/logo/hapas-logo.svg`
2. Verify fallback text if image fails
3. Test logo link to homepage
4. Check responsive sizing

**Expected Results**:
- SVG logo displays correctly
- Alt text: "HAPAS Logo"
- Dimensions: 120x40px
- Links to homepage

#### **2.3 Product Components Test**
**Test Steps**:
1. Navigate to product listing page
2. Verify KIAS products display
3. Check Vietnamese product names
4. Test VND price formatting
5. Verify product card hover effects

**Expected Results**:
- KIAS products with Vietnamese names
- Prices in VND format (₫)
- Responsive product grid
- Smooth hover animations

---

### **3. Database Integration Tests**

#### **3.1 Product Data Verification**
```sql
-- Test KIAS products
SELECT pd.name, p.price 
FROM product_description pd 
JOIN product p ON pd.product_description_product_id = p.product_id 
WHERE pd.name LIKE '%KIAS%' 
LIMIT 5;

-- Expected Results:
-- 6 KIAS products with Vietnamese names
-- Prices in USD (will be converted to VND in frontend)
```

#### **3.2 Vietnamese Text Rendering**
```sql
-- Test Vietnamese character support
SELECT pd.name 
FROM product_description pd 
WHERE pd.name LIKE '%ă%' OR pd.name LIKE '%ê%' OR pd.name LIKE '%ô%'
LIMIT 3;

-- Expected Results:
-- Vietnamese characters display correctly
-- No encoding issues
```

---

### **4. Frontend Functionality Tests**

#### **4.1 Homepage Test**
**URL**: http://localhost:3000
**Test Checklist**:
- [ ] Page loads without errors
- [ ] HAPAS header displays
- [ ] Vietnamese language detected
- [ ] Featured products section
- [ ] Footer with HAPAS branding

#### **4.2 Product Listing Test**
**URL**: http://localhost:3000/products (or category pages)
**Test Checklist**:
- [ ] Product grid displays (4/3/2 columns)
- [ ] KIAS products visible
- [ ] Vietnamese product names
- [ ] VND price formatting
- [ ] Product images load
- [ ] Add to cart buttons work

#### **4.3 Search Functionality Test**
**Test Steps**:
1. Use search bar in header
2. Search for "KIAS"
3. Verify Vietnamese results
4. Test search suggestions

**Expected Results**:
- Search overlay opens
- KIAS products found
- Vietnamese text in results
- Proper result formatting

---

### **5. Responsive Design Tests**

#### **5.1 Desktop Testing (1024px+)**
**Test Checklist**:
- [ ] 4-column product grid
- [ ] Full navigation menu visible
- [ ] Header actions (search, cart, account)
- [ ] Proper spacing and typography

#### **5.2 Tablet Testing (768px-1023px)**
**Test Checklist**:
- [ ] 3-column product grid
- [ ] Navigation adapts properly
- [ ] Touch-friendly buttons
- [ ] Readable text sizes

#### **5.3 Mobile Testing (< 768px)**
**Test Checklist**:
- [ ] 2-column product grid
- [ ] Hamburger menu works
- [ ] Mobile-optimized header
- [ ] Touch targets adequate (44px+)

---

### **6. Performance Tests**

#### **6.1 Load Time Testing**
```bash
# Test page load performance
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:3000"

# Expected Results:
# - Total time < 2 seconds
# - First byte < 500ms
# - DNS lookup < 100ms
```

#### **6.2 Asset Loading Test**
**Test Steps**:
1. Open browser DevTools
2. Load homepage
3. Check Network tab
4. Verify asset loading

**Expected Results**:
- CSS files load quickly
- Images optimized
- No 404 errors
- Efficient caching

---

### **7. Vietnamese Localization Tests**

#### **7.1 Language Detection Test**
**Test Steps**:
1. Check HTML lang attribute
2. Verify currency symbols
3. Test date/time formatting
4. Check number formatting

**Expected Results**:
- `<html lang="vi">`
- VND currency (₫)
- Vietnamese number formatting
- Proper text rendering

#### **7.2 Typography Test**
**Test Steps**:
1. Check Vietnamese font rendering
2. Verify special characters (ă, â, ê, ô, ư)
3. Test text wrapping
4. Check line height and spacing

**Expected Results**:
- Clear Vietnamese text
- No character encoding issues
- Proper font fallbacks
- Readable typography

---

### **8. Cross-Browser Testing**

#### **8.1 Chrome/Edge Testing**
- [ ] Full functionality
- [ ] CSS Grid support
- [ ] JavaScript features
- [ ] Vietnamese fonts

#### **8.2 Firefox Testing**
- [ ] Layout consistency
- [ ] Animation performance
- [ ] Font rendering
- [ ] Responsive behavior

#### **8.3 Safari Testing**
- [ ] WebKit compatibility
- [ ] Mobile Safari (iOS)
- [ ] Font loading
- [ ] Touch interactions

---

### **9. Accessibility Tests**

#### **9.1 ARIA Support Test**
**Test Steps**:
1. Use screen reader
2. Check ARIA labels
3. Test keyboard navigation
4. Verify focus indicators

**Expected Results**:
- Proper ARIA attributes
- Keyboard accessible
- Screen reader friendly
- Clear focus indicators

#### **9.2 Color Contrast Test**
**Test Steps**:
1. Use accessibility tools
2. Check text contrast ratios
3. Test with color blindness simulation
4. Verify button visibility

**Expected Results**:
- WCAG AA compliance
- Sufficient contrast ratios
- Color-blind friendly
- Clear visual hierarchy

---

## 🔧 **Testing Tools**

### **Manual Testing Tools**
- **Browser DevTools**: Performance, Network, Console
- **Responsive Design Mode**: Device simulation
- **Lighthouse**: Performance and accessibility audit
- **WAVE**: Web accessibility evaluation

### **Automated Testing Commands**
```bash
# Component tests
node test-hapas-components.cjs

# Database integration tests
node test-hapas-database-integration.cjs

# Performance testing
npm run build
npm run test:performance

# Accessibility testing
npm run test:a11y
```

---

## 📊 **Success Criteria**

### **Minimum Requirements**
- ✅ Theme activates without errors
- ✅ All components render correctly
- ✅ Vietnamese text displays properly
- ✅ KIAS products visible and functional
- ✅ Responsive design works across devices
- ✅ Performance meets standards (< 3s load time)

### **Optimal Results**
- ✅ Lighthouse score > 90
- ✅ Zero accessibility violations
- ✅ Perfect Vietnamese typography
- ✅ Smooth animations and interactions
- ✅ Professional HAPAS branding throughout

---

## 🐛 **Common Issues & Solutions**

### **Theme Not Loading**
**Problem**: Theme doesn't activate
**Solution**: 
1. Check `config/default.json` has `"theme": "hapas"`
2. Verify `themes/hapas/src/` directory exists
3. Restart development server

### **Components Not Rendering**
**Problem**: HAPAS components don't show
**Solution**:
1. Check component registration in layout exports
2. Verify Area IDs match EverShop expectations
3. Check browser console for errors

### **Vietnamese Text Issues**
**Problem**: Vietnamese characters broken
**Solution**:
1. Ensure UTF-8 encoding
2. Check font loading
3. Verify database charset
4. Test browser language settings

### **Performance Issues**
**Problem**: Slow loading times
**Solution**:
1. Optimize images
2. Minimize CSS/JS
3. Enable compression
4. Check database queries

---

## 📞 **Support & Documentation**

### **Resources**
- **Theme Documentation**: `themes/hapas/README.md`
- **Component API**: JSDoc comments in source files
- **EverShop Docs**: Official documentation
- **Testing Guide**: This document

### **Contact**
- **GitHub Issues**: Bug reports and feature requests
- **Development Team**: Technical support
- **Documentation**: Updates and improvements

---

**© 2025 HAPAS Development Team**  
*Comprehensive testing ensures a flawless Vietnamese e-commerce experience*
