/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Image } from "@components/common/Image.js";
import { useProduct } from "@components/frontStore/catalog/productContext.js";
import "./Media.scss";

const SliderComponent = Slider as any;

type SliderType = any;

const PrevArrow = (props: any) => {
  const { className, onClick } = props;
  return (
    <button
      className={`${className} custom-arrow prev-arrow`}
      onClick={onClick}
      aria-label="Previous slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
};

const NextArrow = (props: any) => {
  const { className, onClick } = props;
  return (
    <button
      className={`${className} custom-arrow next-arrow`}
      onClick={onClick}
      aria-label="Next slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  );
};

// Arrow cho thumbnail slider (màu đen)
const ThumbPrevArrow = (props: any) => (
  <button
    type="button"
    className="thumb-arrow thumb-prev-arrow"
    onClick={props.onClick}
    style={{
      display: "block",
      margin: "0 auto",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      outline: "none",
    }}
    aria-label="Scroll up"
  >
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  </button>
);

const ThumbNextArrow = (props: any) => (
  <button
    type="button"
    className="thumb-arrow thumb-next-arrow"
    onClick={props.onClick}
    style={{
      display: "block",
      margin: "0 auto",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      outline: "none",
    }}
    aria-label="Scroll down"
  >
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  </button>
);

interface ImageWithDimensionsProps {
  url: string;
  alt?: string;
  width: number;
  height: number;
}

interface MediaProps {
  imageSize?: {
    width: number;
    height: number;
  };
  thumbnailSize?: {
    width: number;
    height: number;
  };
  modalSize?: {
    width: number;
    height: number;
  };
}

export const Media: React.FC<MediaProps> = ({
  imageSize = { width: 800, height: 800 }, // tăng kích thước hình chính
  thumbnailSize = { width: 70, height: 90 }, // giảm bề ngang thumbnail
  modalSize = { width: 1200, height: 1200 },
}) => {
  const product = useProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const mainSliderRef = useRef<SliderType>(null);
  const modalSliderRef = useRef<SliderType>(null);
  // ref for main image container to attach non-passive wheel listener
  const mainContainerRef = useRef<HTMLDivElement | null>(null);
  // Responsive: track window width
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Attach wheel listener with passive: false so preventDefault() works
  useEffect(() => {
    const el = mainContainerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      // prevent page scroll while interacting with slider
      e.preventDefault();
      e.stopPropagation();
      if (!mainSliderRef.current) return;
      if ((e as any).deltaY > 0) {
        mainSliderRef.current.slickNext();
      } else if ((e as any).deltaY < 0) {
        mainSliderRef.current.slickPrev();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, [mainContainerRef, mainSliderRef]);

  const isMobile = windowWidth <= 768;

  // compute sizes used for rendering (responsive)
  const currentImageSize = isMobile
    ? {
        width: Math.max(
          280,
          Math.min(imageSize.width, Math.round(windowWidth * 0.95))
        ),
        height: Math.max(
          280,
          Math.round(Math.min(imageSize.height, Math.round(windowWidth * 0.95)))
        ),
      }
    : imageSize;

  const currentThumbSize = isMobile ? { width: 56, height: 56 } : thumbnailSize;

  const allImages: ImageWithDimensionsProps[] = [];

  const fullscreenWidth = modalSize.width * 1.5;
  const fullscreenHeight = modalSize.height * 1.5;

  if (product.image) {
    allImages.push({
      url: product.image.url,
      alt: product.image.alt || product.name,
      width: currentImageSize.width,
      height: currentImageSize.height,
    });
  }

  if (product.gallery && Array.isArray(product.gallery)) {
    product.gallery.forEach((img) => {
      allImages.push({
        url: img.url,
        alt: img.alt || product.name,
        width: currentImageSize.width,
        height: currentImageSize.height,
      });
    });
  }

  if (allImages.length === 0) {
    allImages.push({
      url: "/default-product-image.png",
      alt: product.name,
      width: currentImageSize.width,
      height: currentImageSize.height,
    });
  }

  // Thêm ref cho thumbnail slider nếu muốn điều khiển đồng bộ
  const thumbSliderRef = useRef<SliderType>(null);

  // Slider thumbnail settings (vertical)
  const thumbSliderSettings = {
    vertical: !isMobile,
    verticalSwiping: !isMobile,
    slidesToShow: isMobile
      ? Math.min(4, allImages.length)
      : Math.min(
          Math.floor(currentImageSize.height / currentThumbSize.height),
          allImages.length
        ),
    slidesToScroll: 1,
    focusOnSelect: true,
    arrows: allImages.length > 1,
    infinite: false,
    prevArrow: <ThumbPrevArrow />,
    nextArrow: <ThumbNextArrow />,
    beforeChange: (_: number, next: number) => {
      if (mainSliderRef.current) {
        mainSliderRef.current.slickGoTo(next);
      }
    },
    asNavFor: mainSliderRef.current,
    className: "thumbnail-slider-vertical",
  };

  // Xoá prevArrow, nextArrow khỏi mainSliderSettings, giữ swipe: true
  const mainSliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // Không hiện nút
    fade: false,
    swipe: true, // Cho phép trượt chuột
    vertical: !isMobile,
    verticalSwiping: !isMobile,
    beforeChange: (_: number, next: number) => {
      setActiveSlide(next);
    },
    asNavFor: thumbSliderRef.current,
  };

  // (Có thể giữ arrows cho modal hoặc cũng bỏ đi nếu muốn đồng nhất)
  const modalSliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // Không hiện nút trong modal nếu muốn
    fade: false,
    swipe: true,
    initialSlide: activeSlide,
    adaptiveHeight: true,
    lazyLoad: "ondemand",
    beforeChange: () => setIsImageLoading(true),
    afterChange: () => setIsImageLoading(false),
  };

  const openModal = (index: number) => {
    setActiveSlide(index);
    setIsModalOpen(true);

    setTimeout(() => {
      if (modalSliderRef.current) {
        modalSliderRef.current.slickGoTo(index);
      }
    }, 100);

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.removeEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "";
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    } else if (e.key === "ArrowRight" && modalSliderRef.current) {
      modalSliderRef.current.slickNext();
    } else if (e.key === "ArrowLeft" && modalSliderRef.current) {
      modalSliderRef.current.slickPrev();
    }
  };

  return (
    <div
      className={`product-media-container horizontal-layout ${
        isMobile ? "mobile-layout" : "desktop-layout"
      }`}
    >
      {/* Thumbnails bên trái */}
      <div
        className="thumbnail-slider-container media-thumbnails"
        style={{
          height: isMobile ? "auto" : currentImageSize.height + 10,
          marginRight: isMobile ? 0 : 12,
          minWidth: isMobile ? "auto" : currentThumbSize.width,
          maxWidth: isMobile ? "auto" : currentThumbSize.width,
        }}
      >
        <SliderComponent.default ref={thumbSliderRef} {...thumbSliderSettings}>
          {allImages.map((image, index) => (
            <div
              key={index}
              className={`thumbnail-wrapper${
                activeSlide === index ? " active" : ""
              }`}
              style={{
                width: currentThumbSize.width,
                height: currentThumbSize.height,
                cursor: "pointer",
                border:
                  activeSlide === index
                    ? "2px solid #0070f3"
                    : "2px solid transparent",
                boxSizing: "border-box",
                marginBottom: 8,
              }}
              onClick={() => {
                setActiveSlide(index);
                if (mainSliderRef.current) {
                  mainSliderRef.current.slickGoTo(index);
                }
              }}
            >
              <Image
                src={image.url}
                alt={image.alt || `Thumbnail ${index + 1}`}
                width={currentThumbSize.width}
                height={currentThumbSize.height}
                objectFit="contain"
                style={{ borderRadius: 0 }}
              />
            </div>
          ))}
        </SliderComponent.default>
      </div>

      {/* Hình ảnh chính */}
      <div className="main-image-container">
        <div tabIndex={0} ref={mainContainerRef} className="main-image-wrapper">
          <SliderComponent.default
            ref={mainSliderRef}
            {...mainSliderSettings}
            className="product-slider"
          >
            {allImages.map((image, index) => (
              <div
                key={index}
                className="product-image"
                onClick={() => openModal(index)}
              >
                <Image
                  src={image.url}
                  alt={image.alt || "Product image"}
                  width={currentImageSize.width}
                  height={currentImageSize.height}
                  objectFit="scale-down"
                  style={{ borderRadius: 0 }}
                />
              </div>
            ))}
          </SliderComponent.default>
        </div>
      </div>

      {isModalOpen && (
        <div className="product-image-modal">
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close fullscreen view"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="modal-slider-container">
              {isImageLoading && (
                <div className="loading-indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="spinner"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a10 10 0 1 0 10 10"></path>
                  </svg>
                </div>
              )}
              <SliderComponent.default
                ref={modalSliderRef}
                {...modalSliderSettings}
              >
                {allImages.map((image, index) => (
                  <div key={index} className="modal-image">
                    <Image
                      src={image.url}
                      alt={image.alt || "Product image"}
                      width={fullscreenWidth}
                      height={fullscreenHeight}
                      objectFit="contain"
                    />
                  </div>
                ))}
              </SliderComponent.default>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        /* Base layout */
        .product-media-container {
          display: flex;
          align-items: flex-start;
        }
        
        .desktop-layout {
          flex-direction: row;
        }
        
        .mobile-layout {
          flex-direction: column;
        }
        
        .thumbnail-slider-container {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .main-image-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        
        .desktop-layout .main-image-wrapper {
          width: ${currentImageSize.width}px;
          height: ${currentImageSize.height}px;
        }
        
        .mobile-layout .main-image-wrapper {
          width: 100%;
          height: auto;
        }
        
        /* Mobile layout: stack and make images fluid */
        @media (max-width: 768px) {
          .product-media-container {
            padding: 0;
            width: 100%;
          }
          
          .media-thumbnails {
            display: none !important;
          }
          
          .thumbnail-slider-container {
            display: none !important;
          }
          
          .main-image-container {
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .main-image-wrapper {
            width: 100% !important;
            height: auto !important;
          }
          
          .product-slider {
            width: 100% !important;
          }
          
          .product-image {
            width: 100% !important;
            height: auto !important;
            min-height: 280px;
          }
          
          .product-image img, 
          .product-image picture, 
          .product-image > div, 
          .product-image > div > img {
            width: 100% !important;
            height: auto !important;
            max-width: 100% !important;
            object-fit: contain !important;
          }
          
          .modal-content {
            max-width: 100vw;
            width: 100vw;
            padding: 20px;
          }
          
          .modal-slider-container {
            width: 100%;
            max-width: 100%;
          }
        }
        
        /* Small mobile devices */
        @media (max-width: 480px) {
          .product-image {
            min-height: 240px;
          }
        }
      `}</style>
    </div>
  );
};
