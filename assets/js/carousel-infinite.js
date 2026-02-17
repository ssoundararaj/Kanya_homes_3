/**
 * Location Highlights Carousel - Infinite Scrolling Version
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

    const originalTotalCards = carouselCards.length;
    let cardsToShow = 3; // default desktop
    let cardWidth = 0;
    let gap = 30;
    let currentIndex = cardsToShow; // Start at the first real card (after clones)
    let isTransitioning = false;

    // Clone cards for infinite effect
    function cloneCards() {
        const cardsArray = Array.from(carouselCards);

        // Clone first cardsToShow cards and append to end
        for (let i = 0; i < cardsToShow; i++) {
            const clone = cardsArray[i].cloneNode(true);
            clone.classList.add('cloned');
            carouselTrack.appendChild(clone);
        }

        // Clone last cardsToShow cards and prepend to beginning
        for (let i = originalTotalCards - 1; i >= originalTotalCards - cardsToShow; i--) {
            const clone = cardsArray[i].cloneNode(true);
            clone.classList.add('cloned');
            carouselTrack.insertBefore(clone, carouselTrack.firstChild);
        }
    }

    // Initialize clones
    cloneCards();

    // Get all cards including clones
    const allCards = document.querySelectorAll('.location-card');
    const totalCardsWithClones = allCards.length;

    // Create dots (only for original cards)
    function createDots() {
        carouselDotsContainer.innerHTML = '';
        for (let i = 0; i < originalTotalCards; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            carouselDotsContainer.appendChild(dot);
        }
    }

    // Update dots based on real position
    function updateDots() {
        const dots = document.querySelectorAll('.carousel-dot');
        const realIndex = getRealIndex(currentIndex);
        dots.forEach((dot, index) => {
            if (index === realIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Get real index (accounting for cloned cards)
    function getRealIndex(index) {
        let realIndex = index - cardsToShow;
        if (realIndex < 0) realIndex = originalTotalCards + realIndex;
        if (realIndex >= originalTotalCards) realIndex = realIndex - originalTotalCards;
        return realIndex;
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

        cardWidth = allCards[0].offsetWidth;
    }

    // Update center card highlighting
    function updateCenterCard() {
        allCards.forEach((card, index) => {
            card.classList.remove('center');
            if (index === currentIndex) {
                card.classList.add('center');
            }
        });
    }

    // Move carousel with or without transition
    function moveCarousel(withTransition = true) {
        calculateDimensions();

        if (withTransition) {
            carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
            carouselTrack.style.transition = 'none';
        }

        const moveAmount = (cardWidth + gap) * currentIndex;
        carouselTrack.style.transform = `translateX(-${moveAmount}px)`;
        updateCenterCard();
        updateDots();
    }

    // Handle infinite loop positioning
    function handleInfiniteLoop() {
        isTransitioning = true;

        setTimeout(() => {
            // If we're at a cloned card, jump to the real equivalent
            if (currentIndex >= totalCardsWithClones - cardsToShow) {
                // We're past the original cards, jump to beginning
                currentIndex = cardsToShow;
                moveCarousel(false);
            } else if (currentIndex < cardsToShow) {
                // We're before the original cards, jump to end
                currentIndex = totalCardsWithClones - cardsToShow * 2;
                moveCarousel(false);
            }

            isTransitioning = false;
        }, 500); // Match transition duration
    }

    // Go to specific slide
    function goToSlide(index) {
        if (isTransitioning) return;
        currentIndex = index + cardsToShow; // Adjust for cloned cards at start
        moveCarousel();
    }

    // Next slide
    function nextSlide() {
        if (isTransitioning) return;
        currentIndex++;  // Move one card at a time
        moveCarousel();
        handleInfiniteLoop();
    }

    // Previous slide
    function prevSlide() {
        if (isTransitioning) return;
        currentIndex--;  // Move one card at a time
        moveCarousel();
        handleInfiniteLoop();
    }

    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;

    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
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
    moveCarousel(false); // Initial position without transition

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
            moveCarousel(false);
        }, 250);
    });
});
