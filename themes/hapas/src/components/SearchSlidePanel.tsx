import React, { useState, useEffect, useRef } from "react";

interface SearchProduct {
  productId: number;
  name: string;
  url: string;
  urlKey: string;
  price: {
    regular: { value: number; text: string };
    special?: { value: number; text: string };
  };
  image?: { url: string; alt?: string | null } | null;
}

interface SearchSlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchSlidePanel({ isOpen, onClose }: SearchSlidePanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<SearchProduct[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all products khi component mount
  useEffect(() => {
    if (isOpen && allProducts.length === 0) {
      fetchAllProducts();
    }
  }, [isOpen, allProducts.length]);

  // Focus vào input khi panel mở
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query SearchProducts {
              products(
                filters: [
                  { key: "status", operation: eq, value: "1" }
                ],
                limit: 50
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
          `,
        }),
      });
      const data = await res.json();
      if (data?.data?.products?.items) {
        setAllProducts(data.data.products.items);
        setProducts(data.data.products.items);
      }
    } catch (err) {
      // Silent error
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setProducts(allProducts);
      return;
    }

    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setProducts(filtered);
  }, [searchQuery, allProducts]);

  const formatPrice = (value: number) => {
    return value.toLocaleString("vi-VN") + "₫";
  };

  const calculateDiscount = (regular: number, special?: number) => {
    if (!special) return 0;
    return Math.round(((regular - special) / regular) * 100);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Slide Panel */}
      <div
        className="fixed top-0 left-0 h-full w-full md:w-[500px] bg-white z-[9999] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">
            Tìm kiếm sản phẩm
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Đóng"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập tên sản phẩm..."
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#79192A] focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#79192A]" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery.trim() 
                  ? `Không tìm thấy sản phẩm "${searchQuery}"`
                  : "Nhập từ khóa để tìm kiếm sản phẩm"
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => {
                const discount = product.price.special?.value
                  ? calculateDiscount(
                      product.price.regular.value,
                      product.price.special.value
                    )
                  : 0;

                return (
                  <a
                    key={product.productId}
                    href={product.url || `/product/${product.urlKey}`}
                    className="flex gap-4 p-3 rounded-lg border border-gray-200 hover:border-[#79192A] hover:shadow-md transition-all duration-200"
                    onClick={onClose}
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded overflow-hidden relative">
                      {product.image?.url ? (
                        <img
                          src={product.image.url}
                          alt={product.image.alt || product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                      {discount > 0 && (
                        <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                          -{discount}%
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {product.price.special?.value ? (
                          <>
                            <span className="text-base font-bold text-red-500">
                              {formatPrice(product.price.special.value)}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(product.price.regular.value)}
                            </span>
                          </>
                        ) : (
                          <span className="text-base font-bold text-gray-900">
                            {formatPrice(product.price.regular.value)}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
