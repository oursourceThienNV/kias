import React from "react";
import { MiniCart } from "@components/frontStore/cart/MiniCart.js";

interface HeaderActionsRightProps {
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  customer?: { uuid: string } | null;
  loginUrl: string;
  logoutApi: string;
  currentLanguage?: string; // 'VN'
  colorHex?: string; // navy
}

export default function HeaderActionsRight({
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  customer,
  loginUrl,
  logoutApi,
  currentLanguage = "VN",
  colorHex = "#22295B",
}: HeaderActionsRightProps) {
  const navy = colorHex;
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const loggedIn = customer ? true : isLoggedIn;

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div className="flex items-center justify-end" style={{ color: navy }}>
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Account with dropdown */}
        <div
          className="relative hidden md:flex z-40"
          ref={ref}
          style={{ pointerEvents: "auto" }}
        >
          {!loggedIn ? (
            <a
              href={loginUrl}
              aria-label={"Đăng nhập"}
              className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 no-underline hover:opacity-80 transition-opacity"
              style={{ color: "#79192A" }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
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
            </a>
          ) : (
            <>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((v) => !v);
                }}
                className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 hover:opacity-80 transition-opacity cursor-pointer"
                style={{ color: "#79192A" }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
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
              </button>
              {open && (
                <div
                  role="menu"
                  className="absolute right-0 top-8 w-44 rounded-md border border-gray-200 bg-white shadow-lg z-50"
                >
                  <a
                    href="/account/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    role="menuitem"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500"
                      fill="none"
                      viewBox="0 0 20 20"
                      stroke="currentColor"
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
                    Thông tin cá nhân
                  </a>
                  <button
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    role="menuitem"
                    onClick={async () => {
                      try {
                        await fetch(logoutApi, { method: "POST" });
                        window.location.href = "/";
                      } catch (e) {
                        window.location.reload();
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 12H9m9 0l-3-3m3 3l-3 3"
                      />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Cart (MiniCart with slide drawer): luôn hiện */}
        <MiniCart
          showItemCount
          renderCartIcon={({ totalQty, onClick, isOpen }) => (
            <button
              type="button"
              onClick={onClick}
              aria-label={`Giỏ hàng${totalQty ? ` (${totalQty})` : ""}`}
              className={`relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 hover:opacity-80 transition-opacity ${
                isOpen ? "opacity-80" : ""
              }`}
              style={{ color: "#79192A" }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 2h2l1.5 6h11l1.5-4.5H4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="8.2" cy="16.2" r="1" fill="currentColor" />
                <circle cx="14.2" cy="16.2" r="1" fill="currentColor" />
              </svg>
              {totalQty > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full text-[10px] leading-[16px] font-bold text-white"
                  style={{ backgroundColor: "#79192A" }}
                >
                  {totalQty > 99 ? "99+" : totalQty}
                </span>
              )}
            </button>
          )}
        />

        {/* Wishlist: chỉ hiện trên desktop */}
        <a
          href="/wishlist"
          aria-label={`Yêu thích${wishlistCount ? ` (${wishlistCount})` : ""}`}
          className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 no-underline hover:opacity-80 transition-opacity hidden xl:flex"
          style={{ color: "#79192A" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 17.3s-7-3.9-7-9.3C3 6.1 4.4 4.7 6.4 4.7c1.5 0 3 1 3.6 2.3 0.7-1.3 2.1-2.3 3.6-2.3 2 0 3.4 1.4 3.4 3.3 0 5.4-7 9.3-7 9.3Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          {wishlistCount > 0 && (
            <span
              className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full text-[10px] leading-[16px] font-bold text-white"
              style={{ backgroundColor: navy }}
            >
              {wishlistCount > 99 ? "99+" : wishlistCount}
            </span>
          )}
        </a>
      </div>

      {/* Divider + Language “| VN” */}
      <div className="flex items-center pl-3 sm:pl-4 ml-2">
        <span className="mx-2 select-none" style={{ color: "#79192A" }}>
          |
        </span>
        <button
          type="button"
          className="text-sm font-medium tracking-wide bg-transparent border-0 cursor-pointer hover:opacity-80"
          style={{ color: "#79192A" }}
          aria-label="Chuyển ngôn ngữ"
        >
          {currentLanguage}
        </button>
      </div>
    </div>
  );
}

/* ĐĂNG KÝ BÊN PHẢI */
export const layout = {
  areaId: "headerMiddleRight",
  sortOrder: 10,
};

export const query = `
  query HeaderActionsQuery {
    customer: currentCustomer { uuid }
    loginUrl: url(routeId: "login")
    logoutApi: url(routeId: "customerLogoutJson")
  }
`;
