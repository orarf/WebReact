import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logo1 from '../assets/Tricomm-logo.png';
import { getProductsByPackage, getCategories, searchProducts } from '../lib/supabase';

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  // States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['ทั้งหมด']);
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ข้อมูลแพ็กเกจ
  const packagesData = {
    'test1': {
      name: 'Test1',
      fullName: 'Tricomm Basic',
      tagline: 'เริ่มต้นที่ใช่สำหรับธุรกิจเล็ก',
      logo: logo1,
      price: '฿499',
      period: '/เดือน',
      description: 'แพ็กเกจเริ่มต้นที่เหมาะสมสำหรับธุรกิจขนาดเล็กหรือทีมงานที่เพิ่งเริ่มต้น',
      specs: [
        { label: 'จำนวนผู้ใช้', value: 'สูงสุด 5 คน' },
        { label: 'พื้นที่เก็บข้อมูล', value: '100 GB' },
        { label: 'การรองรับ', value: 'อีเมล' },
        { label: 'uptime', value: '99.9%' }
      ]
    },
    'test2': {
      name: 'Test2',
      fullName: 'Tricomm Pro',
      tagline: 'สำหรับธุรกิจที่ต้องการเติบโต',
      logo: logo1,
      price: '฿1,299',
      period: '/เดือน',
      description: 'แพ็กเกจยอดนิยมสำหรับธุรกิจที่ต้องการขยายตัว',
      specs: [
        { label: 'จำนวนผู้ใช้', value: 'ไม่จำกัด' },
        { label: 'พื้นที่เก็บข้อมูล', value: '1 TB' },
        { label: 'การรองรับ', value: '24/7' },
        { label: 'uptime', value: '99.95%' }
      ]
    },
    'test3': {
      name: 'Test3',
      fullName: 'Tricomm Enterprise',
      tagline: 'โซลูชั่นครบวงจรสำหรับองค์กร',
      logo: logo1,
      price: 'ติดต่อเรา',
      period: '',
      description: 'โซลูชั่นครบวงจรที่ออกแบบมาเฉพาะสำหรับองค์กรขนาดใหญ่',
      specs: [
        { label: 'จำนวนผู้ใช้', value: 'ไม่จำกัด' },
        { label: 'พื้นที่เก็บข้อมูล', value: 'ไม่จำกัด' },
        { label: 'การรองรับ', value: 'ทีมเฉพาะ' },
        { label: 'uptime', value: '99.99%' }
      ]
    }
  };

  const currentPackage = packagesData[productId?.toLowerCase()];

  // ดึงข้อมูลจาก Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // ดึงสินค้าตาม package
        const productsData = await getProductsByPackage(productId);
        setProducts(productsData);
        
        // ดึงหมวดหมู่ทั้งหมด
        const cats = await getCategories(productId);
        setCategories(['ทั้งหมด', ...cats]);
        
      } catch (err) {
        console.error('Error:', err);
        setError('ไม่สามารถโหลดข้อมูลจากฐานข้อมูลได้');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [productId]);

  // ค้นหาแบบ real-time (client-side)
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // กรองสินค้าตามหมวดหมู่ + คำค้นหา
  const filteredProducts = products.filter(product => {
    // กรองตามหมวดหมู่
    const matchCategory = selectedCategory === 'ทั้งหมด' || product.category === selectedCategory;
    
    // กรองตามคำค้นหา
    const query = searchQuery.toLowerCase();
    const matchSearch = 
      !searchQuery || 
      product.model?.toLowerCase().includes(query) ||
      product.name?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.short_spec?.toLowerCase().includes(query);
    
    return matchCategory && matchSearch;
  });

  // ล้างการค้นหา
  const clearSearch = () => {
    setSearchQuery('');
  };

  if (!currentPackage) {
    return (
      <div className="product-detail-not-found">
        <div className="container">
          <h1>ไม่พบสินค้า</h1>
          <p>สินค้าที่คุณค้นหาไม่มีในระบบ</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            กลับหน้าแรก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      {/* Navbar */}
      <nav className="detail-navbar">
        <div className="container">
          <button className="back-btn" onClick={() => navigate('/')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            กลับ
          </button>
          <span className="detail-brand">Tricomm</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="product-detail-hero">
        <div className="container">
          <div className="product-hero-content">
            <img src={currentPackage.logo} alt={currentPackage.name} className="product-detail-logo" />
            <h1 className="product-detail-name">{currentPackage.fullName}</h1>
            <p className="product-detail-tagline">{currentPackage.tagline}</p>
            <div className="product-detail-price">
              <span className="price">{currentPackage.price}</span>
              <span className="period">{currentPackage.period}</span>
            </div>
            <div className="product-detail-actions">
              <button className="btn btn-primary btn-large">
                {currentPackage.price === 'ติดต่อเรา' ? 'ติดต่อฝ่ายขาย' : 'สมัครใช้งาน'}
              </button>
              <button className="btn btn-secondary btn-large">
                ทดลองฟรี 14 วัน
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="product-detail-description">
        <div className="container">
          <p className="description-text">{currentPackage.description}</p>
        </div>
      </section>

      {/* Specs */}
      <section className="product-detail-specs">
        <div className="container">
          <h2 className="section-title">สเปคแพ็กเกจ</h2>
          <div className="specs-grid">
            {currentPackage.specs.map((spec, index) => (
              <div key={index} className="spec-card">
                <span className="spec-label">{spec.label}</span>
                <span className="spec-value">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <section className="product-catalog">
        <div className="container">
          <div className="catalog-header">
            <h2 className="section-title">สินค้าในแพ็กเกจ</h2>
            <p className="section-subtitle">
              {loading ? 'กำลังโหลด...' : `${filteredProducts.length} รายการจากฐานข้อมูล`}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>ลองใหม่</button>
            </div>
          )}

          {/* Search & Filter Section */}
          {!loading && !error && products.length > 0 && (
            <div className="search-filter-section">
              {/* Search Box */}
              <div className="search-box">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="ค้นหาสินค้า, รุ่น, หมวดหมู่..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="search-input"
                />
                {searchQuery && (
                  <button className="clear-search" onClick={clearSearch}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="category-filter">
                {categories.map((cat, idx) => (
                  <button 
                    key={idx} 
                    className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="catalog-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="catalog-card skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <div className="catalog-grid">
              {filteredProducts.map((item) => (
                <div key={item.id} className="catalog-card">
                  <div className="catalog-image">
                    <img src={item.image} alt={item.model} />
                    <span className={`availability-badge ${item.availability === 'มีสินค้า' ? 'in-stock' : 'pre-order'}`}>
                      {item.availability}
                    </span>
                  </div>
                  <div className="catalog-info">
                    <span className="catalog-category">{item.category}</span>
                    <h3 className="catalog-model">{item.model}</h3>
                    <p className="catalog-name">{item.name}</p>
                    <p className="catalog-spec">{item.short_spec || item.shortSpec}</p>
                    <div className="catalog-footer">
                      <span className="catalog-price">{item.price}</span>
                      <button className="catalog-btn">
                        ดูรายละเอียด
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="empty-state">
              {searchQuery ? (
                <>
                  <p>ไม่พบสินค้าที่ตรงกับ "{searchQuery}"</p>
                  <button className="btn btn-secondary" onClick={clearSearch}>
                    ล้างการค้นหา
                  </button>
                </>
              ) : (
                <>
                  <p>ไม่พบสินค้าในหมวดหมู่นี้</p>
                  <p style={{fontSize: '14px', color: '#86868b'}}>
                    กรุณาตรวจสอบว่าได้สร้าง table "products" และใส่ข้อมูลใน Supabase แล้ว
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="product-detail-cta">
        <div className="container">
          <h2 className="cta-title">พร้อมเริ่มต้นแล้วหรือยัง?</h2>
          <p className="cta-subtitle">เริ่มต้นใช้งาน {currentPackage.fullName} วันนี้</p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-large">
              {currentPackage.price === 'ติดต่อเรา' ? 'ติดต่อฝ่ายขาย' : 'สมัครใช้งานทันที'}
            </button>
            <button className="btn btn-secondary btn-large" onClick={() => navigate('/')}>
              ดูแพ็กเกจอื่น
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="detail-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Tricomm. สงวนลิขสิทธิ์ทั้งหมด.</p>
        </div>
      </footer>
    </div>
  );
}

export default ProductDetail;
