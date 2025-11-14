import Area from "@components/common/Area.js";
import { Editor } from "@components/common/Editor.js";
import { useCategory } from "@components/frontStore/catalog/categoryContext.js";
import React from "react";
import "./CategoryInfo.scss";

type CategoryInfoProps = {
  categories: Array<{
    name: string;
    url: string;
    uuid?: string;
    image?: { url: string };
  }>;
};

export function CategoryInfo({ categories }: CategoryInfoProps) {
  const category = useCategory();
  const { name, description, children, products } = category;
  const productCount = products?.total || 0;
  const navItems = [
    { name: "Sản phẩm mới", url: "/category/new-arrivals" },
    { name: "Được yêu thích nhất", url: "/category/best-sellers" },
    { name: "Chain Handle", url: "/category/chain-handle" },
    { name: "Phủ Màu Tag Vuông", url: "/category/phu-mau-tag-vuong" },
  ];
  const thumbItems = categories;
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      style={{ backgroundColor: "#F3F3F3" }}
      className="py-1 px-2 md:px-5 md:py-2"
    >
      <Area id="beforeCategoryInfo" noOuter />

      <div className="page-width py-3 md:py-4">
        <div
          className="hapas-vietnamese categoryId flex items-center gap-2 text-xs"
          style={{ color: "#707070" }}
        >
          <a href="/">Trang chủ</a>
          <span>/</span>
          <span>{name}</span>
          <span>/</span>
          <span style={{ color: "#18181A", fontWeight: 600 }}>
            {productCount} sản phẩm
          </span>
        </div>
      </div>

      <section className="category__general py-4 md:py-12">
        <div className="page-width">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
            <aside className="hidden lg:block lg:col-span-3">
              <h1
                className="text-2xl md:text-4xl uppercase mb-3 md:mb-4"
                style={{
                  color: "#79192A",
                  letterSpacing: "0.04em",
                  lineHeight: "1.2",
                }}
              >
                {name}
              </h1>
              <nav className="space-y-1.5 md:space-y-2">
                {navItems.map((child: any) => (
                  <a
                    key={child.name}
                    href={child.url}
                    className="block py-1.5 text-sm text-gray-900 hover:text-black hover:font-semibold transition-colors"
                  >
                    {child.name}
                  </a>
                ))}
              </nav>
            </aside>

            <div className="lg:col-span-6 max-w-full lg:px-0">
              <div className="lg:hidden mb-3">
                <h1
                  className="text-2xl md:text-4xl font-bold uppercase"
                  style={{
                    color: "#79192A",
                    letterSpacing: "0.04em",
                    lineHeight: "1.2",
                  }}
                >
                  {name}
                </h1>
              </div>

              {description && (
                <div className="mb-3 md:mb-4">
                  <div
                    className={`${
                      expanded
                        ? "clamp-none"
                        : "line-clamp-2 lg:line-clamp-none"
                    } text-sm lg:text-base text-gray-900 leading-relaxed relative`}
                  >
                    <Editor rows={description} />
                  </div>
                  {description.length > 100 && (
                    <button
                      type="button"
                      className="mt-1 text-sm text-gray-900 underline lg:hidden"
                      onClick={() => setExpanded((v) => !v)}
                    >
                      {expanded ? "Thu gọn" : "Xem thêm"}
                    </button>
                  )}
                </div>
              )}

              <div className="lg:hidden mb-4">
                <div className="flex flex-nowrap gap-6 overflow-x-auto hide-scrollbar pb-2">
                  {navItems.map((child: any) => (
                    <a
                      key={child.name}
                      href={child.url}
                      className="min-w-[100px] flex items-center justify-center py-2 text-sm text-gray-900 hover:text-black hover:font-semibold whitespace-nowrap"
                    >
                      {child.name}
                    </a>
                  ))}
                </div>
              </div>

              {thumbItems.length > 0 && (
                <div className="mt-4 md:mt-6">
                  <div className="hidden lg:flex gap-4 md:gap-6 justify-start overflow-x-auto hide-scrollbar pb-2">
                    {thumbItems.map((child: any) => {
                      const childImage = child.image?.url;
                      return (
                        <a
                          key={child.categoryId}
                          href={child.url || `/category/${child.uuid}`}
                          className="subcategory__item group flex flex-col items-center text-center transition-transform flex-shrink-0"
                          style={{ width: "160px" }}
                        >
                          <div
                            className="overflow-hidden rounded-md"
                            style={{ height: "160px", width: "160px" }}
                          >
                            <img
                              src={childImage}
                              alt={child.name}
                              className="max-h-full max-w-full object-contain transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-105"
                            />
                          </div>
                          <span className="text-sm text-gray-800 transition-colors duration-200 group-hover:text-black group-hover:font-semibold mt-2">
                            {child.name}
                          </span>
                        </a>
                      );
                    })}
                  </div>

                  <div className="lg:hidden">
                    <div className="flex flex-nowrap gap-2 overflow-x-auto hide-scrollbar pb-2">
                      {thumbItems.map((child: any) => {
                        const childImage = child.image?.url;
                        return (
                          <a
                            key={child.categoryId}
                            href={child.url || `/category/${child.uuid}`}
                            className="min-w-[120px] subcategory__item group flex flex-col items-center text-center"
                          >
                            <div
                              style={{ height: "120px", width: "120px" }}
                              className="overflow-hidden rounded-md"
                            >
                              <img
                                src={childImage}
                                alt={child.name}
                                className="max-h-full max-w-full object-contain transform transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105"
                              />
                            </div>
                            <span className="text-sm text-gray-800 transition-colors duration-200 group-hover:text-black group-hover:font-semibold">
                              {child.name}
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Area id="afterCategoryInfo" noOuter />
    </div>
  );
}
