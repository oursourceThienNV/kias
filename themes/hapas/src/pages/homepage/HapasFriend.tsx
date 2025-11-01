import React, { useRef, useState, useEffect } from "react";
import { Image } from "@components/common/Image";
import "./HapasFriend.scss";

interface HapasFriend {
  id: number;
  name: string;
  image: {
    url: string;
    alt: string;
  };
  description?: string;
  quote?: string; // Lời trích dẫn của khách hàng
}

interface HapasFriendProps {
  title?: string;
  viewAllHref?: string;
}

export default function HapasFriend({
  title = "Feedback khách hàng",
  viewAllHref = "/kias-friends",
}: HapasFriendProps) {
  // Mock data - các hình ảnh bạn thân HAPAS
  const mockFriends: HapasFriend[] = [
    {
      id: 1,
      name: "xoài non",
      image: {
        url: "https://file.hstatic.net/200000978078/file/_hng1844__1_.jpg",
        alt: "KIAS Friend 1",
      },
      description: "Styling với túi Satchel",
      quote: "Chất lượng tuyệt vời, thiết kế sang trọng!",
    },
    {
      id: 2,
      name: "Hàn Hằng",
      image: {
        url: "https://file.hstatic.net/200000978078/file/denim1_402306f2df9245ec87416290f8b2dab6.png",
        alt: "KIAS Friend 2",
      },
      description: "Outfit casual với túi Hobo",
      quote: "Rất phù hợp với phong cách của mình",
    },
    {
      id: 3,
      name: "Châu Bùi",
      image: {
        url: "https://file.hstatic.net/200000978078/file/snapinsta.to_473530229_1152220669831166_5116063194426879013_n__1_.jpg",
        alt: "KIAS Friend 3",
      },
      description: "Look thanh lịch với túi Tote",
      quote: "Thiết kế tinh tế, chất liệu cao cấp",
    },
    {
      id: 4,
      name: "Trung Nguyễn",
      image: {
        url: "https://file.hstatic.net/200000978078/file/_dsc1379__1_.jpg",
        alt: "KIAS Friend 4",
      },
      description: "Phong cách trẻ trung với túi Crossbody",
      quote: "Đa năng và phong cách, tôi rất thích!",
    },
    {
      id: 5,
      name: "Phương Nguyễn",
      image: {
        url: "https://file.hstatic.net/200000978078/file/shra__1_.png",
        alt: "KIAS Friend 5",
      },
      description: "Backpack cho phong cách năng động",
      quote: "Túi đẹp và tiện dụng cho mọi hoạt động",
    },
    {
      id: 6,
      name: "Hà Huyền My",
      image: {
        url: "https://file.hstatic.net/200000978078/file/5_a325c0f87982487da5e3e88fec6bd164.jpg",
        alt: "KIAS Friend 6",
      },
      description: "Clutch cho buổi tối sang trọng",
      quote: "Hoàn hảo cho những buổi tiệc tối",
    },
    {
      id: 7,
      name: "Ngọc Lê",
      image: {
        url: "https://file.hstatic.net/200000978078/file/4_3e9f15e4e7ef45e789acb780dcdde820.jpg",
        alt: "KIAS Friend 7",
      },
      description: "Mix & match với nhiều phong cách",
      quote: "Mix được với nhiều outfit khác nhau",
    },
  ];

  // All images will use large size uniformly

  // Create infinite loop by duplicating friends array
  const infiniteFriends = [...mockFriends, ...mockFriends, ...mockFriends];
  if (!mockFriends.length) return null;

  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const isResettingRef = useRef(false); // Prevent multiple simultaneous resets

  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [itemWidth, setItemWidth] = useState<number | null>(null);
  

  // Removed: random large/small toggling and intersection-based size switching

  // Auto scroll functionality with infinite loop
  const startAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);

    autoScrollRef.current = setInterval(() => {
      if (!scrollRef.current || isDraggingRef.current) return;

      const container = scrollRef.current;
      // Use computed itemWidth, fallback to 300 if not ready
      const scrollAmount = itemWidth ?? 300;

      // Always scroll right
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }, 3000);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  // Removed: auto random vertical offset for small images

  // Removed: click and hover vertical offset handlers

  // Drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!scrollRef.current) return;

    stopAutoScroll();
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = scrollRef.current.scrollLeft;
    setIsDragging(true);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return;

    const deltaX = e.clientX - dragStartXRef.current;
    const newScrollLeft = dragStartScrollRef.current - deltaX;

    // Disable smooth scroll during drag for better performance
    scrollRef.current.style.scrollBehavior = "auto";

    // Allow scrolling beyond boundaries for infinite loop
    scrollRef.current.scrollLeft = newScrollLeft;
  };

  const handleMouseUp = () => {
    if (!scrollRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    // Re-enable smooth scroll after drag
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.style.scrollBehavior = "smooth";
      }
    });

    // Restart auto scroll after a delay
    setTimeout(() => {
      if (isAutoScrolling) {
        startAutoScroll();
      }
    }, 2000);
  };

  // Handle infinite scroll reset
  const handleScroll = () => {
    if (!scrollRef.current || isDraggingRef.current || isResettingRef.current)
      return;

    const container = scrollRef.current;
    const containerWidth = container.clientWidth;
    const scrollWidth = container.scrollWidth;
    const totalItems = mockFriends.length;

    // Calculate approximate item width based on container
    const itemWidth = scrollWidth / (totalItems * 3); // 3 sets of items
    const firstSetEnd = itemWidth * totalItems;
    const secondSetEnd = itemWidth * totalItems * 2;
    const thirdSetEnd = itemWidth * totalItems * 3;

    // Smaller buffer for more precise reset timing
    const forwardBuffer = itemWidth * 2; // 2 items before end
    const backwardBuffer = itemWidth * 1; // 1 item before start

    // If scrolled near the end of third set, reset to second set (smoother)
    if (container.scrollLeft >= thirdSetEnd - containerWidth - forwardBuffer) {
      isResettingRef.current = true;

      // Stop auto scroll temporarily
      const wasAutoScrolling = autoScrollRef.current !== null;
      if (wasAutoScrolling) {
        stopAutoScroll();
      }

      // Reset position instantly with no transition
      container.style.scrollBehavior = "auto";
      // Jump back one set
      container.scrollLeft = container.scrollLeft - firstSetEnd;

      // Force reset flag after timeout to prevent stuck state
      const resetTimeout = setTimeout(() => {
        isResettingRef.current = false;
        if (wasAutoScrolling && isAutoScrolling && !autoScrollRef.current) {
          startAutoScroll();
        }
      }, 500);

      // Re-enable smooth scrolling after multiple frames to ensure browser has rendered
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          container.style.scrollBehavior = "smooth";
          isResettingRef.current = false;
          clearTimeout(resetTimeout);

          if (wasAutoScrolling && isAutoScrolling) {
            // Longer delay to ensure smooth restart
            setTimeout(() => {
              if (!autoScrollRef.current) {
                startAutoScroll();
              }
            }, 200);
          }
        });
      });
    }
    // If scrolled before the first set, reset to second set
    else if (container.scrollLeft <= backwardBuffer) {
      isResettingRef.current = true;

      const wasAutoScrolling = autoScrollRef.current !== null;
      if (wasAutoScrolling) {
        stopAutoScroll();
      }

      container.style.scrollBehavior = "auto";
      // Jump forward one set
      container.scrollLeft = container.scrollLeft + firstSetEnd;

      // Force reset flag after timeout
      const resetTimeout = setTimeout(() => {
        isResettingRef.current = false;
        if (wasAutoScrolling && isAutoScrolling && !autoScrollRef.current) {
          startAutoScroll();
        }
      }, 500);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          container.style.scrollBehavior = "smooth";
          isResettingRef.current = false;
          clearTimeout(resetTimeout);

          if (wasAutoScrolling && isAutoScrolling) {
            setTimeout(() => {
              if (!autoScrollRef.current) {
                startAutoScroll();
              }
            }, 200);
          }
        });
      });
    }
  };

  // Handle scroll with throttling to prevent too many resets
  const throttledHandleScroll = (() => {
    let ticking = false;
    let lastScrollTime = 0;
    return () => {
      if (!ticking) {
        const now = Date.now();
        // Debounce - minimum 100ms between scroll checks
        if (now - lastScrollTime < 100) {
          return;
        }
        lastScrollTime = now;

        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
  })();

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Calculate item width so that exactly 5 items fit (account for gap)
    const calcItemWidth = () => {
      if (!scrollRef.current) return;
      const el = scrollRef.current;
      const styles = window.getComputedStyle(el);
      const gapRaw = (styles.getPropertyValue("column-gap") || styles.getPropertyValue("gap") || "16px").trim();
      // If gap returns like "16px 16px", take the first number
      const gapMatch = /([0-9]+\.?[0-9]*)/.exec(gapRaw);
      const gap = gapMatch ? parseFloat(gapMatch[1]) : 16;
      // Subtract horizontal paddings from available width
      const padLeft = parseFloat(styles.getPropertyValue("padding-left")) || 0;
      const padRight = parseFloat(styles.getPropertyValue("padding-right")) || 0;
      const visibleCount = 5;
      const totalGap = gap * (visibleCount - 1);
      const width = el.clientWidth - padLeft - padRight;
      if (width > 0) {
        const w = (width - totalGap) / visibleCount;
        setItemWidth(w);
      }
    };

    // Wait for layout to be ready, then set initial position
    const setInitialPosition = () => {
      const scrollWidth = container.scrollWidth;
      const totalItems = mockFriends.length;
      const itemWidth = scrollWidth / (totalItems * 3);
      container.scrollLeft = itemWidth * totalItems;
    };

    // Set initial position after a short delay to ensure layout is ready
    setTimeout(() => {
      calcItemWidth();
      setInitialPosition();
    }, 100);

    // Recalculate on resize
    const handleResize = () => {
      calcItemWidth();
    };
    window.addEventListener("resize", handleResize);

    // Add scroll listener for infinite loop
    container.addEventListener("scroll", throttledHandleScroll);

    // Start auto scroll
    if (isAutoScrolling) {
      startAutoScroll();
    }

    // Safety check: ensure auto scroll is running every 10 seconds
    const safetyCheck = setInterval(() => {
      if (
        isAutoScrolling &&
        !autoScrollRef.current &&
        !isDraggingRef.current &&
        !isResettingRef.current
      ) {
        console.log("Safety check: restarting auto scroll");
        startAutoScroll();
      }
    }, 10000);

    return () => {
      container.removeEventListener("scroll", throttledHandleScroll);
      stopAutoScroll();
      clearInterval(safetyCheck);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    isAutoScrolling,
    mockFriends.length,
  ]);

  // Pause auto scroll on hover
  const handleCarouselMouseEnter = () => {
    stopAutoScroll();
  };

  const handleCarouselMouseLeave = () => {
    if (isAutoScrolling) {
      startAutoScroll();
    }
  };

  return (
    <section
      className="hapas-friend-section"
      aria-labelledby="hapas-friend-title"
      style={{ marginTop: 50, marginBottom: 50 }}
    >
      <div className="container">
        <div className="mb-6 md:mb-8">
          <h2
            id="hapas-friend-title"
            className="text-[20px] md:text-[28px] lg:text-[36px] font-[Montserrat] font-semibold tracking-wide uppercase text-[#79192A]"
          >
            {title}
          </h2>
          <a
            href={viewAllHref}
            className="mt-2 inline-flex items-center gap-2 text-[15px] text-gray-700 hover:text-gray-900"
          >
            Xem tất cả
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

        {/* Carousel */}
        <div
          ref={scrollRef}
          className={`hapas-friend-carousel flex overflow-x-scroll overflow-y-hidden gap-4 ${
            isDragging ? "dragging" : ""
          }`}
          onMouseEnter={handleCarouselMouseEnter}
          onMouseLeave={handleCarouselMouseLeave}
          onMouseDown={handleMouseDown}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollBehavior: "smooth",
          }}
        >
          {infiniteFriends.map((friend, index) => {
            // Dynamic width so 5 items fit the viewport
            const widthPx = itemWidth ?? 300;

            return (
              <article
                key={`${friend.id}-${index}`}
                className={`flex-shrink-0 group cursor-pointer hapas-friend-large`}
                style={{
                  width: `${widthPx}px`,
                  flex: `0 0 ${widthPx}px`,
                  transform: `translateY(0px) scale(1)`,
                  transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  alignSelf: "flex-start",
                  opacity: 1,
                }}
              >
                <div
                  className="block relative"
                  aria-label={`View ${friend.name}`}
                >
                  <div
                    className="relative overflow-hidden rounded-[12px]"
                    style={{
                      aspectRatio: "3/4",
                      width: "100%",
                      transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <Image
                      src={friend.image.url}
                      alt={friend.image.alt}
                      width={widthPx}
                      height={Math.round(widthPx * (4 / 3))}
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      loading="lazy"
                      decoding="async"
                      objectFit="cover"
                      className={`group-hover:scale-105`}
                      style={{
                        transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>

                  {/* Quote and Name Row */}
                  <div
                    className="mt-3 flex items-start justify-between gap-3"
                    style={{
                      transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {/* Quote - Left side */}
                    {friend.quote && (
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs text-gray-600 italic line-clamp-2"
                          style={{
                            transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          "{friend.quote}"
                        </p>
                      </div>
                    )}

                    {/* Name - Right side */}
                    <div className="flex-shrink-0">
                      <p
                        className="text-sm font-medium text-gray-900 uppercase tracking-wide"
                        style={{
                          transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        {friend.name}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const layout = { areaId: "content", sortOrder: 60 };
