import { Image } from "@components/common/Image.js";
import { ProductNoThumbnail } from "@components/common/ProductNoThumbnail.js";
import { AddToCart } from "@components/frontStore/cart/AddToCart.js";
import { ProductData } from "@components/frontStore/catalog/productContext.js";
import React, { ReactNode } from "react";

export interface Product {
  productId: string;
  name: string;
  price: {
    regular: {
      value: number;
      text: string;
    };
    special?: {
      value: number;
      text: string;
    };
  };
  image: {
    url: string;
    alt: string;
  };
  gallery?: {
    url: string;
    alt?: string;
  }[];
  url: string;
  sku: string;
  inventory: {
    isInStock: boolean;
  };
  [key: string]: any;
}

export interface ProductListProps {
  products: ProductData[];
  imageWidth?: number;
  imageHeight?: number;
  isLoading?: boolean;
  emptyMessage?: string | ReactNode;
  className?: string;
  layout?: "grid" | "list";
  gridColumns?: number;
  showAddToCart?: boolean;
  customAddToCartRenderer?: (product: ProductData) => ReactNode;
  renderItem?: (product: ProductData) => ReactNode;
}
const DefaultProductItem = ({
  product,
  imageWidth,
  imageHeight,
  layout = "grid",
  showAddToCart = false,
  customAddToCartRenderer,
}: {
  product: ProductData;
  imageWidth?: number;
  imageHeight?: number;
  layout?: "grid" | "list";
  showAddToCart?: boolean;
  customAddToCartRenderer?: (product: ProductData) => ReactNode;
}) => {
  const formatPrice = (priceObj: any) => {
    try {
      if (!priceObj) return "";
      // prefer numeric value if present
      if (typeof priceObj.value === "number") {
        return (
          Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
            priceObj.value
          ) + "đ"
        );
      }
      // try to extract numeric from text
      if (priceObj.text && typeof priceObj.text === "string") {
        const digits = priceObj.text.replace(/[^0-9]/g, "");
        if (digits) {
          const num = parseInt(digits, 10);
          if (!isNaN(num)) {
            return (
              Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
                num
              ) + "đ"
            );
          }
        }
      }
    } catch (e) {
      // ignore
    }
    return "";
  };

  if (layout === "list") {
    return (
      <div className=" transition-transform product__list__item__inner group relative overflow-hidden flex gap-4 p-4">
        <div className="product__list__image flex-shrink-0">
          <a href={product.url}>
            {product.image && (
              <div className="w-36 h-36 flex items-center justify-center overflow-hidden bg-gray-50 rounded-lg">
                <Image
                  src={product.image.url}
                  alt={product.image.alt || product.name}
                  width={imageWidth || 120}
                  height={imageHeight || 120}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="transition-transform duration-300 ease-in-out group-hover:scale-105 w-auto h-full object-contain"
                />
              </div>
            )}
            {!product.image && (
              <div className="w-36 h-36 flex items-center justify-center bg-gray-100 rounded-lg">
                <ProductNoThumbnail width={imageWidth} height={imageHeight} />
              </div>
            )}
          </a>
        </div>

        <div className="product__list__info flex-1 flex flex-col justify-between">
          <div>
            <h3 className="product__list__name text-lg font-medium mb-2">
              <a
                href={product.url}
                className="hover:text-primary transition-colors"
              >
                {product.name}
              </a>
            </h3>

            <div className="product__list__sku text-sm text-gray-600 mb-2">
              SKU: {product.sku}
            </div>

            <div className="product__list__price mb-2">
              {product.price.special &&
              product.price.regular < product.price.special ? (
                <div className="flex items-center gap-2">
                  <span
                    className="regular-price text-sm"
                    style={{ textDecoration: "line-through", color: "#777" }}
                  >
                    {product.price.regular.text}
                  </span>
                  <span
                    className="special-price text-lg font-bold"
                    style={{ color: "#e53e3e" }}
                  >
                    {product.price.special.text}
                  </span>
                </div>
              ) : (
                <span className="regular-price text-lg font-bold">
                  {product.price.regular.text}
                </span>
              )}
            </div>

            <div className="product__list__stock mb-3">
              {product.inventory.isInStock ? (
                <span className="text-green-600 text-sm font-medium">
                  In Stock
                </span>
              ) : (
                <span className="text-red-600 text-sm font-medium">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          <div className="product__list__actions invisible transform translate-y-2 transition-all duration-300 ease-in-out group-hover:visible group-hover:translate-y-0">
            {customAddToCartRenderer ? (
              customAddToCartRenderer(product)
            ) : (
              <AddToCart
                product={{
                  sku: product.sku,
                  isInStock: product.inventory.isInStock,
                }}
                qty={1}
              >
                {(state, actions) => (
                  <button
                    className="product__list__add-to-cart transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg rounded-full"
                    style={{
                      padding: "10px 20px",
                      backgroundColor: state.isInStock ? "#3182ce" : "#a0aec0",
                      color: "white",
                      border: "none",
                      cursor: state.canAddToCart ? "pointer" : "not-allowed",
                      opacity: state.isLoading ? 0.7 : 1,
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                    disabled={!state.canAddToCart || state.isLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      actions.addToCart();
                    }}
                  >
                    {state.isLoading ? "Adding..." : "Add to Cart"}
                  </button>
                )}
              </AddToCart>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    // reserve space at bottom for the hover add-to-cart so showing it won't push other items
    <div className="product__list__item__inner group relative overflow-visible transition-all">
      {/* hover effect: black border, lift up and scale slightly, higher z-index and shadow */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-200 ease-in-out"></div>
      <div className="relative  group-hover:border group-hover:border-black rounded-md bg-white transition-transform duration-200 ease-in-out">
        <a href={product.url} className="product__list__link block">
          <div className="product__list__image overflow-hidden bg-gray-50 rounded-t-md">
            {product.image && product.image.url ? (
              <div className="w-full h-256 md:h-300 lg:h-320 flex items-center justify-center overflow-hidden bg-gray-50 rounded-t-md">
                <Image
                  src={product.image.url}
                  alt={product.image.alt || product.name}
                  width={imageWidth || 420}
                  height={imageHeight || 420}
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="w-auto h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-full h-48 md:h-56 lg:h-64 flex items-center justify-center bg-gray-100">
                <ProductNoThumbnail width={imageWidth} height={imageHeight} />
              </div>
            )}
          </div>
          <div className="product__list__info p-4 justify-center text-center">
            <h3 className="product__list__name text-sm font-normal text-gray-800 mb-2 line-clamp-2">
              {product.name}
            </h3>

            <div className="product__list__price text-base font-bold text-gray-900">
              {product.price?.special &&
              product.price?.regular < product.price?.special ? (
                <>
                  <span className="regular-price block text-sm line-through text-gray-600">
                    {formatPrice(product.price.regular)}
                  </span>
                  <span className="special-price block text-lg font-bold">
                    {formatPrice(product.price.special)}
                  </span>
                </>
              ) : (
                <span className="regular-price block text-sm font-semibold">
                  {formatPrice(product.price?.regular)}
                </span>
              )}
            </div>
          </div>
        </a>

        {/* Add-to-cart placed below price; desktop shows on hover (opacity) but occupies space to avoid overlap */}
        {showAddToCart && (
          <div className="product__list__add-wrap relative">
            <div className="sm:block product__list__actions opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out px-5">
              {customAddToCartRenderer ? (
                customAddToCartRenderer(product)
              ) : (
                <AddToCart
                  product={{
                    sku: product.sku,
                    isInStock: product.inventory?.isInStock ?? true,
                  }}
                  qty={1}
                >
                  {(state, actions) => (
                    <button
                      className="w-full py-2 mt-1 mb-4 text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed rounded-sm"
                      disabled={!state.canAddToCart || state.isLoading}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        actions.addToCart();
                      }}
                    >
                      THÊM VÀO GIỎ HÀNG
                    </button>
                  )}
                </AddToCart>
              )}
            </div>

            <div className="block hidden product__list__actions px-6 pb-6">
              {customAddToCartRenderer ? (
                customAddToCartRenderer(product)
              ) : (
                <AddToCart
                  product={{
                    sku: product.sku,
                    isInStock: product.inventory?.isInStock ?? true,
                  }}
                  qty={1}
                >
                  {(state, actions) => (
                    <button
                      className="w-full py-3 text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={!state.canAddToCart || state.isLoading}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        actions.addToCart();
                      }}
                    >
                      {state.isLoading ? "Đang thêm..." : "THÊM VÀO GIỎ HÀNG"}
                    </button>
                  )}
                </AddToCart>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface LoadingSkeletonProps {
  count?: number;
  gridColumns?: number;
  layout?: "grid" | "list";
}

const LoadingSkeleton = ({
  count = 4,
  gridColumns = 4,
  layout = "grid",
}: LoadingSkeletonProps) => {
  if (layout === "list") {
    return (
      <div
        className="product-list"
        style={{
          display: "flex",
          flexDirection: "column" as const,
          gap: "20px",
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="product-skeleton product-skeleton-list"
            style={{
              display: "flex",
              gap: "20px",
            }}
          >
            <div
              className="skeleton-image"
              style={{
                flexShrink: 0,
                width: "120px",
                height: "120px",
                backgroundColor: "#f0f0f0",
              }}
            />
            <div className="skeleton-content" style={{ flex: 1 }}>
              <div
                className="skeleton-name"
                style={{
                  height: "20px",
                  backgroundColor: "#f0f0f0",
                  marginBottom: "10px",
                  width: "60%",
                }}
              />
              <div
                className="skeleton-sku"
                style={{
                  height: "16px",
                  backgroundColor: "#f0f0f0",
                  marginBottom: "10px",
                  width: "30%",
                }}
              />
              <div
                className="skeleton-price"
                style={{
                  height: "20px",
                  backgroundColor: "#f0f0f0",
                  marginBottom: "10px",
                  width: "25%",
                }}
              />
              <div
                className="skeleton-stock"
                style={{
                  height: "16px",
                  backgroundColor: "#f0f0f0",
                  width: "20%",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`product-grid grid grid-cols-2 ${
        gridColumns === 1
          ? "md:grid-cols-1"
          : gridColumns === 2
          ? "md:grid-cols-2"
          : gridColumns === 3
          ? "md:grid-cols-3"
          : gridColumns === 4
          ? "md:grid-cols-4"
          : gridColumns === 5
          ? "md:grid-cols-5"
          : "md:grid-cols-6"
      } gap-5`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="product-skeleton">
          <div
            className="skeleton-image"
            style={{
              aspectRatio: "1/1",
              backgroundColor: "#f0f0f0",
              marginBottom: "10px",
            }}
          />
          <div
            className="skeleton-name"
            style={{
              height: "20px",
              backgroundColor: "#f0f0f0",
              marginBottom: "10px",
              width: "80%",
            }}
          />
          <div
            className="skeleton-price"
            style={{
              height: "20px",
              backgroundColor: "#f0f0f0",
              width: "40%",
            }}
          />
        </div>
      ))}
    </div>
  );
};

const EmptyState = ({ message }: { message: string | ReactNode }) => {
  return (
    <div className="empty-product-list">
      {typeof message === "string" ? <p>{message}</p> : message}
    </div>
  );
};

export const ProductList: React.FC<ProductListProps> = ({
  products = [],
  imageWidth = 300,
  imageHeight = 300,
  isLoading = false,
  emptyMessage = "Chưa có sản phẩm nào trong danh mục này",
  className = "",
  layout = "grid",
  gridColumns = 4,
  showAddToCart = false,
  customAddToCartRenderer,
  renderItem,
}) => {
  if (isLoading) {
    return (
      <LoadingSkeleton
        count={layout === "list" ? 5 : gridColumns * 2}
        gridColumns={gridColumns}
        layout={layout}
      />
    );
  }

  if (!products || products.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  const layoutClass = layout === "grid" ? "product-grid" : "product-list";
  const containerClass = `product-list-container ${layoutClass} ${className}`;

  // responsive grid classes: base (mobile) 2 columns, md=X columns where X is gridColumns
  const mdColsClass =
    gridColumns === 1
      ? "md:grid-cols-1"
      : gridColumns === 2
      ? "md:grid-cols-2"
      : gridColumns === 3
      ? "md:grid-cols-3"
      : gridColumns === 4
      ? "md:grid-cols-4"
      : gridColumns === 5
      ? "md:grid-cols-5"
      : "md:grid-cols-6";

  const gridClass =
    layout === "grid"
      ? `grid grid-cols-2 ${mdColsClass} gap-x-3 gap-y-4 md:gap-5`
      : "flex flex-col gap-5";

  const itemImageWidth =
    layout === "list" ? (imageWidth > 150 ? 150 : imageWidth) : imageWidth;
  const itemImageHeight =
    layout === "list" ? (imageHeight > 150 ? 150 : imageHeight) : imageHeight;

  return (
    <div className={`${containerClass} ${gridClass}`}>
      {products.map((product) => (
        <div
          key={product.productId}
          className={`product__list__item ${
            layout === "list"
              ? "product__list__item__list"
              : "product__list__item__grid"
          }`}
        >
          {renderItem ? (
            renderItem(product)
          ) : (
            <DefaultProductItem
              product={product}
              imageWidth={itemImageWidth}
              imageHeight={itemImageHeight}
              layout={layout}
              showAddToCart={showAddToCart}
              customAddToCartRenderer={customAddToCartRenderer}
            />
          )}
        </div>
      ))}
    </div>
  );
};
