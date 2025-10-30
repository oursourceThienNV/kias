import React, { useState, useRef, useEffect } from "react";

interface MoneyText {
  value: number;
  text: string;
}

type Category = {
  categoryId: number;
  name: string;
  url: string;
  urlKey: string;
  image?: { url: string; alt?: string | null } | null;
  price?: {
    regular: MoneyText;
    special?: MoneyText;
  };
  badge?: string;
};

type CategoriesData = {
  items: Category[];
};

interface Props {
  title?: string;
  categories?: CategoriesData;
  viewAllHref?: string;
}

export default function CategoryTiles({
  title = "Sản phẩm mới",
  categories,
  viewAllHref = "/collections/all-bag-styles",
}: Props) {
  const mockCategories: Category[] = [
    {
      categoryId: 1001,
      name: "Satchel",
      url: "/satchel",
      urlKey: "satchel",
      image: {
        url: "https://file.hstatic.net/200000978078/file/t_i_tr_ng.png",
        alt: "Túi Trống",
      },
      price: {
        regular: { value: 1500000, text: "1.500.000₫" },
        special: { value: 1200000, text: "1.200.000₫" },
      },
      badge: "NEW",
    },
    {
      categoryId: 1002,
      name: "Hobo",
      url: "/hobo",
      urlKey: "Túi Hobo",
      image: {
        url: "https://file.hstatic.net/200000978078/file/_nh__3_.png",
        alt: "Hobo",
      },
      price: {
        regular: { value: 1800000, text: "1.800.000₫" },
      },
    },
    {
      categoryId: 1003,
      name: "Tote",
      url: "/tote",
      urlKey: "Túi tote",
      image: {
        url: "https://file.hstatic.net/200000978078/file/_nh.png",
        alt: "Tote",
      },
      price: {
        regular: { value: 2000000, text: "2.000.000₫" },
        special: { value: 1600000, text: "1.600.000₫" },
      },
    },
    {
      categoryId: 1004,
      name: "Backpack",
      url: "/backpack",
      urlKey: "backpack",
      image: {
        url: "https://file.hstatic.net/200000978078/file/_nh__4_.png",
        alt: "Backpack",
      },
      price: {
        regular: { value: 2200000, text: "2.200.000₫" },
      },
    },
    {
      categoryId: 1005,
      name: "Clutch",
      url: "/clutch",
      urlKey: "clutch",
      image: {
        url: "https://file.hstatic.net/200000978078/file/_nh__1_.png",
        alt: "Clutch",
      },
      price: {
        regular: { value: 1200000, text: "1.200.000₫" },
        special: { value: 900000, text: "900.000₫" },
      },
    },
    {
      categoryId: 1006,
      name: "Crossbody",
      url: "/crossbody",
      urlKey: "crossbody",
      image: {
        url: "https://product.hstatic.net/200000978078/product/_mg_5233__1__c74b4a5708ca4f6bac8aed8fa2f355e1_master.jpg",
        alt: "Crossbody",
      },
      price: {
        regular: { value: 1700000, text: "1.700.000₫" },
      },
      badge: "HOT",
    },
  ];

  const tiles = mockCategories;
  if (!tiles.length) return null;

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
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [popupPosition, setPopupPosition] = useState<"left" | "right">("right");

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
    categoryId: number,
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

    // Detect if popup should show on left or right
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const popupWidth = 384; // w-96 = 384px
    const spaceOnRight = window.innerWidth - rect.right;

    // If not enough space on right (need popup width + margin), show on left
    if (spaceOnRight < popupWidth + 32) {
      setPopupPosition("left");
    } else {
      setPopupPosition("right");
    }

    // Set new timeout to show popup after 500ms
    const timeout = setTimeout(() => {
      if (!isDragging) {
        setHoveredCategory(categoryId);
      }
    }, 500);
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
          {tiles.map((x) => {
            const label = x.name;
            const href = x.url;
            const img = x.image?.url || "/placeholder-category.jpg";
            const discount = x.price?.special?.value
              ? calculateDiscount(x.price.regular.value, x.price.special.value)
              : 0;

            return (
              <div
                className="group flex-shrink-0 w-[calc(100vw-2rem)] sm:w-[calc(50vw-2rem)] md:w-[calc(33.333vw-1.5rem)] lg:w-[280px] flex flex-col relative"
                key={x.categoryId ?? x.url ?? x.urlKey}
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
                    onMouseEnter={(e) => handleMouseEnterImage(x.categoryId, e)}
                    onMouseLeave={handleMouseLeaveImage}
                  >
                    <img
                      src={img}
                      alt={x.image?.alt || label}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      draggable="false"
                    />
                    {x.badge && (
                      <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-medium z-20 shadow-lg">
                        {x.badge}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-semibold z-20 shadow-lg">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  {/* Hover Preview Popup */}
                  {hoveredCategory === x.categoryId && (
                    <div
                      className={`absolute ${
                        popupPosition === "right"
                          ? "left-full ml-4"
                          : "right-full mr-4"
                      } top-0 w-96 bg-white shadow-2xl rounded-lg overflow-hidden z-50 border border-gray-200`}
                      style={{
                        animation:
                          popupPosition === "right"
                            ? "fadeInPopup 0.2s ease-out"
                            : "fadeInPopupReverse 0.2s ease-out",
                      }}
                      onMouseEnter={handleMouseEnterPopup}
                      onMouseLeave={handleMouseLeavePopup}
                    >
                      <div className="grid grid-cols-2 gap-3 p-4">
                        {/* Ảnh mẫu */}
                        <div className="col-span-2">
                          <img
                            src={img}
                            alt={label}
                            className="w-full h-48 object-cover rounded"
                          />
                        </div>

                        {/* Ảnh cận chất liệu */}
                        <div className="col-span-1">
                          <div className="text-xs font-medium text-gray-700 mb-1">
                            Chất liệu
                          </div>
                          <img
                            src={img}
                            alt="Material texture"
                            className="w-full h-24 object-cover rounded border border-gray-200"
                          />
                        </div>

                        {/* Mô tả chất liệu */}
                        <div className="col-span-1">
                          <div className="text-xs font-medium text-gray-700 mb-1">
                            Mô tả
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Da PU cao cấp, mềm mại, chống thấm nước tốt
                          </p>
                        </div>
                      </div>

                      {/* Nút xem thêm */}
                      <div className="px-4 pb-4">
                        <a
                          href={href}
                          className="block w-full bg-black text-white text-center py-2 px-4 text-sm font-medium uppercase tracking-wide hover:bg-gray-900 transition-colors rounded"
                        >
                          Xem thêm
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex flex-col flex-grow">
                    <h3 className="text-sm font-medium text-gray-900 text-center group-hover:text-gray-600 transition-colors line-clamp-2">
                      {label}
                    </h3>
                    {x.price && (
                      <div className="mt-1 flex items-center justify-center gap-2">
                        {x.price.special?.value ? (
                          <>
                            <span className="text-base font-semibold text-red-600">
                              {x.price.special.text}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {x.price.regular.text}
                            </span>
                          </>
                        ) : (
                          <span className="text-base font-semibold text-gray-900">
                            {x.price.regular.text}
                          </span>
                        )}
                      </div>
                    )}

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
  query CategoryTilesData {
    categories(filters: [{ key: "status", operation: eq, value: "1" }]) {
      items {
        categoryId
        name
        url
        urlKey
        image { url alt }
      }
    }
  }
`;
