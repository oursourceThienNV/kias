import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import type { ComponentLayout } from "@evershop/evershop";

const defaultNavItems = [
  { id: "new", label: "MỚI", url: "/moi" },
  {
    id: "san-pham",
    label: "SẢN PHẨM",
    url: "/san-pham",
    submenu: [
      { id: "ao", label: "Áo", url: "/ao" },
      { id: "quan", label: "Quần", url: "/quan" },
      { id: "vay-dam", label: "Váy & Đầm", url: "/vay-dam" },
      { id: "set-bo", label: "Set Bộ", url: "/set-bo" },
      { id: "men", label: "Nam", url: "/men" },
      { id: "women", label: "Nữ", url: "/women" },
    ],
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
export default function MainNavigationLeft() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navItems = defaultNavItems;
  const dropdownContainer = typeof document !== "undefined"
    ? document.getElementById("navigation-dropdown-container")
    : null;
  return (
    <>
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

        {/* search icon nhỏ ở cuối dãy */}
        <a
          href="/search"
          aria-label="Tìm kiếm"
          className="ml-1 inline-flex items-center justify-center w-6 h-6 hover:opacity-80 transition-opacity"
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
        </a>


      </nav>

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
