// Component cho phần left trên mobile (hamburger menu)
function HeaderMobileLeft({ onMenuOpen }: { onMenuOpen: () => void }) {
  return (
    <button
      className="hamburger block 2xl:hidden"
      aria-label="Mở menu"
      onClick={onMenuOpen}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#79192A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="7" x2="21" y2="7" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="17" x2="21" y2="17" />
      </svg>
    </button>
  );
}

import Area from "@components/common/Area.js";
import React, { useState, useEffect, useMemo, useRef } from "react";
import "./Header.scss";

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
      { id: "bst-he", label: "BST Hè", url: "/bo-suu-tap/he" },
      { id: "bst-dong", label: "BST Đông", url: "/bo-suu-tap/dong" },
    ],
  },
  { id: "ve-kias", label: "VỀ KIAS", url: "/ve-kias" },
];

export function Header({
  categories = [],
  navigationConfig,
  graphqlEndpoint = "/api/graphql",
}: any) {
  const [menuOpen, setMenuOpen] = useState(false);
  // State for collapsible menu sections
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    moi: false,
    tuixach: false,
    quatang: false,
  });

  // Toggle section open/close
  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const shouldFetch = !Array.isArray(categories) || categories.length === 0;
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
        const items: Category[] = (json?.data?.categories?.items || []).map(
          (c: any) => ({
            categoryId: String(c.categoryId ?? ""),
            name: String(c.name ?? ""),
            url: String(c.url ?? ""),
            urlKey: String(c.urlKey ?? ""),
          })
        );
        setApiCategories(items);
        // debug console
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.log("NavigationData (API):", items);
        }
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
    <header className="header sm:pl-[24px] lg:pl-[44px] relative">
      <Area id="headerTop" className="header__top" />
      <div
        className="flex items-center justify-between text-[#79192A]"
        style={{ height: "70px" }}
      >
        {/* LEFT: Hamburger cho mobile, menu ngang cho desktop */}
        <div className="header__middle__left flex-1 flex justify-start items-center">
          <HeaderMobileLeft onMenuOpen={() => setMenuOpen(true)} />
          <div className="hidden 2xl:flex items-center w-full">
            <Area
              id="headerMiddleLeft"
              className="header__middle__left items-center"
            />
          </div>
        </div>
        <Area
          id="headerMiddleCenter"
          className="header__middle__center flex-1 flex justify-center items-center"
        />
        <Area
          id="headerMiddleRight"
          className="header__middle__right flex-1 flex justify-end items-center gap-3 pl-11"
        />
      </div>
      {/* Dropdown container - positioned absolutely to break out of grid */}
      <div
        id="navigation-dropdown-container"
        className="absolute left-0 right-0"
        style={{ top: "100%", zIndex: 1030 }}
      ></div>
      <Area id="headerBottom" className="header__bottom" />

      {/* Mobile menu drawer */}
      {/* Drawer and overlay always rendered for animation */}
      <div
        className={`fixed inset-0 z-[3000] flex pointer-events-none ${
          menuOpen ? "" : ""
        }`}
        style={{ pointerEvents: menuOpen ? "auto" : "none" }}
      >
        {/* Overlay */}
        <button
          type="button"
          className={`fixed inset-0 bg-black bg-opacity-40 cursor-pointer transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Đóng menu"
          tabIndex={0}
          onClick={() => setMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setMenuOpen(false);
          }}
          style={{
            border: "none",
            padding: 0,
            margin: 0,
            background: "rgba(0,0,0,0.4)",
            pointerEvents: menuOpen ? "auto" : "none",
          }}
        />
        {/* Drawer */}
        <nav
          className={`bg-white w-4/5 max-w-xs h-full shadow-lg flex flex-col fixed left-0 top-0 z-[3100] transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{
            willChange: "transform",
            pointerEvents: menuOpen ? "auto" : "none",
          }}
        >
          <button
            className="absolute top-3 right-3 p-2"
            aria-label="Đóng menu"
            onClick={() => setMenuOpen(false)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#79192A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {/* Đăng nhập/account */}
          <div className="flex items-center gap-2 px-4 pt-6 pb-4 border-b">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="#79192A"
              strokeWidth="1.5"
              viewBox="0 0 20 20"
            >
              <circle
                cx="10"
                cy="7"
                r="3.25"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M4.5 18c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <a
              href="/account/login"
              className="text-[15px] text-[#79192A] font-medium"
            >
              Đăng nhập
            </a>
          </div>
          {/* Menu items from defaultNavItems */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  {item.submenu ? (
                    <>
                      <button
                        className="w-full flex justify-between items-center text-lg font-bold text-[#79192A] py-2 focus:outline-none hover:bg-gray-100 rounded transition"
                        onClick={() => toggleSection(item.id)}
                        aria-expanded={openSections[item.id]}
                      >
                        <span>{item.label}</span>
                        <svg
                          className={`w-5 h-5 ml-2 transition-transform duration-200 ${
                            openSections[item.id] ? "rotate-180" : ""
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
                      {openSections[item.id] && (
                        <ul className="pl-4 text-sm text-[#202020] space-y-1 animate-fadeIn">
                          {item.submenu.map((sub) => (
                            <li className="py-0.5" key={sub.id}>
                              <a
                                href={sub.url}
                                className="hover:text-[#79192A] transition"
                              >
                                {sub.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <a
                      href={item.url}
                      className="block text-lg font-bold text-[#79192A] py-2 hover:bg-gray-100 rounded transition"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            {/* Hình ảnh danh mục ở ngay dưới menu, sau CỬA HÀNG */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {apiCategories.map((item, idx) => (
                <a
                  key={item.url + idx}
                  href={item.url}
                  className="flex flex-col items-center hover:opacity-80"
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src="https://product.hstatic.net/200000142885/product/z4121570251442_1ea4dad0962c57799e2306bf9b6cfe76_90c1420390b94518b2c2b45936bfbb88_master.jpg"
                    alt={item.name}
                    className="w-16 h-16 object-contain"
                  />
                  <span className="text-xs mt-1 text-center">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
