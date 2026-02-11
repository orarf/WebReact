import logo from '../assets/Tricomm-logo.png';

function Footer() {
  const footerLinks = [
    {
      title: 'สินค้า',
      links: ['Test1', 'Test2', 'Test3']
    },
    {
      title: 'บริษัท',
      links: ['เกี่ยวกับเรา', 'ร่วมงานกับเรา', 'ข่าวสาร', 'ติดต่อ']
    },
    {
      title: 'สนับสนุน',
      links: ['ศูนย์ช่วยเหลือ', 'เอกสาร', 'สถานะระบบ', 'ชุมชน']
    }
  ];

  return (
    <footer id="footer" className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <a href="#hero" className="footer-logo">
              <img src={logo} alt="Tricomm" className="footer-logo-img" />
              <span className="footer-logo-text">Tricomm</span>
            </a>
            <p className="footer-tagline">
              เชื่อมต่อโลกของคุณด้วยเทคโนโลยีแห่งอนาคต
            </p>
          </div>

          <div className="footer-links">
            {footerLinks.map((section, index) => (
              <div key={index} className="footer-section">
                <h4 className="footer-title">{section.title}</h4>
                <ul className="footer-list">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <a href="#" className="footer-link">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} Tricomm. สงวนลิขสิทธิ์ทั้งหมด.
          </p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
