import Area from "@components/common/Area.js";
import React, { useState } from "react";

interface FooterProps {
  copyRight: string;
}

export function Footer({ copyRight }: FooterProps) {
  // Accordion state cho mobile
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <footer className="w-full bg-[#79192A] text-white px-4 py-12 md:py-16">
      <div className="container">
        {/* Mobile: Phần 1 */}
        <div className="block sm:hidden mb-10 pb-8 border-b border-white/20">
          {/* Đăng ký để nhận tin */}
          <h4 className="text-sm font-semibold tracking-wide uppercase text-[#ffffff]">
            Đăng ký để nhận tin
          </h4>
          <form className="mt-4 flex w-full max-w-[520px]">
            <input
              type="email"
              placeholder="Email của bạn"
              className="h-10 flex-1 rounded-l-md bg-white/10 placeholder-white/70 text-white text-sm px-4 outline-none border border-white/20 focus:border-white/40"
            />
            <button
              type="button"
              className="h-10 px-4 rounded-r-md bg-white text-[#1f2650] text-sm font-semibold"
            >
              Gửi
            </button>
          </form>
          {/* Theo dõi chúng tôi */}
          <div className="mt-6 hidden">
            <h5 className="text-sm font-semibold tracking-wide uppercase text-white/100">
              Theo dõi chúng tôi
            </h5>
            <div className="mt-3 flex items-center gap-4 text-white">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="hover:opacity-80"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="4.2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="hover:opacity-80"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 8h3V5h-3a4 4 0 0 0-4 4v3H7v3h3v6h3v-6h3l1-3h-4V9a1 1 0 0 1 1-1Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="https://tiktok.com"
                aria-label="TikTok"
                className="hover:opacity-80"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14.5 3v4.2a5.8 5.8 0 0 0 4.9 1.8v3.1a8.9 8.9 0 0 1-4.9-1.5v5.9a5.2 5.2 0 1 1-5.2-5.2c.3 0 .6 0 .9.1v3.1a2.1 2.1 0 1 0 2.1 2.1V3h2.2Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        {/* Mobile: Phần 2 */}
        <div className="block sm:hidden pb-8 border-b border-white/20">
          {/* Về KIAS */}
          <div>
            <button
              className="w-full flex items-center justify-between py-3"
              onClick={() =>
                setOpenSection(openSection === "veKIAS" ? null : "veKIAS")
              }
              aria-expanded={openSection === "veKIAS"}
            >
              <h4 className="text-sm font-semibold tracking-wide uppercase text-white/100">
                Về KIAS
              </h4>
              <span>
                {openSection === "veKIAS" ? (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M6 15l6-6 6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </span>
            </button>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                openSection === "veKIAS"
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {openSection === "veKIAS" && (
                <ul className="mt-2 space-y-3 text-sm text-white/90">
                  <li>
                    <a
                      href="/pages/dieu-binh-thuong"
                      className="hover:opacity-80"
                    >
                      Điều bình thường tươi đẹp
                    </a>
                  </li>
                  <li>
                    <a href="/pages/KIAS-can-ban" className="hover:opacity-80">
                      KIAS cần bạn
                    </a>
                  </li>
                  <li>
                    <a href="/collections/gifts" className="hover:opacity-80">
                      Quà tặng
                    </a>
                  </li>
                  <li>
                    <a href="/collections" className="hover:opacity-80">
                      Bộ sưu tập
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
          {/* Dịch vụ khách hàng */}
          <div className="mt-2">
            <button
              className="w-full flex items-center justify-between py-3"
              onClick={() =>
                setOpenSection(openSection === "dichVu" ? null : "dichVu")
              }
              aria-expanded={openSection === "dichVu"}
            >
              <h4 className="text-sm font-semibold tracking-wide uppercase text-white/100">
                Dịch vụ khách hàng
              </h4>
              <span>
                {openSection === "dichVu" ? (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M6 15l6-6 6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </span>
            </button>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                openSection === "dichVu"
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {openSection === "dichVu" && (
                <ul className="mt-2 space-y-3 text-sm text-white/90">
                  <li>
                    <a
                      href="/pages/chinh-sach-khach-hang-than-thiet"
                      className="hover:opacity-80"
                    >
                      Chính sách khách hàng thân thiết
                    </a>
                  </li>
                  <li>
                    <a href="/pages/doi-tra" className="hover:opacity-80">
                      Chính sách đổi/trả sản phẩm
                    </a>
                  </li>
                  <li>
                    <a href="/pages/bao-mat" className="hover:opacity-80">
                      Chính sách bảo mật
                    </a>
                  </li>
                  <li>
                    <a href="/pages/giao-hang" className="hover:opacity-80">
                      Chính sách giao hàng
                    </a>
                  </li>
                  <li>
                    <a href="/pages/thanh-toan" className="hover:opacity-80">
                      Hình thức thanh toán
                    </a>
                  </li>
                  <li>
                    <a href="/pages/dieu-khoan" className="hover:opacity-80">
                      Điều khoản sử dụng
                    </a>
                  </li>
                  <li>
                    <a href="/pages/faq" className="hover:opacity-80">
                      Các câu hỏi thường gặp
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
          {/* Liên hệ KIAS */}
          <div className="mt-2">
            <button
              className="w-full flex items-center justify-between py-3"
              onClick={() =>
                setOpenSection(openSection === "lienHe" ? null : "lienHe")
              }
              aria-expanded={openSection === "lienHe"}
            >
              <h4 className="text-sm font-semibold tracking-wide uppercase text-white/100">
                Liên hệ KIAS
              </h4>
              <span>
                {openSection === "lienHe" ? (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M6 15l6-6 6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </span>
            </button>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                openSection === "lienHe"
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {openSection === "lienHe" && (
                <ul className="mt-2 space-y-3 text-sm text-white/90">
                  <li>
                    <a href="/pages/stores" className="hover:opacity-80">
                      Hệ thống cửa hàng
                    </a>
                  </li>
                  <li>
                    <a href="/blogs/news" className="hover:opacity-80">
                      Tin tức
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
        {/* Mobile: Phần 3 */}
        <div className="block sm:hidden pt-8">
          {/* Đã thông báo Bộ Công Thương */}
          <div className="mb-4 flex justify-start">
            <a
              href="https://online.gov.vn"
              target="_blank"
              rel="noreferrer"
              aria-label="Đã thông báo Bộ Công Thương"
            >
              <img
                src="https://file.hstatic.net/200000978078/file/dathongbao.png"
                alt="Đã thông báo Bộ Công Thương"
                className="h-16 w-auto"
                loading="lazy"
              />
            </a>
          </div>
          <h5 className="text-sm font-semibold tracking-wide uppercase text-[#ffffff]">
            Phương thức thanh toán
          </h5>
          <div className="mt-3 flex flex-wrap items-center gap-4 justify-start">
            <img
              src="https://cdn.hstatic.net/themes/200000978078/1001399698/14/payment_1_img.png?v=199"
              alt="Visa"
              className="h-5 w-auto"
              loading="lazy"
            />
            <img
              src="https://cdn.hstatic.net/themes/200000978078/1001399698/14/payment_2_img.png?v=199"
              alt="Mastercard"
              className="h-5 w-auto"
              loading="lazy"
            />
            <img
              src="https://cdn.hstatic.net/themes/200000978078/1001399698/14/payment_3_img.png?v=199"
              alt="JCB"
              className="h-5 w-auto"
              loading="lazy"
            />
            <img
              src="https://cdn.hstatic.net/themes/200000978078/1001399698/14/payment_4_img.png?v=199"
              alt="COD"
              className="h-5 w-auto"
              loading="lazy"
            />
          </div>
        </div>
        {/* Desktop layout */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.2fr] gap-8 md:gap-12">
          {/* Cột 1 */}
          <div>
            <h4 className="text-xs md:text-sm font-semibold tracking-wide uppercase text-white/100">
              Về KIAS
            </h4>
            <ul className="mt-3 space-y-2 text-xs md:text-sm text-white/90">
              <li>
                <a href="/pages/dieu-binh-thuong" className="hover:opacity-80">
                  Điều bình thường tươi đẹp
                </a>
              </li>
              <li>
                <a href="/pages/KIAS-can-ban" className="hover:opacity-80">
                  KIAS cần bạn
                </a>
              </li>
              <li>
                <a href="/collections/gifts" className="hover:opacity-80">
                  Quà tặng
                </a>
              </li>
              <li>
                <a href="/collections" className="hover:opacity-80">
                  Bộ sưu tập
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 2 */}
          <div>
            <h4 className="text-xs md:text-sm font-semibold tracking-wide uppercase text-white/100">
              Dịch vụ khách hàng
            </h4>
            <ul className="mt-3 space-y-2 text-xs md:text-sm text-white/90">
              <li>
                <a
                  href="/pages/chinh-sach-khach-hang-than-thiet"
                  className="hover:opacity-80"
                >
                  Chính sách khách hàng thân thiết
                </a>
              </li>
              <li>
                <a href="/pages/doi-tra" className="hover:opacity-80">
                  Chính sách đổi/trả sản phẩm
                </a>
              </li>
              <li>
                <a href="/pages/bao-mat" className="hover:opacity-80">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="/pages/giao-hang" className="hover:opacity-80">
                  Chính sách giao hàng
                </a>
              </li>
              <li>
                <a href="/pages/thanh-toan" className="hover:opacity-80">
                  Hình thức thanh toán
                </a>
              </li>
              <li>
                <a href="/pages/dieu-khoan" className="hover:opacity-80">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="/pages/faq" className="hover:opacity-80">
                  Các câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3 */}
          <div>
            <h4 className="text-base md:text-lg font-semibold tracking-wide uppercase text-white/100">
              Liên hệ KIAS
            </h4>
            <ul className="mt-4 space-y-3 text-base text-white/90">
              <li>
                <a href="/pages/stores" className="hover:opacity-80">
                  Hệ thống cửa hàng
                </a>
              </li>
              <li>
                <a href="/blogs/news" className="hover:opacity-80">
                  Tin tức
                </a>
              </li>
            </ul>
            {/* Theo dõi chúng tôi - chỉ hiện desktop */}
            <div className="mt-6 hidden sm:block">
              <h5 className="text-base md:text-lg font-semibold tracking-wide uppercase text-white/100">
                Theo dõi chúng tôi
              </h5>
              <div className="mt-3 flex items-center gap-4 text-white">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  aria-label="Instagram"
                  className="hover:opacity-80"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="4.2"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                  </svg>
                </a>
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  aria-label="Facebook"
                  className="hover:opacity-80"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14 8h3V5h-3a4 4 0 0 0-4 4v3H7v3h3v6h3v-6h3l1-3h-4V9a1 1 0 0 1 1-1Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                {/* TikTok */}
                <a
                  href="https://tiktok.com"
                  aria-label="TikTok"
                  className="hover:opacity-80"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14.5 3v4.2a5.8 5.8 0 0 0 4.9 1.8v3.1a8.9 8.9 0 0 1-4.9-1.5v5.9a5.2 5.2 0 1 1-5.2-5.2c.3 0 .6 0 .9.1v3.1a2.1 2.1 0 1 0 2.1 2.1V3h2.2Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Cột 4 — form + badges */}
          <div>
            {/* Đăng ký để nhận tin - chỉ hiện desktop */}
            <div className="hidden sm:block">
              <h4 className="text-sm font-semibold tracking-wide uppercase  text-[#ffffff]">
                Đăng ký để nhận tin
              </h4>
              <form className="mt-4 flex w-full max-w-[520px]">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="h-10 flex-1 rounded-l-md bg-white/10 placeholder-white/70 text-white text-sm px-4 outline-none border border-white/20 focus:border-white/40"
                />
                <button
                  type="button"
                  className="h-10 px-4 rounded-r-md bg-white text-[#1f2650] text-sm font-semibold"
                >
                  Gửi
                </button>
              </form>
              <div className="mt-4">
                <a
                  href="https://online.gov.vn"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Đã thông báo Bộ Công Thương"
                >
                  <img
                    src="https://file.hstatic.net/200000978078/file/dathongbao.png"
                    alt="Đã thông báo Bộ Công Thương"
                    className="h-12 w-auto"
                    loading="lazy"
                  />
                </a>
              </div>
            </div>
            <div className="mt-6">
              <h5 className="text-sm font-semibold tracking-wide uppercase text-[#ffffff]">
                Phương thức thanh toán
              </h5>
              <div className="mt-3 flex flex-wrap items-center gap-4 sm:gap-4 gap-2 justify-start sm:justify-start justify-center">
                <img
                  src="https://cdn.hstatic.net/themes/200000978078/1001399698/14/payment_1_img.png?v=199"
                  alt="Visa"
                  className="h-5 w-auto"
                  loading="lazy"
                />
                <img
                  src="https://cdn.hstatic.net/themes/200000978078/1001399698/14/payment_2_img.png?v=199"
                  alt="Mastercard"
                  className="h-5 w-auto"
                  loading="lazy"
                />
                <img
                  src="https://cdn.hstatic.net/themes/200000978078/1001399698/14/payment_3_img.png?v=199"
                  alt="JCB"
                  className="h-5 w-auto"
                  loading="lazy"
                />
                <img
                  src="https://cdn.hstatic.net/themes/200000978078/1001399698/14/payment_4_img.png?v=199"
                  alt="COD"
                  className="h-5 w-auto"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
