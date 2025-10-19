/**
 * Announcement Bar — full-bleed, in-flow (không fixed),
 * navy bar, centered text, auto-rotate 3–5s, fade transition.
 */

import React, { useEffect, useMemo, useRef, useState } from "react";

interface Announcement {
    id: string;
    message: string;
    link?: string;
    backgroundColor?: string;
    textColor?: string;
}

interface AnnouncementBarProps {
    announcements?: Announcement[];
    /** Min/Max auto-rotate interval (ms). Defaults 3000–5000 */
    autoPlayMinMs?: number;
    autoPlayMaxMs?: number;
}

export default function AnnouncementBar({
    announcements = [
        {
            id: "1",
            message: "Miễn phí vận chuyển cho đơn hàng từ 500K",
            link: "/pages/shipping",
            backgroundColor: "#22295B",
            textColor: "#ffffff",
        },
        {
            id: "2",
            message: "Ưu đãi 150K cho sản phẩm BUBBLY",
            link: "/collections/bubbly-promo",
            backgroundColor: "#22295B",
            textColor: "#ffffff",
        },
    ],
    autoPlayMinMs = 3000,
    autoPlayMaxMs = 5000,
}: AnnouncementBarProps) {
    const [index, setIndex] = useState(0);

    const prefersReducedMotion = useMemo(
        () =>
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
        []
    );

    // random delay giữa min/max
    const nextDelay = () => {
        const min = Math.max(1000, autoPlayMinMs);
        const max = Math.max(min, autoPlayMaxMs);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (prefersReducedMotion || announcements.length <= 1) return;

        const schedule = () => {
            timerRef.current = window.setTimeout(() => {
                setIndex((i) => (i + 1) % announcements.length);
                schedule();
            }, nextDelay());
        };

        schedule();
        return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
        };
    }, [announcements.length, prefersReducedMotion, autoPlayMinMs, autoPlayMaxMs]);

    if (!announcements.length) return null;

    const current = announcements[index];
    const bg = current.backgroundColor || "#22295B";
    const fg = current.textColor || "#ffffff";

    return (
        <div
            role="region"
            aria-label="Announcements"
            // full-bleed trong flow (không fixed)
            className="relative w-screen left-1/2 -translate-x-1/2 z-10 overflow-hidden"
            style={{ backgroundColor: bg, color: fg }}
        >
            <div className="flex items-center justify-center min-h-[38px] text-center px-4">
                {announcements.map((a, i) => (
                    <div
                        key={a.id}
                        className={`absolute inset-0 flex items-center justify-center px-2 transition-opacity duration-500 ease-in-out ${i === index ? "opacity-100" : "opacity-0 pointer-events-none"
                            }`}
                    >
                        {a.link ? (
                            <a
                                href={a.link}
                                className="text-[13px] no-underline hover:underline"
                                style={{ color: fg }}
                            >
                                {a.message}
                            </a>
                        ) : (
                            <span className="text-[13px]">{a.message}</span>
                        )}
                    </div>
                ))}
                {/* spacer giữ chiều cao ổn định */}
                <span className="invisible text-[13px] select-none">{current.message}</span>
            </div>
        </div>
    );
}

// Đặt ở vùng trên header, trong flow nên KHÔNG chồng lên header
export const layout = {
    areaId: "headerTop",
    sortOrder: 10,
};
