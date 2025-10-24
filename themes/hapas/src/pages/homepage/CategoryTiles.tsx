import React, { useState, useRef, useEffect } from "react";

type Category = {
  categoryId: number;
  name: string;
  url: string;
  urlKey: string;
  image?: { url: string; alt?: string | null } | null;
  imageSmall?: { url: string; alt?: string | null } | null;
};

type CategoriesData = {
  items: Category[];
};

interface Props {
  title?: string;
  categories?: CategoriesData;
  viewAllHref?: string;
  iconMap?: Record<string, string>;
  iconBasePath?: string;
  iconHeight?: number;
}

const TILES_PER_VIEW = 4.5;
const tileWidth = `${100 / TILES_PER_VIEW}%`;

export default function CategoryTiles({
  title = "DÁNG TÚI BẠN CẦN",
  categories,
  viewAllHref = "/collections/all-bag-styles",
  iconMap = {},
  iconBasePath = "",
  iconHeight = 80,
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
      imageSmall: {
        url: "https://file.hstatic.net/200000978078/file/24x32__1_.png",
      },
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
      imageSmall: {
        url: "https://file.hstatic.net/200000978078/file/hobo_tron-pro.png",
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
      imageSmall: {
        url: "https://file.hstatic.net/200000978078/file/tui_tote-pro.png",
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
      imageSmall: {
        url: "https://file.hstatic.net/200000978078/file/tui_baguette-pro.png",
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
      imageSmall: {
        url: "https://file.hstatic.net/200000978078/file/_nh__2_.png",
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
      imageSmall: {
        url: "https://file.hstatic.net/200000978078/file/_nh__2_.png",
      },
    },
  ];

  const tiles = mockCategories;
  if (!tiles.length) return null;

  const scrollRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef(0);
  const dragStartRatioRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [smoothRatio, setSmoothRatio] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const totalDots = Math.ceil(tiles.length / TILES_PER_VIEW);

  const scrollToPosition = (ratio: number) => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      const maxScrollLeft = scrollWidth - clientWidth;
      const newScrollLeft = maxScrollLeft * Math.max(0, Math.min(1, ratio));
      scrollRef.current.scrollLeft = newScrollLeft;
      setScrollRatio(ratio);

      const newIndex = Math.round(
        (newScrollLeft / maxScrollLeft) * (totalDots - 1)
      );
      setActiveIndex(Math.max(0, Math.min(totalDots - 1, newIndex)));
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    isDraggingRef.current = true;
    dragStartRef.current = event.clientX;
    dragStartRatioRef.current = scrollRatio;

    setIsDragging(true);
    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    event.stopPropagation();

    isDraggingRef.current = true;
    dragStartRef.current = event.touches[0].clientX;
    dragStartRatioRef.current = scrollRatio;

    setIsDragging(true);
    document.addEventListener("touchmove", handleGlobalTouchMove as any);
    document.addEventListener("touchend", handleGlobalTouchEnd);
  };

  const handleGlobalMouseMove = (event: MouseEvent) => {
    if (!isDraggingRef.current || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const sliderWidth = rect.width;
    const deltaX = event.clientX - dragStartRef.current;
    const dragRatio = deltaX / sliderWidth;

    const newRatio = Math.max(
      0,
      Math.min(1, dragStartRatioRef.current + dragRatio)
    );

    scrollToPosition(newRatio);
  };

  const handleGlobalTouchMove = (event: TouchEvent) => {
    if (!isDraggingRef.current || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const sliderWidth = rect.width;
    const deltaX = event.touches[0].clientX - dragStartRef.current;
    const dragRatio = deltaX / sliderWidth;

    const newRatio = Math.max(
      0,
      Math.min(1, dragStartRatioRef.current + dragRatio)
    );

    scrollToPosition(newRatio);
  };

  const handleGlobalMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    document.removeEventListener("mousemove", handleGlobalMouseMove);
    document.removeEventListener("mouseup", handleGlobalMouseUp);
  };

  const handleGlobalTouchEnd = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    document.removeEventListener("touchmove", handleGlobalTouchMove as any);
    document.removeEventListener("touchend", handleGlobalTouchEnd);
  };

  const handleHandleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  // 🧠 Mượt hóa nút bằng nội suy
  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      setSmoothRatio((prev) => {
        const diff = scrollRatio - prev;
        const step = diff * 0.2; // tốc độ mượt (0.1 → chậm, 0.3 → nhanh)
        const next = Math.abs(diff) < 0.001 ? scrollRatio : prev + step;
        return next;
      });
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [scrollRatio]);

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchmove", handleGlobalTouchMove as any);
      document.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, []);

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

      {/* Hàng ảnh */}
      <div ref={scrollRef} className="flex overflow-x-hidden gap-1">
        {tiles.map((x) => {
          const label = x.name;
          const href = x.url;
          const img = x.image?.url || "/placeholder-category.jpg";
          const iconSrc =
            iconMap[x.urlKey] ||
            (iconBasePath ? `${iconBasePath}${x.urlKey}.png` : undefined);

          return (
            <div
              className="group flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/5"
              style={{ width: tileWidth }}
              key={x.categoryId ?? x.url ?? x.urlKey}
            >
              <a
                href={href}
                className="relative block overflow-hidden"
                style={{ aspectRatio: "5 / 6.5" } as React.CSSProperties}
                aria-label={label}
              >
                <img
                  src={img}
                  alt={x.image?.alt || label}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </a>
              <div className="mt-3 text-sm text-gray-700 mb-8">{label}</div>
              {iconSrc && (
                <div className="mt-4 ">
                  <img
                    src={iconSrc}
                    style={{ width: "auto", height: iconHeight }}
                    alt={`${label} icon`}
                    className="h-12 w-auto select-none"
                    loading="lazy"
                  />
                </div>
              )}
              {x.imageSmall && (
                <div className="mt-3">
                  <img
                    src={x.imageSmall.url}
                    alt={x.imageSmall.alt || x.name}
                    className="h-20 w-auto object-contain select-none"
                    style={{
                      mixBlendMode: "multiply",
                      backgroundColor: "transparent",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Thanh trượt */}
      {totalDots > 1 && (
        <div className="flex justify-center mt-8 relative z-10">
          <div
            ref={sliderRef}
            className="relative w-[50vw] h-4 bg-transparent select-none"
            style={{ zIndex: 20 }}
          >
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2" />

            <div
              className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-600 rounded-full cursor-grab transition-all duration-200 ease-out hover:bg-gray-800 hover:scale-110 shadow-md"
              onClick={handleHandleClick}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              style={{
                left: `${smoothRatio * 100}%`,
                marginLeft: "-6px",
                zIndex: 30,
                transform: isDragging
                  ? "translateY(-50%) scale(1.2)"
                  : "translateY(-50%)",
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export const layout = { areaId: "content", sortOrder: 20 };

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
