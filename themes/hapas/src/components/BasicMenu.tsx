import React from 'react';

interface BasicMenuProps {
  basicMenuWidget: {
    menus: {
      id: string;
      name: string;
      url: string;
      type: string;
      uuid: string;
      children: {
        name: string;
        url: string;
        type: string;
        uuid: string;
      }[];
    }[];
    isMain: boolean;
    className: string;
  };
}

// HAPAS-specific BasicMenu override with Vietnamese navigation
export default function BasicMenu({
  basicMenuWidget: { menus, isMain, className }
}: BasicMenuProps) {
  const [isOpen, setIsOpen] = React.useState(!isMain);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Override with HAPAS Vietnamese menu items
  const hapasMenuItems = [
    {
      id: 'hapas_main_menu',
      name: 'HAPAS FASHION ❤️',
      url: 'javascript:void(0)',
      type: 'custom',
      uuid: 'javascript:void(0)',
      children: [
        { name: 'Set Bộ', url: '/set-bo', type: 'category', uuid: '/set-bo' },
        { name: 'Váy và Đầm', url: '/vay-dam', type: 'category', uuid: '/vay-dam' },
        { name: 'Quần', url: '/quan', type: 'category', uuid: '/quan' },
        { name: 'Áo', url: '/ao', type: 'category', uuid: '/ao' }
      ]
    },
    {
      id: 'about_hapas',
      name: 'Về HAPAS',
      url: '/page/about-us',
      type: 'custom',
      uuid: '/page/about-us',
      children: []
    }
  ];

  const listingClasses = isMain
    ? 'md:flex md:justify-center md:space-x-6 absolute md:relative left-[-2.5rem] md:left-0 top-full md:top-auto mt-2 md:mt-0 w-screen md:w-auto md:bg-transparent p-2 md:p-0 min-w-[250px] bg-white z-30 divide-y md:divide-y-0'
    : 'flex justify-center space-x-6 relative left-[-2.5rem] md:left-0 top-full md:top-auto mt-2 md:mt-0 w-screen md:w-auto md:bg-transparent p-2 md:p-0 min-w-[250px] bg-white z-30';

  return (
    <div className={`hapas-basic-menu ${className}`}>
      <div className="flex justify-start gap-4 items-center">
        <nav className="p-2 relative md:flex md:justify-center">
          <div className="flex justify-between items-center">
            {isMain && (
              <div className="md:hidden">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleMenu();
                  }}
                  className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </a>
              </div>
            )}
            <ul className={`${isOpen ? 'block' : 'hidden'} ${listingClasses}`}>
              {hapasMenuItems.map((item, index) => (
                <li key={index} className="relative group">
                  <a
                    href={item.url}
                    className="hover:text-black transition-colors block md:inline-block px-2 py-2 md:px-0 md:py-0 font-medium text-gray-800"
                    style={{ 
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                      fontWeight: '500'
                    }}
                  >
                    {item.name}
                  </a>
                  {item.children.length > 0 && (
                    <ul className="md:absolute left-0 top-full mt-0 md:mt-2 w-30 bg-white md:shadow-lg rounded-md md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-y-0 transform transition-all duration-300 ease-in-out min-w-full md:min-w-[250px] z-30 md:border-t-4 border-gray-200">
                      {item.children.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a
                            href={subItem.url}
                            className="block px-5 md:px-2 py-2 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                            style={{ 
                              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                              fontWeight: '400'
                            }}
                          >
                            {subItem.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
