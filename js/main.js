/**
 * PUBLIC HELP - Main JavaScript
 * Handles Slideshow, Full-Site Language Translation, Booking, Forms, QR Code & Lightbox
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
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerOverlay) drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
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
        // Fallback SVG QR placeholder
        qrContainer.innerHTML = `
          <svg viewBox="0 0 100 100" width="110" height="110" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#ffffff"/>
            <rect x="5" y="5" width="25" height="25" fill="#0f172a"/>
            <rect x="9" y="9" width="17" height="17" fill="#ffffff"/>
            <rect x="13" y="13" width="9" height="9" fill="#0f172a"/>
            <rect x="70" y="5" width="25" height="25" fill="#0f172a"/>
            <rect x="74" y="9" width="17" height="17" fill="#ffffff"/>
            <rect x="78" y="13" width="9" height="9" fill="#0f172a"/>
            <rect x="5" y="70" width="25" height="25" fill="#0f172a"/>
            <rect x="9" y="74" width="17" height="17" fill="#ffffff"/>
            <rect x="13" y="78" width="9" height="9" fill="#0f172a"/>
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
     8. Image Lightbox Modal for Care Posters
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

  document.querySelectorAll('.care-img, .care-wide-img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      openLightbox(img.src, img.alt);
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
     9. Comprehensive Multi-Language System (UI Dictionary + Google Translate)
     ========================================================================== */
  const langSelect = document.getElementById('langSelect');
  const langSelectMobile = document.getElementById('langSelectMobile');

  const dictionaries = {
    hi: {
      nav_home: "होम",
      nav_about: "हमारे बारे में",
      nav_services: "सेवाएं",
      nav_care: "घरेलू केयर",
      nav_contact: "संपर्क करें",

      hero1_badge: "गुड़गांव का विश्वसनीय क्लीनिंग पार्टनर",
      hero1_title: "डीप क्लीनिंग हुई आसान - PUBLIC HELP",
      hero1_desc: "हमारी प्रशिक्षित क्लीनिंग टीम आपके घर के हर कोने की पूरी देखभाल करती है।",
      hero1_btn1: "क्लीनिंग बुक करें",
      hero1_btn2: "हमारी सेवाएं",

      hero2_badge: "100% स्वच्छ और सुरक्षित उत्पाद",
      hero2_title: "प्रोफेशनल होम क्लीनिंग सर्विसेज - PUBLIC HELP",
      hero2_desc: "हमारे प्रमाणित विशेषज्ञों के साथ अपने घर को चमकदार, ताजा और स्वच्छ बनाएं।",

      hero3_badge: "हमारा काम, आपकी सुविधा",
      hero3_title: "साफ-सुथरा घर, बेहतर जीवन - PUBLIC HELP",
      hero3_desc: "घरों, अपार्टमेंट्स और ऑफिस स्पेस के लिए किफायती और विश्वसनीय सफाई सेवाएं।",

      hl_1_title: "साफ और चमकदार",
      hl_1_desc: "हर कोना धूल मुक्त और साफ",
      hl_2_title: "ताजा और सुगंधित",
      hl_2_desc: "स्वच्छ और दुर्गंध रहित वातावरण",
      hl_3_title: "आरामदायक घर",
      hl_3_desc: "आप आराम करें, हम सफाई करेंगे",
      hl_4_title: "100% हाइजीनिक",
      hl_4_desc: "सुरक्षित व प्रमाणित सैनिटाइजेशन",

      why_tag: "हमें क्यों चुनें",
      why_title: "साफ-सुथरा घर, स्वस्थ जीवन",
      why_sub: "गुड़गांव के परिवार पब्लिक हेल्प पर क्यों भरोसा करते हैं",

      about_tag: "हमारे बारे में - PUBLIC HELP",
      about_title: "भरोसेमंद प्रोफेशनल क्लीनिंग",
      about_quote: '"हम आपके रहने की जगह को ताजा, साफ और आरामदायक बनाए रखने के लिए विश्वसनीय और पेशेवर होम क्लीनिंग सेवाएं प्रदान करते हैं। हमारी प्रशिक्षित टीम हर विवरण पर ध्यान देती है और सुरक्षित, गुणवत्तापूर्ण उत्पादों का उपयोग करती है।"',

      serv_tag: "हमारी सेवाएं",
      serv_title: "प्रोफेशनल क्लीनिंग समाधान",
      serv_sub: "आपके घर को स्वच्छ, ताजा और आरामदायक रखने के लिए संपूर्ण सफाई समाधान।",
      
      s1_title: "रेगुलर होम क्लीनिंग",
      s1_desc: "कमरों, फर्श, रसोई और बाथरूम की नियमित सफाई के साथ अपने घर को ताजा रखें।",
      s2_title: "डीप होम क्लीनिंग",
      s2_desc: "मुश्किल कोनों, फर्श और सभी सतहों की गहन और विस्तृत सफाई प्राप्त करें।",
      s3_title: "सोफा क्लीनिंग",
      s3_desc: "धूल, मिट्टी और दाग हटाकर अपने सोफे को नए जैसा और हाइजीनिक बनाएं।",
      s4_title: "बाथरूम क्लीनिंग",
      s4_desc: "टाइल्स, फर्श, सिंक और अन्य सतहों की पूरी सफाई से बाथरूम को चमकदार बनाएं।",
      s5_title: "किचन क्लीनिंग",
      s5_desc: "काउंटर, अलमारियों, फर्श और खाना पकाने के क्षेत्र की विस्तृत सफाई।",
      s6_title: "मूव-इन और मूव-आउट क्लीनिंग",
      s6_desc: "नए घर में शिफ्ट होने से पहले या बाद में संपूर्ण सैनिटाइजेशन और सफाई।",

      care_tag: "घरेलू केयर और दैनिक सहायता",
      care_title: "हमारा काम, आपकी सुविधा",
      care_sub: "गुड़गांव परिवारों के लिए अनुभवी घरेलू मेड, बर्तन धोने वाले, रसोइया और केयरगिवर्स।",

      cta_badge: "Clean. Fresh. Happy.",
      cta_title: "सफाई की चिंता हम पर छोड़ें",
      cta_desc: "अपने समय का आनंद लें जबकि हमारे विशेषज्ञ आपके घर को चमकाते हैं।",
      cta_btn1: "ऑनलाइन बुकिंग करें",
      cta_btn2: "व्हाट्सएप पर चैट करें",

      book_tag: "त्वरित बुकिंग",
      book_title: "60 सेकंड में अपनी क्लीनिंग शेड्यूल करें",
      book_btn: "व्हाट्सएप द्वारा पुष्टि करें और बुक करें",

      contact_tag: "संपर्क करें",
      contact_title: "पब्लिक हेल्प से संपर्क करें",
      contact_sub: "सफाई सेवाओं के बारे में कोई प्रश्न है या बुकिंग करना चाहते हैं? हमारी टीम आपकी सहायता के लिए तैयार है।",
      contact_btn: "संदेश भेजें"
    },

    bn: {
      nav_home: "হোম",
      nav_about: "আমাদের সম্পর্কে",
      nav_services: "সেবাসমূহ",
      nav_care: "গৃহস্থালি সেবা",
      nav_contact: "যোগাযোগ",

      hero1_badge: "গুরুগ্রামের বিশ্বস্ত ক্লিনিং পার্টনার",
      hero1_title: "সহজ ডিপ ক্লিনিং - PUBLIC HELP",
      hero1_desc: "আমাদের প্রশিক্ষিত দল আপনার বাড়ির প্রতিটি কোণার যত্ন নেয়।",
      hero1_btn1: "বুক করুন",
      hero1_btn2: "আমাদের সেবাসমূহ",

      why_tag: "কেন আমাদের বেছে নেবেন",
      why_title: "পরিষ্কার বাড়ি, স্বাস্থ্যকর জীবন",
      why_sub: "কেন গুরুগ্রামবাসী পাবলিক হেল্প-কে বিশ্বাস করেন",

      serv_tag: "আমাদের সেবাসমূহ",
      serv_title: "পেশাদার ক্লিনিং সলিউশন",
      serv_sub: "আপনার বাড়িকে সতেজ এবং পরিষ্কার রাখার সম্পূর্ণ সমাধান।",

      cta_title: "ক্লিনিং-এর দায়িত্ব আমাদের দিন",
      cta_btn1: "এখনই বুক করুন",
      cta_btn2: "হোয়াটসঅ্যাপে চ্যাট করুন"
    },

    gu: {
      nav_home: "હોમ",
      nav_about: "અમારા વિશે",
      nav_services: "સેવાઓ",
      nav_care: "ઘરેલું સેવાઓ",
      nav_contact: "સંપર્ક કરો",

      hero1_badge: "ગુરુગ્રામનું વિશ્વસનીય ક્લિનિંગ પાર્ટનર",
      hero1_title: "ડીપ ક્લિનિંગ હવે સરળ - PUBLIC HELP",
      hero1_desc: "અમારી પ્રશિક્ષિત ટીમ આપના ઘરના દરેક ખૂણાની સંપૂર્ણ સંભાળ રાખે છે.",
      hero1_btn1: "ક્લિનિંગ બુક કરો",
      hero1_btn2: "અમારી સેવાઓ",

      why_tag: "અમને કેમ પસંદ કરશો",
      why_title: "સ્વચ્છ ઘર, સ્વસ્થ જીવન",
      why_sub: "ગુરુગ્રામના પરિવારો પબ્લિક હેલ્પ પર શા માટે વિશ્વાસ કરે છે",

      serv_tag: "અમારી સેવાઓ",
      serv_title: "પ્રોફેશનલ ક્લિનિંગ સોલ્યુશન્સ",
      serv_sub: "આપના ઘરને તાજગીસભર અને સ્વચ્છ રાખવા માટેના ઉત્તમ ઉપાયો.",

      cta_title: "ક્લિનિંગની ચિંતા અમારા પર છોડો",
      cta_btn1: "ઓનલાઇન બુક કરો",
      cta_btn2: "વોટ્સએપ પર વાત કરો"
    },

    mr: {
      nav_home: "होम",
      nav_about: "आमच्याबद्दल",
      nav_services: "सेवा",
      nav_care: "घरगुती सेवा",
      nav_contact: "संपर्क",

      hero1_badge: "गुरुग्राममधील विश्वसनीय क्लिनिंग पार्टनर",
      hero1_title: "डीप क्लिनिंग झाले सोपे - PUBLIC HELP",
      hero1_desc: "आमची प्रशिक्षित टीम आपल्या घराच्या प्रत्येक कोपऱ्याची योग्य काळजी घेते.",
      hero1_btn1: "क्लिनिंग बुक करा",
      hero1_btn2: "आमच्या सेवा",

      why_tag: "आम्हाला का निवडावे",
      why_title: "स्वच्छ घर, निरोगी जीवन",
      why_sub: "गुरुग्रामचे नागरिक पब्लिक हेल्पवर का विश्वास ठेवतात",

      serv_tag: "आमच्या सेवा",
      serv_title: "व्यावसायिक स्वच्छता उपाय",
      serv_sub: "आपले घर ताजेतवाने आणि स्वच्छ ठेवण्यासाठी परिपूर्ण उपाय.",

      cta_title: "घराच्या स्वच्छतेची काळजी आमच्यावर सोडा",
      cta_btn1: "आत्ताच बुक करा",
      cta_btn2: "व्हॉट्सॲपवर चॅट करा"
    },

    en: {
      nav_home: "Home",
      nav_about: "About Us",
      nav_services: "Services",
      nav_care: "Domestic Care",
      nav_contact: "Contact Us",

      hero1_badge: "Gurugram's Trusted Cleaning Partner",
      hero1_title: "Deep Cleaning Made Easy - PUBLIC HELP",
      hero1_desc: "Our trained cleaning team takes care of every corner of your home with proper care.",
      hero1_btn1: "Book A Cleaning",
      hero1_btn2: "Our Services",

      hero2_badge: "100% Hygienic & Safe Products",
      hero2_title: "Professional Home Cleaning Services - PUBLIC HELP",
      hero2_desc: "Keep your living spaces fresh, sparkling, and comfortable with our certified domestic specialists.",

      hero3_badge: "हमारा काम, आपकी सुविधा",
      hero3_title: "A Cleaner Home, A Better Life - PUBLIC HELP",
      hero3_desc: "Affordable, reliable and thorough cleaning services for houses, apartments, and modern living spaces.",

      hl_1_title: "Clean & Spotless",
      hl_1_desc: "Every corner dusted & polished",
      hl_2_title: "Fresh & Pleasant",
      hl_2_desc: "Odour-free living environment",
      hl_3_title: "Comfortable Space",
      hl_3_desc: "Relax while we clean for you",
      hl_4_title: "100% Hygienic",
      hl_4_desc: "Hospital-grade safe sanitization",

      why_tag: "Why Choose Us",
      why_title: "A Cleaner Home, A Healthier Space",
      why_sub: "Why Gurugram Residents Trust PUBLIC HELP",

      about_tag: "About Us - PUBLIC HELP",
      about_title: "Professional Cleaning You Can Trust",
      about_quote: '"We provide reliable and professional home cleaning services to help keep your living spaces fresh, clean, and comfortable. Our trained cleaning team pays attention to every detail and uses safe, quality cleaning products."',

      serv_tag: "Our Services",
      serv_title: "Professional Cleaning Solutions",
      serv_sub: "Professional cleaning solutions to keep your home fresh, clean, and comfortable.",

      s1_title: "Regular Home Cleaning",
      s1_desc: "Keep your home clean and fresh with regular cleaning of rooms, floors, kitchens, and bathrooms.",
      s2_title: "Deep Home Cleaning",
      s2_desc: "Get a detailed cleaning of your home, including hard-to-reach areas, corners, floors, and surfaces.",
      s3_title: "Sofa Cleaning",
      s3_desc: "Remove dust, dirt, and stains from your sofas with professional, safe, and careful cleaning for a fresh and hygienic finish.",
      s4_title: "Bathroom Cleaning",
      s4_desc: "Make your bathroom fresh and hygienic with thorough cleaning of tiles, floors, sinks, and other surfaces.",
      s5_title: "Kitchen Cleaning",
      s5_desc: "Keep your kitchen clean and fresh with detailed cleaning of counters, cabinets, floors, and cooking areas.",
      s6_title: "Move-In & Move-Out Cleaning",
      s6_desc: "Get your home ready for moving with complete cleaning before you move in or after you move out.",

      care_tag: "Domestic Care & Daily Support",
      care_title: "हमारा काम, आपकी सुविधा",
      care_sub: "Dedicated household helpers, utensil washers, home cooks, and patient caregivers for Gurugram families.",

      cta_badge: "Clean. Fresh. Happy.",
      cta_title: "Let Us Take Care of Your Cleaning",
      cta_desc: "Enjoy more free time while our professional cleaning experts make your home shine from top to bottom.",
      cta_btn1: "Book Online Now",
      cta_btn2: "Chat on WhatsApp",

      book_tag: "Instant Booking",
      book_title: "Schedule Your Cleaning In 60 Seconds",
      book_btn: "Confirm & Book via WhatsApp",

      contact_tag: "Contact Us",
      contact_title: "Get In Touch With PUBLIC HELP",
      contact_sub: "Have questions about our cleaning services or want to book a cleaning? Contact us and our team will be happy to help.",
      contact_btn: "Send Message"
    }
  };

  function applyLanguage(lang) {
    if (!lang) return;
    const dict = dictionaries[lang] || dictionaries.en;

    // 1. Navigation Links
    const navItems = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navItems.forEach(item => {
      const navKey = item.getAttribute('data-nav') || item.getAttribute('href');
      if (navKey === 'home' || navKey === '#home') item.textContent = dict.nav_home;
      if (navKey === 'about' || navKey === '#about') item.textContent = dict.nav_about;
      if (navKey === 'services' || navKey === '#services') item.textContent = dict.nav_services;
      if (navKey === 'care' || navKey === '#care-services') item.textContent = dict.nav_care;
      if (navKey === 'contact' || navKey === '#contact') item.textContent = dict.nav_contact;
    });

    // 2. Hero Section
    const hero1Title = document.querySelector('.hero-slide[data-slide="0"] .hero-title');
    const hero1Desc = document.querySelector('.hero-slide[data-slide="0"] .hero-description');
    const hero1Badge = document.querySelector('.hero-slide[data-slide="0"] .hero-badge');
    const hero1Btn1 = document.getElementById('heroBookBtn1');
    const hero1Btn2 = document.getElementById('heroServicesBtn1');
    if (hero1Title && dict.hero1_title) hero1Title.textContent = dict.hero1_title;
    if (hero1Desc && dict.hero1_desc) hero1Desc.textContent = dict.hero1_desc;
    if (hero1Badge && dict.hero1_badge) hero1Badge.innerHTML = `<i class="fa-solid fa-shield-halved"></i> ${dict.hero1_badge}`;
    if (hero1Btn1 && dict.hero1_btn1) hero1Btn1.textContent = dict.hero1_btn1;
    if (hero1Btn2 && dict.hero1_btn2) hero1Btn2.textContent = dict.hero1_btn2;

    const hero2Title = document.querySelector('.hero-slide[data-slide="1"] .hero-title');
    const hero2Desc = document.querySelector('.hero-slide[data-slide="1"] .hero-description');
    if (hero2Title && dict.hero2_title) hero2Title.textContent = dict.hero2_title;
    if (hero2Desc && dict.hero2_desc) hero2Desc.textContent = dict.hero2_desc;

    const hero3Title = document.querySelector('.hero-slide[data-slide="2"] .hero-title');
    const hero3Desc = document.querySelector('.hero-slide[data-slide="2"] .hero-description');
    if (hero3Title && dict.hero3_title) hero3Title.textContent = dict.hero3_title;
    if (hero3Desc && dict.hero3_desc) hero3Desc.textContent = dict.hero3_desc;

    // 3. Highlights
    const hlItems = document.querySelectorAll('.highlight-item');
    if (hlItems.length >= 4 && dict.hl_1_title) {
      if (dict.hl_1_title) hlItems[0].querySelector('h3').textContent = dict.hl_1_title;
      if (dict.hl_1_desc) hlItems[0].querySelector('p').textContent = dict.hl_1_desc;
      if (dict.hl_2_title) hlItems[1].querySelector('h3').textContent = dict.hl_2_title;
      if (dict.hl_2_desc) hlItems[1].querySelector('p').textContent = dict.hl_2_desc;
      if (dict.hl_3_title) hlItems[2].querySelector('h3').textContent = dict.hl_3_title;
      if (dict.hl_3_desc) hlItems[2].querySelector('p').textContent = dict.hl_3_desc;
      if (dict.hl_4_title) hlItems[3].querySelector('h3').textContent = dict.hl_4_title;
      if (dict.hl_4_desc) hlItems[3].querySelector('p').textContent = dict.hl_4_desc;
    }

    // 4. Why Choose Us
    const whyTag = document.querySelector('#why-us .section-tag');
    const whyTitle = document.querySelector('#why-us .section-title');
    const whySub = document.querySelector('#why-us .section-subtitle');
    if (whyTag && dict.why_tag) whyTag.textContent = dict.why_tag;
    if (whyTitle && dict.why_title) whyTitle.textContent = dict.why_title;
    if (whySub && dict.why_sub) whySub.textContent = dict.why_sub;

    // 5. About Us
    const aboutTag = document.querySelector('#about .section-tag');
    const aboutTitle = document.querySelector('#about .section-title');
    const aboutQuote = document.querySelector('#about .company-quote p');
    if (aboutTag && dict.about_tag) aboutTag.textContent = dict.about_tag;
    if (aboutTitle && dict.about_title) aboutTitle.textContent = dict.about_title;
    if (aboutQuote && dict.about_quote) aboutQuote.textContent = dict.about_quote;

    // 6. Services Section
    const servTag = document.querySelector('#services .section-tag');
    const servTitle = document.querySelector('#services .section-title');
    const servSub = document.querySelector('#services .section-subtitle');
    if (servTag && dict.serv_tag) servTag.textContent = dict.serv_tag;
    if (servTitle && dict.serv_title) servTitle.textContent = dict.serv_title;
    if (servSub && dict.serv_sub) servSub.textContent = dict.serv_sub;

    const s1 = document.getElementById('service-regular-cleaning');
    if (s1 && dict.s1_title) {
      s1.querySelector('.service-title').textContent = dict.s1_title;
      s1.querySelector('.service-desc').textContent = dict.s1_desc;
    }
    const s2 = document.getElementById('service-deep-cleaning');
    if (s2 && dict.s2_title) {
      s2.querySelector('.service-title').textContent = dict.s2_title;
      s2.querySelector('.service-desc').textContent = dict.s2_desc;
    }
    const s3 = document.getElementById('service-sofa-cleaning');
    if (s3 && dict.s3_title) {
      s3.querySelector('.service-title').textContent = dict.s3_title;
      s3.querySelector('.service-desc').textContent = dict.s3_desc;
    }
    const s4 = document.getElementById('service-bathroom-cleaning');
    if (s4 && dict.s4_title) {
      s4.querySelector('.service-title').textContent = dict.s4_title;
      s4.querySelector('.service-desc').textContent = dict.s4_desc;
    }
    const s5 = document.getElementById('service-kitchen-cleaning');
    if (s5 && dict.s5_title) {
      s5.querySelector('.service-title').textContent = dict.s5_title;
      s5.querySelector('.service-desc').textContent = dict.s5_desc;
    }
    const s6 = document.getElementById('service-move-cleaning');
    if (s6 && dict.s6_title) {
      s6.querySelector('.service-title').textContent = dict.s6_title;
      s6.querySelector('.service-desc').textContent = dict.s6_desc;
    }

    // 7. Care Section
    const careTag = document.querySelector('#care-services .section-tag');
    const careTitle = document.querySelector('#care-services .section-title');
    const careSub = document.querySelector('#care-services .section-subtitle');
    if (careTag && dict.care_tag) careTag.textContent = dict.care_tag;
    if (careTitle && dict.care_title) careTitle.textContent = dict.care_title;
    if (careSub && dict.care_sub) careSub.textContent = dict.care_sub;

    // 8. CTA Banner
    const ctaBadge = document.querySelector('.cta-badge');
    const ctaTitle = document.querySelector('.cta-title');
    const ctaDesc = document.querySelector('.cta-desc');
    const ctaBtn1 = document.querySelector('.btn-cta-primary');
    const ctaBtn2 = document.querySelector('.btn-cta-whatsapp');
    if (ctaBadge && dict.cta_badge) ctaBadge.textContent = dict.cta_badge;
    if (ctaTitle && dict.cta_title) ctaTitle.textContent = dict.cta_title;
    if (ctaDesc && dict.cta_desc) ctaDesc.textContent = dict.cta_desc;
    if (ctaBtn1 && dict.cta_btn1) ctaBtn1.innerHTML = `<i class="fa-solid fa-calendar-plus"></i> ${dict.cta_btn1}`;
    if (ctaBtn2 && dict.cta_btn2) ctaBtn2.innerHTML = `<i class="fa-brands fa-whatsapp"></i> ${dict.cta_btn2}`;

    // 9. Booking Section
    const bookTag = document.querySelector('#booking-section .section-tag');
    const bookTitle = document.querySelector('#booking-section .section-title');
    const bookBtn = document.getElementById('bookSubmitBtn');
    if (bookTag && dict.book_tag) bookTag.textContent = dict.book_tag;
    if (bookTitle && dict.book_title) bookTitle.textContent = dict.book_title;
    if (bookBtn && dict.book_btn) bookBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${dict.book_btn}`;

    // 10. Contact Section
    const contactTag = document.querySelector('#contact .section-tag');
    const contactTitle = document.querySelector('#contact .section-title');
    const contactSub = document.querySelector('#contact .section-subtitle');
    const sendMsgButton = document.getElementById('sendMsgBtn');
    if (contactTag && dict.contact_tag) contactTag.textContent = dict.contact_tag;
    if (contactTitle && dict.contact_title) contactTitle.textContent = dict.contact_title;
    if (contactSub && dict.contact_sub) contactSub.textContent = dict.contact_sub;
    if (sendMsgButton && dict.contact_btn) sendMsgButton.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${dict.contact_btn}`;

    // Synchronize select elements
    if (langSelect) langSelect.value = lang;
    if (langSelectMobile) langSelectMobile.value = lang;

    // Trigger Google Translate widget if loaded
    triggerGoogleTranslate(lang);

    // Save selection
    localStorage.setItem('publichelp_lang', lang);
  }

  function triggerGoogleTranslate(lang) {
    try {
      // Set cookie for Google Translate
      document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=/en/${lang}; path=/;`;
      
      const gtCombo = document.querySelector('.goog-te-combo');
      if (gtCombo) {
        gtCombo.value = lang;
        gtCombo.dispatchEvent(new Event('change'));
      }
    } catch (err) {
      console.log("Google translate trigger:", err);
    }
  }

  // Handle Desktop Language Change
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      applyLanguage(e.target.value);
    });
  }

  // Handle Mobile Language Change
  if (langSelectMobile) {
    langSelectMobile.addEventListener('change', (e) => {
      applyLanguage(e.target.value);
    });
  }

  // Restore saved language on page load
  const savedLang = localStorage.getItem('publichelp_lang') || 'en';
  if (savedLang && savedLang !== 'en') {
    applyLanguage(savedLang);
  }

});
