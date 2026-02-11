import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/Tricomm-logo.png';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'หน้าแรก', href: '#hero' },
    { name: 'สินค้า', href: '#products' },
    { name: 'บริการ', href: '#features' },
    { name: 'ติดต่อ', href: '#footer' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#hero" className="nav-logo">
          <img src={logo} alt="Tricomm" className="logo-img" />
          <span className="logo-text">Tricomm</span>
        </a>

        <div className="nav-links desktop">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="nav-link">
              {link.name}
            </a>
          ))}
          
          {/* Admin Link */}
          {isAdmin && (
            <Link to="/admin" className="admin-link">
              Admin
            </Link>
          )}
          
          {/* Login/Logout */}
          {user ? (
            <button onClick={signOut} className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer'}}>
              ออกจากระบบ
            </button>
          ) : (
            <Link to="/login" className="nav-link">
              เข้าสู่ระบบ
            </Link>
          )}
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <a 
            key={link.name} 
            href={link.href} 
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.name}
          </a>
        ))}
        
        {isAdmin && (
          <Link 
            to="/admin" 
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
            style={{color: '#00A651', fontWeight: 600}}
          >
            Admin Dashboard
          </Link>
        )}
        
        {user ? (
          <button 
            onClick={() => { signOut(); setMobileMenuOpen(false); }}
            className="mobile-nav-link"
            style={{background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'}}
          >
            ออกจากระบบ
          </button>
        ) : (
          <Link 
            to="/login" 
            className="mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            เข้าสู่ระบบ
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
