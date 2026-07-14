import React, { useState, useEffect } from 'react';
import './App.css';

const SplitText = ({ text, delayOffset = 0 }) => {
  return (
    <span className="split-text" aria-label={text}>
      {text.split('').map((char, index) => (
        <span key={index} style={{ transitionDelay: `${delayOffset + (index * 0.05)}s` }} aria-hidden="true">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

const productData = {
  jacket: {
    title: "WUF Jacket",
    subtitle: "모든 날씨를 완벽하게 제어하다.",
    description: "견체공학적 설계로 완성된 궁극의 아우터. 비, 바람, 눈 어떤 환경에서도 반려견의 체온을 완벽하게 유지합니다. 특수 개발된 마이크로 파이버 소재가 놀라운 가벼움과 완벽한 방수 능력을 동시에 제공합니다.",
    features: ["완벽한 방수 및 방풍", "우주복 수준의 보온재", "야간 반사 리플렉터", "세탁기 사용 가능"],
    price: "₩129,000",
    image: `${import.meta.env.BASE_URL}images/hero_jacket.png`
  },
  harness: {
    title: "WUF Harness Pro",
    subtitle: "산책의 프로페셔널.",
    description: "반려견의 목과 가슴에 가해지는 압박을 제로에 가깝게 분산시킵니다. 초경량 항공기 소재 버클과 통기성이 뛰어난 3D 에어메쉬로 산책의 질이 완전히 달라집니다.",
    features: ["3D 입체 하중 분산", "초경량 알루미늄 버클", "피부 자극 없는 에어메쉬", "원터치 착용 시스템"],
    price: "₩89,000",
    image: `${import.meta.env.BASE_URL}images/hero_harness.png`
  },
  smarttag: {
    title: "WUF Smart Tag",
    subtitle: "반려견의 일상을 기록하는 혁신.",
    description: "단순한 인식표의 한계를 넘었습니다. 정밀한 자이로 센서와 GPS가 활동량, 수면 패턴, 그리고 정확한 위치를 실시간으로 당신의 스마트폰에 전송합니다.",
    features: ["실시간 GPS 추적", "24시간 활동량 분석", "1년 지속 배터리", "IP68 완전 방수"],
    price: "₩69,000",
    image: `${import.meta.env.BASE_URL}images/hero_smarttag.png`
  }
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPurchase, setShowPurchase] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      
      const wrapper = document.querySelector('.parallax-wrapper');
      if (wrapper) {
        const xAxis = (window.innerWidth / 2 - e.clientX) / 25;
        const yAxis = (window.innerHeight / 2 - e.clientY) / 25;
        
        const xRatio = (e.clientX / window.innerWidth) * 100;
        const yRatio = (e.clientY / window.innerHeight) * 100;

        wrapper.style.setProperty('--mouse-x', `${xAxis}deg`);
        wrapper.style.setProperty('--mouse-y', `${yAxis}deg`);
        wrapper.style.setProperty('--glare-x', `${xRatio}%`);
        wrapper.style.setProperty('--glare-y', `${yRatio}%`);
      }

      // Hero mouse tracking for luxury hover effect
      document.querySelectorAll('.hero').forEach(hero => {
        const rect = hero.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          hero.style.setProperty('--hx', `${x}%`);
          hero.style.setProperty('--hy', `${y}%`);
        }
      });
    };
    
    const handleMouseOver = (e) => {
      if (
        e.target.tagName?.toLowerCase() === 'a' || 
        e.target.tagName?.toLowerCase() === 'button' ||
        e.target.closest('a') || 
        e.target.closest('button') ||
        e.target.classList?.contains('icon')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-reveal, .text-reveal, .hero-scroll-reveal');
      const windowHeight = window.innerHeight;
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight * 0.85) {
          el.classList.add('is-visible');
        }
      });
      
      // Scroll-bound text fill effect
      document.querySelectorAll('.scroll-text-fill').forEach(el => {
        const rect = el.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, 1 - (rect.top - windowHeight * 0.3) / (windowHeight * 0.4)));
        el.style.setProperty('--fill-progress', `${progress * 100}%`);
      });
      
      const wrapper = document.querySelector('.parallax-wrapper');
      if (wrapper) {
        const scrollY = window.scrollY;
        const scale = Math.min(1 + scrollY / 1500, 1.25);
        wrapper.style.setProperty('--scroll-scale', scale);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger once on mount

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [selectedProduct]);

  if (selectedProduct) {
    return (
      <div className="product-detail-page split-layout">
        <div className={`custom-cursor ${isHovering ? 'hover' : ''}`} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}></div>
        
        <nav className="detail-nav">
          <button className="back-btn" onClick={() => setSelectedProduct(null)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            돌아가기
          </button>
        </nav>

        <div className="split-left">
          <div className="sticky-image-container">
            <div className="parallax-wrapper">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="parallax-image" />
              <div className="glare"></div>
            </div>
          </div>
        </div>

        <div className="split-right">
          <div className="detail-section text-reveal">
            <h1>{selectedProduct.title}</h1>
            <h2>{selectedProduct.subtitle}</h2>
            <p className="detail-desc scroll-text-fill">{selectedProduct.description}</p>
          </div>
          
          <div className="detail-section text-reveal" style={{ marginTop: '140px' }}>
            <h3 className="section-title">Design Philosophy</h3>
            <p className="section-body scroll-text-fill">디자인의 본질은 눈에 보이지 않는 곳에서 시작됩니다. {selectedProduct.title}은(는) 최고급 소재와 견체공학적 설계를 바탕으로 반려견의 움직임을 전혀 방해하지 않는 완벽한 핏을 구현했습니다. 우리는 아름다움과 기능성이 완벽하게 조화된 순간을 믿습니다.</p>
          </div>

          <div className="detail-section" style={{ marginTop: '140px' }}>
            <h3 className="section-title text-reveal">Core Features</h3>
            <div className="detail-features-list">
              {selectedProduct.features.map((feature, idx) => (
                <div key={idx} className="feature-row text-reveal" style={{ transitionDelay: `${idx * 0.15}s` }}>
                  <div>
                    <h4>{feature}</h4>
                    <p>수백 번의 테스트를 거친 혁신적인 기술이 적용되어, 어떤 상황에서도 최상의 퍼포먼스를 제공합니다.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section" style={{ marginTop: '140px', marginBottom: '200px' }}>
            <h3 className="section-title text-reveal">Tech Specs</h3>
            <div className="specs-grid">
              <div className="spec-item text-reveal" style={{ transitionDelay: '0s' }}>
                <h5>Material</h5>
                <p>Aero-grade Premium Fabric</p>
              </div>
              <div className="spec-item text-reveal" style={{ transitionDelay: '0.1s' }}>
                <h5>Durability</h5>
                <p>Military Standard Tested</p>
              </div>
              <div className="spec-item text-reveal" style={{ transitionDelay: '0.2s' }}>
                <h5>Care</h5>
                <p>Machine Washable, Quick Dry</p>
              </div>
              <div className="spec-item text-reveal" style={{ transitionDelay: '0.3s' }}>
                <h5>Warranty</h5>
                <p>2-Year WUF Care Included</p>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-bottom-bar">
          <span className="price">{selectedProduct.price}</span>
          <button className="btn buy-btn" onClick={() => setShowPurchase(true)}>구입하기</button>
        </div>

        {showPurchase && (
          <div className="purchase-overlay" onClick={() => setShowPurchase(false)}>
            <div className="purchase-card" onClick={e => e.stopPropagation()}>
              <div className="check-icon-wrapper">
                <svg className="animated-check" viewBox="0 0 52 52">
                  <circle className="check-circle" cx="26" cy="26" r="25" fill="none"/>
                  <path className="check-path" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
              <h3>장바구니에 담겼습니다</h3>
              <p><strong>{selectedProduct.title}</strong> 제품이 성공적으로 추가되었습니다.</p>
              <div className="purchase-actions">
                <button className="btn checkout-btn" onClick={() => setShowPurchase(false)}>결제 진행하기</button>
                <button className="btn continue-btn" onClick={() => setShowPurchase(false)}>계속 쇼핑하기</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="wuf-app">
      <div className={`custom-cursor ${isHovering ? 'hover' : ''}`} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}></div>
      {/* Header */}
      <header className="wuf-header">
        <div className="header-content">
          <div className="logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 23C8.5 23 6.5 20 6.5 17C6.5 13.5 9.5 13 12 12C14.5 13 17.5 13.5 17.5 17C17.5 20 15.5 23 12 23Z" fill="#1d1d1f"/>
              <ellipse cx="5.5" cy="9.5" rx="2.2" ry="3.2" transform="rotate(-35 5.5 9.5)" fill="#1d1d1f"/>
              <ellipse cx="18.5" cy="9.5" rx="2.2" ry="3.2" transform="rotate(35 18.5 9.5)" fill="#1d1d1f"/>
              <ellipse cx="9.5" cy="4.5" rx="2.2" ry="3.2" transform="rotate(-15 9.5 4.5)" fill="#1d1d1f"/>
              <ellipse cx="14.5" cy="4.5" rx="2.2" ry="3.2" transform="rotate(15 14.5 4.5)" fill="#1d1d1f"/>
            </svg>
          </div>
          <nav className="desktop-nav">
            <a href="#">스토어</a>
            <a href="#">외출용품</a>
            <a href="#">의류</a>
            <a href="#">장난감</a>
            <a href="#">스마트기기</a>
            <a href="#">리빙용품</a>
            <a href="#">푸드·간식</a>
            <a href="#">엔터테인먼트</a>
            <a href="#">액세서리</a>
            <a href="#">고객지원</a>
          </nav>
          <div className="header-icons">
            <span className="icon search">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.7 13.3l-3.5-3.5c0.8-1 1.2-2.3 1.2-3.6 0-3.4-2.8-6.2-6.2-6.2S0 2.8 0 6.2s2.8 6.2 6.2 6.2c1.3 0 2.6-0.4 3.6-1.2l3.5 3.5 1.4-1.4zM2 6.2c0-2.3 1.9-4.2 4.2-4.2s4.2 1.9 4.2 4.2-1.9 4.2-4.2 4.2S2 8.5 2 6.2z" fill="#000" fillOpacity="0.8"/></svg>
            </span>
            <span className="icon cart">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 4H10C10 1.8 8.2 0 6 0S2 1.8 2 4H0v11h15V4h-2.5zM6 1.5c1.4 0 2.5 1.1 2.5 2.5H3.5C3.5 2.6 4.6 1.5 6 1.5zM13.5 13.5h-12v-8h12v8z" fill="#000" fillOpacity="0.8"/></svg>
            </span>
            <span className="icon hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 2h15v1.5H0V2zm0 5.8h15v1.5H0V7.8zm0 5.7h15v1.5H0v-1.5z" fill="#000" fillOpacity="0.8"/></svg>
            </span>
          </div>
        </div>
        {/* Mobile Nav Overlay */}
        {isMenuOpen && (
          <div className="mobile-nav">
            <a href="#">스토어</a>
            <a href="#">외출용품</a>
            <a href="#">의류</a>
            <a href="#">장난감</a>
            <a href="#">스마트기기</a>
            <a href="#">리빙용품</a>
            <a href="#">푸드·간식</a>
          </div>
        )}
      </header>

      {/* Hero Sections */}
      <section className="hero hero-1 dark">
        <div className="hero-text hero-1-text">
          <h1>WUF Jacket</h1>
          <p>모든 날씨를 완벽하게 제어하다.</p>
          <div className="hero-links">
            <a href="#" className="btn" onClick={(e) => { e.preventDefault(); setSelectedProduct(productData.jacket); }}>더 알아보기</a>
            <a href="#" className="btn btn-outline">구입하기</a>
          </div>
        </div>
      </section>

      <section className="hero hero-2 hero-scroll-reveal">
        <div className="hero-text">
          <h1>WUF Harness Pro</h1>
          <p>산책의 프로페셔널.</p>
          <div className="hero-links">
            <a href="#" className="btn" onClick={(e) => { e.preventDefault(); setSelectedProduct(productData.harness); }}>더 알아보기</a>
            <a href="#" className="btn btn-outline">구입하기</a>
          </div>
        </div>
      </section>

      <section className="hero hero-3 hero-scroll-reveal">
        <div className="hero-text">
          <h1>WUF Smart Tag</h1>
          <p>반려견의 일상을 기록하는 혁신.</p>
          <div className="hero-links">
            <a href="#" className="btn" onClick={(e) => { e.preventDefault(); setSelectedProduct(productData.smarttag); }}>더 알아보기</a>
            <a href="#" className="btn btn-outline">구입하기</a>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <section className="marquee-section">
        <div className="marquee-container">
          <div className="marquee-content">
            <span>BEYOND ORDINARY • THE NEW STANDARD FOR PETS • WUF DESIGN STUDIO • EST. 2026 • BEYOND ORDINARY • THE NEW STANDARD FOR PETS • WUF DESIGN STUDIO • EST. 2026 • </span>
            <span>BEYOND ORDINARY • THE NEW STANDARD FOR PETS • WUF DESIGN STUDIO • EST. 2026 • BEYOND ORDINARY • THE NEW STANDARD FOR PETS • WUF DESIGN STUDIO • EST. 2026 • </span>
          </div>
        </div>
      </section>

      {/* Grid Gallery */}
      <section className="grid-gallery">
        <div className="grid-item item-1 scroll-reveal">
          <div className="grid-text">
            <h2>WUF Bed Max</h2>
            <p>다재다능. 궁극의 휴식.</p>
          </div>
        </div>
        <div className="grid-item item-2 scroll-reveal">
          <div className="grid-text">
            <h2>WUF Leash Air</h2>
            <p>선 없는 듯한 자유로움.</p>
          </div>
        </div>
        <div className="grid-item item-3 scroll-reveal">
          <div className="grid-text">
            <h2>WUF Carrier</h2>
            <p>어디든 가볍게, 함께.</p>
          </div>
        </div>
        <div className="grid-item item-4 scroll-reveal">
          <div className="grid-text">
            <h2>WUF Feeder 4K</h2>
            <p>스마트한 급여, 완벽한 타이밍.</p>
          </div>
        </div>
        <div className="grid-item item-5 scroll-reveal">
          <div className="grid-text">
            <h2>WUF Bowl</h2>
            <p>매일의 식사를 새롭게.</p>
          </div>
        </div>
        <div className="grid-item item-6 scroll-reveal">
          <div className="grid-text">
            <h2>장난감 & 액세서리</h2>
            <p>즐거움의 마법.</p>
          </div>
        </div>
      </section>

      {/* Carousel */}
      <section className="carousel-section">
        <h2>Latest Contents.</h2>
        <div className="carousel">
          {[
            { title: "Puppy Training 101", date: "2026.08.12 - 2026.08.14" },
            { title: "Behavior Seminar", date: "2026.08.20" },
            { title: "Agility Masterclass", date: "2026.09.05" },
            { title: "First Aid for Pets", date: "2026.09.15" },
            { title: "WUF Care Workshop", date: "2026.09.28" },
            { title: "Obedience Course", date: "2026.10.05 - 2026.10.10" }
          ].map((item, index) => (
            <div className="carousel-card scroll-reveal" key={index}>
              <div className="card-content">
                <h3><SplitText text={item.title} delayOffset={0.6} /></h3>
                <p className="card-date"><SplitText text={item.date} delayOffset={0.6 + item.title.length * 0.05} /></p>
              </div>
              <div className="card-hover-action">
                <button className="btn apply-btn">Apply Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Details */}
      <footer className="wuf-footer">
        <div className="footer-details">
          <p>사이즈 교환 및 환불은 제품의 오염도, 훼손 상태, 그리고 해당 제품이 최초 구매된 국가에 따라 차등 적용될 수 있습니다. WUF Inc.는 자체 판단에 따라 환불을 거절할 수 있습니다.</p>
        </div>
        
        <div className="footer-links-grid">
          <div className="footer-column">
            <h3>쇼핑 및 알아보기</h3>
            <ul>
              <li><a href="#">스토어</a></li>
              <li><a href="#">외출용품</a></li>
              <li><a href="#">의류</a></li>
              <li><a href="#">장난감</a></li>
              <li><a href="#">스마트기기</a></li>
              <li><a href="#">푸드·간식</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>WUF 멤버십</h3>
            <ul>
              <li><a href="#">WUF Pay</a></li>
            </ul>
            <h3>계정</h3>
            <ul>
              <li><a href="#">펫 프로필 관리</a></li>
              <li><a href="#">WUF Store 계정</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>엔터테인먼트</h3>
            <ul>
              <li><a href="#">WUF 펫튜브</a></li>
              <li><a href="#">WUF Training</a></li>
              <li><a href="#">WUF Music</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>비즈니스</h3>
            <ul>
              <li><a href="#">동물병원 제휴</a></li>
              <li><a href="#">파트너십</a></li>
            </ul>
            <h3>교육</h3>
            <ul>
              <li><a href="#">반려견 훈련 가이드</a></li>
              <li><a href="#">펫티켓 가이드</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>WUF의 가치관</h3>
            <ul>
              <li><a href="#">동물권 보호</a></li>
              <li><a href="#">친환경 소재</a></li>
              <li><a href="#">건강 최우선</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-legal">
          <div className="footer-contact">
            다양한 쇼핑 방법: WUF Flagship Store를 방문하거나, 공식 파트너사를 찾아보거나, <strong>080-333-WUF(983)</strong>번으로 전화하세요.
          </div>
          <div className="footer-bottom">
            <span className="copyright">Copyright © 2026 WUF Korea Inc. 모든 권리 보유.</span>
            <div className="legal-links">
              <a href="#">개인정보 처리방침</a> | 
              <a href="#">웹 사이트 이용 약관</a> | 
              <a href="#">판매 및 환불</a> | 
              <a href="#">법적 고지</a> | 
              <a href="#">사이트 맵</a>
            </div>
            <span className="country">대한민국</span>
          </div>
          <div className="footer-company-info">
            우프코리아 유한회사 | 대표이사: 우석진(Woo Seok-jin) | 주소: 서울특별시 강남구 테헤란로 123 WUF 타워 | 전화: 080-333-1234 | https://wuf.com/ko-kr/support | 사업자등록번호: 555-81-00000 | 통신판매업신고번호: 제2026-서울강남-01234호 | 호스팅 서비스 제공: WUF Inc. | [사업자정보 확인]
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
