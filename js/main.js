/**
 * PUBLIC HELP - Main JavaScript
 * Handles Slideshow, Language Switching, Booking, Forms, QR Code & Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Hero Carousel Slideshow
     ========================================================================== */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const heroSlider = document.getElementById('heroSlider');
  
  let currentSlide = 0;
  let slideInterval = null;
  const autoPlayDelay = 5000;

  function showSlide(index) {
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    slideInterval = setInterval(nextSlide, autoPlayDelay);
  }

  function stopAutoPlay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'), 10);
      showSlide(idx);
      startAutoPlay();
    });
  });

  // Pause on hover
  if (heroSlider) {
    heroSlider.addEventListener('mouseenter', stopAutoPlay);
    heroSlider.addEventListener('mouseleave', startAutoPlay);
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  if (heroSlider) {
    heroSlider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSlider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      nextSlide();
      startAutoPlay();
    }
    if (touchEndX > touchStartX + 50) {
      prevSlide();
      startAutoPlay();
    }
  }

  startAutoPlay();


  /* ==========================================================================
     2. Mobile Drawer Navigation
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });


  /* ==========================================================================
     3. Active Nav Link on Scroll
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });


  /* ==========================================================================
     4. Service Card "Book This Service" auto-selector
     ========================================================================== */
  const serviceTriggers = document.querySelectorAll('.book-service-trigger');
  const bookServiceSelect = document.getElementById('bookService');

  serviceTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      if (bookServiceSelect && serviceName) {
        bookServiceSelect.value = serviceName;
        // Scroll to booking section
        const bookingSection = document.getElementById('booking-section');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
          // Highlight select box briefly
          bookServiceSelect.focus();
          bookServiceSelect.style.borderColor = '#0284c7';
          bookServiceSelect.style.boxShadow = '0 0 0 4px rgba(2, 132, 199, 0.25)';
          setTimeout(() => {
            bookServiceSelect.style.boxShadow = '';
          }, 1500);
        }
      }
    });
  });


  /* ==========================================================================
     5. Instant Booking Form Submission -> WhatsApp Link
     ========================================================================== */
  const quickBookingForm = document.getElementById('quickBookingForm');
  if (quickBookingForm) {
    quickBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const service = document.getElementById('bookService').value;
      const size = document.getElementById('bookSize').value;
      const frequency = document.getElementById('bookFrequency').value;
      const name = document.getElementById('bookName').value.trim();
      const phone = document.getElementById('bookPhone').value.trim();
      const location = document.getElementById('bookLocation').value.trim();

      const message = `*PUBLIC HELP Booking Request*%0A` +
        `----------------------------%0A` +
        `👤 *Name:* ${encodeURIComponent(name)}%0A` +
        `📞 *Phone:* ${encodeURIComponent(phone)}%0A` +
        `📍 *Location:* ${encodeURIComponent(location)}%0A` +
        `🧹 *Service:* ${encodeURIComponent(service)}%0A` +
        `🏠 *Home Size:* ${encodeURIComponent(size)}%0A` +
        `📅 *Frequency:* ${encodeURIComponent(frequency)}%0A` +
        `----------------------------%0A` +
        `Please confirm my cleaning slot. Thank you!`;

      // Open WhatsApp direct URL
      const whatsappUrl = `https://wa.me/9599250085?text=${message}`;
      window.open(whatsappUrl, '_blank');
    });
  }


  /* ==========================================================================
     6. Contact Us Message Form
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');
  const sendMsgBtn = document.getElementById('sendMsgBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (sendMsgBtn) {
        sendMsgBtn.disabled = true;
        sendMsgBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...`;
      }

      const name = document.getElementById('contactName').value.trim();
      const subject = document.getElementById('contactSubject').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const phone = document.getElementById('contactPhone').value.trim();
      const msg = document.getElementById('contactMessage').value.trim();

      // Simulate sending and trigger WhatsApp option
      setTimeout(() => {
        if (formSuccessMessage) {
          formSuccessMessage.classList.remove('hidden');
        }
        if (sendMsgBtn) {
          sendMsgBtn.disabled = false;
          sendMsgBtn.innerHTML = `<i class="fa-solid fa-check"></i> Message Sent!`;
          sendMsgBtn.style.background = '#16a34a';
        }
        contactForm.reset();

        // Optional prompt to forward via WhatsApp
        setTimeout(() => {
          const forwardConfirm = confirm("Your message is recorded! Would you also like to send this query directly to WhatsApp (+91 9599250085) for instant reply?");
          if (forwardConfirm) {
            const formattedMsg = `*PUBLIC HELP Contact Message*%0A` +
              `*Name:* ${encodeURIComponent(name)}%0A` +
              `*Subject:* ${encodeURIComponent(subject)}%0A` +
              `*Email:* ${encodeURIComponent(email)}%0A` +
              `*Phone:* ${encodeURIComponent(phone)}%0A` +
              `*Message:* ${encodeURIComponent(msg)}`;
            window.open(`https://wa.me/9599250085?text=${formattedMsg}`, '_blank');
          }
        }, 600);
      }, 800);
    });
  }


  /* ==========================================================================
     7. Dynamic QR Code Generator for https://visitonline.in/public-help
     ========================================================================== */
  const qrContainer = document.getElementById('qrcode');
  if (qrContainer) {
    try {
      if (typeof QRCode !== 'undefined') {
        new QRCode(qrContainer, {
          text: "https://visitonline.in/public-help",
          width: 110,
          height: 110,
          colorDark : "#0f172a",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
        });
      } else {
        // Fallback SVG QR placeholder if offline
        qrContainer.innerHTML = `
          <svg viewBox="0 0 100 100" width="110" height="110" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#ffffff"/>
            <!-- Corner Finder 1 -->
            <rect x="5" y="5" width="25" height="25" fill="#0f172a"/>
            <rect x="9" y="9" width="17" height="17" fill="#ffffff"/>
            <rect x="13" y="13" width="9" height="9" fill="#0f172a"/>
            <!-- Corner Finder 2 -->
            <rect x="70" y="5" width="25" height="25" fill="#0f172a"/>
            <rect x="74" y="9" width="17" height="17" fill="#ffffff"/>
            <rect x="78" y="13" width="9" height="9" fill="#0f172a"/>
            <!-- Corner Finder 3 -->
            <rect x="5" y="70" width="25" height="25" fill="#0f172a"/>
            <rect x="9" y="74" width="17" height="17" fill="#ffffff"/>
            <rect x="13" y="78" width="9" height="9" fill="#0f172a"/>
            <!-- Data pattern -->
            <rect x="35" y="10" width="10" height="10" fill="#0f172a"/>
            <rect x="50" y="20" width="10" height="10" fill="#0f172a"/>
            <rect x="40" y="40" width="20" height="20" fill="#0284c7"/>
            <rect x="65" y="45" width="10" height="10" fill="#0f172a"/>
            <rect x="10" y="45" width="10" height="10" fill="#0f172a"/>
            <rect x="45" y="70" width="15" height="15" fill="#0f172a"/>
            <rect x="70" y="70" width="20" height="10" fill="#0f172a"/>
            <rect x="75" y="85" width="15" height="10" fill="#0f172a"/>
          </svg>
        `;
      }
    } catch (e) {
      console.warn("QR code generator notice:", e);
    }
  }


  /* ==========================================================================
     8. Image Lightbox Modal for Gallery & Posters
     ========================================================================== */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  function openLightbox(src, caption) {
    if (lightboxModal && lightboxImg) {
      lightboxImg.src = src;
      if (lightboxCaption) lightboxCaption.textContent = caption || 'PUBLIC HELP Official Visual';
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-img');
      const title = item.getAttribute('data-title');
      openLightbox(src, title);
    });
  });

  document.querySelectorAll('.btn-zoom-img').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title');
      openLightbox(src, title);
    });
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });


  /* ==========================================================================
     9. Multi-Language Switcher Simulation
     ========================================================================== */
  const langSelect = document.getElementById('langSelect');
  
  const translations = {
    hi: {
      hero1_title: "डीप क्लीनिंग हुई आसान - PUBLIC HELP",
      hero1_desc: "हमारी प्रशिक्षित क्लीनिंग टीम आपके घर के हर कोने की पूरी देखभाल करती है।",
      why_title: "साफ-सुथरा घर, स्वस्थ जीवन",
      why_sub: "गुड़गांव के निवासी पब्लिक हेल्प पर क्यों भरोसा करते हैं"
    },
    en: {
      hero1_title: "Deep Cleaning Made Easy - PUBLIC HELP",
      hero1_desc: "Our trained cleaning team takes care of every corner of your home with proper care.",
      why_title: "A Cleaner Home, A Healthier Space",
      why_sub: "Why Gurugram Residents Trust PUBLIC HELP"
    }
  };

  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (selected === 'hi' && translations.hi) {
        const h1 = document.querySelector('.hero-slide[data-slide="0"] .hero-title');
        const desc = document.querySelector('.hero-slide[data-slide="0"] .hero-description');
        if (h1) h1.textContent = translations.hi.hero1_title;
        if (desc) desc.textContent = translations.hi.hero1_desc;
      } else if (selected === 'en' && translations.en) {
        const h1 = document.querySelector('.hero-slide[data-slide="0"] .hero-title');
        const desc = document.querySelector('.hero-slide[data-slide="0"] .hero-description');
        if (h1) h1.textContent = translations.en.hero1_title;
        if (desc) desc.textContent = translations.en.hero1_desc;
      }
    });
  }

});
