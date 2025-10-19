import React from 'react';

type Category = {
    categoryId: number;
    name: string;
    url: string;
    urlKey: string;
    image?: { url: string; alt?: string | null } | null;
    // Nếu backend có trường icon riêng thì bạn có thể thêm ở đây:
    // icon?: { url: string; alt?: string | null } | null;
};

type CategoriesData = {
    items: Category[];
};

interface Props {
    title?: string;
    categories?: CategoriesData; // <- dữ liệu từ query GraphQL
    viewAllHref?: string;
    /**
     * Map icon theo urlKey, ví dụ:
     * { satchel: 'https://.../satchel.png', hobo: 'https://.../hobo.png', ... }
     */
    iconMap?: Record<string, string>;
    /**
     * Nếu iconMap không có, sẽ fallback: `${iconBasePath}${urlKey}.png`
     * set "" để tắt fallback.
     */
    iconBasePath?: string;
    /** Chiều cao icon (px) */
    iconHeight?: number;
}

export default function CategoryTiles({
    title = 'DÁNG TÚI BẠN CẦN',
    categories,
    viewAllHref = '/collections/all-bag-styles',
    iconMap = {},
    iconBasePath = '', // ví dụ: 'https://file.hstatic.net/.../'; nếu để '' thì không dùng fallback
    iconHeight = 80
}: Props) {
    const tiles = categories?.items ?? [];
    if (!tiles.length) return null;

    return (
        <section className="container my-14 md:my-20" style={{ marginTop:50 }} aria-labelledby="category-tiles-title">
            {/* Header (giữ nguyên class giống snippet) */}
            <div className="mb-6 md:mb-8 flex items-end justify-between">
                <div>
                    <h2 id="category-tiles-title" className="text-[28px] md:text-[36px] font-semibold tracking-wide uppercase">
                        {title}
                    </h2>
                    <a
                        href={viewAllHref}
                        className="mt-2 inline-flex items-center gap-2 text-[15px] text-gray-700 hover:text-gray-900"
                    >
                        Xem thêm
                        <svg width="18" height="18" viewBox="0 0 24 24" className="translate-y-[1px]" aria-hidden="true">
                            <path
                                d="M5 12h14M13 5l7 7-7 7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Grid (giữ nguyên class giống snippet) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {tiles.map((x) => {
                    const label = x.name;
                    const href = x.url;
                    const img = x.image?.url || '/placeholder-category.jpg';
                    // Ưu tiên iconMap, sau đó fallback iconBasePath + urlKey + ".png"
                    const iconSrc =
                        iconMap[x.urlKey] ||
                        (iconBasePath ? `${iconBasePath}${x.urlKey}.png` : undefined);

                    return (
                        <div className="group" key={x.categoryId ?? x.url ?? x.urlKey}>
                            <a
                                href={href}
                                className="relative block overflow-hidden rounded-2xl"
                                style={{ aspectRatio: '4 / 5' } as React.CSSProperties}
                                aria-label={label}
                            >
                                <img
                                    src={img}
                                    alt={x.image?.alt || label}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </a>
                            <div className="mt-3 text-sm text-gray-700">{label}</div>

                            {/* Icon (chỉ render nếu có) */}
                            {iconSrc && (
                                <div className="mt-4">
                                    <img
                                        src={iconSrc}
                                        style={{ width: 'auto', height: iconHeight }}
                                        alt={`${label} icon`}
                                        className="h-12 w-auto select-none"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </section>
    );
}
export const layout = { areaId: 'content', sortOrder: 20 };

/** Query GraphQL tương ứng */
export const query = `
  query CategoryTilesData {
    categories(
      filters: [
        { key: "status", operation: eq, value: "1" }
      ]
    ) {
      items {
        categoryId
        name
        url
        urlKey
        image { url alt }
      }
    }
  }
`;

