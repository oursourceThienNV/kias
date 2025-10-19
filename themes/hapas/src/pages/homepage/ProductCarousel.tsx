/**
 * Product Carousel Component - HAPAS Homepage
 * Bestsellers / Featured Products Section
 */

import React, { useRef } from 'react';
import { Image } from '@components/common/Image';
import './ProductCarousel.scss';

interface Product {
  productId: string;
  name: string;
  url: string;
  price: {
    regular: number;
    special?: number;
  };
  image: {
    url: string;
    alt: string;
  };
  badge?: string;
}

interface ProductCarouselProps {
  title?: string;
  products?: {
    items?: Product[];
  };
  columns?: number;
}

export default function ProductCarousel({
  title = 'Sản phẩm bán chạy',
  products,
  columns = 4
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Extract products array from GraphQL response
  const productList = products?.items || [];

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = scrollRef.current.clientWidth / columns;
    const newScrollLeft = scrollRef.current.scrollLeft + 
      (direction === 'right' ? scrollAmount : -scrollAmount);
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  if (!productList || productList.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateDiscount = (regular: number, special?: number) => {
    if (!special) return 0;
    return Math.round(((regular - special) / regular) * 100);
  };

  return (
    <section className="hapas-product-carousel" aria-labelledby="product-carousel-title">
      <div className="container">
        <div className="product-carousel-header">
          <h2 id="product-carousel-title" className="product-carousel-title">
            {title}
          </h2>
          <div className="product-carousel-nav">
            <button
              onClick={() => scroll('left')}
              className="carousel-nav-btn carousel-nav-prev"
              aria-label="Previous products"
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M15 18L9 12L15 6" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="carousel-nav-btn carousel-nav-next"
              aria-label="Next products"
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M9 18L15 12L9 6" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="product-carousel-wrapper">
          <div 
            ref={scrollRef}
            className="product-carousel-track"
            style={{
              gridTemplateColumns: `repeat(${productList.length}, calc((100% - ${(columns - 1) * 1.5}rem) / ${columns}))`
            }}
          >
            {productList.map((product) => {
              const discount = product.price.special?.value
                ? calculateDiscount(
                    product.price.regular.value,
                    product.price.special.value
                  )
                : 0;

              return (
                <a
                  key={product.productId}
                  href={product.url}
                  className="product-card"
                  aria-label={`View ${product.name}`}
                >
                  <div className="product-card-image">
                    {product.image?.url ? (
                      <Image
                        src={product.image.url}
                        alt={product.image?.alt || product.name}
                        width={480}
                        height={640}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        loading="lazy"
                        decoding="async"
                        objectFit="cover"
                        style={{ borderRadius: 8 }}
                      />
                    ) : (
                      <img
                        src={'/placeholder-product.jpg'}
                        alt={product.name}
                        loading="lazy"
                      />
                    )}
                    {product.badge && (
                      <span className="product-badge">{product.badge}</span>
                    )}
                    {discount > 0 && (
                      <span className="product-discount">Giảm {discount}%</span>
                    )}
                  </div>

                  <div className="product-card-content">
                    <h3 className="product-card-name">{product.name}</h3>
                    <div className="product-card-price">
                      {product.price.special?.value ? (
                        <>
                          <span className="price-special">
                            {product.price.special.text}
                          </span>
                          <span className="price-regular">
                            {product.price.regular.text}
                          </span>
                        </>
                      ) : (
                        <span className="price-regular">
                          {product.price.regular.text}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 49
};

export const query = `
  query BestsellersData {
    products(
      filters: [
        { key: "status", operation: eq, value: "1" }
      ],
      limit: 12
    ) {
      items {
        productId
        name
        url
        urlKey
        price {
          regular {
            value
            text
          }
          special {
            value
            text
          }
        }
        image {
          url
          alt
        }
      }
    }
  }
`;

