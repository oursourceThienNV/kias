import React, { useState, useRef, useEffect } from "react";
import { Image } from "@components/common/Image.js";

type Product = {
  productId: number;
  name: string;
  url: string;
  price: {
    regular: { value: number; text: string };
    special?: { value: number; text: string };
  };
  image?: { url: string; alt?: string | null } | null;
};

interface Props {
  title?: string;
  products?: Product[];
  viewAllHref?: string;
}

// Responsive tiles per view
const getResponsiveTilesPerView = () => {
  if (typeof window === "undefined") return 4.5;
  const width = window.innerWidth;
  if (width < 640) return 1.5; // Mobile: 1.5 sản phẩm
  if (width < 768) return 2.2; // Small tablet: 2.2 sản phẩm
  if (width < 1024) return 3.2; // Tablet: 3.2 sản phẩm
  return 4.5; // Desktop: 4.5 sản phẩm
};

const TILES_PER_VIEW = 4.5; // Default for SSR
const tileWidth = `${100 / TILES_PER_VIEW}%`;

export default function ProductRecommendations({
  title = "CÓ THỂ BẠN SẼ THÍCH",
  products,
  viewAllHref = "/products",
}: Props) {
  // Mock products nếu không có data
  const mockProducts: Product[] = [
    {
      productId: 1,
      name: "TDV Hobo Nắp Gập Chain Handle",
      url: "/product/tdv-hobo-nap-gap-chain-handle",
      price: {
        regular: { value: 1083000, text: "1.083.000₫" },
        special: { value: 1007190, text: "1.007.190₫" },
      },
      image: {
        url: "https://cdn.hstatic.net/products/200000978078/26.1_ec242fa30e88406389bab2b0be2c1af6_grande.jpg",
        alt: "TDV Hobo",
      },
    },
    {
      productId: 2,
      name: "TDV Crossbody Nắp Gập",
      url: "/product/tdv-crossbody-nap-gap",
      price: {
        regular: { value: 950000, text: "950.000₫" },
      },
      image: {
        url: "https://product.hstatic.net/200000978078/product/img_0112_4da90db586de42688a52cbb99cef6b55_large.jpg",
        alt: "TDV Crossbody",
      },
    },
    {
      productId: 3,
      name: "TDV Tote Classic",
      url: "/product/tdv-tote-classic",
      price: {
        regular: { value: 1200000, text: "1.200.000₫" },
        special: { value: 1080000, text: "1.080.000₫" },
      },
      image: {
        url: "https://product.hstatic.net/200000978078/product/img_1212_12ad01d38a7d4f518028b9e015be9358_large.jpg",
        alt: "TDV Tote",
      },
    },
    {
      productId: 4,
      name: "TDV Satchel Premium",
      url: "/product/tdv-satchel-premium",
      price: {
        regular: { value: 1500000, text: "1.500.000₫" },
      },
      image: {
        url: "https://cdn.hstatic.net/products/200000978078/26.1_ec242fa30e88406389bab2b0be2c1af6_grande.jpg",
        alt: "TDV Satchel",
      },
    },
    {
      productId: 5,
      name: "TDV Clutch Evening",
      url: "/product/tdv-clutch-evening",
      price: {
        regular: { value: 800000, text: "800.000₫" },
        special: { value: 720000, text: "720.000₫" },
      },
      image: {
        url: "https://product.hstatic.net/200000978078/product/img_0112_4da90db586de42688a52cbb99cef6b55_large.jpg",
        alt: "TDV Clutch",
      },
    },
    {
      productId: 6,
      name: "TDV Backpack Modern",
      url: "/product/tdv-backpack-modern",
      price: {
        regular: { value: 1350000, text: "1.350.000₫" },
      },
      image: {
        url: "https://product.hstatic.net/200000978078/product/img_1212_12ad01d38a7d4f518028b9e015be9358_large.jpg",
        alt: "TDV Backpack",
      },
    },
  ];

  const productList = products || mockProducts;
  if (!productList.length) return null;

  const scrollRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef(0);
  const dragStartRatioRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [smoothRatio, setSmoothRatio] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [tilesPerView, setTilesPerView] = useState(TILES_PER_VIEW);

  const totalDots = Math.ceil(productList.length / tilesPerView);

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

  // Smooth animation
  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      setSmoothRatio((prev) => {
        const diff = scrollRatio - prev;
        const step = diff * 0.2;
        const next = Math.abs(diff) < 0.001 ? scrollRatio : prev + step;
        return next;
      });
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [scrollRatio]);

  // Update tiles per view on resize
  useEffect(() => {
    const handleResize = () => {
      setTilesPerView(getResponsiveTilesPerView());
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchmove", handleGlobalTouchMove as any);
      document.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, []);

  const formatPrice = (value: number) => {
    return value.toLocaleString("vi-VN") + "₫";
  };

  const calculateDiscount = (regular: number, special?: number) => {
    if (!special) return 0;
    return Math.round(((regular - special) / regular) * 100);
  };

  return (
    <section
      className="my-14 md:my-20 product-recommendations-section"
      style={{ marginTop: 50 }}
      aria-labelledby="product-recommendations-title"
    >
      <div className="mb-6 md:mb-8 flex items-end justify-between product-recommendations-header">
        <div>
          <h2
            id="product-recommendations-title"
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

      {/* Product cards */}
      <div ref={scrollRef} className="flex overflow-x-hidden gap-1">
        {productList.map((product) => {
          const discount = product.price.special?.value
            ? calculateDiscount(
                product.price.regular.value,
                product.price.special.value
              )
            : 0;

          return (
            <div
              className="group flex-shrink-0 product-card-item"
              style={{ width: `${100 / tilesPerView}%` }}
              key={product.productId}
            >
              <a
                href={product.url}
                className="relative block overflow-hidden"
                style={{ aspectRatio: "3 / 4" } as React.CSSProperties}
                aria-label={product.name}
              >
                {product.image?.url ? (
                  <Image
                    src={product.image.url}
                    alt={product.image?.alt || product.name}
                    width={480}
                    height={640}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    loading="lazy"
                    objectFit="cover"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    -{discount}%
                  </div>
                )}
              </a>
              <div className="mt-3 text-sm text-gray-900 font-medium">
                {product.name}
              </div>
              <div className="mt-2 flex items-center gap-2">
                {product.price.special?.value ? (
                  <>
                    <span className="text-base font-bold text-red-500">
                      {formatPrice(product.price.special.value)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.price.regular.value)}
                    </span>
                  </>
                ) : (
                  <span className="text-base font-bold text-gray-900">
                    {formatPrice(product.price.regular.value)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slider control */}
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

      {/* Responsive Styles */}
      <style>{`
        .product-card-item {
          transition: width 0.3s ease;
        }
        
        @media (max-width: 1024px) {
          .product-recommendations-section {
            padding: 0 20px;
          }
        }
        
        @media (max-width: 768px) {
          .product-recommendations-section {
            margin-top: 30px !important;
            padding: 0 16px;
          }
          
          .product-recommendations-header h2 {
            font-size: 24px !important;
          }
          
          .product-recommendations-header a {
            font-size: 14px !important;
          }
        }
        
        @media (max-width: 640px) {
          .product-recommendations-section {
            margin-top: 20px !important;
            padding: 0 12px;
          }
          
          .product-recommendations-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 8px;
          }
          
          .product-recommendations-header h2 {
            font-size: 20px !important;
          }
          
          .product-card-item {
            padding: 0 4px;
          }
        }
      `}</style>
    </section>
  );
}
