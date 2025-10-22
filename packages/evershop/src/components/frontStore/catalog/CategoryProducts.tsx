import Area from '@components/common/Area.js';
import { useCategory } from '@components/frontStore/catalog/categoryContext.js';
import { LoadMoreProducts } from '@components/frontStore/catalog/LoadMoreProducts.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React from 'react';

export function CategoryProducts() {
  const { showProducts, products } = useCategory();
  if (!showProducts) {
    return null;
  }
  return (
    <>
      <Area
        id="categoryProductsBefore"
        className="category__products__before"
      />
      <div>
        <LoadMoreProducts
          products={products.items}
          layout="grid"
          gridColumns={4}
          showAddToCart={true}
          initialCount={8}
          loadMoreCount={8}
        />
      </div>
      <Area id="categoryProductsAfter" className="category__products__after" />
    </>
  );
}
