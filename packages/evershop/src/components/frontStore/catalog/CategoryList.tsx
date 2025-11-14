import { _ } from "@evershop/evershop/lib/locale/translate/_";
import React from "react";
import { useCategory } from "./categoryContext.js";

type CategoryListProps = {
  categories: Array<{ name: string; url: string; uuid?: string }>;
};

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="border-b border-t border-gray-300 shadow-sm">
      <div className="page-width-container">
        <div className="px-2 md:px-5 py-2 flex items-center gap-4 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <a
              key={cat.uuid}
              href={cat.url}
              className={`whitespace-nowrap text-sm hover:text-primary`}
              style={{ color: "#79192A", textDecoration: "underline" }}
            >
              {cat.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
