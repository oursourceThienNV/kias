import React from 'react';
import type { ComponentLayout } from '@evershop/evershop';
import { MiniCart } from '@components/frontStore/cart/MiniCart.js';

interface HeaderActionsRightProps {
    cartCount?: number;
    wishlistCount?: number;
    isLoggedIn?: boolean;
    currentLanguage?: string; // 'VN'
    colorHex?: string;        // navy
}

export default function HeaderActionsRight({
    cartCount = 0,
    wishlistCount = 0,
    isLoggedIn = false,
    currentLanguage = 'VN',
    colorHex = '#22295B'
}: HeaderActionsRightProps) {
    const navy = colorHex;

    return (
        <div className="flex items-center justify-end" style={{ color: navy }}>
            <div className="flex items-center gap-3 sm:gap-4">
                {/* Account: chỉ hiện trên desktop */}
                <a
                    href={isLoggedIn ? '/account' : '/account/login'}
                    aria-label={isLoggedIn ? 'Tài khoản' : 'Đăng nhập'}
                    className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 no-underline hover:opacity-80 transition-opacity hidden md:flex"
                    style={{ color: '#79192A' }}
                >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <circle cx="10" cy="7" r="3.25" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M4.5 18c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                </a>

                {/* Cart (MiniCart with slide drawer): luôn hiện */}
                <MiniCart
                    showItemCount
                    renderCartIcon={({ totalQty, onClick, isOpen }) => (
                        <button
                            type="button"
                            onClick={onClick}
                            aria-label={`Giỏ hàng${totalQty ? ` (${totalQty})` : ''}`}
                            className={`relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 hover:opacity-80 transition-opacity ${isOpen ? 'opacity-80' : ''}`}
                            style={{ color: "#79192A" }}
                        >
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                <path d="M2 2h2l1.5 6h11l1.5-4.5H4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="8.2" cy="16.2" r="1" fill="currentColor" />
                                <circle cx="14.2" cy="16.2" r="1" fill="currentColor" />
                            </svg>
                            {totalQty > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full text-[10px] leading-[16px] font-bold text-white" style={{ backgroundColor: "#79192A" }}>
                                    {totalQty > 99 ? '99+' : totalQty}
                                </span>
                            )}
                        </button>
                    )}
                />

                {/* Wishlist: chỉ hiện trên desktop */}
                <a
                    href="/wishlist"
                    aria-label={`Yêu thích${wishlistCount ? ` (${wishlistCount})` : ''}`}
                    className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 no-underline hover:opacity-80 transition-opacity hidden md:flex"
                    style={{ color: "#79192A" }}
                >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M10 17.3s-7-3.9-7-9.3C3 6.1 4.4 4.7 6.4 4.7c1.5 0 3 1 3.6 2.3 0.7-1.3 2.1-2.3 3.6-2.3 2 0 3.4 1.4 3.4 3.3 0 5.4-7 9.3-7 9.3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    {wishlistCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full text-[10px] leading-[16px] font-bold text-white" style={{ backgroundColor: navy }}>
                            {wishlistCount > 99 ? '99+' : wishlistCount}
                        </span>
                    )}
                </a>
            </div>

            {/* Divider + Language “| VN” */}
            <div className="flex items-center pl-3 sm:pl-4 ml-2">
                <span className="mx-2 select-none" style={{ color: "#79192A" }}>|</span>
                <button
                    type="button"
                    className="text-xs sm:text-sm font-medium tracking-wide bg-transparent border-0 cursor-pointer hover:opacity-80"
                    style={{ color: "#79192A" }}
                    aria-label="Chuyển ngôn ngữ"
                >
                    {currentLanguage}
                </button>
            </div>
        </div>
    );
}

/* ĐĂNG KÝ BÊN PHẢI */
export const layout: ComponentLayout = {
    areaId: 'headerMiddleRight',
    sortOrder: 10
};
