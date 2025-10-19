import React, { useState } from 'react';
import './HapasProductCard.scss';

/**
 * HAPAS Product Card Component
 * 
 * Product card matching HAPAS.VN design:
 * - Clean, minimalist product display
 * - Vietnamese product information
 * - Hover effects and animations
 * - Price formatting in VND
 * - Responsive image handling
 * - Add to cart functionality
 */
export default function HapasProductCard({ product }) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Format price in Vietnamese currency
  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    
    // Convert USD to VND (approximate rate: 1 USD = 24,000 VND)
    const vndPrice = Math.round(price * 24000);
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(vndPrice);
  };

  // Handle add to cart
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    
    try {
      // Add to cart API call would go here
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      // Show success feedback
      console.log('Added to cart:', product.name);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Get product URL
  const productUrl = `/product/${product.url_key || product.product_id}`;

  // Get primary image
  const primaryImage = product.images?.[0] || product.image || '/themes/hapas/assets/images/product-placeholder.jpg';

  return (
    <article className="hapas-product-card">
      <a href={productUrl} className="product-link">
        {/* Product Image */}
        <div className="product-image-container">
          {!imageError ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="product-image"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="product-image-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
            </div>
          )}
          
          {/* Product Badge */}
          {product.is_new && (
            <span className="product-badge new-badge">Mới</span>
          )}
          
          {product.sale_price && product.sale_price < product.price && (
            <span className="product-badge sale-badge">Giảm giá</span>
          )}
          
          {/* Quick Actions */}
          <div className="product-actions">
            <button
              className="quick-view-btn"
              title="Xem nhanh"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Quick view functionality
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            
            <button
              className="wishlist-btn"
              title="Thêm vào yêu thích"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Wishlist functionality
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="product-info">
          {/* Product Name */}
          <h3 className="product-name vietnamese-text">
            {product.name}
          </h3>
          
          {/* Product Description */}
          {product.short_description && (
            <p className="product-description vietnamese-text">
              {product.short_description}
            </p>
          )}
          
          {/* Product Price */}
          <div className="product-pricing">
            {product.sale_price && product.sale_price < product.price ? (
              <>
                <span className="sale-price">{formatPrice(product.sale_price)}</span>
                <span className="original-price">{formatPrice(product.price)}</span>
                <span className="discount-percent">
                  -{Math.round(((product.price - product.sale_price) / product.price) * 100)}%
                </span>
              </>
            ) : (
              <span className="current-price">{formatPrice(product.price)}</span>
            )}
          </div>
          
          {/* Product Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="product-variants">
              <div className="variant-colors">
                {product.variants.slice(0, 4).map((variant, index) => (
                  <span
                    key={index}
                    className="variant-color"
                    style={{ backgroundColor: variant.color }}
                    title={variant.name}
                  />
                ))}
                {product.variants.length > 4 && (
                  <span className="variant-more">+{product.variants.length - 4}</span>
                )}
              </div>
            </div>
          )}
          
          {/* Product Rating */}
          {product.rating && (
            <div className="product-rating">
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= product.rating ? 'filled' : ''}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-count">({product.review_count || 0})</span>
            </div>
          )}
        </div>
      </a>

      {/* Add to Cart Button */}
      <button
        className={`add-to-cart-btn ${isLoading ? 'loading' : ''}`}
        onClick={handleAddToCart}
        disabled={isLoading || !product.in_stock}
        title={product.in_stock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
      >
        {isLoading ? (
          <span className="loading-spinner" />
        ) : product.in_stock ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"/>
              <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"/>
              <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"/>
            </svg>
            <span className="vietnamese-text">Thêm vào giỏ</span>
          </>
        ) : (
          <span className="vietnamese-text">Hết hàng</span>
        )}
      </button>
    </article>
  );
}

// Component registration for EverShop Area system
export const layout = {
  areaId: 'productCard',
  sortOrder: 1
};
