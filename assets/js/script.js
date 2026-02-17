'use strict';

/**
 * element toggle function
 */

const elemToggleFunc = function (elem) { elem.classList.toggle("active"); }



/**
 * navbar toggle
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.querySelector("[data-navbar]");
  const overlay = document.querySelector("[data-overlay]");
  const navCloseBtn = document.querySelector("[data-nav-close-btn]");
  const navOpenBtn = document.querySelector("[data-nav-open-btn]");
  const navbarLinks = document.querySelectorAll("[data-nav-link]");

  // Null safety check - only proceed if elements exist
  if (!navbar || !overlay) {
    console.warn('Navbar or overlay not found');
    return;
  }

  const navElemArr = [overlay, navCloseBtn, navOpenBtn].filter(el => el !== null);

  /**
   * Handle navbar link clicks - differentiate between dropdowns and regular links
   */
  if (navbarLinks && navbarLinks.length > 0) {
    for (let i = 0; i < navbarLinks.length; i++) {
      navbarLinks[i].addEventListener("click", function (e) {
        // Check if this is a dropdown parent link
        const parentLi = this.closest('li');
        const hasDropdown = parentLi && parentLi.classList.contains('dropdown');

        // If it's a dropdown parent, don't close the menu (let dropdowns work)
        // If it's a regular link (Services, Contact, Home), close the menu
        if (!hasDropdown) {
          // Close the mobile menu
          if (navbar) elemToggleFunc(navbar);
          if (overlay) elemToggleFunc(overlay);
          // Let the browser navigate to the href (don't prevent default)
        }
      });
    }
  }

  /**
   * Toggle navbar when clicking overlay, close button, or open button
   */
  for (let i = 0; i < navElemArr.length; i++) {
    if (navElemArr[i]) {
      navElemArr[i].addEventListener("click", function () {
        if (navbar) elemToggleFunc(navbar);
        if (overlay) elemToggleFunc(overlay);
      });
    }
  }
});



/**
 * header active state
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  window.scrollY >= 400 ? header.classList.add("active")
    : header.classList.remove("active");
});



/**
 * Stats Counter Animation
 */

const counters = document.querySelectorAll('.counter');
let countersStarted = false;

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'k';
  }
  return num.toString();
}

function animateCounter(counter) {
  const target = parseInt(counter.getAttribute('data-target'));
  const duration = 2000; // 2 seconds
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function for smooth animation
    const easeOutQuad = progress * (2 - progress);
    const currentValue = Math.floor(easeOutQuad * target);

    counter.textContent = formatNumber(currentValue);

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = formatNumber(target);
    }
  }

  requestAnimationFrame(updateCounter);
}

function startCounters() {
  if (countersStarted) return;

  const statsSection = document.querySelector('.stats');
  if (!statsSection) return;

  const rect = statsSection.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Start when stats section is 80% visible
  if (rect.top <= windowHeight * 0.8) {
    countersStarted = true;
    counters.forEach(counter => animateCounter(counter));
  }
}

window.addEventListener('scroll', startCounters);
window.addEventListener('load', startCounters);

/**
 * Sticky Contact Button Injection
 */
document.addEventListener("DOMContentLoaded", function () {
  // Check if button already exists to prevent duplicates
  if (document.querySelector('.sticky-contact-bar')) return;

  const contactBar = document.createElement("div");
  contactBar.className = "sticky-contact-bar";
  contactBar.innerHTML = `
    <a href="https://wa.me/919876543210" target="_blank" class="sticky-btn whatsapp">
      <ion-icon name="logo-whatsapp"></ion-icon>
      <span class="tooltip">Chat +91 9876543210</span>
    </a>
    <a href="tel:04422436272" class="sticky-btn phone">
      <ion-icon name="call"></ion-icon>
      <span class="tooltip">Call +91 9876543210</span>
    </a>
  `;
  document.body.appendChild(contactBar);
});

/**
 * Hero Slider Initialization
 */
document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector('.hero-slider')) {
    const swiper = new Swiper('.hero-slider', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      }
    });
  }
});
/**
 * Scroll Progress Bar
 */

document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  // Create progress bar element
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  header.appendChild(progressBar);

  // Update progress on scroll
  window.addEventListener('scroll', function () {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
});

/**
 * Active Page Tracker
 */

document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const currentUrl = window.location.href;
  const currentPath = window.location.pathname;
  // Handle root/index correctly
  const pageName = currentPath.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');

    // Check if link matches current page
    // Simple check: if href matches pageName
    if (linkHref === pageName) {
      link.classList.add('active');
    }
    // Handle home page specifically if pageName is 'index.html' and href is './' or 'index.html'
    else if ((pageName === 'index.html' || pageName === '') && (linkHref === './' || linkHref === 'index.html')) {
      link.classList.add('active');
    }
  });
});

/**
 * Active Page Tracker (Updated)
 */

document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const currentUrl = window.location.href;
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop() || 'index.html';

  // Remove active class from ALL links first to prevent duplicates
  navLinks.forEach(link => link.classList.remove('active'));

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');

    if (linkHref === pageName) {
      link.classList.add('active');
    }
    else if ((pageName === 'index.html' || pageName === '') && (linkHref === './' || linkHref === 'index.html')) {
      link.classList.add('active');
    }
  });
});

/**
 * Plans Section Tabs
 */
document.addEventListener('DOMContentLoaded', function () {
  const planTabs = document.querySelectorAll('.plan-tab');
  const planContents = document.querySelectorAll('.plan-content');

  if (planTabs.length > 0) {
    planTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        // Remove active class from all tabs
        planTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        this.classList.add('active');

        // Hide all contents
        planContents.forEach(content => content.classList.remove('active'));

        // Show target content
        const targetId = this.getAttribute('data-tab');
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }
});

/**
 * Feedback Slider
 */
document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('.feedback-slider')) {
    const feedbackSwiper = new Swiper('.feedback-slider', {
      loop: true,
      spaceBetween: 30,
      autoplay: {
        delay: 6000,
        disableOnInteraction: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    // Custom Play Button Logic
    const playButtons = document.querySelectorAll('.video-play-btn');
    playButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const video = this.nextElementSibling;
        if (video) {
          video.play();
          video.setAttribute('controls', 'true');
          this.style.display = 'none';
          feedbackSwiper.autoplay.stop(); // Stop slider autoplay when video plays
        }
      });
    });
  }
});
/**
 * Joint Venture Timeline Animation
 */
/**
 * Joint Venture Timeline Animation
 */
/**
 * Sticky Center Timeline Animation
 */
document.addEventListener('DOMContentLoaded', function () {
  const centerMarker = document.querySelector('.center-marker');
  const items = document.querySelectorAll('.timeline-item');
  const section = document.querySelector('.joint-venture');

  if (!centerMarker || items.length === 0) return;

  function handleScroll() {
    const windowHeight = window.innerHeight;
    const centerPoint = windowHeight / 2;

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + (rect.height / 2);

      // Check distance from center of viewport
      const distance = Math.abs(centerPoint - itemCenter);

      // Activation zone (e.g., within 100px of center)
      if (distance < 150) {
        item.classList.add('active');
        // Update number
        const num = index + 1;
        centerMarker.textContent = num < 10 ? `0${num}` : num;

        // Add pulse effect to marker when locked on
        if (distance < 50) {
          centerMarker.classList.add('pulse');
        } else {
          centerMarker.classList.remove('pulse');
        }

      } else {
        item.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
});

/**
 * Gallery Filtering
 */
document.addEventListener('DOMContentLoaded', function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');

        galleryItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.classList.remove('hide');
            item.classList.add('show');
          } else {
            item.classList.remove('show');
            item.classList.add('hide');
          }
        });
      });
    });
  }
});

/**
 * Location Highlights Carousel
 */
document.addEventListener('DOMContentLoaded', function () {
  const carouselTrack = document.querySelector('.carousel-track');
  const carouselCards = document.querySelectorAll('.location-card');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const carouselDotsContainer = document.querySelector('.carousel-dots');

  if (!carouselTrack || carouselCards.length === 0) {
    return; // Exit if carousel doesn't exist
  }

  let currentIndex = 0;
  const totalCards = carouselCards.length;
  let cardsToShow = 3; // default desktop
  let cardWidth = 0;
  let gap = 30;

  // Create dots
  function createDots() {
    carouselDotsContainer.innerHTML = '';
    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      carouselDotsContainer.appendChild(dot);
    }
  }

  // Update dots
  function updateDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Calculate dimensions
  function calculateDimensions() {
    const windowWidth = window.innerWidth;

    if (windowWidth <= 768) {
      cardsToShow = 1;
      gap = 20;
    } else if (windowWidth <= 992) {
      cardsToShow = 2;
      gap = 20;
    } else {
      cardsToShow = 3;
      gap = 30;
    }

    cardWidth = carouselCards[0].offsetWidth;
  }

  // Update center card highlighting
  function updateCenterCard() {
    carouselCards.forEach((card, index) => {
      card.classList.remove('center');
      if (index === currentIndex) {
        card.classList.add('center');
      }
    });
  }

  // Move carousel
  function moveCarousel() {
    calculateDimensions();
    const moveAmount = (cardWidth + gap) * currentIndex;
    carouselTrack.style.transform = `translateX(-${moveAmount}px)`;
    updateCenterCard();
    updateDots();
    updateButtonStates();
  }

  // Go to specific slide
  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, totalCards - cardsToShow));
    moveCarousel();
  }

  // Next slide
  function nextSlide() {
    if (currentIndex < totalCards - cardsToShow) {
      currentIndex++;
    } else {
      // Loop back to start when reaching the end
      currentIndex = 0;
    }
    moveCarousel();
  }

  // Previous slide
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      moveCarousel();
    }
  }

  // Update button states
  function updateButtonStates() {
    if (prevBtn && nextBtn) {
      prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
      prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';

      nextBtn.style.opacity = currentIndex >= totalCards - cardsToShow ? '0.5' : '1';
      nextBtn.style.cursor = currentIndex >= totalCards - cardsToShow ? 'not-allowed' : 'pointer';
    }
  }

  // Event Listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }

  // Touch/Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  carouselTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carouselTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      nextSlide(); // Swipe left
    } else if (touchEndX - touchStartX > swipeThreshold) {
      prevSlide(); // Swipe right
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  });

  // Initialize
  createDots();
  moveCarousel();

  // Auto-play functionality
  let autoPlayInterval;
  const autoPlayDelay = 3000; // 3 seconds

  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      nextSlide();
    }, autoPlayDelay);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  // Start auto-play on load
  startAutoPlay();

  // Pause on hover
  if (carouselTrack) {
    carouselTrack.addEventListener('mouseenter', stopAutoPlay);
    carouselTrack.addEventListener('mouseleave', startAutoPlay);
  }

  // Restart auto-play after manual navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoPlay();
      startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoPlay();
      startAutoPlay();
    });
  }

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Recalculate on resize
      const oldCardsToShow = cardsToShow;
      calculateDimensions();

      // Adjust currentIndex if needed after resize
      if (oldCardsToShow !== cardsToShow) {
        currentIndex = Math.min(currentIndex, totalCards - cardsToShow);
      }

      moveCarousel();
    }, 250);
  });
});

