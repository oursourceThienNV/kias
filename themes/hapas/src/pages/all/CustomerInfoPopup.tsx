/**
 * Customer Info Popup Component - HAPAS
 * Pop-up xin thông tin khách hàng (Tên + SĐT) hiện sau 20-30s
 */

import React, { useState, useEffect } from "react";
import "./CustomerInfoPopup.scss";

interface CustomerInfoPopupProps {
  delay?: number; // Thời gian delay trước khi hiện popup (ms)
  onSubmit?: (data: { name: string; phone: string }) => void;
}

export default function CustomerInfoPopup({
  delay = 25000, // 25 giây = 25000ms
  onSubmit,
}: CustomerInfoPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [errors, setErrors] = useState({ name: "", phone: "" });

  // Kiểm tra xem đã hiển thị popup trong session này chưa
  useEffect(() => {
    const hasShown = sessionStorage.getItem("customerInfoPopupShown");
    if (hasShown) {
      return; // Không hiện lại nếu đã hiện trong session này
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem("customerInfoPopupShown", "true");
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const validateForm = () => {
    const newErrors = { name: "", phone: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên của bạn";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Tên phải có ít nhất 2 ký tự";
      isValid = false;
    }

    // Validate số điện thoại (VN format: 10 số, bắt đầu bằng 0)
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Gọi callback nếu có
      if (onSubmit) {
        onSubmit({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
        });
      }

      // Có thể gửi đến API ở đây
      console.log("Customer Info:", {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      });

      // Đóng popup
      handleClose();
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  const handleInputChange = (field: "name" | "phone", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error khi user bắt đầu nhập lại
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`customer-info-popup-overlay ${isClosing ? "closing" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`customer-info-popup ${isClosing ? "closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="popup-close-btn"
          onClick={handleClose}
          aria-label="Đóng"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Logo KIAS */}
        <div className="popup-logo">
          <img
            src="/logo/logo-kias.webp"
            alt="KIAS Logo"
            onError={(e) => {
              // Fallback nếu không có logo
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        {/* Content */}
        <div className="popup-content">
          <h2 className="popup-title">Nhận ưu đãi đặc biệt từ KIAS</h2>
          <p className="popup-description">
            Để lại thông tin để nhận ngay voucher giảm giá và cập nhật sản phẩm
            mới nhất!
          </p>

          <form onSubmit={handleSubmit} className="popup-form">
            {/* Tên */}
            <div className="form-group">
              <label htmlFor="customer-name" className="form-label">
                Họ và tên <span className="required">*</span>
              </label>
              <input
                id="customer-name"
                type="text"
                className={`form-input ${errors.name ? "error" : ""}`}
                placeholder="Nhập họ và tên của bạn"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="form-group">
              <label htmlFor="customer-phone" className="form-label">
                Số điện thoại <span className="required">*</span>
              </label>
              <input
                id="customer-phone"
                type="tel"
                className={`form-input ${errors.phone ? "error" : ""}`}
                placeholder="Nhập số điện thoại của bạn"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                maxLength={10}
                required
              />
              {errors.phone && (
                <span className="error-message">{errors.phone}</span>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="popup-submit-btn">
              Nhận ưu đãi ngay
            </button>

            <p className="popup-privacy">
              Bằng việc điền form, bạn đồng ý với{" "}
              <a href="/pages/privacy-policy" target="_blank">
                Chính sách bảo mật
              </a>{" "}
              của chúng tôi
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 998, // Đặt trước FloatingChatWidget
};
