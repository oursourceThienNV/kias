import React from "react";

const ProductVideo: React.FC = () => {
  return (
    <>
      <div
        className="product-video-wrapper"
        style={{ width: "100%", height: "800px" }}
      >
        <video
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          autoPlay
          muted
          loop
          playsInline
          src="https://cdn.hstatic.net/files/200000978078/file/thi_t_k__ch_a_c__t_n_015d11f140b844378bc0e729d965964a.mp4"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .product-video-wrapper {
            height: 600px !important;
          }
        }
        
        @media (max-width: 768px) {
          .product-video-wrapper {
            height: 400px !important;
          }
        }
        
        @media (max-width: 640px) {
          .product-video-wrapper {
            height: 300px !important;
          }
        }
      `}</style>
    </>
  );
};

export default ProductVideo;
