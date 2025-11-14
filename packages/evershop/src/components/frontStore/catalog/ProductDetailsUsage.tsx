import React from "react";
import { useProduct } from "@components/frontStore/catalog/productContext.js";

export default function ProductDetailsUsage() {
  const [expanded, setExpanded] = React.useState(false);
  const product = useProduct();

  // Build details list from DB: sku + attributeIndex
  const attributes = Array.isArray(product?.attributes) ? product.attributes : [];
  const details: Array<{ label: string; value: string }> = [];
  if (product?.sku) {
    details.push({ label: "Mã sản phẩm", value: String(product.sku) });
  }
  attributes.forEach((attr: any) => {
    const label = attr?.attributeName;
    const value = attr?.optionText;
    if (label && value) {
      details.push({ label, value });
    }
  });

  // Usage content from DB with fallback sample when empty
  const rawDesc = (product as any)?.description;
  const usageText = typeof rawDesc === "string" ? rawDesc.trim() : "";
  const fallbackUsage = [
    "Giặt tay hoặc giặt máy chế độ nhẹ, nhiệt độ nước dưới 30°C.",
    "Không dùng thuốc tẩy, không ngâm lâu.",
    "Phơi nơi thoáng mát, tránh ánh nắng trực tiếp.",
    "Ủi ở nhiệt độ trung bình, tránh lên bề mặt in/thêu.",
    "Giặt riêng sản phẩm màu đậm trong những lần giặt đầu."
  ].join("\n");
  const usageDisplay = usageText || fallbackUsage;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {details.length > 0 && (
        <>
          <h3
            style={{
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: 0.2,
              color: "#22223B",
              marginBottom: 10,
            }}
          >
            Thông tin chi tiết
          </h3>
          <ul
            style={{
              marginLeft: 18,
              marginBottom: 14,
              lineHeight: 1.7,
              color: "#333",
              listStyle: "disc",
            }}
          >
            {details.map((d, i) => (
              <li key={i}>
                <b>{d.label}:</b> {d.value}
              </li>
            ))}
          </ul>
          <hr style={{ border: 0, borderTop: "1px solid #F0F2F5", margin: "10px 0 16px" }} />
        </>
      )}

      {usageDisplay && (
        <>
          <h3
            style={{
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: 0.2,
              color: "#22223B",
              marginBottom: 10,
            }}
          >
            Hướng dẫn sử dụng
          </h3>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              transition: "max-height 220ms ease",
              maxHeight: expanded ? "1000px" : 180,
            }}
          >
            <div
              style={{
                marginLeft: 18,
                lineHeight: 1.7,
                color: "#333",
                whiteSpace: "pre-wrap",
              }}
            >
              {usageDisplay}
            </div>
            {!expanded && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 42,
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))",
                }}
              />
            )}
          </div>
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              marginTop: 14,
              alignSelf: "flex-start",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #E5E5E5",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 700,
              color: "#22223B",
            }}
          >
            {expanded ? "Thu gọn" : "Xem thêm"}
          </button>
        </>
      )}
    </div>
  );
}
