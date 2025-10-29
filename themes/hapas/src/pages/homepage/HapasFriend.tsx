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
  title = "BẠN THÂN KIAS",
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

  // State to track which images are large (random every 5s)
  const [largeImageIds, setLargeImageIds] = useState<Set<number>>(
    new Set([1, 4])
  ); // Initially 2 large images
  const [pendingLargeImageIds, setPendingLargeImageIds] = useState<Set<number>>(
    new Set([1, 4])
  ); // Pending changes waiting for images to leave viewport
  const [visibleImageIds, setVisibleImageIds] = useState<Set<number>>(
    new Set()
  ); // Track visible images
  const numLargeImages = 2; // Number of large images to show
  const imageRefs = useRef<Map<number, HTMLElement>>(new Map()); // Track image elements

  // Create infinite loop by duplicating friends array
  const infiniteFriends = [...mockFriends, ...mockFriends, ...mockFriends];
  if (!mockFriends.length) return null;

  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const isResettingRef = useRef(false); // Prevent multiple simultaneous resets

  const [imageOffsets, setImageOffsets] = useState<Record<number, number>>({});
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const autoOffsetRef = useRef<NodeJS.Timeout | null>(null);

  // Intersection Observer to track visible images
  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    // Delay to ensure refs are populated
    const timeoutId = setTimeout(() => {
      if (imageRefs.current.size === 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const imageId = parseInt(
              entry.target.getAttribute("data-image-id") || "0"
            );

            setVisibleImageIds((prev) => {
              const newSet = new Set(prev);
              if (entry.isIntersecting) {
                newSet.add(imageId);
              } else {
                newSet.delete(imageId);
              }
              return newSet;
            });
          });
        },
        {
          root: null, // Use viewport instead of scroll container
          threshold: 0.1, // 10% visible
          rootMargin: "0px",
        }
      );

      // Observe all image elements
      imageRefs.current.forEach((element) => {
        observer?.observe(element);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer?.disconnect();
    };
  }, [mockFriends.length]); // Re-run when friends list changes

  // Apply size changes only when images are out of viewport
  useEffect(() => {
    const checkInterval = setInterval(() => {
      setLargeImageIds((currentLarge) => {
        let hasChanges = false;
        const newLarge = new Set(currentLarge);

        // For each image that should change size
        pendingLargeImageIds.forEach((pendingId) => {
          // If it should be large but isn't, and it's NOT visible, make it large
          if (!currentLarge.has(pendingId) && !visibleImageIds.has(pendingId)) {
            newLarge.add(pendingId);
            hasChanges = true;
          }
        });

        // For images that should be small but are large, shrink only if NOT visible
        currentLarge.forEach((currentId) => {
          if (
            !pendingLargeImageIds.has(currentId) &&
            !visibleImageIds.has(currentId)
          ) {
            newLarge.delete(currentId);
            hasChanges = true;
          }
        });

        return hasChanges ? newLarge : currentLarge;
      });
    }, 100); // Check every 100ms

    return () => clearInterval(checkInterval);
  }, [pendingLargeImageIds, visibleImageIds]);

  // Random large images every 5 seconds
  useEffect(() => {
    const randomizeInterval = setInterval(() => {
      // Filter out images that are currently offsetting (animating up/down)
      const stableImages = mockFriends.filter(
        (friend) => !imageOffsets[friend.id] || imageOffsets[friend.id] === 0
      );

      // Shuffle and pick random images from stable images only
      const shuffled = [...stableImages].sort(() => 0.5 - Math.random());
      const selectedLarge = shuffled.slice(0, numLargeImages).map((f) => f.id);
      setPendingLargeImageIds(new Set(selectedLarge)); // Set pending instead of immediate

      // Reset offset for newly selected images to ensure they're at center
      const resetOffsets: Record<number, number> = {};
      selectedLarge.forEach((id) => {
        resetOffsets[id] = 0;
      });
      setImageOffsets((prev) => ({
        ...prev,
        ...resetOffsets,
      }));
    }, 5000);

    return () => clearInterval(randomizeInterval);
  }, [mockFriends.length, numLargeImages, imageOffsets]);

  // Auto scroll functionality with infinite loop
  const startAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);

    autoScrollRef.current = setInterval(() => {
      if (!scrollRef.current || isDraggingRef.current) return;

      const container = scrollRef.current;
      // Calculate itemWidth based on screen size
      const screenWidth = window.innerWidth;
      let itemWidth = 350; // Desktop default (average of 400 and 200)

      if (screenWidth <= 640) {
        // Mobile
        itemWidth = 180; // Average of 240 and 120
      } else if (screenWidth <= 768) {
        // Tablet
        itemWidth = 245; // Average of 280 and 140
      } else if (screenWidth <= 1024) {
        // Small laptop
        itemWidth = 280; // Average of 320 and 160
      }

      const scrollAmount = itemWidth;

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

  // Auto random offset for small images
  const startAutoOffset = () => {
    if (autoOffsetRef.current) clearInterval(autoOffsetRef.current);

    autoOffsetRef.current = setInterval(() => {
      // Get all small images from original set only (not in largeImageIds and not in pendingLargeImageIds)
      const smallImages = mockFriends.filter(
        (friend) =>
          !largeImageIds.has(friend.id) && !pendingLargeImageIds.has(friend.id)
      );

      if (smallImages.length === 0) return;

      // Randomly select 1-2 small images to offset
      const numToOffset = Math.floor(Math.random() * 2) + 1; // 1-2 images
      const shuffled = [...smallImages].sort(() => 0.5 - Math.random());
      const selectedImages = shuffled.slice(0, numToOffset);

      // Apply random offsets from center position
      const newOffsets: Record<number, number> = {};

      selectedImages.forEach((friend) => {
        // Always start from center (0) and move to random position
        const randomOffset =
          Math.random() > 0.5
            ? Math.random() * 25 + 8 // Move down 8-33px from center
            : -(Math.random() * 25 + 8); // Move up 8-33px from center

        newOffsets[friend.id] = randomOffset;
      });

      setImageOffsets((prev) => ({
        ...prev,
        ...newOffsets,
      }));

      // Reset offsets back to center after a delay
      setTimeout(() => {
        const resetOffsets: Record<number, number> = {};
        selectedImages.forEach((friend) => {
          resetOffsets[friend.id] = 0; // Reset to center position
        });

        setImageOffsets((prev) => ({
          ...prev,
          ...resetOffsets,
        }));
      }, 1500 + Math.random() * 2000); // Reset after 1.5-3.5 seconds
    }, 3000 + Math.random() * 2000); // Trigger every 3-5 seconds
  };

  const stopAutoOffset = () => {
    if (autoOffsetRef.current) {
      clearInterval(autoOffsetRef.current);
      autoOffsetRef.current = null;
    }
  };

  // Handle image click - random offset for small images only
  const handleImageClick = (friend: HapasFriend, e: React.MouseEvent) => {
    e.preventDefault();

    if (largeImageIds.has(friend.id)) {
      // Large images: no effect
      return;
    }

    // Small images: random offset from center position
    const randomOffset =
      Math.random() > 0.5
        ? Math.random() * 30 + 10 // Move down 10-40px from center
        : -(Math.random() * 30 + 10); // Move up 10-40px from center

    setImageOffsets((prev) => ({
      ...prev,
      [friend.id]: randomOffset,
    }));
  };

  // Handle image hover - reset to center
  const handleImageHover = (friend: HapasFriend) => {
    if (
      !largeImageIds.has(friend.id) &&
      imageOffsets[friend.id] !== undefined
    ) {
      setImageOffsets((prev) => ({
        ...prev,
        [friend.id]: 0, // Reset to center
      }));
    }
  };

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

    // Wait for layout to be ready, then set initial position
    const setInitialPosition = () => {
      const scrollWidth = container.scrollWidth;
      const totalItems = mockFriends.length;
      const itemWidth = scrollWidth / (totalItems * 3);
      container.scrollLeft = itemWidth * totalItems;
    };

    // Set initial position after a short delay to ensure layout is ready
    setTimeout(setInitialPosition, 100);

    // Add scroll listener for infinite loop
    container.addEventListener("scroll", throttledHandleScroll);

    // Start auto scroll
    if (isAutoScrolling) {
      startAutoScroll();
    }

    // Start auto offset for small images
    startAutoOffset();

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
      stopAutoOffset();
      clearInterval(safetyCheck);
    };
  }, [
    isAutoScrolling,
    mockFriends.length,
    largeImageIds,
    pendingLargeImageIds,
  ]);

  // Pause auto scroll on hover
  const handleCarouselMouseEnter = () => {
    stopAutoScroll();
    stopAutoOffset();
  };

  const handleCarouselMouseLeave = () => {
    if (isAutoScrolling) {
      startAutoScroll();
    }
    startAutoOffset();
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
            // Check if this image is large
            const isLarge = largeImageIds.has(friend.id);

            // Responsive dimensions
            const getLargeSize = () => {
              if (typeof window === "undefined")
                return { width: 400, height: 533 };
              const screenWidth = window.innerWidth;
              if (screenWidth <= 640) return { width: 240, height: 320 };
              if (screenWidth <= 768) return { width: 280, height: 373 };
              if (screenWidth <= 1024) return { width: 320, height: 427 };
              return { width: 400, height: 533 };
            };

            const getSmallSize = () => {
              if (typeof window === "undefined")
                return { width: 200, height: 300 };
              const screenWidth = window.innerWidth;
              if (screenWidth <= 640) return { width: 120, height: 180 };
              if (screenWidth <= 768) return { width: 140, height: 210 };
              if (screenWidth <= 1024) return { width: 160, height: 240 };
              return { width: 200, height: 300 };
            };

            const size = isLarge ? getLargeSize() : getSmallSize();

            return (
              <article
                key={`${friend.id}-${index}`}
                ref={(el) => {
                  if (el) {
                    imageRefs.current.set(friend.id, el);
                  } else {
                    imageRefs.current.delete(friend.id);
                  }
                }}
                data-image-id={friend.id}
                className={`flex-shrink-0 group cursor-pointer ${
                  isLarge ? "hapas-friend-large" : "hapas-friend-small"
                }`}
                style={{
                  width: `${size.width}px`,
                  transform: `translateY(${
                    imageOffsets[friend.id] || 0
                  }px) scale(${isLarge ? 1 : 1})`,
                  transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  alignSelf: !isLarge ? "center" : "flex-start",
                  opacity: 1,
                }}
              >
                <div
                  onClick={(e) => handleImageClick(friend, e)}
                  onMouseEnter={() => handleImageHover(friend)}
                  className="block relative"
                  aria-label={`View ${friend.name}`}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{
                      aspectRatio: isLarge ? "3/4" : "2/3",
                      width: "100%",
                      transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <Image
                      src={friend.image.url}
                      alt={friend.image.alt}
                      width={isLarge ? 400 : 200}
                      height={isLarge ? 533 : 300}
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      loading="lazy"
                      decoding="async"
                      objectFit="cover"
                      className={`${
                        isLarge
                          ? "group-hover:scale-105"
                          : "group-hover:scale-110"
                      }`}
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
