import { Og } from '@components/frontStore/Og.js';
import React, {
  LinkHTMLAttributes,
  MetaHTMLAttributes,
  ScriptHTMLAttributes
} from 'react';

// Import HAPAS theme styles
import '../../styles/theme.scss';

interface HeadTagsProps {
  pageInfo: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl: string;
    robots: string;
    ogInfo: {
      locale: string;
      title: string;
      description: string;
      image: string;
      url: string;
      type: 'website' | 'article' | 'product' | string;
      siteName: string;
      twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player';
      twitterSite: string;
      twitterCreator: string;
      twitterImage: string;
    };
  };
  themeConfig: {
    headTags: {
      metas: Array<MetaHTMLAttributes<HTMLMetaElement>>;
      links: Array<LinkHTMLAttributes<HTMLLinkElement>>;
      scripts: Array<ScriptHTMLAttributes<HTMLScriptElement>>;
      base?: {
        href: string;
        target: '_blank' | '_self' | '_parent' | '_top';
      };
    };
  };
}

export default function HapasHeadTags({
  pageInfo: { title, description, keywords, canonicalUrl, robots, ogInfo },
  themeConfig: {
    headTags: { metas, links, scripts, base }
  }
}: HeadTagsProps) {
  React.useEffect(() => {
    const head = document.querySelector('head');
    
    // Set document language to Vietnamese
    document.documentElement.lang = 'vi';
    
    // Add Vietnamese font preloading
    const fontPreloadLinks = [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com'
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous'
      },
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap&subset=vietnamese',
        as: 'style'
      }
    ];
    
    fontPreloadLinks.forEach(linkProps => {
      const linkElement = document.createElement('link');
      Object.keys(linkProps).forEach((key) => {
        if (linkProps[key]) {
          linkElement[key] = linkProps[key];
        }
      });
      head?.appendChild(linkElement);
    });
    
    // Add Vietnamese character encoding meta
    const charsetMeta = document.createElement('meta');
    charsetMeta.setAttribute('charset', 'UTF-8');
    head?.insertBefore(charsetMeta, head.firstChild);
    
    // Add language meta
    const langMeta = document.createElement('meta');
    langMeta.setAttribute('http-equiv', 'Content-Language');
    langMeta.setAttribute('content', 'vi');
    head?.appendChild(langMeta);
    
    // Process theme scripts
    scripts.forEach((script) => {
      const scriptElement = document.createElement('script');
      Object.keys(script).forEach((key) => {
        if (script[key]) {
          scriptElement[key] = script[key];
        }
      });
      head?.appendChild(scriptElement);
    });
  }, []);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta httpEquiv="Content-Language" content="vi" />
      
      {/* Vietnamese Font Loading */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link 
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap&subset=vietnamese,latin" 
        rel="stylesheet" 
      />
      
      {/* HAPAS Brand Meta Tags */}
      <meta name="author" content="HAPAS Fashion" />
      <meta name="language" content="Vietnamese" />
      <meta name="geo.region" content="VN" />
      <meta name="geo.country" content="Vietnam" />
      
      {metas.map((meta, index) => (
        <meta key={index} {...meta} />
      ))}
      {links.map((link, index) => (
        <link key={index} {...link} />
      ))}
      {scripts.map((script, index) => (
        <script key={index} {...script} />
      ))}
      {base && <base {...base} />}
      <Og
        type={ogInfo.type}
        title={title}
        description={description}
        url={ogInfo.url}
        siteName={ogInfo.siteName}
        image={ogInfo.image}
        locale="vi_VN"
        twitterCard={ogInfo.twitterCard}
        twitterSite={ogInfo.twitterSite}
        twitterCreator={ogInfo.twitterCreator}
        twitterImage={ogInfo.twitterImage}
      />
    </>
  );
}

export const layout = {
  areaId: 'head',
  sortOrder: 1  // Higher priority than default HeadTags
};

export const query = `
  query query {
    pageInfo {
      title
      description
      keywords
      canonicalUrl
      robots
      ogInfo {
        locale
        title
        description
        image
        url
        type
        siteName
        twitterCard
        twitterSite
        twitterCreator
        twitterImage
      }
    }
    themeConfig {
      headTags {
        metas {
          name
          content
          charSet
          httpEquiv
          property
          itemProp
          itemType
          itemID
          lang
        }
        links {
          rel
          href
          sizes
          type
          hrefLang
          media
          title
          as
          crossOrigin
          integrity
          referrerPolicy
        }
        scripts {
          src
          type
          async
          defer
          crossOrigin
          integrity
          noModule
          nonce
        }
        base {
          href
          target
        }
      }
    }
  }
`;
