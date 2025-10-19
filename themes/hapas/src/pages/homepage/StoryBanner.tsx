/**
 * Story Banner Component - HAPAS Homepage
 * "THE MAKING OF A BAG" content section + Bestseller (1 product from API)
 */

import React from 'react';
import './StoryBanner.scss';

interface MoneyText {
    value: number;
    text: string;
}

interface ProductPrice {
    regular?: MoneyText | null;
    special?: MoneyText | null;
}

interface ProductImage {
    url: string;
    alt?: string | null;
}

interface ProductItem {
    productId: number;
    name: string;
    url: string;
    urlKey: string;
    price?: ProductPrice | null;
    image?: ProductImage | null;
}

interface ProductsData {
    items: ProductItem[];
}

interface StoryBannerProps {
    title?: string;
    content?: string;
    /** Background media (video preferred) */
    videoSrc?: string;
    poster?: string;
    cta?: {
        text: string;
        url: string;
    };
    /** Layout cho copy vs media (giữ API nếu sau này cần ảnh tĩnh thay video) */
    layout?: 'image_left' | 'image_right';

    /** Dữ liệu sản phẩm bán chạy (query dưới cùng trả về 1 bản ghi) */
    BestsellersData?: {
        products: ProductsData;
    } | {
        items: ProductItem[]; // phòng trường hợp layer ngoài đã unwrap
    } | null;
}

export default function StoryBanner({
    title = 'THE MAKING OF A BAG',
    content,
    videoSrc = 'https://file.hstatic.net/200000978078/file/hapas_8__2_.mp4',
    poster = '/assets/images/hero-poster.jpg',
    cta = { text: 'Xem chi tiết', url: '/pages/the-making-of-a-bag' },
    layout = 'image_left',
    BestsellersData
}: StoryBannerProps) {
    // Copy mặc định nếu không truyền
    const defaultContent =
        'Mỗi sản phẩm được tạo ra không đơn thuần chỉ là một món đồ – mà là kết tinh của sự tỉ mỉ trong từng đường kim mũi chỉ, là kết quả của hàng giờ nghiên cứu, thử nghiệm và hoàn thiện. Từ khâu chọn chất liệu, phối màu đến thiết kế chi tiết nhỏ nhất, tất cả đều được thực hiện với tinh thần cầu toàn và niềm đam mê. Chúng tôi tin rằng, chỉ khi thực sự đặt trọn tâm huyết vào từng sản phẩm, mới có thể mang đến trải nghiệm xứng đáng tới bạn.';

    // Chuẩn hoá cách lấy 1 sản phẩm đầu tiên
    const items =
        (BestsellersData as any)?.products?.items ??
        (BestsellersData as any)?.items ??
        [];
    const product: ProductItem | undefined = items?.[0];

    const productHref = product?.url || '/products/bubbly';
    const productImg = product?.image?.url || 'https://file.hstatic.net/200000978078/file/img_8059_ddbccef8d7da49538562a1b9fcb28313.jpg';
    const productAlt = product?.image?.alt || product?.name || 'Bestseller';

    return (
        <section className="relative w-full h-screen story-banner" style={{marginTop:50}} data-layout={layout}>
            {/* BG video */}
            <video
                className="absolute inset-0 w-full h-full object-cover"
                src={videoSrc}
                poster={poster}
                autoPlay
                muted
                loop
                playsInline
            />

            {/* Gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Left copy */}
            <div className="absolute left-5 md:left-10 bottom-6 md:bottom-10 max-w-xl text-white">
                <h3 className="text-2xl md:text-3xl font-semibold tracking-wide">{title}</h3>
                <p className="mt-3 text-sm md:text-[15px] leading-6 opacity-90">
                    {content || defaultContent}
                </p>
                {cta?.url && cta?.text && (
                    <a href={cta.url} className="mt-4 inline-flex items-center gap-2 text-sm md:text-[15px]">
                        {cta.text}
                        <svg width="18" height="18" viewBox="0 0 24 24" className="translate-y-[1px]" aria-hidden="true">
                            <path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                )}
            </div>

            {/* Bestseller card (right-bottom) — chỉ render khi có product hoặc fallback */}
            <div className="absolute right-5 md:right-10 bottom-6 md:bottom-10">
                <div className="mb-2 flex items-left justify-end gap-2 text-white text-xs md:text-sm opacity-90">
                    <span>Sản phẩm bán chạy</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <a
                    href={productHref}
                    className="block w-[210px] h-[260px] bg-white rounded-xl overflow-hidden shadow-lg"
                    aria-label="Sản phẩm bán chạy"
                >
                    <img
                        src={productImg}
                        alt={productAlt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                    />
                </a>
            </div>
        </section>
    );
}

/** Gắn vào Page Builder nếu cần */
// export const layout = { areaId: 'content', sortOrder: 40 };

/**
 * ✅ Query: lấy đúng 1 bản ghi (limit: 1)
 * - Giữ filter status=1 như bạn đưa
 * - Kết quả: BestsellersData.products.items[0]
 */
export const query = `
  query BestsellersData {
    products(
      filters: [
        { key: "status", operation: eq, value: "1" }
      ],
      limit: 1
    ) {
      items {
        productId
        name
        url
        urlKey
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
        image {
          url
          alt
        }
      }
    }
  }
`;


export const layout = {
  areaId: 'content',
  sortOrder: 40
};

