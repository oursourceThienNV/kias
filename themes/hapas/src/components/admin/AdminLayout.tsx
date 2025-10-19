import React from 'react';

// Admin Layout Override Component
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      {/* Add custom CSS for admin pages */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Admin Logo Override - Inline CSS for maximum specificity */
          #app .admin-login-form .flex.items-center.justify-center.mb-7 {
            position: relative !important;
            min-height: 80px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          
          #app .admin-login-form .flex.items-center.justify-center.mb-7 svg {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
          }
          
          #app .admin-login-form .flex.items-center.justify-center.mb-7::before {
            content: '';
            display: block !important;
            width: 200px !important;
            height: 67px !important;
            min-width: 200px !important;
            min-height: 67px !important;
            background-image: url('/kias-logo-new.png') !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            margin: 0 auto !important;
            flex-shrink: 0 !important;
            z-index: 10 !important;
          }
        `
      }} />
      {children}
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1
};