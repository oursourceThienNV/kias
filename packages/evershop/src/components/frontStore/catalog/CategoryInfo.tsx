import Area from '@components/common/Area.js';
import { Editor } from '@components/common/Editor.js';
import { Image } from '@components/common/Image.js';
import { useCategory } from '@components/frontStore/catalog/categoryContext.js';
import React from 'react';

type CategoryInfoProps = {
  showImage?: boolean;          // mới: cho phép ẩn/hiện banner ảnh
  maxTextWidthClass?: string;   // mới: kiểm soát độ rộng khối text
};

export function CategoryInfo({
  showImage = false,
  maxTextWidthClass = 'max-w-[900px]' // hợp mắt như screenshot
}: CategoryInfoProps) {
  const { name, description, image } = useCategory();

  return (
    <>
      {/* <Area id="beforeCategoryInfo" noOuter /> */}
      <section className="category__general mb-2 md:mb-6" style={{marginLeft:20}}>
        {showImage && image && (
          <Image
            className="category__image mb-5 rounded-xl"
            src={image.url}
            alt={image.alt || name}
            width={1800}
            height={1029}
            priority
          />
        )}

        <div className={`category__info prose prose-base max-w-none ${maxTextWidthClass}`}>
          <h1 className="category__name text-2xl md:text-3xl font-semibold tracking-wide uppercase mb-2">
            {name}
          </h1>

          {description && (
            <div className="category__description text-neutral-700 leading-relaxed">
              <Editor rows={description} />
            </div>
          )}
        </div>
      </section>
      <Area id="afterCategoryInfo" noOuter />
    </>
  );
}
