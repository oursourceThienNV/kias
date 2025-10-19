# KIAS.VN Website Structure Analysis

## Overview
KIAS.VN is a Vietnamese fashion e-commerce site built on WordPress with WooCommerce. The site uses the Flatsome theme and has a well-structured product catalog.

## Product Data Structure

### Categories Identified:
1. **Set Bộ** (14 products) - Clothing sets
2. **Váy & Đầm** (22 products) - Dresses & Skirts  
3. **Quần** (5 products) - Pants
4. **Áo** (12 products) - Tops/Shirts

**Total Products: ~53 products**

### Product Information Available:
- **Product Names**: Vietnamese names with descriptive titles
  - Example: "[KIAS x HannahOlala] 𝐌𝐨𝐝𝐞𝐫𝐧 𝐀𝐮𝐭𝐡𝐨𝐫𝐢𝐭𝐲 – Bản lĩnh thăng hoa trong tinh hoa thời trang"
- **Prices**: VND format (580,000₫ - 2,780,000₫)
- **Sale Prices**: Original and discounted prices available
- **Product Images**: High-quality fashion photography
- **Variants**: Size and color options
- **Ratings**: Star rating system (0-5 stars)

### HTML Structure Analysis:

#### Product Grid Container:
```html
<div class="products row row-small large-columns-4 medium-columns-3 small-columns-2">
```

#### Individual Product Card:
```html
<div class="product-small col">
  <div class="col-inner">
    <div class="badge-container">
      <!-- Sale badge if applicable -->
      <span class="badge onsale">Giảm giá!</span>
    </div>
    
    <div class="product-image">
      <a href="[product-url]">
        <img src="[image-url]" alt="[product-name]">
      </a>
    </div>
    
    <div class="product-info">
      <h3 class="name product-title">
        <a href="[product-url]">[Product Name]</a>
      </h3>
      
      <span class="price">
        <span class="woocommerce-Price-amount amount">
          <bdi>[Price]&nbsp;&#8363;</bdi>
        </span>
      </span>
      
      <div class="star-rating">
        <!-- Rating stars -->
      </div>
    </div>
  </div>
</div>
```

### Key CSS Selectors for Scraping:

#### Product Containers:
- **Product Grid**: `.products.row`
- **Individual Product**: `.product-small.col`

#### Product Data:
- **Product Name**: `.name.product-title a`
- **Product URL**: `.name.product-title a[href]`
- **Product Image**: `.product-image img[src]`
- **Price**: `.price .woocommerce-Price-amount.amount bdi`
- **Sale Badge**: `.badge.onsale`
- **Rating**: `.star-rating`

#### Category Pages:
- **Set Bộ**: `/danh-muc/set-bo/`
- **Váy & Đầm**: `/danh-muc/vay-dam/`
- **Quần**: `/danh-muc/quan/`
- **Áo**: `/danh-muc/ao/`

### Navigation Structure:
```html
<nav class="header-nav-main nav nav-left nav-size-medium nav-spacing-medium">
  <li class="menu-item">
    <a href="/danh-muc/set-bo/">Set Bộ</a>
  </li>
  <li class="menu-item">
    <a href="/danh-muc/vay-dam/">Váy & Đầm</a>
  </li>
  <li class="menu-item">
    <a href="/danh-muc/quan/">Quần</a>
  </li>
  <li class="menu-item">
    <a href="/danh-muc/ao/">Áo</a>
  </li>
</nav>
```

## Technical Considerations

### Anti-Scraping Measures:
1. **Rate Limiting**: Likely implemented at server level
2. **User-Agent Detection**: Standard WordPress protection
3. **Session Management**: Cookie-based sessions
4. **CAPTCHA**: Not observed on product pages

### Recommended Scraping Strategy:
1. **Respectful Delays**: 1-2 seconds between requests
2. **User-Agent Rotation**: Use realistic browser user agents
3. **Session Management**: Maintain cookies across requests
4. **Error Handling**: Retry logic for failed requests
5. **Incremental Approach**: Start with 2-3 products for testing

### Data Quality:
- **High**: Product names and prices are consistently formatted
- **Medium**: Image URLs are absolute and accessible
- **High**: Category classification is clear and consistent
- **Medium**: Vietnamese text encoding needs UTF-8 handling

### Pagination:
- Products appear to load via AJAX/infinite scroll
- May need to handle dynamic loading for complete catalog

## Sample Product Data:

### Example 1: Premium Set
```json
{
  "name": "[KIAS x HannahOlala] 𝐌𝐨𝐝𝐞𝐫𝐧 𝐀𝐮𝐭𝐡𝐨𝐫𝐢𝐭𝐲",
  "description": "Bản lĩnh thăng hoa trong tinh hoa thời trang",
  "price": 2650000,
  "category": "Set Bộ",
  "currency": "VND",
  "rating": 0,
  "sale": false
}
```

### Example 2: Sale Item
```json
{
  "name": "Vải Lụa Pháp cao cấp",
  "price": 1200000,
  "originalPrice": 1650000,
  "category": "Váy & Đầm", 
  "currency": "VND",
  "rating": 0,
  "sale": true,
  "discount": 27
}
```

## Implementation Priority:
1. **Start with Set Bộ category** (14 products, manageable size)
2. **Test with 2-3 products first**
3. **Verify data quality and encoding**
4. **Scale to full catalog once proven**

## Risk Assessment:
- **Low Risk**: Standard WordPress/WooCommerce structure
- **Medium Risk**: Vietnamese text encoding challenges
- **Low Risk**: Image accessibility and quality
- **Medium Risk**: Rate limiting and blocking

## Next Steps:
1. Implement scraping logic for Set Bộ category
2. Test with sample products
3. Handle Vietnamese text encoding
4. Implement image download and optimization
5. Create EverShop product import functionality
