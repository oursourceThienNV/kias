// Component cho phần left trên mobile (hamburger menu)
function HeaderMobileLeft({ onMenuOpen }: { onMenuOpen: () => void }) {
  return (
    <button
      className="hamburger block md:hidden"
      aria-label="Mở menu"
      onClick={onMenuOpen}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#79192A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="7" x2="21" y2="7" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="17" x2="21" y2="17" />
      </svg>
    </button>
  );
}

import Area from "@components/common/Area.js";
import React, { useState } from "react";
import "./Header.scss";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  // State for collapsible menu sections
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    moi: false,
    tuixach: false,
    quatang: false,
  });

  // Toggle section open/close
  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const thumbItems = [
    {
      name: "Áo",
      url: "/ao",
      image: {
        url: "data:image/webp;base64,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",
      },
    },
    {
      name: "Quần",
      url: "/quan",
      image: {
        url: "data:image/webp;base64,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",
      },
    },
    {
      name: "Váy & Đầm",
      url: "/vay-dam",
      image: {
        url: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRade_oT8zlbhzAnNN-Zba3z9kAXFomI8CHkYvqz61Fs_slj7FoFhG0fTHn58DF0nk3o0f5xhv1aJ8SQYdROA8uuuxtfhgkzhxGCbZI13upHFvWtovZOggG&usqp=CAc",
      },
    },
    {
      name: "Set Bộ",
      url: "/set-bo",
      image: {
        url: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRSroYdkb21qdjMRuFc4MutwK9-icNTvRk-Vb0HPdrpZ3yPYrZ1tMTZXaYbvhThrNoDGbxFkvGdLxL2HZeW3dPR9rBI5jHYoOX4aADHSocreMlOTJlWE1AwNlzYYvVecCUEvYOAXQ&usqp=CAc",
      },
    },
    {
      name: "Men",
      url: "/men",
      image: {
        url: "data:image/webp;base64,UklGRtQRAABXRUJQVlA4IMgRAACwUwCdASq7ALsAPj0cjEQiIaEUKOTIIAPEs5nTcJut/9nPHbrj4fNR1rFi3JnPfVricNcgqfU5/3un1tqO6r+uv/AOndq8b0Hrr/UNhaEyua9yf9V4O/6S9r6KJ8jfEeLNq3eJ/Ko9TPGY+1/9n1Q/85/z/aq+9b/GevD64/7vsZf27/kdgf9ufZN/bcrV1OBk+tkzqtjO//+lP4yQKamr6NLaaiu/XiA4EtskPmrdKBY/6b38xW+5PVgRtNTK8cZZO/KlG6z3TdzmhrIIgAYV0wJ6C/Utc85EmrciR4xhLrto2lZDScykm9PIN4aZ0pA6GjiSDaTfC9J3gFMbb4OPylxtUDPlFmCQvhCB4WyrytastoQ/wLYCwjrGz4Vun99bNDrFqVdt7CWTlbIgbUu0dYbFn8THRq7t66lsawfS5gk7rjKTlP1ZwgbMpugTcliduv3aUZqGVYNPVb/MxSHXh3xiHnPj37ja4u0C4dtvF6kbHTgBorfz+d0lROL76vXYanY6FB5d5fVXAAZmouOUaJIEnWc1DTaKpntsQkO9CPKJoU1vgjuQ8/3Zw+VMBG5gh37+KB9LU5aLy78Gx2qUarGSL6+4JWT2tbus2NMGVmRyjVl5Zsy4pRvYPAWgBRU6+nuyJ7EqmppoDOjpst8WUrC+HmjaKLwLj/XPwwwpwhfwZEZ7AX3DTeY0nscXLzUbkvdGr3n5/iU3Xr48Sw5C8IPsHRS9Dt0bxon2GzpHCEBjUV0hf+yxDObuIbzxRWolKw7yzrQsN3XWpVlGWjVAVvYC35NmcQm5fxH1C1tZePXz89KikRd2Nt/OKNpb3jkRSVz4ifURF7BD652mniswYxfUQA42XaM/ZCHIaoFbQTXoELc3zMOp8CgA+inwAdiOhhxps0AA/vydBSViYb975y4xRUFm3Evyzp7quslffq2sgq+EpCNkzZPGhH+k5GqZ4eKCPHBF44vT1j0Vt/UH/Ik9Cd3AcRhyDoPOodtvMAHOWFF6PvMDcxsdVTaKg2kduCu1NbCgLqY6Rjm3BEPlHpSne4QqmDfxk1JKwqmbgX1QLfxheqSeqD/re+TRsJ7edvygUgJc/OxBUBEDkP4WHf+yQuyr5RSZyc9sLRfwg5jwu6aP3uNX0S5P6j70SZniPaxZKFdrY4g0/FBp9Xc8EDng817DV/Tjuac/5uf/8pXnUVdWiyx6VzwkW07VK+85GlQH+2TyvwuBAnbWTzFt7CaTjjBuB9lJiu13/iaNsgpS4nasGXTnGMMpWr/4l8PQG/fnoK7i+/qp5CCjg2JZ/DKs+CakrC2LE+xfzGWZf8HXYY4lESPcYil9xLqYV1hEvyZ2FUlB1J0qRTlAfnAr4UD7YQNSK0/cPe4QnJFglHvxuwLJYIcYj1G25ruYlBZpT5k4m3/aLMw2+dAtWJKb/AefbdqsEhWDVVH74kuIxLr4WgNtKteuyCPaSBDj6ScCZNyeEdZLQPrZHHcxO73o5lw8UzwJgkbZ/z8yRgp32KsV4KNOH24x5IAnAE5xzm+rJhFgVWPYrthr6MNTuMdyZrrCyFayIZMEDLFri6QMRPqdqk7jojfxZJFM4OD65+uCISzVpOKvkTtYmpAFOWw5U/vJ0wqckHzN5aJHyCUjkGGCZTpDvEi6NisV5nOLWrxDmTMGDECnbZ5ICzsrkazGRsS28Za0gIqLdU0tljgl9/+/HPW0TX905D2ghP6Sp25n9CF/PlNiZ8hFSvzf0/NXjM2mocEiMUNn/NMk0lCOhgs+2jpEY/vn8J8sfRmPKJ1yXT4+fR/LfxR2NBOD6SA0VW/7gWlKmQwClmgv4IQ1nrhdW9AL1sUa+ystekj9WWqCrU3WFZkm6+O12M3b1pajG5O1lSs3ry4zAY9e85xOuT4LpsjlsBNXtWNopPAr0JFr6gAFIPSIA/3xT+ApMZc27Qy9tuoXLxjv/IXYlG+aj3Pz4ZS05oIH2JKRYD6mJT3qfOlok+ZtVXbf1NsuaQiET0k1QMDnRrkdHAoH3ea5q0qQPV4BJAI3hxv4GFNY6txFK6QiML6T0ALfRUnPaPHACg6+emC8BaCIGhh8QJUONwM3lcjKFtGp46tmPHeRZ3FzSJYuivNDjaqeqHQQkZpHVUr2PLoAlQnxKj1hVEVqkzRvZp1s4G5mUyh2fi5Vxo4UOUQ90zOvxE1/p261igT6D9GA4T7j496Vz9RfPxzhROmAh6lqjVIBg2WmZ84UsE7Gt3cYcmQgA6wZ5KhzspFRukGBZCZW6yw6jlBn4mGPLARUuDotjZKFsBNYQvjgWO4JuhDWwFkhCcbEYgeCqlZmB6HoTagKpKaFK7fL9TtKpwLz9nU81Nwa9MMxJ+IyXL074yllxambf4U1GBVJCqVBQj7Rtlag8fAo4PSROwhqTI7SMMrmMBAzdC2uDQuaBZDM6eIJFrwR3tBSOC3fUqaryWOGxDIzSPB9CxFV3sOWtswqnQ2yhrcK4EWaDeXcCZY71W3L1GXQOSi2JLg3cknSyyg4LbgXuPKAx2ND9ArrSNZrlu6O+Dm5Ix0fsPbZedM6zAtMHZMsKOXTzCnmTnrP3JMQGy2KHVJW+4jP+9Q+vHkWkfUqwx/APq5eVFPsc/a3HfqP4Zc/8Dnw0vwTgKTO6HhsYiY+OgzpIuAw6tmialNdGfoWgvJG1TPgejwtHBiTUTnqNBMvAtu8sQdrY6pcRKPUCtF6fYELKYvW6ybXjp/9omUpC9f14n982rv0qzp/dzye+IZNb3SqQ4tcGxPqOK19mbry/Vw8q2Frzvrsb/XI6SRS7NOtQ9B2pbfyqXU+x0CeCs5tsp0V67+bVH6o4k6y5IRLJCw15tBKmgu1GFsrm839e8f76xZJmNb1bSTO9RbrJdSDcBDFImTqawjFtNChbNbUEitZePBbBDnVyn8/qpmqTX+O/Y3WSGn5y8ZvTxaCr7mIEVEWwH6vuR5zhCbBAUpvt3aJKR2AvA5Ds8c8uCAhQDkQ3uCm5KsfBqUy2v4OXfyN885zAhOdMnMn2XuduydHl4s+czX5xaT8LecAaC+K1dfgzGYU5aVifuub1CcOC25vlqc63voBultw1H0/0WUzKt2mXf6JzviPdiY5AR2SugJ9bfxZzN2GZsddbuDT0esdsL/nFrQp9d0LfuhgzoVMtsrgKH149LpIxJQoYWLb2pzzFZJaxM4XCCnaL/sYR+rbhi9LCP4tHZsL51TzzTJBg2hIby0oQovqMOonzCko7c5RJROyIRzL5oItDPkPhKXs/g7ClXa7A5/1UEQWcRGAlqAOkURygaAoBQgy9er+Dh5gCjDwMwz9lATydJxywTLm0BQs7Ax7e4nHni1XXYItsyarjV0RhRjNK2LGBAbS4oFJuAs8E6xG4Ao81sl8ht6hsn0t1C2NZjVzqLqJg8E4gt2nEXcm5DwOJ+LlpMEzwW6Av2Ma34z8GCSsxnD55msxWkFZoKCyH5+Ffku4QWrVtwxEYhB/+j6AXbJk3+k/XfStZDVf0xuhQ2baRp5SPyRxO0nlPMtgm2Vxcugcj769ROoqksa8XCh4hNYWOSlmdBRYf+yjF1Q5MLkU4KstDsiwYMBNaiyr7EC/ocio6vfkxFCrsjyiU1E7taNznxb2gwZYXQkpv523bMFpJ6SVmGw38bmSQQJ508kkPADDTT0bOUiCUi7vmSY4iT2ZFA37ASdgput44j3Q1qwaVzbrbVFdCpyZ0Rz9N8urQD0v7LKwtswAMG9drNqR8FzNQGRXLZHaABeZ3N3v4Op1Bj9tmRz5kyx7cXUPqndWlLgtUIfzq3KXH2blfZE038FMZs4j5tD3z4ke2K0yH65d0VgDmPq6T10V0Wi0FKC43X3GpSV7y3Xzwqe1qu3NSghOe9WcrNo4bLduDBstfhTUByOaLxbHR6GXU+iuO2BaGyAYIzKBp/4+Vo0nbgiuotZ2M2WTRDZhA3uCV0Bs3NKQwgmnEdOUAt7EQ4GtDk/JLMje5Kf2v0qQL1j54q6Z/Bbbeeah3leQbffihjAuRZX5QyiCBn97w/ZFpgaBaD6fik1PawXOdAt9ZFiw9300VaATrvajfKUOEQ2Xsy+F/z1HY6BHtYpJv/E6jeKyrg3z4WBYbeiu21/AJqGurOxe9tTmPniu6fMyaHb2xcwyzxKm1GHC53QkG4rVMpXhUN6CVCevUDyOlU9MTKGDM4oEV1bLjMt1z0xIV7NEu5fm8FhcHkGwETwC+IDtuymtTmt2LT1S/qtKGByGD/l3hgUr7sXUpegKSJRYFe2IMBbN67WeyXZFdQ6mVK0Zk17eqvoGJj4a5zw/Xs4sQCG8fOA7MnJMzxmykiF6rb2T+GiWZbguXUpRsR/91yfsuCeSfZVy5MHoOZY+I9IlMMB3fmunC3+DZYFBq4bCqUmm4kkfdTRgxZnJXgPOAe1dF8Z27QrvU48hNZbZmBKyBcN/sk5X2+sJYotCgEDtSeZ43mTmPiOs3cU29iFr3nTYNQaPPZSGr050Nc01lKBgnF6nHnt4nSVkpOPYluTAGZefId/c9pfINZa4ftp9QIQBxT932rYs35WX0Af64NNxDC3eZGnrcipi6B3S/F3HpgAEWcJ4tbnL1nee+cdfkrGYaxy5xj8UwwYTo2CugiltocmXzqnt+2b5jyTzKt1SHfZ0DiWdhM6Bf6OE0wkoKM3V5fi0QnQgt2q4BLbPaOCyY/mHzwLvRTGXBdF0KSF814K27jldGDz2inBQaeVXc9tf4e7KHdtEifpwRlORwAUg5LfQwgyjbp5RdNCLMbe9OM6+WfMgL9sciNz5us0aRk4CGRNVf9yogP0aKRFJ+mvZ7jsQa0IAD+HwObeFNO8XPWEDNgBJKSPFgsxUGh3DlxRK9lWhO4kO9SE5OZTw4WJeyFR4DjIOMvnzWkKjnXpRDZ0sprfC1Dbf97dTYrpOCpqV3C/F7QnM0h2yp7tqx7zorOXGkrhiM918HXO17jVqqKPsPZWhTdfRGvyyf4cci9JjovWC3w3p4nU4feHliSMg3FyRCWLCmzP/svG5EGfqU9A+PotunNDL19JS6n90dp2sZYVVRDBS1E+FSNnVddAObOKPnGg/5cXe6Po9ystbM4I14uM5zMPqVsh9bd1O8uD+arv2m9aBDJ/q0/jk/aIY6yYGHRRopgs15FnzNYJKbJKg5Kzc/xGxHeP1c0QVHDWZa2mSKc7plVrR46d2D5IhCxF6yeQnmvAURIRBtwQKsRHR3Rfyxk55aoPCyaWj9AH4NaAHbA9lpQICbPeKl8as24Ejot+VfxvRjM1gd5UwyTJ9BQ8uDpn+qWdD97/qy64sc39ScsIahx++HgYpE2XB0SdV3BjSPWkZwndWc1g1MgGQq5bpmVnQE+QQVJRFZLhtH2ExB1SXfvN7QjLcFMivuHuMK8qccBJuVUkW9MVQ/2/Vzb03HI3u5SaANVUBKYUMu6VrQJwbGl/fbTLujT5A2jQOBdXFSlXaTzRCOUfKXF1CXtk+TPNTiFuiOpcr+8bujyPyaR8X9JFSS2GJRK0JdSU58RzX0mCV/FVmWRYFqiyusucoBKg7IRd+87KgAWEby3GIT8KF5IlMmM3RoQLVE4ump0TMyMA0w/qtLElVYaA4Mu01ibytD8P/oknNEK91BYKu4gMFymxQdWNVvsbVoCaWQ+SxO9d+H9so4Y90uVtY/wspWIT4l1rKBNnLpYKwLaVY7rJBCS9+WeornEjGLLX0SKABSO6qFiO5Gq51Wv4sEh0K5300zYhpkQ8K/CrleA922KUQy+i1TWd9hxj8qXucGWW3kEIs/Oy2CX5qGLpBfC7NA2EO3beOpRx3z/iXVRrAwKuW+Vb1H/mlbCRkd1g/N1BVGNhvVSgD4N8uhKxqVaAkZa+i7PjpxTtbjvqO87cAQ6dAGCj2RoAAAJt4FtQAAIL/meAAAd5tx7d0LE042VBnQOnA/Zzq5bqVvo0jUPftiaWX6eE1rhywT5FChuf/jrkb4zj9FLUllYPpzSAt9WcppxUfEUZsBzemal16XtZdYe9q6sat/h7/45OhK6D75wi/pSGaaytQAAAA",
      },
    },
  ];

  const defaultNavItems = [
    { id: 'new', label: 'MỚI', url: '/moi' },
    {
      id: 'san-pham',
      label: 'SẢN PHẨM',
      url: '/san-pham',
      submenu: [
        { id: 'ao', label: 'Áo', url: '/ao' },
        { id: 'quan', label: 'Quần', url: '/quan' },
        { id: 'vay-dam', label: 'Váy & Đầm', url: '/vay-dam' },
        { id: 'set-bo', label: 'Set Bộ', url: '/set-bo' },
        { id: 'men', label: 'Nam', url: '/men' },
        { id: 'women', label: 'Nữ', url: '/women' },
      ],
    },
    {
      id: 'san-pham-sale',
      label: 'SẢN PHẨM SALE',
      url: '/san-pham-sale',
      submenu: [
        { id: 'sale-upto', label: 'Sale Up To', url: '/sale-upto' },
      ],
    },
    {
      id: 'bo-suu-tap',
      label: 'BỘ SƯU TẬP',
      url: '/bo-suu-tap',
      submenu: [
        { id: 'bst-he', label: 'BST Hè', url: '/bo-suu-tap/he' },
        { id: 'bst-dong', label: 'BST Đông', url: '/bo-suu-tap/dong' },
      ],
    },
    { id: 've-kias', label: 'VỀ KIAS', url: '/ve-kias' },
  ];

  return (
    <header className="header sm:pl-[24px] lg:pl-[44px] relative">
      <Area id="headerTop" className="header__top" />
      <div
        className="header__middle flex items-center justify-between md:grid md:grid-cols-3 text-[#79192A]"
        style={{ height: "70px" }}
      >
        {/* LEFT: Hamburger cho mobile, menu ngang cho desktop */}
        <div className="header__middle__left flex justify-start items-center">
          <HeaderMobileLeft onMenuOpen={() => setMenuOpen(true)} />
          <div className="header-middle-left-container">
            <Area
              id="headerMiddleLeft"
              className="header__middle__left"
            />
          </div>
        </div>
        <Area
          id="headerMiddleCenter"
          className="header__middle__center flex justify-center items-center"
        />
        <Area
          id="headerMiddleRight"
          className="header__middle__right flex justify-end items-center gap-3 pl-11"
        />
      </div>
      {/* Dropdown container - positioned absolutely to break out of grid */}
      <div id="navigation-dropdown-container" className="absolute left-0 right-0" style={{ top: '100%', zIndex: 1030 }}></div>
      <Area id="headerBottom" className="header__bottom" />

      {/* Mobile menu drawer */}
      {/* Drawer and overlay always rendered for animation */}
      <div className={`fixed inset-0 z-[3000] flex pointer-events-none ${menuOpen ? '' : ''}`} style={{ pointerEvents: menuOpen ? 'auto' : 'none' }}>
        {/* Overlay */}
        <button
          type="button"
          className={`fixed inset-0 bg-black bg-opacity-40 cursor-pointer transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          aria-label="Đóng menu"
          tabIndex={0}
          onClick={() => setMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setMenuOpen(false);
          }}
          style={{
            border: "none",
            padding: 0,
            margin: 0,
            background: "rgba(0,0,0,0.4)",
            pointerEvents: menuOpen ? 'auto' : 'none',
          }}
        />
        {/* Drawer */}
        <nav
          className={`bg-white w-4/5 max-w-xs h-full shadow-lg flex flex-col fixed left-0 top-0 z-[3100] transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ willChange: 'transform', pointerEvents: menuOpen ? 'auto' : 'none' }}
        >
          <button
            className="absolute top-3 right-3 p-2"
            aria-label="Đóng menu"
            onClick={() => setMenuOpen(false)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#79192A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {/* Đăng nhập/account */}
          <div className="flex items-center gap-2 px-4 pt-6 pb-4 border-b">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="#79192A"
              strokeWidth="1.5"
              viewBox="0 0 20 20"
            >
              <circle
                cx="10"
                cy="7"
                r="3.25"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M4.5 18c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <a
              href="/account/login"
              className="text-[15px] text-[#79192A] font-medium"
            >
              Đăng nhập
            </a>
          </div>
          {/* Menu items from defaultNavItems */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-1">
              {defaultNavItems.map((item) => (
                <li key={item.id}>
                  {item.submenu ? (
                    <>
                      <button
                        className="w-full flex justify-between items-center text-lg font-bold text-[#79192A] py-2 focus:outline-none hover:bg-gray-100 rounded transition"
                        onClick={() => toggleSection(item.id)}
                        aria-expanded={openSections[item.id]}
                      >
                        <span>{item.label}</span>
                        <svg
                          className={`w-5 h-5 ml-2 transition-transform duration-200 ${
                            openSections[item.id] ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="#79192A"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M6 9l6 6 6-6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      {openSections[item.id] && (
                        <ul className="pl-4 text-sm text-[#202020] space-y-1 animate-fadeIn">
                          {item.submenu.map((sub) => (
                            <li className="py-0.5" key={sub.id}>
                              <a href={sub.url} className="hover:text-[#79192A] transition">
                                {sub.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <a
                      href={item.url}
                      className="block text-lg font-bold text-[#79192A] py-2 hover:bg-gray-100 rounded transition"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            {/* Hình ảnh danh mục ở ngay dưới menu, sau CỬA HÀNG */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {thumbItems.map((item, idx) => (
                <a
                  key={item.url + idx}
                  href={item.url}
                  className="flex flex-col items-center hover:opacity-80"
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src={item.image?.url}
                    alt={item.name}
                    className="w-16 h-16 object-contain"
                  />
                  <span className="text-xs mt-1 text-center">
                    {item.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
