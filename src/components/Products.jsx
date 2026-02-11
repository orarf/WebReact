import { Link } from 'react-router-dom';
import logo1 from '../assets/Tricomm-logo.png';
import logo2 from '../assets/unnamed.jpg';

function Products() {
  const products = [
    {
      id: 'test1',
      name: 'Test1',
      tagline: 'เริ่มต้นที่ใช่สำหรับธุรกิจเล็ก',
      logo: logo1,
      price: '฿499',
      period: '/เดือน',
      features: [
        'ผู้ใช้งานสูงสุด 5 คน',
        'พื้นที่จัดเก็บ 100 GB',
        'รองรับการสนทนาแบบกลุ่ม',
        'การเข้ารหัสพื้นฐาน',
        'สนับสนุนทางอีเมล'
      ],
      cta: 'ทดลองฟรี',
      popular: false
    },
    {
      id: 'test2',
      name: 'Viavi',
      tagline: 'สำหรับธุรกิจที่ต้องการเติบโต',
      logo: logo2,
      price: '฿1,299',
      period: '/เดือน',
      features: [
        'ผู้ใช้งานไม่จำกัด',
        'พื้นที่จัดเก็บ 1 TB',
        'การวิเคราะห์ขั้นสูง',
        'การเข้ารหัสระดับองค์กร',
        'สนับสนุน 24/7',
        'API สำหรับนักพัฒนา'
      ],
      cta: 'ซื้อเลย',
      popular: true
    },
    {
      id: 'test3',
      name: 'Test3',
      tagline: 'โซลูชั่นครบวงจรสำหรับองค์กร',
      logo: logo1,
      price: 'ติดต่อเรา',
      period: '',
      features: [
        'ทุกอย่างใน Pro',
        'พื้นที่จัดเก็บไม่จำกัด',
        'เซิร์ฟเวอร์ส่วนตัว',
        'ระบบ Single Sign-On',
        'ทีมสนับสนุนเฉพาะ',
        'SLA การันตี 99.99%'
      ],
      cta: 'ติดต่อฝ่ายขาย',
      popular: false
    }
  ];

  return (
    <section id="products" className="products">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">เลือกแพ็กเกจที่เหมาะกับคุณ</h2>
          <p className="section-subtitle">
            ยืดหยุ่น คุ้มค่า พร้อมรองรับการเติบโต
          </p>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div 
              key={product.id} 
              className={`product-card ${product.popular ? 'popular' : ''}`}
            >
              {product.popular && (
                <span className="popular-badge">ยอดนิยม</span>
              )}
              {product.logo && (
                <img src={product.logo} alt={product.name} className="product-logo" />
              )}
              <h3 className="product-name">{product.name}</h3>
              <p className="product-tagline">{product.tagline}</p>
              <div className="product-price">
                <span className="price">{product.price}</span>
                <span className="period">{product.period}</span>
              </div>
              <ul className="product-features">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="feature-item">
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              {/* ปุ่มรายละเอียด → ไปหน้าใหม่ */}
              <div className="product-actions">
                <Link to={`/product/${product.id}`} className="btn btn-primary">
                  ดูรายละเอียด
                </Link>
                <button className={`btn ${product.popular ? 'btn-secondary' : 'btn-text'}`}>
                  {product.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;
