/**
 * Main Navigation Component - HAPAS Theme
 *
 * Matches hapas.vn navigation structure
 * Dynamically loads KIAS categories and maps to HAPAS UI
 */

import React, { useState } from 'react';
import './MainNavigation.scss';

interface Category {
  categoryId: string;
  name: string;
  url: string;
  urlKey: string;
}

interface NavItem {
  id: string;
  label: string;
  url: string;
  submenu?: Array<{
    id: string;
    label: string;
    url: string;
  }>;
}

interface MainNavigationProps {
  categories?: Category[];
  navigationConfig?: {
    primary: NavItem[];
  };
}

export default function MainNavigation({
  categories = [],
  navigationConfig
}: MainNavigationProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Map KIAS categories from DB to HAPAS navigation structure
  const categoryMap: Record<string, string> = {
    'Set Bộ': 'set-bo',
    'Váy & Đầm': 'vay-dam',
    'Quần': 'quan',
    'Áo': 'ao',
    'Hàng mới về': 'new-arrivals',
    'Giá mới hấp dẫn': 'sale'
  };

  // Build dynamic navigation from database categories
  // Ensure categories is an array before filtering
  const categoriesArray = Array.isArray(categories) ? categories : [];
  const dynamicNavItems: NavItem[] = categoriesArray
    .filter(cat => categoryMap[cat.name]) // Only show mapped categories
    .map(cat => ({
      id: cat.categoryId,
      label: cat.name.toUpperCase(),
      url: cat.url || `/${categoryMap[cat.name]}`
    }));

  // Default fallback matching hapas.vn structure
  const defaultNavItems: NavItem[] = [
    { id: 'new', label: 'MỚI', url: '/new-arrivals' },
    { id: 'set-bo', label: 'SET BỘ', url: '/set-bo' },
    { id: 'vay-dam', label: 'VÁY & ĐẦM', url: '/vay-dam' },
    { id: 'quan', label: 'QUẦN', url: '/quan' },
    { id: 'ao', label: 'ÁO', url: '/ao' },
    { id: 'sale', label: 'GIÁ MỚI HẤP DẪN', url: '/sale' }
  ];

  const navItems = dynamicNavItems.length > 0
    ? dynamicNavItems
    : (navigationConfig?.primary || defaultNavItems);

  const handleMouseEnter = (itemId: string) => {
    setActiveDropdown(itemId);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent, itemId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveDropdown(activeDropdown === itemId ? null : itemId);
    } else if (event.key === 'Escape') {
      setActiveDropdown(null);
    }
  };

  return ( null
    // <nav
    //   className="hapas-main-navigation"
    //   aria-label="Main navigation"
    //   role="navigation"
    // >
    //   <div className="page-width">
    //     <ul className="nav-list">
    //       {navItems.map((item) => {
    //         const hasSubmenu = item.submenu && item.submenu.length > 0;
    //         const isActive = activeDropdown === item.id;
    //
    //         return (
    //           <li
    //             key={item.id}
    //             className="nav-item"
    //             onMouseEnter={() => hasSubmenu && handleMouseEnter(item.id)}
    //             onMouseLeave={handleMouseLeave}
    //           >
    //             {hasSubmenu ? (
    //               <button
    //                 className="nav-button"
    //                 aria-expanded={isActive}
    //                 aria-haspopup="true"
    //                 onKeyDown={(e) => handleKeyDown(e, item.id)}
    //                 type="button"
    //               >
    //                 {item.label}
    //                 <svg
    //                   width="16"
    //                   height="16"
    //                   viewBox="0 0 16 16"
    //                   fill="none"
    //                   aria-hidden="true"
    //                 >
    //                   <path
    //                     d="M4 6L8 10L12 6"
    //                     stroke="currentColor"
    //                     strokeWidth="2"
    //                     strokeLinecap="round"
    //                     strokeLinejoin="round"
    //                   />
    //                 </svg>
    //               </button>
    //             ) : (
    //               <a
    //                 href={item.url}
    //                 className="nav-link"
    //                 aria-current={item.id === 'home' ? 'page' : undefined}
    //               >
    //                 {item.label}
    //               </a>
    //             )}
    //
    //             {hasSubmenu && item.submenu && (
    //               <ul
    //                 className={`nav-submenu ${isActive ? 'visible' : ''}`}
    //                 role="menu"
    //                 aria-label={`${item.label} submenu`}
    //               >
    //                 {item.submenu.map((subItem) => (
    //                   <li key={subItem.id} role="none">
    //                     <a
    //                       href={subItem.url}
    //                       className="nav-submenu-link"
    //                       role="menuitem"
    //                     >
    //                       {subItem.label}
    //                     </a>
    //                   </li>
    //                 ))}
    //               </ul>
    //             )}
    //           </li>
    //         );
    //       })}
    //     </ul>
    //   </div>
    // </nav>
  );
}

export const layout = {
  areaId: 'headerBottom',
  sortOrder: 10
};

export const query = `
  query NavigationData {
    categories(
      filters: [
        { key: "status", operation: eq, value: "1" },
        { key: "include_in_nav", operation: eq, value: "1" }
      ]
    ) {
      items {
        categoryId
        name
        url
        urlKey
        image {
          url
          alt
        }
      }
    }
  }
`;

