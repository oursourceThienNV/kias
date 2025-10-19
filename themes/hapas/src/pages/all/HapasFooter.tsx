/**
 * HAPAS Footer Component
 * 
 * Full footer matching HAPAS.VN design:
 * - Multi-column layout (4 columns)
 * - Newsletter signup
 * - Social media links
 * - Payment method icons
 * - Vietnamese content
 * - Responsive design
 */

import React, { useState } from 'react';
// import './HapasFooter.scss'; // SCSS has @import issues - needs rewrite

interface FooterLink {
  label: string;
  url: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface HapasFooterProps {
  copyRight?: string;
}

export default function HapasFooter({ copyRight = '© 2025 HAPAS. All Rights Reserved.' }: HapasFooterProps) {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const footerColumns: FooterColumn[] = [
    {
      title: 'VỀ HAPAS',
      links: [
        { label: 'Điều bình thường tươi đẹp', url: '/pages/about' },
        { label: 'Hapas cần bạn', url: '/pages/careers' },
        { label: 'Quà tặng', url: '/collections/gifts' },
        { label: 'Bộ sưu tập', url: '/collections' },
        { label: 'Tuyển dụng', url: '/pages/recruitment' }
      ]
    },
    {
      title: 'DỊCH VỤ KHÁCH HÀNG',
      links: [
        { label: 'Chính sách khách hàng thân thiết', url: '/pages/loyalty-program' },
        { label: 'Chính sách đổi/trả sản phẩm', url: '/pages/return-policy' },
        { label: 'Chính sách bảo mật', url: '/pages/privacy-policy' },
        { label: 'Chính sách giao hàng', url: '/pages/shipping-policy' },
        { label: 'Hình thức thanh toán', url: '/pages/payment-methods' },
        { label: 'Điều khoản sử dụng', url: '/pages/terms' },
        { label: 'Các câu hỏi thường gặp', url: '/pages/faq' }
      ]
    },
    {
      title: 'LIÊN HỆ HAPAS',
      links: [
        { label: 'Hệ thống cửa hàng', url: '/pages/stores' },
        { label: 'Tin tức', url: '/blogs/news' }
      ]
    }
  ];

  const socialLinks = [
    { 
      name: 'Instagram', 
      url: 'https://www.instagram.com/hapas.vn/',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    { 
      name: 'Facebook', 
      url: 'https://www.facebook.com/hapas2010',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    { 
      name: 'TikTok', 
      url: 'https://www.tiktok.com/@hapas.official',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      )
    }
  ];

  const paymentMethods = [
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'JCB', icon: '💳' },
    { name: 'MoMo', icon: '📱' }
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // TODO: Implement newsletter API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus('success');
      setEmail('');
      
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="hapas-footer">
      <div className="footer-main">
        <div className="footer-container">
          {/* Footer Columns */}
          <div className="footer-columns">
            {footerColumns.map((column, index) => (
              <div key={index} className="footer-column">
                <h3 className="footer-column-title">{column.title}</h3>
                <ul className="footer-links">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href={link.url} className="footer-link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter Column */}
            <div className="footer-column newsletter-column">
              <h3 className="footer-column-title">ĐĂNG KÝ ĐỂ NHẬN TIN</h3>
              
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <div className="newsletter-input-wrapper">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="newsletter-input"
                    disabled={isSubmitting}
                    aria-label="Email đăng ký nhận tin"
                  />
                  <button
                    type="submit"
                    className="newsletter-button"
                    disabled={isSubmitting}
                    aria-label="Gửi"
                  >
                    {isSubmitting ? '...' : 'GỬI'}
                  </button>
                </div>
                
                {submitStatus === 'success' && (
                  <p className="newsletter-message success">
                    Cảm ơn bạn đã đăng ký!
                  </p>
                )}
                
                {submitStatus === 'error' && (
                  <p className="newsletter-message error">
                    Vui lòng nhập email hợp lệ
                  </p>
                )}
              </form>

              {/* Social Media */}
              <div className="footer-social">
                <h4 className="social-title">THEO DÕI CHÚNG TÔI</h4>
                <div className="social-links">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className="social-link"
                      aria-label={social.name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="footer-payment">
                <h4 className="payment-title">PHƯƠNG THỨC THANH TOÁN</h4>
                <div className="payment-methods">
                  {paymentMethods.map((method, index) => (
                    <span
                      key={index}
                      className="payment-method"
                      title={method.name}
                    >
                      {method.icon}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <p className="copyright">{copyRight}</p>
        </div>
      </div>
    </footer>
  );
}

// Component registration for EverShop Area system
export const layout = {
  areaId: 'footer',
  sortOrder: 10
};

