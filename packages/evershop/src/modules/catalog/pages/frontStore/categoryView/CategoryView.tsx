import Area from "@components/common/Area.js";
import {
  CategoryData,
  CategoryProvider,
} from "@components/frontStore/catalog/categoryContext.js";
import { CategoryInfo } from "@components/frontStore/catalog/CategoryInfo.js";
import { CategoryList } from "@components/frontStore/catalog/CategoryList.js";
import { CategoryProducts } from "@components/frontStore/catalog/CategoryProducts.js";
import { CategoryProductsFilter } from "@components/frontStore/catalog/CategoryProductsFilter.js";
import { _ } from "@evershop/evershop/lib/locale/translate/_";
import React from "react";

interface CategoryViewProps {
  category: CategoryData;
}

export default function CategoryView({ category }: CategoryViewProps) {
  return (
    <CategoryProvider category={category}>
      <CategoryInfo />
      <CategoryList />
      <div className="page-width-container py-2 border-b border-gray-200 shadow-sm">
        <Area
          id="categoryFilters"
          className="px-2 md:px-5"
          coreComponents={[
            {
              component: { default: <CategoryProductsFilter /> },
              sortOrder: 10,
              id: "productFilter",
            },
          ]}
        />
      </div>
      <div className="page-width-container">
        <Area
          id="categoryProductsSection"
          className="px-2 md:px-5 mb-4 md:mb-6 mt-1"
          coreComponents={[
            {
              component: { default: <CategoryProducts /> },
              sortOrder: 10,
              id: "categoryProducts",
            },
          ]}
        />
      </div>
      <Area id="categoryPageBottom" className="category__page__bottom" />
    </CategoryProvider>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 10,
};

export const query = `
  query Query {
    category: currentCategory {
      categoryId
      showProducts
      name
      uuid
      description
      image {
        alt
        url
      }
      products {
        items {
          ...Product
        }
        currentFilters {
          key
          operation
          value
        }
        total
      }
      availableAttributes {
        attributeCode
        attributeName
        options {
          optionId
          optionText
        }
      }
      priceRange {
        min
        max
        minText
        maxText
      }
      children {
        categoryId
        name
        uuid
        url
        urlKey
        image {
          url
          alt
        }
      }
    }
}`;

export const fragments = `
  fragment Product on Product {
    productId
    name
    sku
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
    inventory {
      isInStock
    }
    image {
      alt
      url
    }
    url
  }
`;
