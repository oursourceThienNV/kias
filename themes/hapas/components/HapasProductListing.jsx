import React, { useState, useEffect } from 'react';
import HapasProductCard from './HapasProductCard';
import './HapasProductListing.scss';

/**
 * HAPAS Product Listing Component
 * 
 * Product listing for category pages matching HAPAS.VN design:
 * - Responsive grid layout (4/3/2 columns)
 * - Vietnamese filtering and sorting
 * - Pagination with Vietnamese labels
 * - Loading states and empty states
 * - Search functionality
 */
export default function HapasProductListing({ 
  products = [], 
  category = null,
  totalProducts = 0,
  currentPage = 1,
  productsPerPage = 12,
  isLoading = false,
  onPageChange,
  onSortChange,
  onFilterChange
}) {
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [filters, setFilters] = useState({
    priceRange: null,
    colors: [],
    sizes: []
  });

  // Vietnamese sort options
  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price_asc', label: 'Giá thấp đến cao' },
    { value: 'price_desc', label: 'Giá cao đến thấp' },
    { value: 'name_asc', label: 'Tên A-Z' },
    { value: 'name_desc', label: 'Tên Z-A' },
    { value: 'popular', label: 'Phổ biến nhất' }
  ];

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    onSortChange?.(newSort);
  };

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startProduct = (currentPage - 1) * productsPerPage + 1;
  const endProduct = Math.min(currentPage * productsPerPage, totalProducts);

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="hapas-product-listing">
      {/* Category Header */}
      {category && (
        <div className="category-header">
          <h1 className="category-title vietnamese-text">{category.name}</h1>
          {category.description && (
            <p className="category-description vietnamese-text">
              {category.description}
            </p>
          )}
        </div>
      )}

      {/* Listing Controls */}
      <div className="listing-controls">
        <div className="controls-left">
          <div className="results-count">
            <span className="vietnamese-text">
              Hiển thị {startProduct}-{endProduct} trong tổng số {totalProducts} sản phẩm
            </span>
          </div>
        </div>

        <div className="controls-right">
          {/* View Mode Toggle */}
          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('grid')}
              title="Xem dạng lưới"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('list')}
              title="Xem dạng danh sách"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="sort-dropdown">
            <label htmlFor="sort-select" className="sort-label vietnamese-text">
              Sắp xếp:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select vietnamese-text"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className={`product-grid ${viewMode}`}>
        {isLoading ? (
          // Loading State
          <div className="loading-grid">
            {Array.from({ length: productsPerPage }).map((_, index) => (
              <div key={index} className="product-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-price"></div>
                  <div className="skeleton-button"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          // Products
          products.map((product) => (
            <HapasProductCard
              key={product.product_id || product.id}
              product={product}
            />
          ))
        ) : (
          // Empty State
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <h3 className="empty-title vietnamese-text">
              Không tìm thấy sản phẩm
            </h3>
            <p className="empty-description vietnamese-text">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem thêm sản phẩm.
            </p>
            <button className="reset-filters-btn vietnamese-text">
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <div className="pagination">
          <div className="pagination-info vietnamese-text">
            Trang {currentPage} / {totalPages}
          </div>
          
          <div className="pagination-controls">
            {/* Previous Button */}
            <button
              className="pagination-btn prev-btn"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              title="Trang trước"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
              <span className="vietnamese-text">Trước</span>
            </button>

            {/* Page Numbers */}
            <div className="pagination-numbers">
              {getPaginationNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="pagination-ellipsis">...</span>
                  ) : (
                    <button
                      className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                      onClick={() => onPageChange?.(page)}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Next Button */}
            <button
              className="pagination-btn next-btn"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Trang sau"
            >
              <span className="vietnamese-text">Sau</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Component registration for EverShop Area system
export const layout = {
  areaId: 'productListing',
  sortOrder: 1
};
