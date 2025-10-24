/**
 * Hero Slider Component - HAPAS Homepage
 * Matches hapas.vn design with featured collections
 *
 * SSR-ready with GraphQL data fetching
 */

import React, { useState, useEffect } from "react";
import { Image } from "@components/common/Image";
import "./HeroSlider.scss";

interface Category {
  categoryId: number;
  name: string;
  url: string;
  urlKey: string;
  image: {
    url: string;
    alt: string;
  };
  description: string;
}

interface TabConfig {
  id: string;
  label: string;
  categoryFilter: string[]; // Array of category names to show
}

interface HeroSliderProps {
  categories?: {
    items: Category[];
  };
  autoplay?: boolean;
  interval?: number;
  showTabs?: boolean;
}

export default function HeroSlider({
  categories,
  autoplay = true,
  interval = 5000,
  showTabs = true,
}: HeroSliderProps) {
  const [activeTab, setActiveTab] = useState<string>("collections");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Tab configuration matching HAPAS.VN
  const tabs: TabConfig[] = [
    {
      id: "collections",
      label: "BỘ SƯU TẬP MỚI",
      categoryFilter: ["Set Bộ", "Váy & Đầm", "Quần", "Áo"],
    },
    {
      id: "gifts",
      label: "QUÀ TẶNG",
      categoryFilter: ["Giá mới hấp dẫn", "Hàng mới về"],
    },
  ];

  // Filter slides based on active tab
  const allSlides = categories?.items || [];
  const activeTabConfig = tabs.find((tab) => tab.id === activeTab);
  const slides = activeTabConfig
    ? allSlides.filter((cat) =>
        activeTabConfig.categoryFilter.includes(cat.name)
      )
    : allSlides;

  useEffect(() => {
    if (!autoplay || isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, interval, isPaused, slides.length]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentSlide(0); // Reset to first slide when changing tabs
    setIsPaused(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section
      className="container my-10 md:my-14 hero-slider-responsive"
      style={{ marginTop: 60 }}
    >
      <div className="mb-6 md:mb-8 sm:mb-4">
        <nav className="flex items-center justify-center md:justify-start gap-6 md:gap-10 uppercase tracking-[0.08em] text-[13px]">
          <a
            href="/collections/new"
            className="font-[Montserrat] font-semibold uppercase tracking-wide text-black hover:opacity-80 text-[11px] md:text-[13px]"
          >
            BỘ SƯU TẬP MỚI
          </a>
          <a
            href="/collections/gifts"
            className="font-[Montserrat] uppercase tracking-wide text-gray-500 hover:text-gray-900 text-[11px] md:text-[13px]"
          >
            QUÀ TẶNG
          </a>
        </nav>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-0"
        style={{ marginTop: 60 }}
      >
        {/* Trái */}
        <a
          href="/collections/best-sellers"
          className="group relative block overflow-hidden "
          style={{ aspectRatio: "4 / 5" }}
          aria-label="Được yêu thích nhất"
        >
          <img
            src="https://file.hstatic.net/200000978078/file/1.png"
            alt="Được yêu thích nhất"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          <div className="absolute left-6 md:left-10 bottom-6 md:bottom-10 text-white select-none">
            <h3 className="text-[20px] md:text-[28px] font-[Montserrat] font-semibold uppercase tracking-wide text-white">
              ĐƯỢC YÊU THÍCH NHẤT
            </h3>
            <span className="mt-2 inline-flex items-center gap-2 text-sm opacity-90 group-hover:opacity-100 transition">
              Xem chi tiết
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className="transition-transform group-hover:translate-x-1"
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
            </span>
          </div>
        </a>

        {/* Phải */}
        <a
          href="/collections/gifts"
          className="group relative block overflow-hidden"
          style={{ aspectRatio: "4 / 5" }}
          aria-label="Quà tặng"
        >
          <img
            src="https://file.hstatic.net/200000978078/file/1_63559a0aba7d4bed9aa5056d49243667.png"
            alt="Quà tặng"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          <div className="absolute left-6 md:left-10 bottom-6 md:bottom-10 text-white select-none">
            <h3 className="text-[20px] md:text-[28px] font-[Montserrat] font-semibold uppercase tracking-wide text-white">
              QUÀ TẶNG
            </h3>
            <span className="mt-2 inline-flex items-center gap-2 text-sm opacity-90 group-hover:opacity-100 transition">
              Xem chi tiết
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className="transition-transform group-hover:translate-x-1"
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
            </span>
          </div>
        </a>
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
