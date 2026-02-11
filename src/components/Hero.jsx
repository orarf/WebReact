import logo from '../assets/Tricomm-logo.png';

function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <div className="hero-logo">
          <img src={logo} alt="Tricomm" className="hero-logo-img" />
        </div>
        <h1 className="hero-title">
          Tricomm
        </h1>
        <p className="hero-subtitle">
          เชื่อมต่อโลกของคุณด้วยเทคโนโลยีแห่งอนาคต
        </p>
        <p className="hero-description">
          โซลูชั่นครบวงจรสำหรับธุรกิจยุคดิจิทัล<br />
          สื่อสาร รวดเร็ว เชื่อถือได้
        </p>
        <div className="hero-buttons">
          <a href="#products" className="btn btn-primary">
            เริ่มต้นใช้งาน
          </a>
          <a href="#features" className="btn btn-secondary">
            เรียนรู้เพิ่มเติม
          </a>
        </div>
      </div>
      <div className="hero-scroll">
        <span className="scroll-indicator"></span>
      </div>
    </section>
  );
}

export default Hero;
