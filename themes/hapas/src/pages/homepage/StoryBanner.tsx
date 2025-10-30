/**
 * Story Banner Component - HAPAS Homepage
 * "THE MAKING OF A BAG" content section + Bestseller (1 product from API)
 */

import React, { useEffect, useMemo, useState } from "react";
import "./StoryBanner.scss";

interface MoneyText {
  value: number;
  text: string;
}

interface ProductPrice {
  regular?: MoneyText | null;
  special?: MoneyText | null;
}

interface ProductImage {
  url: string;
  alt?: string | null;
}

interface ProductItem {
  productId: number;
  name: string;
  url: string;
  urlKey: string;
  price?: ProductPrice | null;
  image?: ProductImage | null;
}

interface ProductsData {
  items: ProductItem[];
}

interface StoryBannerProps {
  title?: string;
  content?: string;
  /** Background media (video preferred) */
  videoSrc?: string;
  poster?: string;
  cta?: {
    text: string;
    url: string;
  };
  /** Layout cho copy vs media (giữ API nếu sau này cần ảnh tĩnh thay video) */
  layout?: "image_left" | "image_right";

  /** Dữ liệu sản phẩm bán chạy (query dưới cùng trả về 1 bản ghi) */
  BestsellersData?:
    | {
        products: ProductsData;
      }
    | {
        items: ProductItem[]; // phòng trường hợp layer ngoài đã unwrap
      }
    | null;

  /** Bật công tắc mock và nút chuyển dữ liệu (mặc định: tắt để không ảnh hưởng production) */
  enableMockSwitch?: boolean;
}

export default function StoryBanner({
  title = "THE MAKING OF A BAG",
  content,
  videoSrc = "https://file.hstatic.net/200000978078/file/hapas_8__2_.mp4",
  poster = "/assets/images/hero-poster.jpg",
  cta = { text: "Xem chi tiết", url: "/pages/the-making-of-a-bag" },
  layout = "image_left",
  BestsellersData,
  enableMockSwitch = true,
}: StoryBannerProps) {
  // Nhiều bộ mock để demo và có thể chuyển qua lại khi bật enableMockSwitch
  const mockDatasets = useMemo(
    () =>
      [
        {
          title: "THE MAKING OF A BAG",
          content:
            "Quy trình chế tác tỉ mỉ từ khâu chọn chất liệu đến hoàn thiện, mỗi chi tiết đều thể hiện sự cầu toàn.",
          videoSrc:
            "https://file.hstatic.net/200000978078/file/hapas_8__2_.mp4",
          poster: "/assets/images/hero-poster.jpg",
          cta: {
            text: "Khám phá quy trình",
            url: "/pages/the-making-of-a-bag",
          },
          BestsellersData: {
            items: [
              {
                productId: 1001,
                name: "Bubbly Crossbody",
                url: "/products/bubbly",
                urlKey: "bubbly",
                price: {
                  regular: { value: 1290000, text: "1.290.000₫" },
                  special: { value: 990000, text: "990.000₫" },
                },
                image: {
                  url: "https://file.hstatic.net/200000978078/file/img_8059_ddbccef8d7da49538562a1b9fcb28313.jpg",
                  alt: "Bubbly Crossbody",
                },
              },
            ],
          },
        },
        {
          title: "CRAFTED WITH CARE",
          content:
            "Thiết kế hướng tới trải nghiệm sử dụng – nhẹ, bền, tiện – phù hợp nhịp sống hiện đại.",
          videoSrc:
            "https://file.hstatic.net/200000978078/file/hapas_8__2_.mp4",
          poster: "/assets/images/hero-poster-2.jpg",
          cta: { text: "Xem bộ sưu tập", url: "/collections/new-arrivals" },
          BestsellersData: {
            items: [
              {
                productId: 1002,
                name: "Flex Mini Tote",
                url: "/products/flex-mini-tote",
                urlKey: "flex-mini-tote",
                price: {
                  regular: { value: 1590000, text: "1.590.000₫" },
                  special: null,
                },
                image: {
                  url: "https://file.hstatic.net/200000978078/file/_nh.png",
                  alt: "Flex Mini Tote",
                },
              },
            ],
          },
        },
        {
          title: "SIMPLICITY IS THE ULTIMATE SOPHISTICATION",
          content:
            "Tinh gọn trong thiết kế, tối đa công năng – triết lý tạo nên bản sắc HAPAS.",
          videoSrc:
            "https://file.hstatic.net/200000978078/file/hapas_8__2_.mp4",
          poster: "/assets/images/hero-poster-3.jpg",
          cta: { text: "Tìm hiểu thêm", url: "/pages/our-philosophy" },
          BestsellersData: {
            items: [
              {
                productId: 1003,
                name: "Everyday Backpack",
                url: "/products/everyday-backpack",
                urlKey: "everyday-backpack",
                price: {
                  regular: { value: 1890000, text: "1.890.000₫" },
                  special: { value: 1690000, text: "1.690.000₫" },
                },
                image: {
                  url: "https://file.hstatic.net/200000978078/file/_nh__3_.png",
                  alt: "Everyday Backpack",
                },
              },
            ],
          },
        },
      ].map((d) => ({ ...d })),
    []
  );

  const [activeMockIndex, setActiveMockIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const activeMock = enableMockSwitch
    ? mockDatasets[activeMockIndex]
    : undefined;

  // Auto-slide when mock switch is enabled
  useEffect(() => {
    if (!enableMockSwitch) return;
    const id = setInterval(() => {
      setIsTransitioning(true);
      setActiveMockIndex((prev) => (prev + 1) % mockDatasets.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }, 6000);
    return () => clearInterval(id);
  }, [enableMockSwitch, mockDatasets.length]);

  const handleNext = () => {
    if (!enableMockSwitch || isTransitioning) return;
    setIsTransitioning(true);
    setActiveMockIndex((prev) => (prev + 1) % mockDatasets.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handlePrev = () => {
    if (!enableMockSwitch || isTransitioning) return;
    setIsTransitioning(true);
    setActiveMockIndex(
      (prev) => (prev - 1 + mockDatasets.length) % mockDatasets.length
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Copy mặc định nếu không truyền
  const defaultContent =
    "Mỗi sản phẩm được tạo ra không đơn thuần chỉ là một món đồ – mà là kết tinh của sự tỉ mỉ trong từng đường kim mũi chỉ, là kết quả của hàng giờ nghiên cứu, thử nghiệm và hoàn thiện. Từ khâu chọn chất liệu, phối màu đến thiết kế chi tiết nhỏ nhất, tất cả đều được thực hiện với tinh thần cầu toàn và niềm đam mê. Chúng tôi tin rằng, chỉ khi thực sự đặt trọn tâm huyết vào từng sản phẩm, mới có thể mang đến trải nghiệm xứng đáng tới bạn.";

  // Chuẩn hoá cách lấy 1 sản phẩm đầu tiên
  const effectiveBestsellers = enableMockSwitch
    ? (activeMock?.BestsellersData as any)
    : (BestsellersData as any);
  const items =
    effectiveBestsellers?.products?.items ?? effectiveBestsellers?.items ?? [];
  const product: ProductItem | undefined = items?.[0];

  const effectiveTitle = activeMock?.title ?? title;
  const effectiveContent = activeMock?.content ?? content ?? defaultContent;
  const effectiveVideoSrc = activeMock?.videoSrc ?? videoSrc;
  const effectivePoster = activeMock?.poster ?? poster;
  const effectiveCta = activeMock?.cta ?? cta;

  const productHref = product?.url || "/products/bubbly";
  const productImg =
    product?.image?.url ||
    "https://file.hstatic.net/200000978078/file/img_8059_ddbccef8d7da49538562a1b9fcb28313.jpg";
  const productAlt = product?.image?.alt || product?.name || "Bestseller";

  return (
    <section
      className="relative w-full h-screen story-banner story-banner-responsive"
      style={{ marginTop: 50 }}
      data-layout={layout}
    >
      {/* BG video - với transition fade */}
      <video
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
        src={effectiveVideoSrc}
        poster={effectivePoster}
        autoPlay
        muted
        loop
        playsInline
        key={enableMockSwitch ? activeMockIndex : "single"}
      />

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Left copy - với transition fade */}
      <div
        className={`absolute left-5 md:left-10 bottom-6 md:bottom-10 max-w-xl text-white transition-opacity duration-500 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
        key={enableMockSwitch ? `copy-${activeMockIndex}` : "copy-single"}
      >
        <h3
          className="text-[20px] md:text-[28px] font-[Montserrat] font-semibold uppercase tracking-wide"
          style={{ color: "#f5f5f5" }}
        >
          {effectiveTitle}
        </h3>

        <p className="mt-3 text-sm md:text-[15px] leading-6 opacity-90">
          {effectiveContent}
        </p>
        {effectiveCta?.url && effectiveCta?.text && (
          <a
            href={effectiveCta.url}
            className="mt-4 inline-flex items-center gap-2 text-sm md:text-[15px]"
          >
            {effectiveCta.text}
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
        )}
      </div>

      {/* Bestseller card (right-bottom) — chỉ render khi có product hoặc fallback - với transition fade */}
      <div
        className={`absolute right-5 md:right-10 bottom-6 md:bottom-10 transition-opacity duration-500 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
        key={enableMockSwitch ? `product-${activeMockIndex}` : "product-single"}
      >
        <div className="mb-2 flex items-left justify-end gap-2 text-white text-xs md:text-sm opacity-90">
          <span>Sản phẩm bán chạy</span>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M5 12h14M13 5l7 7-7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <a
          href={productHref}
          className="block w-[210px] h-[260px] bg-white rounded-xl overflow-hidden shadow-lg"
          aria-label="Sản phẩm bán chạy"
        >
          <img
            src={productImg}
            alt={productAlt}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </a>
      </div>

      {/* Nút điều hướng mũi tên (chỉ hiện khi bật công tắc) */}
      {enableMockSwitch && (
        <>
          {/* Nút Previous */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-black w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            aria-label="Slide trước"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="md:w-6 md:h-6"
            >
              <path
                d="M15 18l-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Nút Next */}
          <button
            type="button"
            onClick={handleNext}
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-black w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            aria-label="Slide sau"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="md:w-6 md:h-6"
            >
              <path
                d="M9 18l6-6-6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Indicator dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {mockDatasets.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  if (!isTransitioning && index !== activeMockIndex) {
                    setIsTransitioning(true);
                    setActiveMockIndex(index);
                    setTimeout(() => setIsTransitioning(false), 500);
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeMockIndex
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Chuyển tới slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

/** Gắn vào Page Builder nếu cần */
// export const layout = { areaId: 'content', sortOrder: 40 };

/**
 * ✅ Query: lấy đúng 1 bản ghi (limit: 1)
 * - Giữ filter status=1 như bạn đưa
 * - Kết quả: BestsellersData.products.items[0]
 */
export const query = `
  query BestsellersData {
    products(
      filters: [
        { key: "status", operation: eq, value: "1" }
      ],
      limit: 1
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

export const layout = {
  areaId: "content",
  sortOrder: 40,
};
