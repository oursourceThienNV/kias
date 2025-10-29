/**
 * Hero Slider Component - HAPAS Homepage
 * Matches hapas.vn design with featured collections
 *
 * SSR-ready with GraphQL data fetching
 */

import React, { useState, useEffect, useRef } from "react";
import "./HeroSlider.scss";

interface HeroSliderProps {
  categories?: any; // Reserved for future GraphQL integration
  autoplay?: boolean;
  interval?: number;
}

export default function HeroSlider({
  categories,
  autoplay = true,
  interval = 5000,
}: HeroSliderProps) {
  const [isPaused, setIsPaused] = useState(false);

  // Drag/Swipe state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragStartTime, setDragStartTime] = useState(0);

  // Configuration
  const cloneCount = 2; // Always clone 2 for consistency

  // Start from first real slide (after clones)
  const [currentSlide, setCurrentSlide] = useState(cloneCount);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Ref for slider container (for touch events with passive: false)
  const sliderRef = useRef<HTMLDivElement>(null);

  // Responsive: Detect screen size
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        // Reset to first slide on screen size change
        setCurrentSlide(cloneCount);
        setIsTransitioning(true);
      }
    };

    // Initial check
    checkMobile();

    // Debounce resize event
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [isMobile, cloneCount]);

  // Responsive slides per view
  const slidesPerView = isMobile ? 1 : 2; // 1 slide on mobile, 2 on desktop

  // Mock data for demo - Replace with real data from GraphQL
  const slides = [
    {
      id: 1,
      title: "ĐƯỢC YÊU THÍCH NHẤT",
      description: "Xem chi tiết",
      image:
        "https://kias.vn/wp-content/uploads/2025/07/To-voan-van-noi-3D-7.jpg",
      link: "/collections/best-sellers",
    },
    {
      id: 2,
      title: "BỘ SƯU TẬP MÙA XUÂN",
      description: "Khám phá ngay",
      image:
        "https://kias.vn/wp-content/uploads/2025/07/Ao-Tam-van-doc-it-nhan-Quan-Vai-Dui-Han-3.jpg",
      link: "/collections/spring",
    },
    {
      id: 3,
      title: "VÁY & ĐẦM THANH LỊCH",
      description: "Mua sắm ngay",
      image: "https://kias.vn/wp-content/uploads/2025/07/Vai-cheo-Han-6.jpg",
      link: "/collections/dresses",
    },
    {
      id: 4,
      title: "SET BỘ CÔNG SỞ",
      description: "Khám phá thêm",
      image:
        "https://kias.vn/wp-content/uploads/2023/01/Vai-Lua-Phap-cao-cap-2.jpg",
      link: "/collections/office-sets",
    },
    {
      id: 5,
      title: "HÀNG MỚI VỀ",
      description: "Xem bộ sưu tập",
      image: "https://kias.vn/wp-content/uploads/2025/07/CTS04610.jpg",
      link: "/collections/new-arrivals",
    },
    {
      id: 6,
      title: "PHỤ KIỆN THỜI TRANG",
      description: "Khám phá ngay",
      image: "https://kias.vn/wp-content/uploads/2025/07/CTS04663.jpg",
      link: "/collections/accessories",
    },
  ];

  // Create infinite loop by cloning slides
  // Clone last 2 slides to beginning, and first 2 slides to end
  const extendedSlides = [
    ...slides.slice(-cloneCount), // Last slides at beginning
    ...slides, // Original slides
    ...slides.slice(0, cloneCount), // First slides at end
  ];

  // Autoplay effect
  useEffect(() => {
    if (!autoplay || isPaused || isDragging || slides.length <= slidesPerView)
      return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, interval, isPaused, isDragging, slides.length, slidesPerView]);

  // Handle infinite loop - reset position when reaching clones
  useEffect(() => {
    if (!isTransitioning || isDragging) return;

    // If we're showing the end clones, jump to real start
    if (currentSlide >= cloneCount + slides.length) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(cloneCount);
      }, 550); // Wait for transition (500ms) to complete
      return () => clearTimeout(timer);
    }
    // If we're showing the beginning clones, jump to real end
    else if (currentSlide < cloneCount) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(cloneCount + slides.length - 1);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [
    currentSlide,
    cloneCount,
    slides.length,
    slidesPerView,
    isTransitioning,
    isDragging,
  ]);

  // Re-enable transition after jump
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const goToSlide = (slideIndex: number) => {
    setIsTransitioning(true);
    setCurrentSlide(cloneCount + slideIndex);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev - 1);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  // Drag/Swipe handlers with velocity tracking
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setIsTransitioning(false); // Disable transition during drag
    setStartX(clientX);
    setCurrentX(clientX);
    setDragStartTime(Date.now());
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    setCurrentX(clientX);
    const offset = clientX - startX;

    // Apply resistance at edges for better UX
    const resistance = 0.5;
    const adjustedOffset = offset * resistance;
    setDragOffset(adjustedOffset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const distance = currentX - startX;
    const duration = Date.now() - dragStartTime;
    const velocity = Math.abs(distance / duration); // pixels per ms

    // Lower threshold for fast swipes, higher for slow drags
    const threshold = velocity > 0.5 ? 30 : 80;

    if (Math.abs(distance) > threshold) {
      if (distance > 0) {
        // Dragged right -> previous slide
        prevSlide();
      } else {
        // Dragged left -> next slide
        nextSlide();
      }
    } else {
      // Snap back to current position
      setIsTransitioning(true);
    }

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

  // Attach native touch events with { passive: false } to allow preventDefault
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let touchStartX = 0;
    let touchCurrentX = 0;
    let touchStartTime = 0;
    let isTouchDragging = false;

    const handleTouchStartNative = (e: TouchEvent) => {
      isTouchDragging = true;
      touchStartX = e.touches[0].clientX;
      touchCurrentX = e.touches[0].clientX;
      touchStartTime = Date.now();
      setIsDragging(true);
      setIsTransitioning(false);
      setStartX(touchStartX);
      setCurrentX(touchCurrentX);
      setDragStartTime(touchStartTime);
    };

    const handleTouchMoveNative = (e: TouchEvent) => {
      if (!isTouchDragging) return;

      // Prevent scroll while dragging - works with passive: false
      e.preventDefault();

      touchCurrentX = e.touches[0].clientX;
      setCurrentX(touchCurrentX);

      const offset = touchCurrentX - touchStartX;
      const resistance = 0.5;
      const adjustedOffset = offset * resistance;
      setDragOffset(adjustedOffset);
    };

    const handleTouchEndNative = (e: TouchEvent) => {
      if (!isTouchDragging) return;

      e.preventDefault();
      isTouchDragging = false;
      setIsDragging(false);

      const distance = touchCurrentX - touchStartX;
      const duration = Date.now() - touchStartTime;
      const velocity = Math.abs(distance / duration);
      const threshold = velocity > 0.5 ? 30 : 80;

      if (Math.abs(distance) > threshold) {
        if (distance > 0) {
          setIsTransitioning(true);
          setCurrentSlide((prev) => prev - 1);
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 3000);
        } else {
          setIsTransitioning(true);
          setCurrentSlide((prev) => prev + 1);
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 3000);
        }
      } else {
        setIsTransitioning(true);
      }

      setDragOffset(0);
    };

    // Add event listeners with passive: false to allow preventDefault
    slider.addEventListener("touchstart", handleTouchStartNative, {
      passive: false,
    });
    slider.addEventListener("touchmove", handleTouchMoveNative, {
      passive: false,
    });
    slider.addEventListener("touchend", handleTouchEndNative, {
      passive: false,
    });

    return () => {
      slider.removeEventListener("touchstart", handleTouchStartNative);
      slider.removeEventListener("touchmove", handleTouchMoveNative);
      slider.removeEventListener("touchend", handleTouchEndNative);
    };
  }, []); // Empty deps - attach once on mount

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section className="hero-slider-responsive w-full overflow-hidden mt-8 md:mt-12 lg:mt-16">
      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 mb-6 md:mb-8">
        <nav className="flex flex-col items-center justify-center gap-1 md:gap-2">
          <h2
            id="category-tiles-title"
            className="text-[20px] md:text-[28px] lg:text-[36px] font-['Playfair_Display',serif] font-semibold tracking-normal uppercase text-[#79192A]"
          >
            BỘ SƯU TẬP MỚI
          </h2>
          <p className="font-['Playfair_Display',serif] text-[#79192A] normal-case tracking-normal font-normal text-[14px] sm:text-[15px] md:text-[18px]">
            Dành riêng cho bạn
          </p>
        </nav>
      </div>

      {/* Carousel Container - Responsive */}
      <div className="relative w-full max-w-full">
        {/* Slides Wrapper */}
        <div
          ref={sliderRef}
          className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none w-full"
          style={{
            touchAction: "none", // Prevent all touch gestures, handle manually
            margin: "0",
            padding: "0",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="flex gap-0 ease-out"
            style={{
              transform: `translateX(calc(-${
                currentSlide * (isMobile ? 100 : 50)
              }% + ${dragOffset}px))`,
              transition:
                isDragging || !isTransitioning
                  ? "none"
                  : "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
              willChange: "transform",
            }}
          >
            {extendedSlides.map((slide, index) => (
              <div
                key={`slide-${index}`}
                className={`flex-shrink-0 ${isMobile ? "w-full" : "w-1/2"}`}
                style={{
                  height: isMobile ? "min(80vh, 650px)" : "min(90vh, 800px)",
                  minHeight: isMobile ? "450px" : "550px",
                  maxHeight: isMobile ? "650px" : "800px",
                }}
              >
                <a
                  href={slide.link}
                  className="group relative block overflow-hidden h-full"
                  aria-label={slide.title}
                  onClick={(e) => {
                    // Prevent navigation if user dragged more than 10px
                    if (Math.abs(currentX - startX) > 10) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                    draggable={false}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute left-4 right-4 sm:left-6 sm:right-6 md:left-8 md:right-8 lg:left-10 lg:right-10 bottom-6 sm:bottom-8 md:bottom-10 lg:bottom-12 text-white select-none">
                    <h3 className="text-[18px] sm:text-[22px] md:text-[26px] lg:text-[32px] font-[Montserrat] font-bold uppercase tracking-wide text-white leading-tight mb-2 sm:mb-3">
                      {slide.title}
                    </h3>
                    <span className="inline-flex items-center gap-2 text-xs sm:text-sm md:text-base font-medium opacity-95 group-hover:opacity-100 transition-opacity">
                      {slide.description}
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 items-center justify-center bg-white/95 hover:bg-white text-black rounded-full w-10 h-10 lg:w-12 lg:h-12 shadow-xl transition-all hover:scale-110 active:scale-95 backdrop-blur-sm"
              aria-label="Previous slide"
            >
              <svg
                className="w-5 h-5 lg:w-6 lg:h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 items-center justify-center bg-white/95 hover:bg-white text-black rounded-full w-10 h-10 lg:w-12 lg:h-12 shadow-xl transition-all hover:scale-110 active:scale-95 backdrop-blur-sm"
              aria-label="Next slide"
            >
              <svg
                className="w-5 h-5 lg:w-6 lg:h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicator - One dot per position */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full">
            {slides.map((_, slideIndex) => {
              // Calculate which dot should be active based on current position
              const adjustedCurrent =
                (currentSlide - cloneCount + slides.length) % slides.length;
              const isActive = slideIndex === adjustedCurrent;

              return (
                <button
                  key={slideIndex}
                  onClick={() => goToSlide(slideIndex)}
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-8 h-2 bg-white"
                      : "w-2 h-2 bg-white/60 hover:bg-white/80"
                  }`}
                  aria-label={`Go to position ${slideIndex + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// EverShop SSR layout configuration
export const layout = {
  areaId: "content",
  sortOrder: 3,
};

// GraphQL query for fetching hero data from categories
export const query = `
  query HeroSliderData {
    categories(filters: [{ key: "status", operation: eq, value: "1" }]) {
      items {
        categoryId
        name
        url
        image {
          url
          alt
        }
        description
      }
    }
  }
`;
