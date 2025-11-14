import React, { useState, useRef, useEffect } from "react";
import { Image } from "@components/common/Image";

interface MoneyText {
  value: number;
  text: string;
}

interface ProductImage {
  url: string;
  alt?: string | null;
}

type Product = {
  productId: string;
  name: string;
  url: string;
  urlKey: string;
  sku?: string;
  image?: ProductImage | null;
  description?: string | null;
  price?: {
    regular: MoneyText;
    special?: MoneyText;
  };
  badge?: string;
};

type ProductsData = {
  items: Product[];
};

interface Props {
  title?: string;
  products?: ProductsData;
  viewAllHref?: string;
}

export default function CategoryTiles({
  title = "Sản phẩm mới",
  products,
  viewAllHref = "/products",
}: Props) {
  const productList = products?.items || [];
  if (!productList.length) return null;

  const scrollRef = useRef<HTMLDivElement>(null);

  // Calculate discount percentage
  const calculateDiscount = (regular: number, special?: number) => {
    if (!special) return 0;
    return Math.round(((regular - special) / regular) * 100);
  };

  // Drag/Swipe state (from HeroSlider)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Hover preview state
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [popupPosition, setPopupPosition] = useState<"left" | "right">("right");
  const [popupCoords, setPopupCoords] = useState<{ top: number; left: number }>(
    { top: 0, left: 0 }
  );

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
    const popupWidth = 720; // width must match the popup element
    const popupHeight = 460; // fixed popup height to ensure CTA visible
    const margin = 16;

    // Set new timeout to show popup after 200ms (snappier)
    const timeout = setTimeout(() => {
      if (!isDragging) {
        // Recalculate rect to avoid any mid-delay movement
        const rect = target.getBoundingClientRect();
        const spaceOnRight = window.innerWidth - rect.right;
        // Center vertically relative to the tile
        const centerY = rect.top + rect.height / 2;
        const unclampedTop = centerY - popupHeight / 2;
        const clampedTop = Math.max(
          8,
          Math.min(unclampedTop, window.innerHeight - popupHeight - 8)
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

        setHoveredCategory(productId);
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
      setHoveredCategory(null);
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
    setHoveredCategory(null);
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
  };

  // Drag/Swipe handlers (from HeroSlider)
  const handleDragStart = (clientX: number) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
    setScrollLeft(scrollRef.current.scrollLeft);
    setDragStartTime(Date.now());
    // Hide popup when dragging
    setHoveredCategory(null);
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

  // Attach native touch events with { passive: false } (from HeroSlider)
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchCurrentX = 0;
    let touchStartTime = 0;
    let touchScrollLeft = 0;
    let isTouchDragging = false;
    let hasLockedDirection = false;
    let isHorizontalLock = false;

    const handleTouchStartNative = (e: TouchEvent) => {
      isTouchDragging = true;
      touchStartX = e.touches[0].clientX;
      touchCurrentX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
      touchScrollLeft = scrollElement.scrollLeft;
      setIsDragging(true);
      setStartX(touchStartX);
      setCurrentX(touchCurrentX);
      setScrollLeft(touchScrollLeft);
      setDragStartTime(touchStartTime);
      hasLockedDirection = false;
      isHorizontalLock = false;
    };

    const handleTouchMoveNative = (e: TouchEvent) => {
      if (!isTouchDragging) return;

      // Determine gesture intent
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      if (!hasLockedDirection) {
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
          hasLockedDirection = true;
          isHorizontalLock = Math.abs(dx) > Math.abs(dy);
        }
      }
      if (isHorizontalLock) {
        e.preventDefault();
      }

      touchCurrentX = e.touches[0].clientX;
      setCurrentX(touchCurrentX);

      const offset = touchStartX - touchCurrentX;

      // Direct scroll update for smooth dragging
      scrollElement.scrollLeft = touchScrollLeft + offset;
    };

    const handleTouchEndNative = (e: TouchEvent) => {
      if (!isTouchDragging) return;

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

  return (
    <section
      className="container my-14 md:my-20"
      style={{ marginTop: 50 }}
      aria-labelledby="category-tiles-title"
    >
      <div className="mb-6 md:mb-8 flex items-end justify-between">
        <div>
          <h2
            id="category-tiles-title"
            className="text-[20px] md:text-[28px] lg:text-[36px] font-[Montserrat] font-semibold tracking-wide uppercase text-[#79192A]"
          >
            {title}
          </h2>
          <a
            href={viewAllHref}
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
            touchAction: "pan-y",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {productList.map((p) => {
            const label = p.name;
            const href = p.url;
            const img = p.image?.url || "/placeholder-product.jpg";
            const discount = p.price?.special?.value
              ? calculateDiscount(p.price.regular.value, p.price.special.value)
              : 0;

            return (
              <div
                className="group flex-shrink-0 w-[calc(100vw-2rem)] sm:w-[calc(50vw-2rem)] md:w-[calc(33.333vw-1.5rem)] lg:w-[280px] flex flex-col relative"
                key={p.productId ?? p.url ?? p.urlKey}
              >
                <a
                  href={href}
                  className="flex flex-col h-full"
                  aria-label={label}
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
                    style={{ aspectRatio: "5 / 6.5" } as React.CSSProperties}
                    onMouseEnter={(e) =>
                      handleMouseEnterImage(String(p.productId), e)
                    }
                    onMouseLeave={handleMouseLeaveImage}
                  >
                    {p.image?.url ? (
                      <Image
                        src={p.image.url}
                        alt={p.image?.alt || label}
                        width={480}
                        height={640}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        loading="lazy"
                        decoding="async"
                        objectFit="cover"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        draggable="false"
                      />
                    ) : (
                      <img
                        src={"/placeholder-product.jpg"}
                        alt={label}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        draggable="false"
                      />
                    )}
                    {p.badge && (
                      <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-medium z-20 shadow-lg">
                        {p.badge}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-semibold z-20 shadow-lg">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  {/* Hover Preview Popup */}
                  {hoveredCategory === String(p.productId) && (
                    <div
                      className={`fixed w-[720px] h-[460px] overflow-hidden bg-white shadow-2xl rounded-lg z-50 border border-gray-200`}
                      style={{
                        top: popupCoords.top,
                        left: popupCoords.left,
                        willChange: "auto",
                      }}
                      onMouseEnter={handleMouseEnterPopup}
                      onMouseLeave={handleMouseLeavePopup}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <div className="grid grid-cols-2 gap-1.5 p-2 pb-3">
                        {/* Ảnh mẫu */}
                        <div className="col-span-2">
                          <img
                            src={p.image?.url || "/placeholder-product.jpg"}
                            alt={label}
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
                              src={p.image?.url || "/placeholder-product.jpg"}
                              alt="Material texture"
                              className="w-full h-[10.25rem] object-cover object-center rounded border border-gray-200"
                            />
                          </div>
                        </div>

                        {/* Mô tả sản phẩm từ DB (nếu có) */}
                        <div className="col-span-1">
                          <div className="text-xs font-medium text-gray-700 mb-0">Mô tả</div>
                          {typeof p.description === 'string' && p.description.trim() && (
                            <p className="text-xs text-gray-600 leading-tight line-clamp-5">
                              {p.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Nút xem chi tiết sản phẩm */}
                      <div className="sticky bottom-0 left-0 right-0 bg-white px-3 py-2 border-t border-gray-200">
                        <button
                          className="block w-full bg-black text-white text-center py-2 px-3 text-sm font-medium uppercase tracking-wide hover:bg-gray-900 transition-colors rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = href;
                          }}
                        >
                          Xem thêm
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex flex-col flex-grow">
                    <h3 className="text-sm font-medium text-gray-900 text-center group-hover:text-gray-600 transition-colors line-clamp-2">
                      {label}
                    </h3>
                    {p.price && (
                      <div className="mt-1 flex items-center justify-center gap-2">
                        {p.price.special?.value ? (
                          <>
                            <span className="text-base font-semibold text-red-600">
                              {p.price.special.text}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {p.price.regular.text}
                            </span>
                          </>
                        ) : (
                          <span className="text-base font-semibold text-gray-900">
                            {p.price.regular.text}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Button Mua ngay -> điều hướng sang trang chi tiết */}
                    <button
                      className="mt-auto pt-3 w-full bg-black text-white py-3 px-4 font-medium text-sm uppercase tracking-wide hover:bg-gray-900 transition-colors duration-200"
                    >
                      Mua ngay
                    </button>
                  </div>
                </a>
              </div>
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
    </section>
  );
}

export const layout = { areaId: "content", sortOrder: 49 };

export const query = `
  query NewProductData {
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
        sku
        description
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
