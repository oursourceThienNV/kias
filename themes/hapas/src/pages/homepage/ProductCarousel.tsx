/**
 * Product Carousel Component - HAPAS Homepage
 * Bestsellers / Featured Products Section
 */

import React, { useRef, useState, useEffect } from "react";
import { Image } from "@components/common/Image";
import "./ProductCarousel.scss";

interface MoneyText {
  value: number;
  text: string;
}

interface Product {
  productId: string;
  name: string;
  url: string;
  price: {
    regular: MoneyText;
    special?: MoneyText;
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

// Responsive tiles per view
const getResponsiveTilesPerView = () => {
  if (typeof window === "undefined") return 4.5;
  const screenWidth = window.innerWidth;
  if (screenWidth <= 640) return 2; // Mobile: 2 tiles
  if (screenWidth <= 768) return 3; // Tablet: 3 tiles
  if (screenWidth <= 1024) return 3.5; // Small laptop: 3.5 tiles
  return 4.5; // Desktop: 4.5 tiles
};

const TILES_PER_VIEW = 4.5;
const tileWidth = `${100 / TILES_PER_VIEW}%`;

export default function ProductCarousel({
  title = "Sản phẩm bán chạy",
  products,
  columns = 4,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

  const [scrollRatio, setScrollRatio] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Extract products array from GraphQL response
  const productList = products?.items || [];
  const totalDots = Math.ceil(productList.length / TILES_PER_VIEW);

  const updateScrollRatio = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const ratio = maxScrollLeft > 0 ? container.scrollLeft / maxScrollLeft : 0;
    setScrollRatio(ratio);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!sliderRef.current || !scrollRef.current) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = scrollRef.current.scrollLeft;
    setIsDragging(true);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!sliderRef.current || !scrollRef.current) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.touches[0].clientX;
    dragStartScrollRef.current = scrollRef.current.scrollLeft;
    setIsDragging(true);

    document.addEventListener("touchmove", handleTouchMove as any);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !scrollRef.current || !sliderRef.current)
      return;

    const deltaX = e.clientX - dragStartXRef.current;
    const trackWidth = sliderRef.current.clientWidth;
    const container = scrollRef.current;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    const ratioDelta = deltaX / trackWidth;
    const newScrollLeft =
      dragStartScrollRef.current + ratioDelta * maxScrollLeft;
    container.scrollLeft = Math.max(0, Math.min(maxScrollLeft, newScrollLeft));

    updateScrollRatio();
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDraggingRef.current || !scrollRef.current || !sliderRef.current)
      return;

    const deltaX = e.touches[0].clientX - dragStartXRef.current;
    const trackWidth = sliderRef.current.clientWidth;
    const container = scrollRef.current;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    const ratioDelta = deltaX / trackWidth;
    const newScrollLeft =
      dragStartScrollRef.current + ratioDelta * maxScrollLeft;
    container.scrollLeft = Math.max(0, Math.min(maxScrollLeft, newScrollLeft));

    updateScrollRatio();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    document.removeEventListener("touchmove", handleTouchMove as any);
    document.removeEventListener("touchend", handleTouchEnd);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => updateScrollRatio();

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove as any);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  if (!productList || productList.length === 0) {
    return null;
  }

  const calculateDiscount = (regular: number, special?: number) => {
    if (!special) return 0;
    return Math.round(((regular - special) / regular) * 100);
  };

  return (
    <section
      className="hapas-product-carousel"
      aria-labelledby="product-carousel-title"
      style={{ marginTop: 50, marginBottom: 50 }}
    >
      <div className="container">
        <div className="mb-6 md:mb-8">
          <h2
            id="product-carousel-title"
            className="text-[20px] md:text-[28px] lg:text-[36px] font-[Montserrat] font-semibold tracking-wide uppercase text-[#79192A]"
          >
            {title}
          </h2>
          <a
            href="/products"
            className="mt-2 inline-flex items-center gap-2 text-[15px] text-gray-700 hover:text-gray-900"
          >
            Xem thêm
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="translate-y-[1px]"
              aria-hidden="true"
            >
              <path
                d="M5 12h14M13 5l7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div ref={scrollRef} className="flex overflow-x-hidden gap-1">
          {productList.map((product) => {
            const discount = product.price.special?.value
              ? calculateDiscount(
                  product.price.regular.value,
                  product.price.special.value
                )
              : 0;

            return (
              <article
                key={product.productId}
                className="flex-shrink-0 group"
                style={{ width: tileWidth }}
              >
                <a
                  href={product.url}
                  className="block"
                  aria-label={`View ${product.name}`}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: "3/4" }}
                  >
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
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <img
                        src={"/placeholder-product.jpg"}
                        alt={product.name}
                        loading="lazy"
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-medium">
                        {product.badge}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-medium">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      {product.price.special?.value ? (
                        <>
                          <span className="text-base font-semibold text-red-600">
                            {product.price.special.text}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {product.price.regular.text}
                          </span>
                        </>
                      ) : (
                        <span className="text-base font-semibold text-gray-900">
                          {product.price.regular.text}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              </article>
            );
          })}
        </div>

        {/* Slider thumb */}
        {totalDots > 1 && (
          <div className="flex justify-center mt-8 relative">
            <div ref={sliderRef} className="relative w-[50vw] h-4">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full -translate-y-1/2" />
              <div
                className="absolute top-1/2 w-3 h-3 bg-gray-600 rounded-full cursor-grab"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                style={{
                  left: `${scrollRatio * 100}%`,
                  transform: isDragging
                    ? "translateY(-50%) scale(1.2)"
                    : "translateY(-50%)",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 49,
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
