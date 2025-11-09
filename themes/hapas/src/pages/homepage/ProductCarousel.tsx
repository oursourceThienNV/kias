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

export default function ProductCarousel({
  title = "Sản phẩm bán chạy",
  products,
  columns = 4,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drag/Swipe state (from CategoryTiles/HeroSlider pattern)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Hover preview state
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [popupPosition, setPopupPosition] = useState<"left" | "right">("right");
  const [popupCoords, setPopupCoords] = useState<{ top: number; left: number }>(
    { top: 0, left: 0 }
  );
  const [popupHeight, setPopupHeight] = useState<number>(460);

  // Extract products array from GraphQL response
  const productList = products?.items || [];

  // Scroll sang trái
  const scrollToPrev = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Scroll sang phải
  const scrollToNext = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Cập nhật hiển thị mũi tên dựa vào vị trí scroll
  const updateArrowVisibility = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Hover preview handlers
  const handleMouseEnterImage = (
    productId: string,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    // Only show popup on desktop (>= 1024px)
    if (window.innerWidth < 1024) {
      return;
    }

    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    // Defer computing viewport coordinates until just before showing popup
    const target = event.currentTarget;
    const initialRect = target.getBoundingClientRect();
    const popupWidth = 720; // must match popup element width
    const desiredHeight = Math.min(460, window.innerHeight - 16); // ensure fully visible
    setPopupHeight(desiredHeight);
    const margin = 16;

    // Show popup after 200ms
    const timeout = setTimeout(() => {
      if (!isDragging) {
        // Recalculate rect to avoid any mid-delay movement
        const rect = target.getBoundingClientRect();
        const spaceOnRight = window.innerWidth - rect.right;
        const centerY = rect.top + rect.height / 2;
        const unclampedTop = centerY - desiredHeight / 2;
        const clampedTop = Math.max(
          8,
          Math.min(unclampedTop, window.innerHeight - desiredHeight - 8)
        );

        if (spaceOnRight < popupWidth + margin) {
          setPopupPosition("left");
          setPopupCoords({
            top: clampedTop,
            left: Math.max(8, rect.left - popupWidth - margin),
          });
        } else {
          setPopupPosition("right");
          setPopupCoords({
            top: clampedTop,
            left: Math.min(
              window.innerWidth - popupWidth - 8,
              rect.right + margin
            ),
          });
        }

        setHoveredProduct(productId);
      }
    }, 200);
    setHoverTimeout(timeout);
  };

  const handleMouseLeaveImage = () => {
    // Clear show timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    // Delay hide để user có thời gian di chuyển vào popup
    const timeout = setTimeout(() => {
      setHoveredProduct(null);
    }, 200); // 200ms delay để di chuyển vào popup
    setHideTimeout(timeout);
  };

  const handleMouseEnterPopup = () => {
    // Cancel việc hide nếu user đã vào popup
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
  };

  const handleMouseLeavePopup = () => {
    // Hide popup khi leave khỏi popup
    setHoveredProduct(null);
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
  };

  // Drag/Swipe handlers (from CategoryTiles)
  const handleDragStart = (clientX: number) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
    setScrollLeft(scrollRef.current.scrollLeft);
    setDragStartTime(Date.now());
    // Hide popup when dragging
    setHoveredProduct(null);
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || !scrollRef.current) return;
    setCurrentX(clientX);
    const offset = startX - clientX;

    // Direct scroll update for smooth dragging
    scrollRef.current.scrollLeft = scrollLeft + offset;
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragOffset(0);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      handleDragMove(e.clientX);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // Attach native touch events with { passive: false }
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    let touchStartX = 0;
    let touchCurrentX = 0;
    let touchStartTime = 0;
    let touchScrollLeft = 0;
    let isTouchDragging = false;

    const handleTouchStartNative = (e: TouchEvent) => {
      isTouchDragging = true;
      touchStartX = e.touches[0].clientX;
      touchCurrentX = e.touches[0].clientX;
      touchStartTime = Date.now();
      touchScrollLeft = scrollElement.scrollLeft;
      setIsDragging(true);
      setStartX(touchStartX);
      setCurrentX(touchCurrentX);
      setScrollLeft(touchScrollLeft);
      setDragStartTime(touchStartTime);
    };

    const handleTouchMoveNative = (e: TouchEvent) => {
      if (!isTouchDragging) return;

      // Prevent scroll while dragging
      e.preventDefault();

      touchCurrentX = e.touches[0].clientX;
      setCurrentX(touchCurrentX);

      const offset = touchStartX - touchCurrentX;

      // Direct scroll update for smooth dragging
      scrollElement.scrollLeft = touchScrollLeft + offset;
    };

    const handleTouchEndNative = (e: TouchEvent) => {
      if (!isTouchDragging) return;

      e.preventDefault();
      isTouchDragging = false;
      setIsDragging(false);
      setDragOffset(0);
    };

    // Add event listeners with passive: false
    scrollElement.addEventListener("touchstart", handleTouchStartNative, {
      passive: false,
    });
    scrollElement.addEventListener("touchmove", handleTouchMoveNative, {
      passive: false,
    });
    scrollElement.addEventListener("touchend", handleTouchEndNative, {
      passive: false,
    });

    // Add scroll listener for arrow visibility
    scrollElement.addEventListener("scroll", updateArrowVisibility);
    updateArrowVisibility();

    return () => {
      scrollElement.removeEventListener("touchstart", handleTouchStartNative);
      scrollElement.removeEventListener("touchmove", handleTouchMoveNative);
      scrollElement.removeEventListener("touchend", handleTouchEndNative);
      scrollElement.removeEventListener("scroll", updateArrowVisibility);
    };
  }, []); // Empty deps - attach once on mount

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

        {/* Container với nút điều hướng */}
        <div className="relative">
          {/* Nút mũi tên trái */}
          {showLeftArrow && (
            <button
              onClick={scrollToPrev}
              className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full p-3"
              aria-label="Previous"
              style={{
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Scroll container */}
          <div
            ref={scrollRef}
            className="flex overflow-x-scroll gap-4 scrollbar-hide cursor-grab active:cursor-grabbing select-none px-1"
            style={{
              touchAction: "none",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
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
                  className="flex-shrink-0 group w-[calc(100vw-2rem)] sm:w-[calc(50vw-2rem)] md:w-[calc(33.333vw-1.5rem)] lg:w-[280px] flex flex-col relative"
                >
                  <a
                    href={product.url}
                    className="flex flex-col h-full"
                    aria-label={`View ${product.name}`}
                    onClick={(e) => {
                      // Prevent navigation if dragged
                      if (Math.abs(currentX - startX) > 10) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{ aspectRatio: "3/4" }}
                      onMouseEnter={(e) =>
                        handleMouseEnterImage(product.productId, e)
                      }
                      onMouseLeave={handleMouseLeaveImage}
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
                          draggable="false"
                        />
                      )}
                      {product.badge && (
                        <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-medium z-20 shadow-lg">
                          {product.badge}
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-semibold z-20 shadow-lg">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    {/* Hover Preview Popup */}
                    {hoveredProduct === product.productId && (
                      <div
                        className={`fixed w-[720px] h-[460px] overflow-hidden bg-white shadow-2xl rounded-lg z-50 border border-gray-200`}
                        style={{
                          top: popupCoords.top,
                          left: popupCoords.left,
                          willChange: "auto",
                        }}
                        onMouseEnter={handleMouseEnterPopup}
                        onMouseLeave={handleMouseLeavePopup}
                      >
                        <div className="grid grid-cols-2 gap-1.5 p-2 pb-3">
                          {/* Ảnh mẫu */}
                          <div className="col-span-2">
                            <img
                              src={product.image?.url || "/placeholder-product.jpg"}
                              alt={product.name}
                              className="w-full h-52 object-cover rounded"
                            />
                          </div>

                          {/* Ảnh cận chất liệu */}
                          <div className="col-span-1">
                            <div className="text-xs font-medium text-gray-700 mb-0">
                              Chất liệu
                            </div>
                            <div className="relative overflow-hidden">
                              <img
                                src={product.image?.url || "/placeholder-product.jpg"}
                                alt="Material texture"
                                className="w-full h-[10.25rem] object-cover object-center rounded border border-gray-200"
                              />
                            </div>
                          </div>

                          {/* Mô tả chất liệu */}
                          <div className="col-span-1">
                            <div className="text-xs font-medium text-gray-700 mb-0">
                              Mô tả
                            </div>
                            <p className="text-xs text-gray-600 leading-tight">
                              Da PU cao cấp, mềm mại, chống thấm nước tốt
                            </p>
                          </div>
                        </div>

                        {/* Nút xem thêm */}
                        <div className="sticky bottom-0 left-0 right-0 bg-white px-3 py-2 border-t border-gray-200">
                          <a
                            href={product.url}
                            className="block w-full bg-black text-white text-center py-2 px-3 text-sm font-medium uppercase tracking-wide hover:bg-gray-900 transition-colors rounded"
                          >
                            Xem thêm
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex flex-col flex-grow">
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
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

                      {/* Button Mua ngay */}
                      <button
                        className="mt-auto pt-3 w-full bg-black text-white py-3 px-4 font-medium text-sm uppercase tracking-wide hover:bg-gray-900 transition-colors duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Add to cart logic here
                        }}
                      >
                        Mua ngay
                      </button>
                    </div>
                  </a>
                </article>
              );
            })}
          </div>

          {/* Nút mũi tên phải */}
          {showRightArrow && (
            <button
              onClick={scrollToNext}
              className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full p-3"
              aria-label="Next"
              style={{
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 20,
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
