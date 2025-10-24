import Area from "@components/common/Area.js";
import { Media } from "@components/frontStore/catalog/Media.js";
import {
  ProductData,
  ProductProvider,
} from "@components/frontStore/catalog/productContext.js";
// import { ProductSingleAttributes } from "@components/frontStore/catalog/ProductSingleAttributes.js";
// import { ProductSingleDescription } from "@components/frontStore/catalog/ProductSingleDescription.js";
// import { ProductSingleForm } from "@components/frontStore/catalog/ProductSingleForm.js";
import { ProductSingleName } from "@components/frontStore/catalog/ProductSingleName.js";
import ProductVideo from "@components/frontStore/catalog/ProductVideo.js";
import ProductContains from "@components/frontStore/catalog/ProductContains.js";
import ProductRecommendations from "@components/frontStore/catalog/ProductRecommendations.js";
import React from "react";

export default function ProductView({ product }: ProductData) {
  return (
    <ProductProvider product={product}>
      <div className="product__detail">
        <Area id="productPageTop" className="product__page__top" />
        <div className="product__page__middle page-width">
          {/* Hàng 1: Media + Thông tin sản phẩm & Accordion */}
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
            <Area
              id="productPageMiddleLeft"
              className="product__detail__left"
              coreComponents={[
                {
                  component: { default: <Media /> },
                  sortOrder: 0,
                  id: "media",
                },
              ]}
            />
            <Area
              id="productPageMiddleRight"
              className="product__detail__right"
              coreComponents={[
                {
                  component: {
                    default: (() => {
                      // State cho số lượng và size
                      const [quantity, setQuantity] = React.useState(1);
                      const [size, setSize] = React.useState(24);

                      // Hàm xử lý tăng/giảm số lượng
                      const handleDecrease = () => {
                        setQuantity((q) => (q > 1 ? q - 1 : 1));
                      };
                      const handleIncrease = () => {
                        setQuantity((q) => q + 1);
                      };

                      // Hàm xử lý đổi size (nếu cần mở rộng sau này)
                      // const handleSizeChange = (newSize: number) => setSize(newSize);

                      return (
                        <div
                          className="product-info-box"
                          style={{
                            padding: "36px 32px 32px 32px",
                            background: "#fff",
                            borderRadius: 14,
                            boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                            width: "100%",
                            maxWidth: "100%",
                            margin: 0,
                          }}
                        >
                          {/* Tên sản phẩm */}
                          <div
                            className="product-name-text"
                            style={{
                              fontWeight: 700,
                              fontSize: 24,
                              marginBottom: 14,
                            }}
                          >
                            <ProductSingleName />
                          </div>
                          {/* Giá sản phẩm */}
                          <div
                            className="product-price-text"
                            style={{
                              color: "#FF7A7A",
                              fontWeight: 700,
                              fontSize: 24,
                              marginBottom: 22,
                            }}
                          >
                            <ProductPrice quantity={quantity} />
                          </div>
                          <hr style={{ margin: "22px 0" }} />
                          {/* Màu sắc */}
                          <div style={{ marginBottom: 18 }}>
                            <div style={{ marginBottom: 8, fontSize: 17 }}>
                              Màu sắc:
                            </div>
                            <div style={{ display: "flex", gap: 14 }}>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 26,
                                  height: 26,
                                  borderRadius: "50%",
                                  border: "2px solid #C3CBD6",
                                  background: "#C3CBD6",
                                  cursor: "pointer",
                                }}
                              />
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 26,
                                  height: 26,
                                  borderRadius: "50%",
                                  border: "2px solid #000",
                                  background: "#fff",
                                  cursor: "pointer",
                                }}
                              />
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 26,
                                  height: 26,
                                  borderRadius: "50%",
                                  border: "2px solid #E5E5E5",
                                  background: "#fff",
                                  cursor: "pointer",
                                }}
                              />
                            </div>
                          </div>
                          {/* Kích thước và giá trị size */}
                          <div style={{ marginBottom: 18 }}>
                            <div style={{ marginBottom: 8, fontSize: 17 }}>
                              Kích thước:
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                              }}
                            >
                              <div
                                style={{
                                  display: "inline-block",
                                  border: "1.5px solid #E5E5E5",
                                  borderRadius: 8,
                                  padding: "7px 22px",
                                  color: "#C3CBD6",
                                  fontWeight: 700,
                                  fontSize: 17,
                                  position: "relative",
                                  minWidth: 56,
                                }}
                              >
                                <span
                                  style={{
                                    position: "absolute",
                                    left: 8,
                                    top: 7,
                                    color: "#C3CBD6",
                                    fontSize: 15,
                                  }}
                                >
                                  ✕
                                </span>
                                <span style={{ marginLeft: 20 }}>{size}</span>
                              </div>
                              {/* Đã xoá số 24 bên phải */}
                            </div>
                          </div>
                          {/* Số lượng và link tìm cửa hàng */}
                          <div
                            className="quantity-section"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: 22,
                              flexWrap: "wrap",
                              gap: "12px",
                            }}
                          >
                            <div style={{ marginRight: 22 }}>
                              <span style={{ fontSize: 17 }}>Số lượng:</span>
                              <button
                                style={{
                                  marginLeft: 14,
                                  marginRight: 6,
                                  width: 34,
                                  height: 34,
                                  border: "1.5px solid #E5E5E5",
                                  borderRadius: 8,
                                  background: "#fff",
                                  fontWeight: 700,
                                  fontSize: 18,
                                  cursor: "pointer",
                                }}
                                onClick={handleDecrease}
                              >
                                -
                              </button>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 34,
                                  height: 34,
                                  border: "1.5px solid #E5E5E5",
                                  borderRadius: 8,
                                  background: "#fff",
                                  textAlign: "center",
                                  lineHeight: "34px",
                                  fontWeight: 700,
                                  fontSize: 17,
                                }}
                              >
                                {quantity}
                              </span>
                              <button
                                style={{
                                  marginLeft: 6,
                                  width: 34,
                                  height: 34,
                                  border: "1.5px solid #E5E5E5",
                                  borderRadius: 8,
                                  background: "#fff",
                                  fontWeight: 700,
                                  fontSize: 18,
                                  cursor: "pointer",
                                }}
                                onClick={handleIncrease}
                              >
                                +
                              </button>
                            </div>
                            <a
                              href="#"
                              style={{
                                color: "#22223B",
                                textDecoration: "underline",
                                fontSize: 17,
                              }}
                            >
                              Tìm cửa hàng còn hàng
                            </a>
                          </div>
                          {/* Nút mua ngay và hết hàng */}
                          <div style={{ marginBottom: 14 }}>
                            <button
                              style={{
                                width: "100%",
                                background: "#79192A",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 18,
                                padding: "14px 0",
                                border: "none",
                                borderRadius: 8,
                                marginBottom: 8,
                                letterSpacing: 1.5,
                                transition: "background 0.2s",
                              }}
                            >
                              MUA NGAY
                            </button>
                            <button
                              style={{
                                width: "100%",
                                background: "#fff",
                                color: "#C3CBD6",
                                fontWeight: 700,
                                fontSize: 18,
                                padding: "14px 0",
                                border: "1.5px solid #E5E5E5",
                                borderRadius: 8,
                                letterSpacing: 1.5,
                              }}
                            >
                              HẾT HÀNG
                            </button>
                          </div>
                          <hr style={{ margin: "20px 0" }} />
                          {/* Accordion thông tin */}
                          <div>
                            <ProductDetailsAccordion />
                            <WarrantyAccordion />
                          </div>
                        </div>
                      );
                    })(),
                  },
                  sortOrder: 10,
                  id: "customProductDetailRight",
                },
              ]}
            />
          </div>

          {/* Hàng 2: Video bên trái, ProductContains bên phải */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-7"
            style={{ marginTop: "28px", alignItems: "stretch" }}
          >
            <div>
              <ProductVideo />
            </div>
            <div>
              <ProductContains />
            </div>
          </div>

          {/* Hàng 3: Có thể bạn sẽ thích */}
          <div style={{ marginTop: "60px", marginBottom: "40px" }}>
            <ProductRecommendations />
          </div>
        </div>

        {/* Responsive Styles */}
        <style>{`
          @media (max-width: 768px) {
            .product-info-box {
              padding: 24px 20px !important;
              border-radius: 10px !important;
            }
            
            .product-name-text {
              font-size: 20px !important;
              margin-bottom: 12px !important;
            }
            
            .product-price-text {
              font-size: 20px !important;
              margin-bottom: 18px !important;
            }
            
            .quantity-section {
              flex-direction: column;
              align-items: flex-start !important;
              gap: 12px !important;
            }
            
            .quantity-section > div {
              margin-right: 0 !important;
            }
            
            .quantity-section a {
              font-size: 15px !important;
              margin-top: 8px;
            }
          }
          
          @media (max-width: 640px) {
            .product-info-box {
              padding: 20px 16px !important;
            }
            
            .product-name-text {
              font-size: 18px !important;
            }
            
            .product-price-text {
              font-size: 18px !important;
            }
          }
        `}</style>
        <Area id="productPageBottom" className="product__page__bottom" />
      </div>
    </ProductProvider>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 10,
};

export const query = `
query Query {
    product: currentProduct {
      name
      description
      sku
      price {
        regular {
          value
          text
        }
        special {
          value
          text
        }
      }
      inventory {
        isInStock
      }
      attributes: attributeIndex {
        attributeName
        attributeCode
        optionText
      }
      image {
        alt
        url
      }
      gallery {
        alt
        url
      }
      variantGroup {
        variantAttributes {
          attributeId
          attributeCode
          attributeName
          options {
            optionId
            optionText
            productId
          }
        }
        items {
          attributes {
            attributeCode
            optionId
          }
        }
      }
    }
}`;

// Sửa ProductPrice để nhận quantity và tính tổng giá
function ProductPrice({ quantity = 1 }: { quantity?: number }) {
  const pricePerItem = 1200000;
  const total = pricePerItem * quantity;
  return <span>{total.toLocaleString("vi-VN")}₫</span>;
}

// Accordion chi tiết sản phẩm với data cứng
function ProductDetailsAccordion() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ marginBottom: 8, overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: 17,
          padding: "12px 0",
          transition: "all 0.3s ease",
        }}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          style={{
            marginRight: 8,
            transition: "transform 0.3s ease",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          ▶
        </span>
        Thông tin chi tiết sản phẩm
      </div>
      <div
        style={{
          maxHeight: open ? "1000px" : "0",
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.5s ease, opacity 0.3s ease",
        }}
      >
        <div
          style={{ marginTop: 18, marginLeft: 24, fontSize: 16, color: "#222" }}
        >
          <div style={{ marginBottom: 12 }}>
            <b>Mã sản phẩm:</b> TDV250361
          </div>
          <div style={{ marginBottom: 12 }}>
            <b>Chất liệu:</b> Da PU cao cấp và Denim thật
          </div>
          <div style={{ marginBottom: 12 }}>
            <b>Thiết kế:</b>
            <div style={{ marginLeft: 16 }}>
              - 01 ngăn
              <br />
              - Đáy tròn
              <br />- Khoá kéo
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <b>Chiều dài:</b> 24 cm
          </div>
          <div style={{ marginBottom: 12 }}>
            <b>Chiều rộng:</b> 6 cm
          </div>
          <div style={{ marginBottom: 12 }}>
            <b>Chiều cao:</b> 12 cm
          </div>
          <div style={{ marginBottom: 12 }}>
            <b>Khối lượng:</b> 200 gr
          </div>
        </div>
      </div>
    </div>
  );
}

// Accordion chính sách bảo hành với data cứng từ ảnh
function WarrantyAccordion() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ marginBottom: 8, overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: 17,
          padding: "12px 0",
          transition: "all 0.3s ease",
        }}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          style={{
            marginRight: 8,
            transition: "transform 0.3s ease",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          ▶
        </span>
        Chính sách bảo hành
      </div>
      <div
        style={{
          maxHeight: open ? "2000px" : "0",
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.5s ease, opacity 0.3s ease",
        }}
      >
        <div
          style={{
            marginTop: 18,
            marginLeft: 24,
            fontSize: 16,
            color: "#222",
            lineHeight: 1.7,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            1. Điều kiện đổi trả
          </div>
          <div style={{ marginBottom: 8 }}>
            Quý Khách hàng cần kiểm tra tình trạng hàng hóa và có thể{" "}
            <span
              style={{
                color: "#0056b3",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              đổi hàng/ trả lại
            </span>{" "}
            hàng ngay tại thời điểm giao/nhận hàng trong những trường hợp sau:
          </div>
          <ul style={{ marginBottom: 8, paddingLeft: 20 }}>
            <li>
              Hàng không đúng chủng loại, mẫu mã trong đơn hàng đã đặt hoặc như
              trên website tại thời điểm đặt hàng.
            </li>
            <li>Không đủ số lượng, không đủ bộ như trong đơn hàng.</li>
            <li>
              Tình trạng bên ngoài bị ảnh hưởng như rách bao bì, bong tróc, bể
              vỡ...
            </li>
            <li>
              Khách hàng có trách nhiệm trình giấy tờ liên quan chứng minh sự
              thiếu sót trên để hoàn thành việc hoàn trả/đổi trả hàng hóa.
            </li>
          </ul>
          <div style={{ fontWeight: 700, marginBottom: 8, marginTop: 16 }}>
            2. Quy định về thời gian thông báo và gửi sản phẩm đổi trả
          </div>
          <div style={{ marginBottom: 8 }}>
            <b>Thời gian thông báo đổi trả:</b> trong vòng 48h kể từ khi nhận
            sản phẩm đối với trường hợp sản phẩm thiếu phụ kiện, quà tặng hoặc
            bể vỡ.
            <br />
            <b>Thời gian gửi chuyển trả sản phẩm:</b> trong vòng 14 ngày kể từ
            khi nhận sản phẩm.
            <br />
            <b>Địa điểm đổi trả sản phẩm:</b> Khách hàng có thể mang hàng trực
            tiếp đến văn phòng/cửa hàng của chúng tôi hoặc chuyển qua đường bưu
            điện.
            <br />
            Trong trường hợp Quý Khách hàng có ý kiến đóng góp/khiếu nại liên
            quan đến chất lượng sản phẩm, Quý Khách hàng vui lòng liên hệ đường
            dây chăm sóc khách hàng của chúng tôi.
          </div>
        </div>
      </div>
    </div>
  );
}
