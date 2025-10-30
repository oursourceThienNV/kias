import React, { useState, useRef, useEffect } from "react";
import { Image } from "@components/common/Image";
import "./NewsGrid.scss";

interface CmsPage {
  cmsPageId: number;
  name: string;
  url: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  image: {
    url: string;
    alt: string;
  };
  createdAt: string;
}

interface NewsGridProps {
  title?: string;
  cmsPages?: {
    items: CmsPage[];
  };
}

export default function NewsGrid({
  title = "Our blogs",
  cmsPages,
}: NewsGridProps) {
  // 🌟 Mock data
  const mockArticles: CmsPage[] = [
    {
      cmsPageId: 1,
      name: "Tin tức 1",
      url: "/news/1",
      content: "",
      metaTitle: "",
      metaDescription: "GỬI LỜI YÊU QUA THIỆP ĐIỆN TỬ CỦA HAPAS",
      image: {
        url: "https://cdn.hstatic.net/files/200000978078/article/untitled_design__1__33ada0c3e79742cba121a23edc3b5ee7_large.png",
        alt: "News 1",
      },
      createdAt: "2025-10-17T10:00:00Z",
    },
    {
      cmsPageId: 2,
      name: "Tin tức 2",
      url: "/news/2",
      content: "",
      metaTitle: "",
      metaDescription: "YÊU LÀ CHIỀU - HAPAS & HAIDILAO",
      image: {
        url: "https://cdn.hstatic.net/files/200000978078/article/_mg_0872_cf71952ddd284ee590174bd617aa5f11_large.jpg",
        alt: "News 2",
      },
      createdAt: "2025-10-20T10:00:00Z",
    },
    {
      cmsPageId: 3,
      name: "Tin tức 3",
      url: "/news/3",
      content: "",
      metaTitle: "",
      metaDescription:
        "HAPAS ĐỔ BỘOOH - THÔNG ĐIỆP THÚ VỊ LAN TOẢ TỪ BẮC VÔ NAM",
      image: {
        url: "https://cdn.hstatic.net/files/200000978078/article/hp102728__1__caa81d2693dc409ebde82192342dd671_large.jpg",
        alt: "News 3",
      },
      createdAt: "2025-10-19T10:00:00Z",
    },
    {
      cmsPageId: 4,
      name: "Tin tức 4",
      url: "/news/4",
      content: "",
      metaTitle: "",
      metaDescription: "THÁNG 10 NÀY, BẠN CÓ HẸN TẠI CỬA HÀNG HAPAS",
      image: {
        url: "https://cdn.hstatic.net/files/200000978078/article/_mg_0058_2b21db6db7d2411da1cb3d1014e1316c_large.jpg",
        alt: "News 4",
      },
      createdAt: "2025-10-18T10:00:00Z",
    },
    {
      cmsPageId: 5,
      name: "Tin tức 5",
      url: "/news/5",
      content: "",
      metaTitle: "",
      metaDescription:
        "YÊU TỪ ĐIỀU NHỎ NHẤT 2025: HAPAS x VŨ CÁT TƯỜNG - BÍ ĐỎ",
      image: {
        url: "https://cdn.hstatic.net/files/200000978078/article/untitled_design__1__0fee7b2ec98241ed8186e6462a821fb9_large.png",
        alt: "News 5",
      },
      createdAt: "2025-10-17T10:00:00Z",
    },
    {
      cmsPageId: 6,
      name: "Tin tức 6",
      url: "/news/6",
      content: "",
      metaTitle: "",
      metaDescription: "HAPAS x VŨ CÁT TƯỜNG - BÍ ĐỎ: FEEL LIGHT, LIVE MORE",
      image: {
        url: "https://cdn.hstatic.net/files/200000978078/article/82361__1__51593cf1dc7d42d0a17625011ff40766.jpg",
        alt: "News 6",
      },
      createdAt: "2025-10-16T10:00:00Z",
    },
  ];

  // const articles = cmsPages?.items || mockArticles;
  const articles = mockArticles;
  if (!articles.length) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("vi-VN", { month: "short" });
    return { day, month };
  };

  // Drag/Swipe state (from CategoryTiles pattern)
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

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

  // Drag/Swipe handlers (from CategoryTiles)
  const handleDragStart = (clientX: number) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
    setScrollLeft(scrollRef.current.scrollLeft);
    setDragStartTime(Date.now());
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || !scrollRef.current) return;
    setCurrentX(clientX);
    const offset = startX - clientX;
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
      e.preventDefault();
      touchCurrentX = e.touches[0].clientX;
      setCurrentX(touchCurrentX);
      const offset = touchStartX - touchCurrentX;
      scrollElement.scrollLeft = touchScrollLeft + offset;
    };

    const handleTouchEndNative = (e: TouchEvent) => {
      if (!isTouchDragging) return;
      e.preventDefault();
      isTouchDragging = false;
      setIsDragging(false);
      setDragOffset(0);
    };

    scrollElement.addEventListener("touchstart", handleTouchStartNative, {
      passive: false,
    });
    scrollElement.addEventListener("touchmove", handleTouchMoveNative, {
      passive: false,
    });
    scrollElement.addEventListener("touchend", handleTouchEndNative, {
      passive: false,
    });
    scrollElement.addEventListener("scroll", updateArrowVisibility);
    updateArrowVisibility();

    return () => {
      scrollElement.removeEventListener("touchstart", handleTouchStartNative);
      scrollElement.removeEventListener("touchmove", handleTouchMoveNative);
      scrollElement.removeEventListener("touchend", handleTouchEndNative);
      scrollElement.removeEventListener("scroll", updateArrowVisibility);
    };
  }, []);

  return (
    <section
      className="hapas-news-grid"
      aria-labelledby="news-grid-title"
      style={{ marginTop: 50, marginBottom: 50 }}
    >
      <div className="container">
        <div className="mb-6 md:mb-8">
          <h2
            id="news-grid-title"
            className="text-[20px] md:text-[28px] lg:text-[36px] font-[Montserrat] font-semibold tracking-wide uppercase text-[#79192A]"
          >
            {title}
          </h2>
          <a
            href="/news"
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
            className="flex items-stretch overflow-x-scroll gap-4 scrollbar-hide cursor-grab active:cursor-grabbing select-none px-1"
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
            {articles.map((page) => {
              const dateInfo = formatDate(page.createdAt);

              return (
                <article
                  key={page.cmsPageId}
                  className="flex-shrink-0 group w-[calc(100vw-2rem)] sm:w-[calc((100%-1rem)/2)] md:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-2rem)/3)] flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <a
                    href={page.url}
                    className="flex flex-col h-full"
                    onClick={(e) => {
                      // Prevent navigation if dragged
                      if (Math.abs(currentX - startX) > 10) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  >
                    <div
                      className="relative overflow-hidden w-full rounded-t-lg"
                      style={{ aspectRatio: "16/10" }}
                    >
                      <Image
                        src={page.image?.url || "/placeholder-news.jpg"}
                        alt={page.image?.alt || page.name}
                        width={550}
                        height={350}
                        objectFit="cover"
                        className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Date badge */}
                      <div className="absolute top-4 left-4 bg-[#79192A] text-white rounded-full w-16 h-16 flex flex-col items-center justify-center z-10 shadow-lg">
                        <div className="text-xl font-bold leading-none">
                          {dateInfo.day}
                        </div>
                        <div className="text-xs uppercase leading-none mt-1">
                          {dateInfo.month}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-4">
                        {page.metaDescription || page.name}
                      </h3>

                      {/* Button Xem thêm */}
                      <button
                        className="mt-auto w-full border-2 border-black text-black py-3 px-4 font-medium text-sm uppercase tracking-wide hover:bg-black hover:text-white transition-colors duration-200 rounded"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.location.href = page.url;
                        }}
                      >
                        Xem thêm
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

export const layout = { areaId: "content", sortOrder: 50 };

export const query = `
  query NewsArticles {
    cmsPages(
      filters: [
        { key: "status", operation: eq, value: "1" }
      ],
      limit: 6
    ) {
      items {
        cmsPageId
        name
        url
        content
        metaTitle
        metaDescription
        image {
          url
          alt
        }
        createdAt
        updatedAt
      }
    }
  }
`;
