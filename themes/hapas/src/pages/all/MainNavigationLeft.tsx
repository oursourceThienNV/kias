import React, { useEffect, useMemo, useState } from 'react';
import type { ComponentLayout } from '@evershop/evershop';

/* === GraphQL query (y hệt bạn đưa) === */
export const query = `
  query NavigationData {
    categories(
      filters: [
        { key: "status", operation: eq, value: "1" },
        { key: "include_in_nav", operation: eq, value: "1" }
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

interface Category {
  categoryId: string;
  name: string;
  url: string;
  urlKey: string;
}

interface NavItem {
  id: string;
  label: string;
  url: string;
  submenu?: Array<{ id: string; label: string; url: string }>;
}

interface MainNavigationProps {
  categories?: Category[];
  navigationConfig?: { primary: NavItem[] };
  graphqlEndpoint?: string;       // mặc định /api/graphql
  colorHex?: string;              // màu chữ
  debugCategories?: boolean;      // in JSON navItems
}

const categoryMap: Record<string, string> = {
  'Set Bộ': 'set-bo',
  'Váy & Đầm': 'vay-dam',
  'Quần': 'quan',
  'Áo': 'ao',
  'Hàng mới về': 'new-arrivals',
  'Giá mới hấp dẫn': 'sale'
};

const defaultNavItems: NavItem[] = [
  { id: 'new',     label: 'MỚI',             url: '/ao' },
  { id: 'set-bo',  label: 'SẢN PHẨM',          url: '/quan' },
  { id: 'vay-dam', label: 'QUÀ TẶNG',       url: '/vay-dam' },
  { id: 'quan',    label: 'GIÁ MỚI HẤP DẪN',            url: '/set-bo' },
  { id: 'ao',      label: 'CỬA HÀNG',              url: '/men' },
];

export default function MainNavigationLeft({
  categories = [],
  navigationConfig,
  graphqlEndpoint = '/api/graphql',
  colorHex = '#22295B',
  debugCategories = false
}: MainNavigationProps) {
  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const shouldFetch = !Array.isArray(categories) || categories.length === 0;

  useEffect(() => {
    if (!shouldFetch) return;
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch(graphqlEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
          signal: ctrl.signal
        });
        const json = await res.json();
        const items: Category[] = (json?.data?.categories?.items || []).map((c: any) => ({
          categoryId: String(c.categoryId ?? ''),
          name: String(c.name ?? ''),
          url: String(c.url ?? ''),
          urlKey: String(c.urlKey ?? '')
        }));
        setApiCategories(items);
        // debug console
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.log('NavigationData (API):', items);
        }
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Fetch NavigationData error:', e);
        }
        setApiCategories([]);
      }
    })();
    return () => ctrl.abort();
  }, [graphqlEndpoint, shouldFetch]);

  const source = (Array.isArray(categories) && categories.length > 0) ? categories : apiCategories;

  const dynamicNavItems: NavItem[] = useMemo(
    () =>
      (Array.isArray(source) ? source : [])
        .filter(cat => categoryMap[cat.name])
        .map(cat => ({
          id: cat.categoryId,
          label: cat.name.toUpperCase(),
          url: cat.url || `/${categoryMap[cat.name]}`
        })),
    [source]
  );

  const navItems: NavItem[] = defaultNavItems

  return (
    <nav
      aria-label="Main Navigation"
      className="flex items-center gap-3 sm:gap-5"
      style={{ color: colorHex }}
    >
      <ul className="flex items-center gap-4 sm:gap-6 m-0 p-0 list-none">
        {navItems.map(item => (
          <li
            key={item.id}
            className="relative whitespace-nowrap"
            onMouseEnter={() => setActiveDropdown(item.id)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <a
              href={item.url}
              className="inline-flex items-center gap-1 text-[13px] tracking-[0.08em] uppercase no-underline hover:opacity-80 transition-opacity"
              style={{ color: '#79192A' }}
              role="button"
              aria-haspopup={item.submenu ? 'true' : 'false'}
              aria-expanded={activeDropdown === item.id}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveDropdown(prev => prev === item.id ? null : item.id);
                } else if (e.key === 'Escape') {
                  setActiveDropdown(null);
                }
              }}
            >
              {item.label}
            </a>

            {item.submenu && activeDropdown === item.id && (
              <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md border border-gray-100 min-w-[220px] z-30" role="menu">
                <ul className="py-2">
                  {item.submenu.map(sub => (
                    <li key={sub.id}>
                      <a href={sub.url} className="block px-4 py-2 text-[13px] text-gray-800 hover:bg-gray-50 no-underline" role="menuitem">
                        {sub.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* search icon nhỏ ở cuối dãy */}
      <a
        href="/search"
        aria-label="Tìm kiếm"
        className="ml-1 inline-flex items-center justify-center w-6 h-6 hover:opacity-80 transition-opacity"
        style={{ color: colorHex }}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="6.2" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M14.5 14.5L18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </a>

      {debugCategories && (
        <pre className="ml-4 max-h-40 overflow-auto text-xs text-gray-700 bg-gray-100 rounded p-2">
          {JSON.stringify(navItems, null, 2)}
        </pre>
      )}
    </nav>
  );
}

/* ĐĂNG KÝ BÊN TRÁI */
export const layout: ComponentLayout = {
  areaId: 'headerMiddleLeft',
  sortOrder: 10
};
