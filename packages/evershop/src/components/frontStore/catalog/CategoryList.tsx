import { _ } from "@evershop/evershop/lib/locale/translate/_";
import React from "react";
import { useCategory } from "./categoryContext.js";

export function CategoryList() {
  const categories = [
  { name: "Áo", url: "/ao", uuid: "1" },
  { name: "Quần", url: "/quan", uuid: "2" },
  { name: "Váy & Đầm", url: "/vay-dam", uuid: "3" },
  { name: "Set Bộ", url: "/set-bo", uuid: "4" },
  { name: "Men", url: "/men", uuid: "5" },
];
  return (
    <div className="border-b border-t border-gray-300 shadow-sm">
      <div className="page-width-container">
        <div className="px-2 md:px-5 py-2 flex items-center gap-4 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <a
              key={cat.uuid}
              href={cat.url}
              className={`whitespace-nowrap text-sm hover:text-primary`}
              style={{color: '#5D5D5D', textDecoration: 'underline' }}
            >
              {cat.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}