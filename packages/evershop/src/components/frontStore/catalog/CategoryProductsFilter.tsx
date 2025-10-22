/* eslint-disable react/prop-types */
import Area from "@components/common/Area.js";
import { useAppDispatch } from "@components/common/context/app.js";
import { useCategory } from "@components/frontStore/catalog/categoryContext.js";
import {
  ProductFilter,
  PriceFilterRenderer,
  ProductFilterRenderProps,
  ProductFilterDispatch,
} from "@components/frontStore/catalog/ProductFilter.js";
import React from "react";
import "./CategoryProductsFilter.scss";

export function CategoryProductsFilter() {
  const category = useCategory();
  const availableAttributes = category.availableAttributes || [];
  const priceRange = category.priceRange;
  const currentFilters = category.products?.currentFilters || [];
  const categories = (category.children || []).map((c) => ({
    categoryId: c.categoryId,
    name: c.name,
    uuid: c.uuid,
  }));

  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);

  // Text inputs below the slider for price range
  const PriceTextInputs: React.FC<{
    priceRange: any;
    currentFilters: any[];
    updateFilter: (filters: any[]) => void;
  }> = ({ priceRange, currentFilters, updateFilter }) => {
    const formatVND = (n: number) =>
      new Intl.NumberFormat("vi-VN").format(Math.max(0, Math.floor(n))) + " đ";

    const minFilter = currentFilters.find((f) => f.key === "min_price")?.value;
    const maxFilter = currentFilters.find((f) => f.key === "max_price")?.value;
    const currentMin = minFilter ? parseInt(minFilter) : priceRange.min;
    const currentMax = maxFilter ? parseInt(maxFilter) : priceRange.max;

    const [minInput, setMinInput] = React.useState<string>(
      formatVND(currentMin)
    );
    const [maxInput, setMaxInput] = React.useState<string>(
      formatVND(currentMax)
    );

    React.useEffect(() => {
      const minF = currentFilters.find((f) => f.key === "min_price")?.value;
      const maxF = currentFilters.find((f) => f.key === "max_price")?.value;
      const newMin = minF ? parseInt(minF) : priceRange.min;
      const newMax = maxF ? parseInt(maxF) : priceRange.max;
      setMinInput(formatVND(newMin));
      setMaxInput(formatVND(newMax));
    }, [currentFilters, priceRange.min, priceRange.max]);

    const sanitize = (val: string) => parseInt(val.replace(/\D/g, "")) || 0;
    const applyTyped = () => {
      let nextMin = sanitize(minInput);
      let nextMax = sanitize(maxInput);
      nextMin = Math.max(priceRange.min, Math.min(nextMin, priceRange.max));
      nextMax = Math.max(priceRange.min, Math.min(nextMax, priceRange.max));
      if (nextMin > nextMax) {
        const t = nextMin;
        nextMin = nextMax;
        nextMax = t;
      }
      const newFilters = currentFilters.filter(
        (f) => f.key !== "min_price" && f.key !== "max_price"
      );
      if (nextMin > priceRange.min) {
        newFilters.push({
          key: "min_price",
          operation: "eq",
          value: String(nextMin),
        });
      }
      if (nextMax < priceRange.max) {
        newFilters.push({
          key: "max_price",
          operation: "eq",
          value: String(nextMax),
        });
      }
      updateFilter(newFilters);
    };

    return (
      <div className="mt-4 flex items-center justify-between w-3xl">
        <div className="flex items-center gap-3">
          <span className="text-gray-600 text-sm">TỪ</span>
          <input
            className="w-28 px-4 py-2 border border-gray-300 rounded text-center"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            onBlur={applyTyped}
            inputMode="numeric"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-600 text-sm">ĐẾN</span>
          <input
            className="w-28 px-4 py-2 border border-gray-300 rounded text-center"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            onBlur={applyTyped}
            inputMode="numeric"
          />
        </div>
      </div>
    );
  };

  const renderFilterBar = (props: ProductFilterRenderProps) => {
    const AppContextDispatch = useAppDispatch();
    const [activePanel, setActivePanel] = React.useState<
      "color" | "price" | "sort" | "cat" | null
    >(null);

    const [currentSort, setCurrentSort] = React.useState<{
      ob: "" | "price" | "name";
      od: "asc" | "desc";
    }>(() => {
      if (typeof window !== "undefined") {
        const params = new URL(document.location.href).searchParams;
        return {
          ob: (params.get("ob") || "") as "" | "price" | "name",
          od: (params.get("od") || "asc") as "asc" | "desc",
        };
      }
      return { ob: "", od: "asc" };
    });

    const hasActiveFilters = React.useMemo(() => {
      return props.currentFilters.some(
        (filter) =>
          filter.key === "color" ||
          filter.key === "min_price" ||
          filter.key === "max_price" ||
          filter.key === "cat"
      ) || currentSort.ob !== "";
    }, [props.currentFilters, currentSort.ob]);

    const applySort = async (
      sortBy: "" | "price" | "name",
      sortOrder: "asc" | "desc"
    ) => {
      if (typeof window === "undefined") return;

      setCurrentSort({ ob: sortBy, od: sortOrder });

      const currentUrl = window.location.href;
      const url = new URL(currentUrl, window.location.origin);
      url.searchParams.delete("page");
      url.searchParams.delete("limit");
      if (sortBy === "") {
        url.searchParams.delete("ob");
        url.searchParams.delete("od");
      } else {
        url.searchParams.set("ob", sortBy);
        url.searchParams.set("od", sortOrder);
      }
      url.searchParams.append("ajax", "true");
      await AppContextDispatch.fetchPageData(url);
      url.searchParams.delete("ajax");
      history.pushState(null, "", url);
    };

    const currentOb = currentSort.ob;
    const currentOd = currentSort.od;

    const colorAttr = availableAttributes.find(
      (a) =>
        a.attributeCode.toLowerCase().includes("color") ||
        a.attributeName.toLowerCase().includes("màu")
    );

    return (
      <div>
        {/* Mobile Filter Row */}
        <div className="md:hidden flex items-center justify-between w-full">
          <div className="flex-1">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsMobileFilterOpen(true)}
              onKeyDown={(e) =>
                e.key === "Enter" && setIsMobileFilterOpen(true)
              }
              className="flex items-center gap-2 py-2.5 rounded-lg w-full cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-600"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
              <span className="text-sm text-gray-700">Bộ lọc</span>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={async () => {
                props.updateFilter([]);
                setActivePanel(null);
                await applySort("", "desc");
              }}
              className="text-sm text-gray-600 hover:text-gray-900 underline ml-4"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Mobile Filter Sidebar */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Bộ lọc sản phẩm"
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden transition-opacity duration-500 ease-out ${
            isMobileFilterOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <button
            className="absolute inset-0 w-full h-full bg-transparent"
            onClick={() => setIsMobileFilterOpen(false)}
            aria-label="Đóng bộ lọc"
          />
          <div
            role="document"
            className={`fixed inset-y-0 left-0 w-screen bg-white transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-xl ${
              isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Sidebar Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Bộ lọc</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="p-4">
              {/* Mobile Filter Options */}
              <div className="space-y-4">
                {/* Màu sắc */}
                <div className="mobile-filter-section border-b pb-4">
                  <button
                    onClick={() =>
                      setActivePanel(activePanel === "color" ? null : "color")
                    }
                    className="flex justify-between items-center w-full py-2"
                  >
                    <span className="font-medium">Màu sắc</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        activePanel === "color" ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {activePanel === "color" && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {[
                        { name: "Black", code: "#000000" },
                        { name: "TAN", code: "#D2B48C" },
                        { name: "WHITE", code: "#FFFFFF" },
                        { name: "NAVY", code: "#000080" },
                        { name: "GREEN", code: "#008000" },
                        { name: "GREY", code: "#808080" },
                        { name: "BURGUNDY", code: "#800020" },
                        { name: "GOLD", code: "#FFD700" },
                        { name: "SILVER", code: "#C0C0C0" },
                        { name: "RED", code: "#FF0000" },
                        { name: "BLUE", code: "#0000FF" },
                        { name: "YELLOW", code: "#FFFF00" },
                        { name: "PINK", code: "#FFC0CB" },
                        { name: "ORANGE", code: "#FFA500" },
                        { name: "NATURAL", code: "#EBE2D5" },
                        { name: "BEIGE", code: "#F5F5DC" },
                      ].map((color) => {
                        const isSelected = props.isOptionSelected(
                          colorAttr?.attributeCode || "color",
                          color.name
                        );
                        return (
                          <label
                            key={color.name}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                props.toggleFilter(
                                  colorAttr?.attributeCode || "color",
                                  "in",
                                  color.name
                                )
                              }
                              className="sr-only peer"
                            />
                            <div
                              className={`w-4 h-4 rounded-sm border-2 ${
                                isSelected
                                  ? "border-black ring-1 ring-black"
                                  : "border-gray-400"
                              }`}
                              style={{ backgroundColor: color.code }}
                            />
                            <span className="text-[12px] font-medium text-gray-700">
                              {color.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Khoảng giá */}
                {priceRange && priceRange.min !== priceRange.max && (
                  <div className="mobile-filter-section border-b pb-4">
                    <button
                      onClick={() =>
                        setActivePanel(activePanel === "price" ? null : "price")
                      }
                      className="flex justify-between items-center w-full py-2"
                    >
                      <span className="font-medium">Khoảng giá</span>
                      <svg
                        className={`w-5 h-5 transition-transform ${
                          activePanel === "price" ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {activePanel === "price" && (
                      <div className="price-panel max-w-4xl mx-auto px-2 md:px-0 mt-8">
                        <ProductFilterDispatch.Provider
                          value={{ updateFilter: props.updateFilter }}
                        >
                          <PriceFilterRenderer
                            priceRange={priceRange}
                            currentFilters={props.currentFilters}
                            setting={props.setting}
                          />
                        </ProductFilterDispatch.Provider>
                        <PriceTextInputs
                          priceRange={priceRange}
                          currentFilters={props.currentFilters}
                          updateFilter={props.updateFilter}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Sắp xếp theo */}
                <div className="mobile-filter-section border-b pb-4">
                  <button
                    onClick={() =>
                      setActivePanel(activePanel === "sort" ? null : "sort")
                    }
                    className="flex justify-between items-center w-full py-2"
                  >
                    <span className="font-medium">Sắp xếp theo</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        activePanel === "sort" ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {activePanel === "sort" && (
                    <div className="mt-4 space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentOb === ""}
                          onChange={(e) => {
                            const checked = (e.target as HTMLInputElement)
                              .checked;
                            if (checked) applySort("", "desc");
                            else applySort("", "desc");
                          }}
                          className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          Sản phẩm mới
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={
                            currentOb === "price" && currentOd === "desc"
                          }
                          onChange={(e) => {
                            const checked = (e.target as HTMLInputElement)
                              .checked;
                            if (checked) applySort("price", "desc");
                            else applySort("", "desc");
                          }}
                          className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          Giá giảm dần
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentOb === "price" && currentOd === "asc"}
                          onChange={(e) => {
                            const checked = (e.target as HTMLInputElement)
                              .checked;
                            if (checked) applySort("price", "asc");
                            else applySort("", "desc");
                          }}
                          className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          Giá tăng dần
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Loại sản phẩm */}
                <div className="mobile-filter-section border-b pb-4">
                  <button
                    onClick={() =>
                      setActivePanel(activePanel === "cat" ? null : "cat")
                    }
                    className="flex justify-between items-center w-full py-2"
                  >
                    <span className="font-medium">Loại sản phẩm</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        activePanel === "cat" ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {activePanel === "cat" && (
                    <div className="mt-4 space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={props.isCategorySelected("túi")}
                          onChange={() =>
                            props.toggleFilter("cat", "in", "túi")
                          }
                          className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Túi xách</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={props.isCategorySelected("sản phẩm")}
                          onChange={() =>
                            props.toggleFilter("cat", "in", "sản phẩm")
                          }
                          className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Sản phẩm</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Filter Bar */}
        <div className="hidden md:flex items-center gap-2 md:gap-4 lg:gap-6 flex-wrap text-xs md:text-sm py-2">
          <div className="flex items-center gap-2">
            <div className="md:flex items-center text-gray-600">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mr-1 md:mr-2 md:w-5 md:h-5"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
              <span className="text-xs md:text-sm">Bộ lọc</span>
              <span className="mx-2 md:mx-4 text-gray-300">|</span>
            </div>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={async () => {
                props.updateFilter([]);
                setActivePanel(null);
                await applySort("", "desc");
              }}
              className="ml-2 text-xs md:text-sm"
              style={{
                color: "#202020",
                textDecoration: "underline",
              }}
            >
              Xóa bộ lọc
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              setActivePanel(activePanel === "color" ? null : "color")
            }
            className={`inline-flex items-center gap-0.5 md:gap-1 text-xs md:text-sm whitespace-nowrap ${
              activePanel === "color"
                ? "text-[#12224a] font-medium"
                : "text-gray-700 hover:text-[#12224a]"
            }`}
          >
            <svg
              className={`w-2.5 h-2.5 md:w-3 md:h-3 transition-transform ${
                activePanel === "color" ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            MÀU SẮC
          </button>

          {priceRange && priceRange.min !== priceRange.max && (
            <button
              type="button"
              onClick={() =>
                setActivePanel(activePanel === "price" ? null : "price")
              }
              className={`inline-flex items-center gap-0.5 md:gap-1 text-xs md:text-sm whitespace-nowrap ${
                activePanel === "price"
                  ? "text-[#12224a] font-medium"
                  : "text-gray-700 hover:text-[#12224a]"
              }`}
            >
              <svg
                className={`w-2.5 h-2.5 md:w-3 md:h-3 transition-transform ${
                  activePanel === "price" ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              KHOẢNG GIÁ
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              setActivePanel(activePanel === "sort" ? null : "sort")
            }
            className={`inline-flex items-center gap-0.5 md:gap-1 text-xs md:text-sm whitespace-nowrap ${
              activePanel === "sort"
                ? "text-[#12224a] font-medium"
                : "text-gray-700 hover:text-[#12224a]"
            }`}
          >
            <svg
              className={`w-2.5 h-2.5 md:w-3 md:h-3 transition-transform ${
                activePanel === "sort" ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            SẮP XẾP THEO
          </button>

          <button
            type="button"
            onClick={() => setActivePanel(activePanel === "cat" ? null : "cat")}
            className={`inline-flex items-center gap-0.5 md:gap-1 text-xs md:text-sm whitespace-nowrap ${
              activePanel === "cat"
                ? "text-[#12224a] font-medium"
                : "text-gray-700 hover:text-[#12224a]"
            }`}
          >
            <svg
              className={`w-2.5 h-2.5 md:w-3 md:h-3 transition-transform ${
                activePanel === "cat" ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            LOẠI SẢN PHẨM
          </button>

          <div className="ml-auto hidden md:block" />
        </div>

        {activePanel === "color" && !isMobileFilterOpen && (
          <div className="w-full border-t border-gray-200 py-4 md:py-6 relative hidden md:block">
            <button
              type="button"
              onClick={() => setActivePanel(null)}
              className="absolute right-1 md:right-2 top-0 p-0 text-gray-600 hover:text-black w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-lg md:text-xl close-x-btn"
              aria-label="Đóng"
            >
              ×
            </button>
            <div className="price-panel max-w-4xl mx-auto px-2 md:px-0 grid grid-cols-4 gap-4 p-4 mt-8">
              {[
                { name: "Black", code: "#000000" },
                { name: "TAN", code: "#D2B48C" },
                { name: "WHITE", code: "#FFFFFF" },
                { name: "NAVY", code: "#000080" },
                { name: "GREEN", code: "#008000" },
                { name: "GREY", code: "#808080" },
                { name: "BURGUNDY", code: "#800020" },
                { name: "GOLD", code: "#FFD700" },
                { name: "SILVER", code: "#C0C0C0" },
                { name: "RED", code: "#FF0000" },
                { name: "BLUE", code: "#0000FF" },
                { name: "YELLOW", code: "#FFFF00" },
                { name: "PINK", code: "#FFC0CB" },
                { name: "ORANGE", code: "#FFA500" },
                { name: "NATURAL", code: "#EBE2D5" },
                { name: "BEIGE", code: "#F5F5DC" },
              ].map((color) => {
                const isSelected = props.isOptionSelected(
                  colorAttr?.attributeCode || "color",
                  color.name
                );
                return (
                  <label
                    key={color.name}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() =>
                        props.toggleFilter(
                          colorAttr?.attributeCode || "color",
                          "in",
                          color.name
                        )
                      }
                      className="sr-only peer"
                    />
                    <div
                      className={`w-4 h-4 rounded-sm border-2 ${
                        isSelected
                          ? "border-black ring-1 ring-black"
                          : "border-gray-400"
                      }`}
                      style={{ backgroundColor: color.code }}
                    />
                    <span className="text-[12px] font-medium text-gray-700">
                      {color.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {activePanel === "price" && priceRange && !isMobileFilterOpen && (
          <div className="w-full border-t border-gray-200 py-4 md:py-6 relative hidden md:block">
            <button
              type="button"
              onClick={() => setActivePanel(null)}
              className="absolute right-1 md:right-2 top-0 p-0 text-gray-600 hover:text-black w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-lg md:text-xl close-x-btn"
              aria-label="Đóng"
            >
              ×
            </button>
            <div className="price-panel max-w-4xl mx-auto px-2 md:px-0 mt-8">
              <ProductFilterDispatch.Provider
                value={{ updateFilter: props.updateFilter }}
              >
                <PriceFilterRenderer
                  priceRange={priceRange}
                  currentFilters={props.currentFilters}
                  setting={props.setting}
                />
              </ProductFilterDispatch.Provider>
              <PriceTextInputs
                priceRange={priceRange}
                currentFilters={props.currentFilters}
                updateFilter={props.updateFilter}
              />
            </div>
          </div>
        )}

        {activePanel === "sort" && !isMobileFilterOpen && (
          <div className="w-full border-t border-gray-200 py-4 md:py-6 relative hidden md:block">
            <button
              type="button"
              onClick={() => setActivePanel(null)}
              className="absolute right-1 md:right-2 top-0 p-0 text-gray-600 hover:text-black w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-lg md:text-xl close-x-btn"
              aria-label="Đóng"
            >
              ×
            </button>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-4 md:gap-12 text-xs md:text-sm mt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentOb === ""}
                  onChange={(e) => {
                    const checked = (e.target as HTMLInputElement).checked;
                    if (checked) applySort("", "desc");
                    else applySort("", "desc");
                  }}
                />
                <span>Sản phẩm mới</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentOb === "price" && currentOd === "desc"}
                  onChange={(e) => {
                    const checked = (e.target as HTMLInputElement).checked;
                    if (checked) applySort("price", "desc");
                    else applySort("", "desc");
                  }}
                />
                <span>Giá giảm dần</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentOb === "price" && currentOd === "asc"}
                  onChange={(e) => {
                    const checked = (e.target as HTMLInputElement).checked;
                    if (checked) applySort("price", "asc");
                    else applySort("", "desc");
                  }}
                />
                <span>Giá tăng dần</span>
              </label>
            </div>
          </div>
        )}

        {activePanel === "cat" && !isMobileFilterOpen && (
          <div className="w-full border-t border-gray-200 py-4 md:py-6 relative hidden md:block">
            <button
              type="button"
              onClick={() => setActivePanel(null)}
              className="absolute right-1 md:right-2 top-0 p-0 text-gray-600 hover:text-black w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-lg md:text-xl close-x-btn"
              aria-label="Đóng"
            >
              ×
            </button>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-4 md:gap-12 text-xs md:text-sm mt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={props.isCategorySelected("túi")}
                  onChange={() => props.toggleFilter("cat", "in", "túi")}
                  className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Túi xách</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={props.isCategorySelected("sản phẩm")}
                  onChange={() => props.toggleFilter("cat", "in", "sản phẩm")}
                  className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Sản phẩm</span>
              </label>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Area id="beforeFilter" noOuter />
      <ProductFilter
        currentFilters={currentFilters}
        availableAttributes={availableAttributes}
        priceRange={priceRange}
        categories={categories}
      >
        {(renderProps) => renderFilterBar(renderProps)}
      </ProductFilter>
      <Area id="afterFilter" noOuter />
    </>
  );
}
