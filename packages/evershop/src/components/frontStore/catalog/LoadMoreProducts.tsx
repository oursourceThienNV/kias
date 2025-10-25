import { ProductData } from '@components/frontStore/catalog/productContext.js';
import { ProductList } from '@components/frontStore/catalog/ProductList.js';
import React, { useState } from 'react';

interface LoadMoreProductsProps {
  products: ProductData[];
  initialCount?: number;
  loadMoreCount?: number;
  layout?: 'grid' | 'list';
  gridColumns?: number;
  showAddToCart?: boolean;
  customAddToCartRenderer?: (product: ProductData) => React.ReactNode;
  imageWidth?: number;
  imageHeight?: number;
}

/**
 * Component hiển thị danh sách sản phẩm với tính năng "Xem thêm"
 * - Mặc định hiển thị 8 sản phẩm đầu tiên
 * - Mỗi lần bấm "XEM THÊM SẢN PHẨM" sẽ load thêm 8 sản phẩm
 * - Ẩn nút khi đã hiển thị hết tất cả sản phẩm
 */
export function LoadMoreProducts({
  products = [],
  initialCount = 8,
  loadMoreCount = 8,
  layout = 'grid',
  gridColumns = 4,
  showAddToCart = true,
  customAddToCartRenderer,
  imageWidth,
  imageHeight,
}: LoadMoreProductsProps) {
  // State để theo dõi số lượng sản phẩm đang hiển thị
  const [displayCount, setDisplayCount] = useState(initialCount);
  // State theo dõi trạng thái loading
  const [isLoading, setIsLoading] = useState(false);
  // State theo dõi sản phẩm mới được thêm vào (để animate)
  const [newlyAddedCount, setNewlyAddedCount] = useState(0);

  // Lấy danh sách sản phẩm cần hiển thị (slice từ mảng gốc)
  const visibleProducts = products.slice(0, displayCount);

  // Kiểm tra xem còn sản phẩm để load thêm không
  const hasMore = displayCount < products.length;

  // Handler khi bấm nút "Xem thêm"
  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading với animation (1.2s cho fill animation)
    setTimeout(() => {
      const oldCount = displayCount;
      const newCount = Math.min(displayCount + loadMoreCount, products.length);
      setDisplayCount(newCount);
      setNewlyAddedCount(newCount - oldCount);
      setIsLoading(false);
      
      // Reset newly added count sau khi animation fade-in hoàn tất
      setTimeout(() => {
        setNewlyAddedCount(0);
      }, 600);
    }, 1200);
  };

  return (
    <div className="load-more-products">
      {/* Render danh sách sản phẩm hiện tại với fade-in animation cho items mới */}
      <div
        className="product-list-wrapper"
        style={{
          animation: newlyAddedCount > 0 ? 'fadeInUp 0.6s ease-out' : 'none',
        }}
      >
        <ProductList
          products={visibleProducts}
          layout={layout}
          gridColumns={gridColumns}
          showAddToCart={showAddToCart}
          customAddToCartRenderer={customAddToCartRenderer}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
        />
      </div>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .load-more-button:disabled {
          cursor: not-allowed;
          opacity: 0.9;
        }
        
        .load-more-button:not(:disabled):hover {
          box-shadow: 0 4px 12px rgba(43, 58, 103, 0.3);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Nút "Xem thêm" - chỉ hiển thị khi còn sản phẩm */}
      {hasMore && (
        <div className="load-more-button-wrapper flex justify-center mt-12 mb-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="load-more-button relative overflow-hidden px-12 py-4 text-sm font-medium uppercase tracking-wide border border-[#79192A] transition-all duration-300 cursor-pointer"
            style={{
              letterSpacing: '0.05em',
              backgroundColor: isLoading ? '#79192A' : 'transparent',
              color: isLoading ? 'white' : '#79192A',
            }}
          >
            {/* Lớp fill animation từ trái sang phải */}
            <span
              className="absolute inset-0 bg-[#79192A] transition-transform duration-2000 ease-out"
              style={{
                transform: isLoading ? 'translateX(0)' : 'translateX(-100%)',
                zIndex: 0,
              }}
            />
            
            {/* Text button */}
            <span className="relative z-10 flex items-center gap-2">
              <>
                  XEM THÊM SẢN PHẨM
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
