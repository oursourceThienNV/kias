import Area from "@components/common/Area.js";
import React from "react";

interface FooterProps {
  copyRight: string;
}

export function Footer({ copyRight }: FooterProps) {
  return (
    <footer className="w-full bg-[#79192A] text-white py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.2fr] gap-10 md:gap-16">
          {/* Cột 1 */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide uppercase text-white/100">
              Về KIAS
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/90">
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
            <h4 className="text-sm font-semibold tracking-wide uppercase text-white/100">
              Dịch vụ khách hàng
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/90">
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
            <h4 className="text-sm font-semibold tracking-wide uppercase text-white/100">
              Liên hệ KIAS
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/90">
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

            <div className="mt-6">
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

          {/* Cột 4 — form + badges */}
          <div>
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

            <div className="mt-6">
              <h5 className="text-sm font-semibold tracking-wide uppercase text-[#ffffff]">
                Phương thức thanh toán
              </h5>
              <div className="mt-3 flex items-center gap-4">
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
