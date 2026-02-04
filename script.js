// ============================================
// Health Insurance Refund Landing Page Scripts
// ============================================

// 1. Scroll Progress Bar
function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.getElementById('progressBar').style.width = scrollPercent + '%';
}

// 2. Active Navigation Link
function updateActiveNav() {
  const sections = document.querySelectorAll('section, .hero-section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === current) {
      link.classList.add('active');
    }
  });
}

// 3. Floating CTA Visibility
function updateFloatingCTA() {
  const floatingCTA = document.querySelector('.floating-cta');
  const heroSection = document.querySelector('.hero-section');
  
  if (heroSection) {
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    if (window.scrollY > heroBottom - 200) {
      floatingCTA.classList.add('visible');
    } else {
      floatingCTA.classList.remove('visible');
    }
  }
}

// 4. Scroll Event Handler (throttled)
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateProgressBar();
      updateActiveNav();
      updateFloatingCTA();
      ticking = false;
    });
    ticking = true;
  }
});

// 5. Calculator Function
function calculateRefund() {
  const limit = parseInt(document.getElementById('income-level').value);
  const expense = parseInt(document.getElementById('medical-expense').value);
  const resultDiv = document.getElementById('calc-result');
  const amountText = document.getElementById('refund-amount');

  if (isNaN(expense) || expense <= 0) {
    alert('본인 부담 의료비를 입력해 주세요.');
    return;
  }

  let refund = expense - limit;
  if (refund < 0) refund = 0;

  if (refund > 0) {
    amountText.innerText = refund.toLocaleString() + '만원';
  } else {
    amountText.innerText = '환급 대상이 아닙니다';
  }
  
  resultDiv.classList.add('show');
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // GTM Event
  if (typeof dataLayer !== 'undefined') {
    dataLayer.push({
      'event': 'calculator_used',
      'refund_amount': refund,
      'income_level': limit
    });
  }
}

// 6. FAQ Toggle
function toggleFaq(button) {
  const faqItem = button.closest('.faq-item');
  const isOpen = faqItem.classList.contains('open');
  
  // Close all other FAQs
  document.querySelectorAll('.faq-item.open').forEach(item => {
    if (item !== faqItem) item.classList.remove('open');
  });
  
  // Toggle current
  faqItem.classList.toggle('open');
  
  // GTM Event
  if (typeof dataLayer !== 'undefined' && !isOpen) {
    dataLayer.push({
      'event': 'faq_opened',
      'faq_question': button.querySelector('span').textContent
    });
  }
}

// 7. CTA Click Tracking
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.cta-check-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      // GTM Event
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          'event': 'click_cta',
          'event_label': this.innerText.substring(0, 50)
        });
      }
      
      // GA4 Event (backup)
      if (typeof gtag === 'function') {
        gtag('event', 'click_cta', {
          'event_label': this.innerText.substring(0, 50)
        });
      }
    });
  });
});

// 8. Ad Loading Detection
function observeAds() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-ad-status') {
        const adBox = mutation.target.closest('.ad-box');
        if (adBox && mutation.target.getAttribute('data-ad-status') === 'filled') {
          adBox.classList.add('ad-loaded');
        }
      }
    });
  });
  
  document.querySelectorAll('.adsbygoogle').forEach(ins => {
    observer.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });
  });
}

// 9. Smooth Scroll for Nav Links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// 10. Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateProgressBar();
  updateActiveNav();
  observeAds();
  
  // Add animation class to sections on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.content-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    sectionObserver.observe(section);
  });
});
