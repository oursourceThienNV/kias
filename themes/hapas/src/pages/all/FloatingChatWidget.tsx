/**
 * Floating Chat Widget Component - HAPAS
 * Messenger và Zalo chat buttons ở góc phải
 */

import React, { useState, useEffect } from "react";
import CustomerInfoPopup from "./CustomerInfoPopup";
import "./FloatingChatWidget.scss";

interface FloatingChatWidgetProps {
  messengerUrl?: string;
  zaloUrl?: string;
  messengerPhone?: string;
  zaloPhone?: string;
}

export default function FloatingChatWidget({
  messengerUrl = "https://m.me/your-page", // thay đổi url của page
  zaloUrl = "https://zalo.me/your-phone", // thay đổi url của page
  messengerPhone = "0123456789", // thay đổi số điện thoại
  zaloPhone = "0123456789", // thay đổi số điện thoại
}: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<"messenger" | "zalo" | null>(
    null
  );
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);
  const [customerPopupKey, setCustomerPopupKey] = useState(0);

  // Handle scroll để hiện/ẩn nút back to top
  useEffect(() => {
    const handleScroll = () => {
      // Hiện nút khi scroll xuống > 300px
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleChat = (type: "messenger" | "zalo") => {
    if (activeChat === type && isOpen) {
      // Đóng nếu đang mở cùng loại
      setIsOpen(false);
      setActiveChat(null);
    } else {
      // Mở loại mới
      setActiveChat(type);
      setIsOpen(true);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setActiveChat(null);
  };

  return (
    <div className="floating-chat-widget">
      {/* Customer Info Popup (on-demand) */}
      {showCustomerPopup && (
        <CustomerInfoPopup key={customerPopupKey} delay={0} />
      )}
      {/* Chat Box */}
      {isOpen && activeChat && (
        <div className="chat-box">
          <div className="chat-box-header">
            <div className="chat-box-header-info">
              {activeChat === "messenger" ? (
                <>
                  <div className="chat-icon messenger-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M0 7.76C0 3.301 3.493 0 8 0s8 3.301 8 7.76-3.493 7.76-8 7.76c-.81 0-1.586-.107-2.316-.307a.64.64 0 0 0-.427.03l-1.588.702a.64.64 0 0 1-.898-.566l-.044-1.423a.64.64 0 0 0-.215-.456C.956 12.108 0 10.092 0 7.76m5.546-1.459-2.35 3.728c-.225.358.214.761.551.506l2.525-1.916a.48.48 0 0 1 .578-.002l1.869 1.402a1.2 1.2 0 0 0 1.735-.32l2.35-3.728c.226-.358-.214-.761-.551-.506L9.728 7.381a.48.48 0 0 1-.578.002L7.281 5.98a1.2 1.2 0 0 0-1.735.32z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="chat-box-title">Messenger</h3>
                    <p className="chat-box-subtitle">
                      Chat với chúng tôi trên Messenger
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="chat-icon zalo-icon">
                    <span className="zalo-text-icon-small">Zalo</span>
                  </div>
                  <div>
                    <h3 className="chat-box-title">Zalo</h3>
                    <p className="chat-box-subtitle">
                      Liên hệ với chúng tôi qua Zalo
                    </p>
                  </div>
                </>
              )}
            </div>
            <button
              className="chat-box-close"
              onClick={closeChat}
              aria-label="Đóng chat"
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
          </div>
          <div className="chat-box-content">
            {activeChat === "messenger" ? (
              <div className="chat-box-message">
                <p>
                  Nhấn vào nút bên dưới để bắt đầu trò chuyện với chúng tôi trên
                  Messenger.
                </p>
                <a
                  href={messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chat-box-button messenger-button"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="currentColor"
                      d="M0 7.76C0 3.301 3.493 0 8 0s8 3.301 8 7.76-3.493 7.76-8 7.76c-.81 0-1.586-.107-2.316-.307a.64.64 0 0 0-.427.03l-1.588.702a.64.64 0 0 1-.898-.566l-.044-1.423a.64.64 0 0 0-.215-.456C.956 12.108 0 10.092 0 7.76m5.546-1.459-2.35 3.728c-.225.358.214.761.551.506l2.525-1.916a.48.48 0 0 1 .578-.002l1.869 1.402a1.2 1.2 0 0 0 1.735-.32l2.35-3.728c.226-.358-.214-.761-.551-.506L9.728 7.381a.48.48 0 0 1-.578.002L7.281 5.98a1.2 1.2 0 0 0-1.735.32z"
                    />
                  </svg>
                  Mở Messenger
                </a>
              </div>
            ) : (
              <div className="chat-box-message">
                <p>
                  Quét mã QR hoặc nhấn vào nút bên dưới để liên hệ với chúng tôi
                  qua Zalo.
                </p>
                <a
                  href={`https://zalo.me/${zaloPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chat-box-button zalo-button"
                >
                  <span className="zalo-text-icon-tiny">Zalo</span>
                  Mở Zalo
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Buttons */}
      <div className="floating-chat-buttons">
        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            className="chat-button back-to-top-button"
            onClick={scrollToTop}
            aria-label="Lên đầu trang"
            title="Lên đầu trang"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        )}

        {/* Contact Button */}
        <div style={{ position: "relative" }}>
          {/* Options panel */}
          {showOptions && (
            <div
              style={{
                position: "absolute",
                bottom: "72px",
                right: 0,
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                padding: 10,
                width: 240,
                zIndex: 50,
              }}
            >
              {/* Open customer info popup (combined): Đăng ký thông tin & để lại lời nhắn */}
              <button
                className="chat-button"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#fff",
                  color: "#222",
                  border: "1px solid #E5E5E5",
                  borderRadius: 10,
                  padding: "10px 12px",
                  marginBottom: 8,
                }}
                onClick={() => {
                  sessionStorage.removeItem("customerInfoPopupShown");
                  setShowOptions(false);
                  setIsOpen(false);
                  setActiveChat(null);
                  setCustomerPopupKey((k) => k + 1);
                  setShowCustomerPopup(true);
                }}
              >
                <span className="contact-option-icon" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="5" width="18" height="14" rx="2" ry="2" stroke="white" strokeWidth="2" fill="none"/>
                    <path d="M3 7l9 7 9-7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span style={{ fontWeight: 700 }}>Đăng ký thông tin & để lại lời nhắn</span>
              </button>
              <button
                className="chat-button"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#1877F2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 12px",
                  marginBottom: 8,
                }}
                onClick={() => {
                  setShowOptions(false);
                  setIsOpen(false);
                  setActiveChat(null);
                  window.open(messengerUrl, "_blank", "noopener,noreferrer");
                }}
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 7.76C0 3.301 3.493 0 8 0s8 3.301 8 7.76-3.493 7.76-8 7.76c-.81 0-1.586-.107-2.316-.307a.64.64 0 0 0-.427.03l-1.588.702a.64.64 0 0 1-.898-.566l-.044-1.423a.64.64 0 0 0-.215-.456C.956 12.108 0 10.092 0 7.76m5.546-1.459-2.35 3.728c-.225.358.214.761.551.506l2.525-1.916a.48.48 0 0 1 .578-.002l1.869 1.402a1.2 1.2 0 0 0 1.735-.32l2.35-3.728c.226-.358-.214-.761-.551-.506L9.728 7.381a.48.48 0 0 1-.578.002L7.281 5.98a1.2 1.2 0 0 0-1.735.32z" />
                </svg>
                <span style={{ fontWeight: 700 }}>Messenger</span>
              </button>
              <button
                className="chat-button"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#fff",
                  color: "#0068FF",
                  border: "1px solid #E5E5E5",
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
                onClick={() => {
                  setShowOptions(false);
                  setIsOpen(false);
                  setActiveChat(null);
                  const link = zaloUrl || `https://zalo.me/${zaloPhone}`;
                  window.open(link, "_blank", "noopener,noreferrer");
                }}
              >
                <span className="zalo-text-icon" style={{ fontSize: 14 }}>Zalo</span>
                <span style={{ fontWeight: 700, color: "#222" }}>Liên hệ Zalo</span>
              </button>
            </div>
          )}

          <button
            className={`chat-button contact-button ${showOptions ? 'active' : ''}`}
            aria-label={showOptions ? 'Đóng' : 'Liên hệ'}
            title={showOptions ? 'Đóng' : 'Liên hệ'}
            onClick={() => setShowOptions((v) => !v)}
          >
            {showOptions ? (
              // X icon when panel is open
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <>
                {/* Chat bubbles icon */}
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M21 6h-2V5a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h1v3a1 1 0 0 0 1.64.77L11.25 15H16a3 3 0 0 0 3-3V9h2a1 1 0 0 0 0-2ZM16 12H10a1 1 0 0 0-.64.23L9 12.53V12H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1Zm3 2h-1v1a3 3 0 0 1-3 3h-3.75l-3.61 3.04A1 1 0 0 1 6 20v-3H5a3 3 0 0 1-3-3v-1a1 1 0 1 1 2 0v1a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v1.47l2.39-2a1 1 0 0 1 .64-.23H15a1 1 0 0 0 1-1v-1a1 1 0 1 1 2 0Z" />
                </svg>
                <span className="contact-button__label">Liên hệ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 999, // Đặt cuối cùng để luôn ở dưới cùng
};
