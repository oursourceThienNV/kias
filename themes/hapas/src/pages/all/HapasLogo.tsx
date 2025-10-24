/**
 * HAPAS Logo Component
 *
 * - Centered logo matching hapas.vn layout
 * - Responsive sizing with proper constraints
 * - Fallback to Facebook CDN image if local logo fails
 * - Prevents overlap with navigation and header elements
 * - Optimized for Vietnamese brand identity
 */

import React from "react";
import "./HapasLogo.scss";

interface LogoConfig {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface HapasLogoProps {
  logoConfig?: LogoConfig;
}

export default function HapasLogo({
  logoConfig = {
    src: "/logo/logo-kias.webp",
    alt: "HAPAS E-commerce",
    width: 120,
    height: 40,
  },
}: HapasLogoProps) {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      className="flex items-center justify-center w-full"
      style={{ padding: "0 1rem", maxWidth: "300px" }}
    >
      <a
        href="/"
        className="flex items-center no-underline w-full"
        aria-label="HAPAS E-commerce - Trang chủ"
        style={{ display: "block", position: "relative", zIndex: 10 }}
      >
        {!imageError && logoConfig.src ? (
          <img
            src={logoConfig.src}
            alt={logoConfig.alt || ""}
            className="w-full h-auto object-contain"
            style={{
              maxHeight: "50px",
              minHeight: "30px",
              height: "auto",
              width: "100%",
            }}
            onError={() => setImageError(true)}
            loading="eager"
          />
        ) : (
          <img
            src="https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-1/404756484_312573534954573_932064301282126617_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=101&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=4FuqiUy71IQQ7kNvwEPn8HK&_nc_oc=AdnY4QoTelhtiqj1wD2eyoSmRWxp5067fN_sMYdwwwcFJPD2bD47aiQXG-CssPTemCo&_nc_zt=24&_nc_ht=scontent.fsgn2-4.fna&_nc_gid=zVXmxGTEigHI_1ri0vOpeg&oh=00_AfcgRtDCAe92cuKQpcWKEYCdujFWUTEwhkfEhUmc5ThH0Q&oe=68FBFFF3"
            alt="HAPAS"
            className="w-full h-auto object-contain"
            style={{
              maxHeight: "50px",
              minHeight: "30px",
              height: "auto",
              width: "100%",
            }}
          />
        )}
      </a>
    </div>
  );
}

export const layout = {
  areaId: "headerMiddleCenter",
  sortOrder: 1, // Lower than core Logo (sortOrder: 10) to render first
};
