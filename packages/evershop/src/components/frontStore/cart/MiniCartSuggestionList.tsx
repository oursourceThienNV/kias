import React, { useEffect, useRef, useState } from "react";

export interface SuggestionProduct {
  img: string;
  name: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  url?: string;
}

interface MiniCartSuggestionListProps {
  products?: SuggestionProduct[];
}

export const MiniCartSuggestionList: React.FC<MiniCartSuggestionListProps> = ({ products = [] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [products.length]);

  const scrollByOffset = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
      setTimeout(updateScrollButtons, 350);
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[15px] font-medium text-gray-800 uppercase tracking-wide">CÓ THỂ BẠN SẼ THÍCH</span>
        <div className="flex gap-1">
          <button
            onClick={() => scrollByOffset(-242)}
            className={`text-lg mr-2 ${canScrollLeft ? 'text-gray-700 hover:text-black' : 'text-gray-300 cursor-not-allowed'}`}
            aria-label="Scroll left"
            disabled={!canScrollLeft}
          >
            &lt;
          </button>
          <button
            onClick={() => scrollByOffset(242)}
            className={`text-lg ${canScrollRight ? 'text-gray-700 hover:text-black' : 'text-gray-300 cursor-not-allowed'}`}
            aria-label="Scroll right"
            disabled={!canScrollRight}
          >
            &gt;
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 minicart-suggestion-scroll hide-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {products.map((product, idx) => (
          <a
            key={idx}
            href={product.url}
            className="min-w-[220px] bg-white rounded-lg hover:border hover:border-gray-200 flex flex-col items-center p-3 shadow-md mx-1 cursor-pointer"
            style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)' }}
          >
            <img src={typeof product.img === 'string' ? product.img : product.img?.url} alt={product.name} className="w-full h-32 object-contain mb-2 rounded" />
            <div className="text-[14px] text-gray-900 text-center leading-tight mb-2 min-h-[38px] flex items-center justify-center font-medium">
              {product.name}
            </div>
            <div className="flex items-end justify-center gap-2 mb-2">
              <span className="text-[17px] font-semibold text-[#e53935]">{product.price}</span>
              {product.oldPrice && (
                <span className="text-[14px] text-black line-through">{product.oldPrice}</span>
              )}
            </div>
            {product.discount && (
              <div className="text-[13px] bg-[#ffeaea] text-[#e53935] rounded px-3 py-1 font-semibold mt-0 mb-1 border border-[#e53935]">
                {product.discount}
              </div>
            )}
          </a>
        ))}
      </div>
      <style>{`
        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome/Safari/Webkit */
        }
      `}</style>
    </div>
  );
};
