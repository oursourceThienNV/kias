import React from "react";

export default function ProductDetailsUsage() {
  const [expanded, setExpanded] = React.useState(false);
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
        <li>Mã sản phẩm: TDV250361</li>
        <li>Chất liệu: Cotton pha Spandex, thoáng mát</li>
        <li>Kiểu dáng: Regular fit, bo gấu</li>
        <li>Xuất xứ: Việt Nam</li>
      </ul>
      <hr style={{ border: 0, borderTop: "1px solid #F0F2F5", margin: "10px 0 16px" }} />

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
        <ol
          style={{
            marginLeft: 18,
            lineHeight: 1.7,
            color: "#333",
          }}
        >
          <li>Giặt tay hoặc giặt máy chế độ nhẹ, nhiệt độ nước dưới 30°C.</li>
          <li>Không dùng thuốc tẩy, không ngâm lâu.</li>
          <li>Phơi nơi thoáng mát, tránh ánh nắng trực tiếp.</li>
          <li>Ủi ở nhiệt độ trung bình, tránh lên bề mặt in/thêu.</li>
          <li>Giặt riêng sản phẩm màu đậm trong những lần giặt đầu.</li>
          <li>Lộn trái khi giặt và phơi để giữ màu tốt hơn.</li>
          <li>Không sấy ở nhiệt độ cao để tránh co rút.</li>
          <li>Không vắt xoắn mạnh đối với chất liệu mỏng.</li>
          <li>Tránh tiếp xúc với bề mặt nhám gây xù lông.</li>
          <li>Bảo quản ở nơi khô ráo, thoáng mát.</li>
          <li>Tránh sử dụng bàn chải cứng khi giặt.</li>
          <li>Sử dụng bột giặt dịu nhẹ, không chứa chất tẩy mạnh.</li>
          <li>Ủi mặt trái đối với vải có in/ thêu/ đính.</li>
          <li>Hạn chế ngâm quá 15 phút để giữ form vải.</li>
          <li>Không tiếp xúc trực tiếp với dung môi/ hóa chất.</li>
        </ol>
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
    </div>
  );
}
