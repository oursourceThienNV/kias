/**
 * Floating Chat Widget Component - HAPAS
 * Messenger và Zalo chat buttons ở góc phải
 */

import React, { useState, useEffect } from "react";
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

        {/* Messenger Button */}
        <button
          className={`chat-button messenger-button ${
            isOpen && activeChat === "messenger" ? "active" : ""
          }`}
          onClick={() => toggleChat("messenger")}
          aria-label="Chat Messenger"
          title="Chat với Messenger"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M0 7.76C0 3.301 3.493 0 8 0s8 3.301 8 7.76-3.493 7.76-8 7.76c-.81 0-1.586-.107-2.316-.307a.64.64 0 0 0-.427.03l-1.588.702a.64.64 0 0 1-.898-.566l-.044-1.423a.64.64 0 0 0-.215-.456C.956 12.108 0 10.092 0 7.76m5.546-1.459-2.35 3.728c-.225.358.214.761.551.506l2.525-1.916a.48.48 0 0 1 .578-.002l1.869 1.402a1.2 1.2 0 0 0 1.735-.32l2.35-3.728c.226-.358-.214-.761-.551-.506L9.728 7.381a.48.48 0 0 1-.578.002L7.281 5.98a1.2 1.2 0 0 0-1.735.32z"
            />
          </svg>
        </button>

        {/* Zalo Button */}
        <button
          className={`chat-button zalo-button ${
            isOpen && activeChat === "zalo" ? "active" : ""
          }`}
          onClick={() => toggleChat("zalo")}
          aria-label="Chat Zalo"
          title="Chat với Zalo"
        >
          <span className="zalo-text-icon">Zalo</span>
        </button>
      </div>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 999, // Đặt cuối cùng để luôn ở dưới cùng
};
