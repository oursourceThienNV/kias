/**
 * News Grid Component - HAPAS Homepage
 * "CÓ VÀI ĐIỀU VỪA CẬP NHẬT" blog/news section
 */

import React from 'react';
import { Image } from '@components/common/Image';
import './NewsGrid.scss';

interface CmsPage {
  cmsPageId: number;
  name: string;
  url: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  image: {
    url: string;
    alt: string;
  };
  createdAt: string;
}

interface NewsGridProps {
  title?: string;
  cmsPages?: {
    items: CmsPage[];
  };
  columns?: number;
  showExcerpt?: boolean;
}

export default function NewsGrid({
  title = 'CÓ VÀI ĐIỀU VỪA CẬP NHẬT',
  cmsPages,
  columns = 3,
  showExcerpt = false
}: NewsGridProps) {
  const articles = cmsPages?.items || [];
  
  if (!articles || articles.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <section className="hapas-news-grid" aria-labelledby="news-grid-title">
      <div className="container">
        <div className="news-grid-header">
          <h2 id="news-grid-title" className="news-grid-title">
            {title}
          </h2>
          <a href="/blogs/news" className="news-grid-view-all">
            <span>Xem tất cả</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path 
                d="M7.5 15L12.5 10L7.5 5" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div 
          className="news-grid-items"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`
          }}
        >
          {articles.map((page) => (
            <article key={page.cmsPageId} className="news-card">
              <a href={page.url} className="news-card-link">
                <div className="news-card-image">
                  {page.image?.url ? (
                    <Image
                      src={page.image.url}
                      alt={page.image?.alt || page.name}
                      width={480}
                      height={320}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                      decoding="async"
                      objectFit="cover"
                      style={{ borderRadius: 8 }}
                    />
                  ) : (
                    <img
                      src={'/placeholder-news.jpg'}
                      alt={page.name}
                      loading="lazy"
                    />
                  )}
                </div>
                
                <div className="news-card-content">
                  <time className="news-card-date" dateTime={page.createdAt}>
                    {formatDate(page.createdAt)}
                  </time>
                  <h3 className="news-card-title">{page.name}</h3>
                  {showExcerpt && page.metaDescription && (
                    <p className="news-card-excerpt">{page.metaDescription}</p>
                  )}
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 50
};

// If using CMS pages as blog posts
export const query = `
  query NewsArticles {
    cmsPages(
      filters: [
        { key: "status", operation: eq, value: "1" }
      ],
      limit: 6
    ) {
      items {
        cmsPageId
        name
        url
        content
        metaTitle
        metaDescription
        image {
          url
          alt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

