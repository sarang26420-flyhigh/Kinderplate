/**
 * KinderPlate Landing Page Javascript Business Logic
 * Features: Sticky Header, Mobile Navigation, Scroll Entrance Animations, Testimonials Slider, FAQ Accordions, and Animated Stats Counters.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initScrollAnimations();
  initTestimonialsSlider();
  initFAQAccordion();
  initStatsCounters();
  initPricingToggle();
});

/**
 * 1. Sticky Header scroll effect
 */
function initStickyHeader() {
  const header = document.querySelector('header');
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/**
 * 2. Mobile Menu drawer toggle
 */
function initMobileMenu() {
  const burgerMenu = document.querySelector('.burger-menu');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  burgerMenu.addEventListener('click', () => {
    const isActive = burgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      burgerMenu.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/**
 * 3. Intersection Observer for scroll entrance animations
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Trigger once
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    animatedElements.forEach(el => el.classList.add('active'));
  }
}

/**
 * 4. Testimonials Slider
 */
function initTestimonialsSlider() {
  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  const dotsContainer = document.querySelector('.slider-dots');

  if (!track || cards.length === 0) return;

  let currentIndex = 0;
  const cardCount = cards.length;

  // Create indicator dots dynamically
  for (let i = 0; i < cardCount; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  const dots = document.querySelectorAll('.dot');

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlider();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % cardCount;
    updateSlider();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + cardCount) % cardCount;
    updateSlider();
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Auto-play every 7 seconds
  let autoPlayTimer = setInterval(nextSlide, 7000);

  // Reset timer on user interaction
  const resetAutoPlay = () => {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(nextSlide, 7000);
  };

  if (nextBtn) nextBtn.addEventListener('click', resetAutoPlay);
  if (prevBtn) prevBtn.addEventListener('click', resetAutoPlay);
  dots.forEach(dot => dot.addEventListener('click', resetAutoPlay));
}

/**
 * 5. FAQ Accordion Toggle
 */
function initFAQAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.parentElement;
      const body = parent.querySelector('.faq-body');
      const isActive = parent.classList.contains('active');

      // Close all open FAQ items first
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-body').style.maxHeight = null;
      });

      if (!isActive) {
        parent.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/**
 * 6. Stats numerical counter animation
 */
function initStatsCounters() {
  const counters = document.querySelectorAll('.stat-number-anim');
  
  if (counters.length === 0) return;

  const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const suffix = counter.getAttribute('data-suffix') || '';
    const speed = 1000; // total animation duration in ms
    const increment = target / (speed / 16); // 60fps refresh rate

    let current = 0;

    const update = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.ceil(current) + suffix;
        requestAnimationFrame(update);
      } else {
        counter.textContent = target + suffix;
      }
    };

    update();
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  } else {
    // Fallback
    counters.forEach(c => {
      const target = c.getAttribute('data-target');
      const suffix = c.getAttribute('data-suffix') || '';
      c.textContent = target + suffix;
    });
  }
}

/**
 * 7. Pricing Table billing selector toggle (Weekly / Monthly)
 */
function initPricingToggle() {
  const checkbox = document.getElementById('billing-toggle');
  const priceElements = document.querySelectorAll('.pricing-card .amount');
  const periodElements = document.querySelectorAll('.pricing-card .period');

  if (!checkbox) return;

  const weeklyPrices = [1499, 2499, 4499]; // INR (or currency equivalent) for weekly billing
  const monthlyPrices = [4999, 7999, 14999]; // Discounted monthly package prices

  checkbox.addEventListener('change', () => {
    const isMonthly = checkbox.checked;
    
    priceElements.forEach((priceEl, idx) => {
      const targetPrice = isMonthly ? monthlyPrices[idx] : weeklyPrices[idx];
      
      // Animate transition
      priceEl.style.opacity = 0;
      setTimeout(() => {
        priceEl.textContent = formatCurrency(targetPrice);
        priceEl.style.opacity = 1;
      }, 150);
    });

    periodElements.forEach(periodEl => {
      periodEl.style.opacity = 0;
      setTimeout(() => {
        periodEl.textContent = isMonthly ? '/mo' : '/wk';
        periodEl.style.opacity = 1;
      }, 150);
    });
  });
}

function formatCurrency(num) {
  // Return formatted localized number
  return num.toLocaleString('en-IN');
}
