// main.js - Interactivity for WOTDO

document.addEventListener('DOMContentLoaded', () => {
  // Hero Slider
  const slides = document.querySelectorAll('.hero-slider .slide');
  if (slides.length > 0) {
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5000); // 5 seconds per slide
  }

  // Sticky Shrinking Header
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('shrunk');
    } else {
      header.classList.remove('shrunk');
    }
  });

  // Mobile Navigation Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  if (hamburger && navLinks) {
    // Inject mobile-only DONATE & PROFILE buttons into navigation overlay
    const mobileNavBtns = document.createElement('div');
    mobileNavBtns.className = 'mobile-nav-btns';
    mobileNavBtns.innerHTML = `
      <a href="contact.html" class="btn mobile-nav-btn" style="background-color: #e8910c; color: white; display: block; text-align: center; padding: 10px; border-radius: 5px; font-weight: bold;">DONATE</a>
      <a href="partners.html" class="btn mobile-nav-btn" style="background-color: var(--color-navy); color: white !important; display: block; margin-top: 10px; text-align: center; padding: 10px; border-radius: 5px; font-weight: bold;">PARTNER WITH US</a>
    `;
    navLinks.appendChild(mobileNavBtns);

    hamburger.addEventListener('click', () => {
      const isActive = navLinks.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isActive);
      body.style.overflow = isActive ? 'hidden' : '';
      hamburger.innerHTML = isActive ? '&times;' : '&#9776;';
    });

    // Mobile Accordion Logic
    const dropBtns = navLinks.querySelectorAll('.nav-dropbtn');
    dropBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          const dropdown = btn.nextElementSibling;
          if (dropdown && dropdown.classList.contains('dropdown-content')) {
            e.preventDefault();
            // Close other mobile dropdowns
            navLinks.querySelectorAll('.dropdown-content').forEach(d => {
              if (d !== dropdown) d.classList.remove('show');
            });
            dropdown.classList.toggle('show');

            // Toggle rotation class on the button itself (for the CSS pseudo-element)
            btn.classList.toggle('rotated', dropdown.classList.contains('show'));
          }
        }
      });
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('.dropdown-content a, .nav-dropbtn:not([href="#"])').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.classList.remove('active');
          body.style.overflow = '';
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.innerHTML = '&#9776;';
        }
      });
    });
  }

  // Active Link Highlight
  const currentPage = window.location.pathname.split("/").pop();
  const navItems = document.querySelectorAll('.nav-links a');

  navItems.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Intersection Observer for Scroll Animations
  const scrollers = document.querySelectorAll('.animate-on-scroll, .slide-in-left, .slide-in-right');

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('is-visible');

      // Trigger number animation if it's a stat item
      if (entry.target.classList.contains('stat-item')) {
        const numberEl = entry.target.querySelector('.stat-number');
        if (numberEl && !numberEl.classList.contains('counted')) {
          const target = parseInt(numberEl.getAttribute('data-target'));
          const suffix = numberEl.getAttribute('data-suffix') || '';
          animateValue(numberEl, 0, target, 2000, suffix);
          numberEl.classList.add('counted');
        }
      }

      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  scrollers.forEach(scroller => {
    scrollObserver.observe(scroller);
  });

  // Number Counter Animation Function
  function animateValue(obj, start, end, duration, suffix) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart curve
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      obj.innerHTML = Math.floor(easeProgress * (end - start) + start) + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.innerHTML = end + suffix;
      }
    };
    window.requestAnimationFrame(step);
  }

  // Simple Contact Form Handling
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simple visual feedback
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;

      btn.textContent = 'Message Sent!';
      btn.classList.add('btn-success');

      contactForm.reset();

      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('btn-success');
      }, 3000);
    });
  }

  // Testimonial Slider
  const testiSlides = document.querySelectorAll('.testi-slide');
  if (testiSlides.length > 0) {
    let currentTesti = 0;
    setInterval(() => {
      testiSlides[currentTesti].classList.remove('active');
      currentTesti = (currentTesti + 1) % testiSlides.length;
      testiSlides[currentTesti].classList.add('active');
    }, 6000); // 6 seconds per testimonial
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) otherItem.classList.remove('active');
      });
      // Toggle current
      item.classList.toggle('active');
    });
  });

  // Back to Top
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Language Toggle Placeholder
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    const spans = langToggle.querySelectorAll('span');
    spans.forEach(span => {
      span.addEventListener('click', () => {
        spans.forEach(s => s.classList.remove('active'));
        span.classList.add('active');
        const lang = span.getAttribute('data-lang');
        console.log(`Language switched to: ${lang}`);
        // In a real app, this would trigger a translation or redirect
        if (lang === 'lg') {
          alert("Luganda translation coming soon! / Luganda ejja mangu!");
        }
      });
    });
  }

  // Swipe Support Helper
  function addSwipeListener(element, onSwipeLeft, onSwipeRight) {
    let touchstartX = 0;
    let touchendX = 0;

    element.addEventListener('touchstart', e => {
      touchstartX = e.changedTouches[0].screenX;
    }, { passive: true });

    element.addEventListener('touchend', e => {
      touchendX = e.changedTouches[0].screenX;
      handleGesture();
    }, { passive: true });

    function handleGesture() {
      if (touchendX < touchstartX - 50) onSwipeLeft();
      if (touchendX > touchstartX + 50) onSwipeRight();
    }
  }

  // Apply Swipe to Hero Slider
  const heroSlider = document.querySelector('.hero-slider');
  if (heroSlider && slides.length > 0) {
    addSwipeListener(heroSlider,
      () => { // Swipe Left -> Next
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
      },
      () => { // Swipe Right -> Prev
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
      }
    );
  }

  // Apply Swipe to Testimonial Slider
  const testimonialSlider = document.querySelector('.testimonial-slider');
  if (testimonialSlider && testiSlides.length > 0) {
    addSwipeListener(testimonialSlider,
      () => { // Swipe Left -> Next
        testiSlides[currentTesti].classList.remove('active');
        currentTesti = (currentTesti + 1) % testiSlides.length;
        testiSlides[currentTesti].classList.add('active');
      },
      () => { // Swipe Right -> Prev
        testiSlides[currentTesti].classList.remove('active');
        currentTesti = (currentTesti - 1 + testiSlides.length) % testiSlides.length;
        testiSlides[currentTesti].classList.add('active');
      }
    );
  }
});
