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

// Responsive tiles per view
const getResponsiveTilesPerView = () => {
  if (typeof window === "undefined") return 3.5;
  const screenWidth = window.innerWidth;
  if (screenWidth <= 640) return 1.5; // Mobile: 1.5 tiles
  if (screenWidth <= 768) return 2.5; // Tablet: 2.5 tiles
  if (screenWidth <= 1024) return 3; // Small laptop: 3 tiles
  return 3.5; // Desktop: 3.5 tiles
};

const TILES_PER_VIEW = 3.5;
const tileWidth = `${100 / TILES_PER_VIEW}%`;

export default function NewsGrid({
  title = "CÓ VÀI ĐIỀU VỪA CẬP NHẬT",
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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  // 🌀 Carousel logic
  const scrollRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

  const [scrollRatio, setScrollRatio] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const totalDots = Math.ceil(articles.length / TILES_PER_VIEW);

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

  return (
    <section className="hapas-news-grid" aria-labelledby="news-grid-title">
      <div className="container">
        <div className="news-grid-header">
          <h2
            id="news-grid-title"
            className="text-[20px] md:text-[28px] lg:text-[36px] font-[Montserrat] font-semibold tracking-wide uppercase"
          >
            {title}
          </h2>
          <a
            href="#"
            className="mt-2 text-[15px] text-gray-700 hover:text-gray-900 block"
          >
            Xem thêm
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="inline ml-1"
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
        <div ref={scrollRef} className="flex overflow-x-hidden gap-1">
          {articles.map((page) => (
            <article
              key={page.cmsPageId}
              className="flex-shrink-0"
              style={{ width: tileWidth }}
            >
              <a href={page.url} className="block relative">
                <div
                  className="news-card-image"
                  style={{ aspectRatio: " 11/ 7" }}
                >
                  <Image
                    src={page.image?.url || "/placeholder-news.jpg"}
                    alt={page.image?.alt || page.name}
                    width={480}
                    height={320}
                    objectFit="cover"
                  />
                </div>
                <div className="news-card-content mt-2">
                  <time
                    dateTime={page.createdAt}
                    className="block text-sm text-gray-500"
                  >
                    {formatDate(page.createdAt)}
                  </time>
                  <h3 className="text-base font-semibold mt-1">{page.name}</h3>
                </div>
              </a>
            </article>
          ))}
        </div>

        {/* Slider thumb */}
        {totalDots > 1 && (
          <div className="flex justify-center mt-4 relative">
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
