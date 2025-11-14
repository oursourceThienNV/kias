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
  // Gọi API lấy danh mục cho CategoryInfo & CategoryList
  const [categories, setCategories] = React.useState<Array<{ name: string; url: string; uuid?: string; image?: { url: string } }>>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: `
            query NavigationData {
              categories(
                filters: [
                  { key: "status", operation: eq, value: "1" },
                  { key: "include_in_nav", operation: eq, value: "1" }
                ]
              ) {
                items {
                  name
                  url
                  uuid
                  image { url }
                }
              }
            }
          ` }),
        });
        const json = await res.json();
        const items = (json?.data?.categories?.items || []).map((c: any) => ({
          name: c.name,
          url: c.url || "/san-pham",
          uuid: c.uuid || c.categoryId || c.name,
          image: {url: 'https://product.hstatic.net/200000142885/product/z4121570251442_1ea4dad0962c57799e2306bf9b6cfe76_90c1420390b94518b2c2b45936bfbb88_master.jpg'}
        }));
        setCategories(items);
      } catch (e) {
        setCategories([]);
      }
      setLoading(false);
    })();
  }, []);

  if(loading && categories.length === 0) {
    return (
      <div className="page-width-container py-10 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#79192A] mb-4"></div>
        <div className="text-base text-gray-600 font-medium tracking-wide">Đang tải danh mục sản phẩm...</div>
      </div>
    );
  }

  return (
    <CategoryProvider category={category}>
      <CategoryInfo categories={categories} />
      <CategoryList categories={categories} />
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
