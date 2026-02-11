import logo from '../assets/Tricomm-logo.png';

function Features() {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'รวดเร็วทันใจ',
      description: 'ระบบที่ออกแบบมาเพื่อความเร็วสูงสุด ตอบสนองทันทีในทุกการใช้งาน'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: 'ปลอดภัยสูงสุด',
      description: 'การเข้ารหัสระดับสูงปกป้องข้อมูลของคุณตลอด 24 ชั่วโมง'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: 'เชื่อมต่อได้ทุกที่',
      description: 'ทำงานร่วมกันได้ทุกที่ทุกเวลา ไม่ว่าจะอยู่ที่ไหนในโลก'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      title: 'รองรับทุกอุปกรณ์',
      description: 'ใช้งานได้บนทุกแพลตฟอร์ม ทั้งคอมพิวเตอร์ แท็บเล็ต และมือถือ'
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">ทำไมต้อง Tricomm?</h2>
          <p className="section-subtitle">
            เทคโนโลยีที่ออกแบบมาเพื่อธุรกิจของคุณ
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
