import React from "react";

const leftList = ["Ví", "Sổ tay", "Điện thoại", "Đồ make-up", "Chìa khoá"];

const bags = [
  {
    image:
      "https://cdn.hstatic.net/products/200000978078/26.1_ec242fa30e88406389bab2b0be2c1af6_grande.jpg",
    colors: ["#222", "#fff", "#e5e5e5", "#000"],
    name: "TDV Hobo Nắp Gập Chain Handle - Bạc",
    price: 1007190,
    oldPrice: 1083000,
    discount: "Giảm 7%",
  },
  {
    image:
      "https://product.hstatic.net/200000978078/product/img_0112_4da90db586de42688a52cbb99cef6b55_large.jpg",
    colors: ["#000", "#fff", "#e5e5e5"],
    name: "TDV Hobo Nắp Gập Chain Handle - Đen",
    price: 1007190,
    oldPrice: 1083000,
    discount: "Giảm 7%",
  },
  {
    image:
      "https://product.hstatic.net/200000978078/product/img_1212_12ad01d38a7d4f518028b9e015be9358_large.jpg",
    colors: ["#fff", "#222", "#e5e5e5"],
    name: "TDV Hobo Nắp Gập Chain Handle - Trắng",
    price: 1007190,
    oldPrice: 1083000,
    discount: "Giảm 7%",
  },
  // ...bạn có thể thêm nhiều item để test scroll...
];

const ProductContains: React.FC = () => {
  return (
    <div
      className="product-contains-wrapper"
      style={{
        display: "flex",
        gap: 0,
        alignItems: "flex-start",
        width: "100%",
        height: "800px",
        background: "transparent",
      }}
    >
      {/* Left */}
      <div
        className="product-contains-left"
        style={{
          flex: 1,
          minWidth: 320,
          padding: "0 0 0 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "800px",
        }}
      >
        <div
          style={{
            fontFamily: "'Montserrat', 'Arial', sans-serif",
            fontWeight: 700,
            fontSize: 36,
            color: "#79192A",
            marginBottom: 20,
            letterSpacing: 1,
            lineHeight: 1.1,
          }}
        >
          TÚI CÓ THỂ CHỨA
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#222",
            marginBottom: 32,
            maxWidth: 420,
            lineHeight: 1.6,
          }}
        >
          TDV Nắp Gập Khoá H - Lock Sz 19 đủ đựng các vật dụng thiết yếu: điện
          thoại, ví, son phấn và một chút cá tính riêng.
        </div>
        <div style={{ marginTop: 30 }}>
          {leftList.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 16,
                marginBottom: 10,
                fontFamily: "'Montserrat', 'Arial', sans-serif",
              }}
            >
              <span
                style={{
                  width: 32,
                  color: "#222",
                  fontWeight: 400,
                  fontFamily: "monospace",
                  fontSize: 16,
                }}
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span style={{ color: "#222", fontWeight: 400 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Right: List card scrollable */}
      <div
        className="product-contains-right"
        style={{
          flex: 1.2,
          minWidth: 340, // giảm từ 400 xuống 340
          height: "800px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "32px 0 0 0",
        }}
      >
        <div
          style={{
            width: "100%",
            maxHeight: 736,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 0, // Không có khoảng cách giữa các card
            alignItems: "center",
            paddingRight: 8,
          }}
          className="product-contains-card-list"
        >
          {bags.map((bag, idx) => (
            <div
              key={idx}
              className="product-contains-card"
              style={{
                width: 340, // giảm từ 420 xuống 340
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                padding: "24px 18px 24px 18px", // giảm padding
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 12,
                border: "1.5px solid transparent",
                position: "relative",
                transition: "border 0.2s",
              }}
            >
              {/* Ảnh sản phẩm */}
              <div
                style={{
                  width: "100%",
                  height: 260, // giảm chiều cao ảnh
                  background: "#f5f5f5",
                  borderRadius: 4,
                  marginBottom: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                }}
              >
                <img
                  src={bag.image}
                  alt={bag.name}
                  style={{
                    width: 240,
                    height: 200,
                    objectFit: "contain",
                    borderRadius: 8,
                    background: "#f5f5f5",
                    border: "none",
                  }}
                />
              </div>
              {/* Màu sắc */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 16,
                  justifyContent: "center",
                }}
              >
                {bag.colors.map((color, cidx) => (
                  <span
                    key={cidx}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: color,
                      border: "1.5px solid #222",
                      display: "inline-block",
                    }}
                  />
                ))}
              </div>
              {/* Tên sản phẩm */}
              <div
                style={{
                  fontWeight: 500,
                  fontSize: 17,
                  color: "#222",
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                {bag.name}
              </div>
              {/* Giá và giá gạch */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 22,
                    color: "#FF7A7A",
                  }}
                >
                  {bag.price.toLocaleString("vi-VN")}₫
                </span>
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: 16,
                    color: "#222",
                    textDecoration: "line-through",
                  }}
                >
                  {bag.oldPrice.toLocaleString("vi-VN")}₫
                </span>
              </div>
              {/* Badge giảm giá */}
              <div
                style={{
                  background: "#fff",
                  color: "#FF7A7A",
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 4,
                  border: "1.5px solid #FF7A7A",
                  padding: "2px 18px",
                  marginBottom: 18,
                  display: "inline-block",
                }}
              >
                {bag.discount}
              </div>
              {/* Nút thêm vào giỏ hàng */}
              <button
                className="add-to-cart-btn"
                style={{
                  width: "100%",
                  background: "#222328",
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: 18,
                  padding: "14px 0",
                  border: "none",
                  borderRadius: 6,
                  marginTop: 8,
                  letterSpacing: 1,
                  cursor: "pointer",
                  display: "none",
                  transition: "display 0.2s",
                }}
              >
                THÊM VÀO GIỎ HÀNG
              </button>
            </div>
          ))}
        </div>
        <style>{`
          .product-contains-card-list {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
          }
          .product-contains-card-list::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
          .product-contains-card:hover {
            border: 1.5px solid #222 !important;
          }
          .product-contains-card:hover .add-to-cart-btn {
            display: block !important;
          }
          
          /* Responsive styles */
          @media (max-width: 1024px) {
            .product-contains-wrapper {
              flex-direction: column !important;
              height: auto !important;
            }
            
            .product-contains-left {
              height: auto !important;
              padding: 20px !important;
              min-width: 100% !important;
            }
            
            .product-contains-left > div:first-child {
              font-size: 28px !important;
              margin-bottom: 16px !important;
            }
            
            .product-contains-right {
              min-width: 100% !important;
              height: 600px !important;
              padding: 20px 0 !important;
            }
          }
          
          @media (max-width: 768px) {
            .product-contains-left > div:first-child {
              font-size: 24px !important;
            }
            
            .product-contains-right {
              height: 500px !important;
            }
            
            .product-contains-card {
              width: 280px !important;
              padding: 18px 14px !important;
            }
            
            .product-contains-card > div:first-child {
              height: 220px !important;
            }
            
            .product-contains-card img {
              width: 200px !important;
              height: 170px !important;
            }
          }
          
          @media (max-width: 640px) {
            .product-contains-left {
              padding: 16px !important;
            }
            
            .product-contains-left > div:first-child {
              font-size: 20px !important;
            }
            
            .product-contains-right {
              height: 450px !important;
            }
            
            .product-contains-card {
              width: 260px !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProductContains;
