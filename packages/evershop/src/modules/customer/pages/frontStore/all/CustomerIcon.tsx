import { UserCircleIcon as Icon } from '@heroicons/react/24/outline';
import React from 'react';

interface UserIconProps {
  customer: {
    uuid: string;
    fullName: string;
    email: string;
  };
  accountUrl: string;
  loginUrl: string;
  logoutApi: string;
}

export default function UserIcon({
  customer,
  accountUrl,
  loginUrl,
  logoutApi
}: UserIconProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  if (!customer) {
    return (
      <div className="self-center">
        <a href={loginUrl}>
          <Icon width={25} height={25} />
        </a>
      </div>
    );
  }

  return (
    <div className="self-center relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center"
      >
        <Icon width={25} height={25} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 rounded-md border border-gray-200 bg-white shadow-lg z-50"
        >
          <a
            href="/account/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            role="menuitem"
          >
            Thông tin cá nhân
          </a>
          <button
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            role="menuitem"
            onClick={async () => {
              try {
                await fetch(logoutApi, { method: 'POST' });
                window.location.href = '/';
              } catch (e) {
                window.location.reload();
              }
            }}
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

export const layout = {
  areaId: 'headerMiddleRight',
  sortOrder: 10
};

export const query = `
  query Query {
    customer: currentCustomer {
      uuid
      fullName
      email
    }
    accountUrl: url(routeId: "account")
    loginUrl: url(routeId: "login")
    logoutApi: url(routeId: "customerLogoutJson")
  }
`;
