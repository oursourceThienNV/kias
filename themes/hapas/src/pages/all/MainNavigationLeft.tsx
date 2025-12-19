import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import type { ComponentLayout } from "@evershop/evershop";
import SearchSlidePanel from "../../components/SearchSlidePanel.js";

/* === GraphQL query (y hệt bạn đưa) === */
export const query = `
  query NavigationData {
    categories(
      filters: [
        { key: "status", operation: eq, value: "1" },
        { key: "include_in_nav", operation: eq, value: "1" }
      ]
    ) {
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

interface Category {
  categoryId: string;
  name: string;
  url: string;
  urlKey: string;
}

interface NavItem {
  id: string;
  label: string;
  url: string;
  submenu?: Array<{ id: string; label: string; url: string }>;
}

interface MainNavigationProps {
  categories?: Category[];
  navigationConfig?: { primary: NavItem[] };
  graphqlEndpoint?: string; // mặc định /api/graphql
  colorHex?: string; // màu chữ
  debugCategories?: boolean; // in JSON navItems
}

const defaultNavItems = [
  { id: "new", label: "MỚI", url: "/moi" },
  {
    id: "san-pham",
    label: "SẢN PHẨM",
    url: "/san-pham",
    submenu: [],
  },
  {
    id: "san-pham-sale",
    label: "SẢN PHẨM SALE",
    url: "/san-pham-sale",
    submenu: [{ id: "sale-upto", label: "Sale Up To", url: "/sale-upto" }],
  },
  {
    id: "bo-suu-tap",
    label: "BỘ SƯU TẬP",
    url: "/bo-suu-tap",
    submenu: [
      { id: "bst-he", label: "BST Hè", url: "/he" },
      { id: "bst-dong", label: "BST Đông", url: "/dong" },
    ],
  },
  { id: "ve-kias", label: "VỀ KIAS", url: "/ve-kias" },
];

export default function MainNavigationLeft({
  categories = [],
  navigationConfig,
  graphqlEndpoint = "/api/graphql",
  colorHex = "#22295B",
  debugCategories = false,
}: MainNavigationProps) {
  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldFetch = !Array.isArray(categories) || categories.length === 0;
  const dropdownContainer =
    typeof document !== "undefined"
      ? document.getElementById("navigation-dropdown-container")
      : null;
  useEffect(() => {
    if (!shouldFetch) return;
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch(graphqlEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
          signal: ctrl.signal,
        });
        const json = await res.json();
        console.log(
          "categories fetch response:",
          json?.data?.categories?.items
        );
        const items: Category[] = (json?.data?.categories?.items || []).map(
          (c: any) => ({
            categoryId: String(c.categoryId ?? ""),
            name: String(c.name ?? ""),
            url: String(c.url ?? ""),
            urlKey: String(c.urlKey ?? ""),
          })
        );
        setApiCategories(items);
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.error("Fetch NavigationData error:", e);
        }
        setApiCategories([]);
      }
    })();
    return () => ctrl.abort();
  }, [graphqlEndpoint, shouldFetch]);

  const source =
    Array.isArray(categories) && categories.length > 0
      ? categories
      : apiCategories;

  // Chèn submenu động cho 'SẢN PHẨM' nếu có dữ liệu API
  const navItems: NavItem[] = useMemo(() => {
    const baseNav = navigationConfig?.primary || defaultNavItems;
    // Tìm vị trí 'SẢN PHẨM'
    const idx = baseNav.findIndex((item) => item.id === "san-pham");
    if (idx !== -1) {
      // Nếu có dữ liệu API, chèn vào submenu
      const submenu = (Array.isArray(source) ? source : []).map((cat) => ({
        id: cat.categoryId,
        label: cat.name,
        url: cat.url || "/san-pham",
      }));
      // Tạo bản sao để không mutate mảng gốc
      const newNav = [...baseNav];
      newNav[idx] = {
        ...newNav[idx],
        submenu,
      };
      return newNav;
    }
    return baseNav;
  }, [navigationConfig, source]);

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <nav
          ref={navRef}
          aria-label="Main Navigation"
          className="flex items-center gap-3 sm:gap-5"
        >
          <ul className="flex items-center gap-4 sm:gap-6 m-0 p-0 list-none relative w-full">
            {navItems.map((item) => (
              <li
                key={item.id}
                className="relative whitespace-nowrap"
                onMouseEnter={() => {
                  if (item.submenu) {
                    if (closeTimeoutRef.current) {
                      clearTimeout(closeTimeoutRef.current);
                      closeTimeoutRef.current = null;
                    }
                    setActiveDropdown(item.id);
                  }
                }}
                onMouseLeave={() => {
                  if (item.submenu) {
                    closeTimeoutRef.current = setTimeout(() => {
                      setActiveDropdown(null);
                    }, 200);
                  }
                }}
              >
                {item.submenu ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[13px] tracking-[0.08em] uppercase no-underline hover:opacity-80 transition-opacity focus:outline-none"
                    style={{
                      color: "#79192A",
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === item.id}
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                        activeDropdown === item.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="#79192A"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : (
                  <a
                    href={item.url}
                    className="inline-flex items-center gap-1 text-[13px] tracking-[0.08em] uppercase no-underline hover:opacity-80 transition-opacity"
                    style={{ color: "#79192A" }}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* search icon nhỏ ở cuối dãy */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          aria-label="Tìm kiếm"
          className="ml-3 inline-flex items-center justify-center w-6 h-6 hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="9"
              cy="9"
              r="6.2"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M14.5 14.5L18 18"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Search Slide Panel */}
      <SearchSlidePanel 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      {/* Render dropdown using portal to header container */}
      {dropdownContainer &&
        activeDropdown &&
        createPortal(
          (() => {
            const activeItem = navItems.find(
              (item) => item.id === activeDropdown
            );
            if (!activeItem || !activeItem.submenu) return null;

            return (
              <div
                className="w-full bg-white shadow-md py-4 border border-t transition-all duration-200"
                style={{
                  opacity: 1,
                  visibility: "visible",
                  transform: "translateY(0)",
                  pointerEvents: "auto",
                  position: "relative",
                  zIndex: 9999,
                }}
                role="menu"
                onMouseEnter={() => {
                  if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current);
                    closeTimeoutRef.current = null;
                  }
                  setActiveDropdown(activeItem.id);
                }}
                onMouseLeave={() => {
                  closeTimeoutRef.current = setTimeout(() => {
                    setActiveDropdown(null);
                  }, 200);
                }}
              >
                <div className="w-full px-7">
                  <ul className="flex flex-col gap-0 m-0 p-0 list-none">
                    {activeItem.submenu.map((sub) => (
                      <li key={sub.id}>
                        <a
                          href={sub.url}
                          className="block text-sm font-normal text-black py-2 px-4 hover:bg-gray-50 transition no-underline uppercase tracking-wide cursor-pointer"
                          role="menuitem"
                        >
                          {sub.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })(),
          dropdownContainer
        )}
    </>
  );
}

/* ĐĂNG KÝ BÊN TRÁI */
export const layout: ComponentLayout = {
  areaId: "headerMiddleLeft",
  sortOrder: 10,
};
