// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initSmoothScrolling();
    initContactForm();
    initAnimations();
    initTestimonialCarousel();
    initFAQSection();
    initPricingFilters();
    initPricingToggle();
    initHowItWorks();
});

/**
 * Mobile menu functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            if (nav) {
                nav.classList.toggle('show');
                this.classList.toggle('active');
            }
        });
    }
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            const menuToggle = document.querySelector('.menu-toggle');
            const nav = document.querySelector('nav ul');
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (nav && nav.classList.contains('show')) {
                    nav.classList.remove('show');
                    if (menuToggle) menuToggle.classList.remove('active');
                }
            }
        });
    });
}

/**
 * Contact form handling
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
}

/**
 * Initialize animations on scroll
 */
function initAnimations() {
    function animateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll:not(.animate)');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            const delay = element.getAttribute('data-delay') || 0;
            
            if (elementPosition < screenPosition) {
                // Add a delay based on the data-delay attribute
                setTimeout(() => {
                    element.classList.add('animate');
                }, delay * 300); // 300ms delay multiplier
            }
        });
    }
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initialize on load
    
    // Initialize testimonial carousel
    initTestimonialCarousel();
    
    // Initialize How It Works section animations
    function initHowItWorks() {
        const steps = document.querySelectorAll('.step');
        
        const animateSteps = () => {
            const windowHeight = window.innerHeight;
            
            steps.forEach(step => {
                const stepPosition = step.getBoundingClientRect().top;
                const stepInView = stepPosition - windowHeight + 100 < 0;
                
                if (stepInView) {
                    step.classList.add('animate');
                    // Add staggered delay based on data-delay attribute
                    const delay = step.getAttribute('data-delay') || 0;
                    step.style.transitionDelay = `${delay}s`;
                }
            });
        };
        
        // Initial check in case elements are already in view
        animateSteps();
        
        // Listen for scroll events
        window.addEventListener('scroll', animateSteps);
        
        // Also check on window resize
        window.addEventListener('resize', animateSteps);
    }
    
    // Initialize FAQ section
    initPricingToggle();
    
    // Initialize How It Works animations
    initHowItWorks();
    
    // Recalculate carousel on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initTestimonialCarousel();
        }, 250);
    });

    // Initialize pricing toggle
    initPricingToggle();
    
    // FAQ Flip Card Functionality
    function initFAQSection() {
        const faqCards = document.querySelectorAll('.faq-card');
        let isAnimating = false;
        const ANIMATION_DURATION = 600; // ms - should match CSS transition duration
        
        // Function to close all FAQ cards except the one passed as parameter
        function closeOtherCards(currentCard) {
            faqCards.forEach(card => {
                if (card !== currentCard && card.classList.contains('active')) {
                    flipCard(card, false);
                }
            });
        }
        
        // Function to handle card flip
        function flipCard(card, shouldOpen) {
            if (isAnimating) return;
            isAnimating = true;
            
            const front = card.querySelector('.faq-card-front');
            const back = card.querySelector('.faq-card-back');
            
            if (shouldOpen) {
                // Open the card
                closeOtherCards(card);
                card.classList.add('active');
                card.setAttribute('aria-expanded', 'true');
                
                // Make back accessible
                if (back) {
                    back.setAttribute('aria-hidden', 'false');
                    back.setAttribute('tabindex', '0');
                }
                
                // Set focus to the close button when opened
                setTimeout(() => {
                    const closeBtn = card.querySelector('.faq-close');
                    if (closeBtn) {
                        closeBtn.focus();
                    }
                }, 50);
            } else {
                // Close the card
                card.classList.remove('active');
                card.setAttribute('aria-expanded', 'false');
                
                // Hide back from accessibility tree when closed
                if (back) {
                    back.setAttribute('aria-hidden', 'true');
                    back.setAttribute('tabindex', '-1');
                }
                
                // Set focus back to the front when closed
                setTimeout(() => {
                    if (front) {
                        front.focus();
                    }
                }, 50);
            }
            
            // Reset animation lock after animation completes
            setTimeout(() => {
                isAnimating = false;
            }, ANIMATION_DURATION);
        }
        
        // Initialize FAQ cards
        function initFaqCards() {
            faqCards.forEach(card => {
                const front = card.querySelector('.faq-card-front');
                const back = card.querySelector('.faq-card-back');
                const closeBtn = card.querySelector('.faq-close');
                
                // Set initial ARIA attributes
                card.setAttribute('aria-expanded', 'false');
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                
                if (back) {
                    back.setAttribute('aria-hidden', 'true');
                    back.setAttribute('tabindex', '-1');
                }
                
                // Click handler for the entire card
                card.addEventListener('click', function(e) {
                    // Don't flip if clicking on interactive elements
                    if (e.target.closest('a, button, [tabindex="0"]') && e.target !== this) {
                        return;
                    }
                    
                    const isActive = this.classList.contains('active');
                    flipCard(this, !isActive);
                });
                
                // Keyboard navigation
                card.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                        e.preventDefault();
                        const isActive = this.classList.contains('active');
                        flipCard(this, !isActive);
                    } else if (e.key === 'Escape' && this.classList.contains('active')) {
                        flipCard(this, false);
                    } else if (e.key === 'Tab' && this.classList.contains('active')) {
                        // Trap focus inside the card when open
                        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
                        const focusableContent = this.querySelectorAll(focusableElements);
                        const firstFocusableElement = focusableContent[0];
                        const lastFocusableElement = focusableContent[focusableContent.length - 1];
                        
                        if (e.shiftKey) {
                            if (document.activeElement === firstFocusableElement) {
                                lastFocusableElement.focus();
                                e.preventDefault();
                            }
                        } else {
                            if (document.activeElement === lastFocusableElement) {
                                firstFocusableElement.focus();
                                e.preventDefault();
                            }
                        }
                    }
                });
            console.log('Filtering by category:', category);
            pricingRows.forEach(row => {
                const rowCategory = row.getAttribute('data-category');
                if (category === 'all' || rowCategory === category) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
        
        // Add click event to each filter button
        filterButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Button clicked:', this);
                
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Filter rows
                const category = this.getAttribute('data-category');
                filterRows(category);
            });
        });
        
        // Show all rows by default
        filterRows('all');
        
        // Set first button as active
        if (filterButtons[0]) {
            filterButtons[0].classList.add('active');
        }
        
        console.log('Pricing filters initialized');
    }, 300); // Small delay to ensure DOM is ready
});

// Pricing Table Filter Functionality
function initPricingFilters() {
    console.log('Initializing pricing filters...');
    
    // Get the pricing section first
    const pricingSection = document.querySelector('#pricing');
    if (!pricingSection) {
        console.error('Pricing section not found');
        return;
    }
    
    // Get elements within the pricing section
    const filterButtons = pricingSection.querySelectorAll('.pricing-filters .filter-btn');
    const pricingTable = pricingSection.querySelector('.pricing-table tbody');
    
    if (!pricingTable) {
        console.error('Pricing table not found');
        return;
    }
    
    const pricingRows = pricingTable.querySelectorAll('tr[data-category]');
    
    console.log(`Found ${filterButtons.length} filter buttons`);
    console.log(`Found ${pricingRows.length} pricing rows`);
    
    if (filterButtons.length === 0 || pricingRows.length === 0) {
        console.error('Could not find filter buttons or pricing rows');
        return;
    }
    
    function filterTable(category) {
        console.log(`Filtering by category: ${category}`);
        pricingRows.forEach(row => {
            const rowCategory = row.getAttribute('data-category');
            if (category === 'all' || rowCategory === category) {
                row.style.display = '';
                console.log(`Showing row with category: ${rowCategory}`);
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Button clicked:', button);
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            console.log('Selected category:', category);
            
            // Filter the table
            filterTable(category);
        });
    });
    
    // Initialize with all services shown
    const allButton = document.querySelector('.filter-btn[data-category="all"]');
    if (allButton) {
        console.log('Initializing with all services');
        allButton.click();
    } else {
        console.error('Could not find "All Services" button');
    }
    
    // Force show all rows initially
    filterTable('all');
}

// Pricing Toggle Functionality
function initPricingToggle() {
    const toggle = document.getElementById('billing-toggle');
    const monthlyLabels = document.querySelectorAll('.toggle-labels.monthly');
    const yearlyLabels = document.querySelectorAll('.toggle-labels.yearly');
    const yearlyTexts = document.querySelectorAll('.yearly-text');
    const saveAmounts = document.querySelectorAll('.save-amount');
    const discountBadge = document.querySelector('.discount-badge');

    if (!toggle) return;

    function updatePricing(isYearly) {
        // Update toggle UI
        monthlyLabels.forEach(el => el.classList.toggle('active', !isYearly));
        yearlyLabels.forEach(el => el.classList.toggle('active', isYearly));
        
        // Update price displays
        document.querySelectorAll('.price .amount').forEach(amountEl => {
            const monthlyPrice = amountEl.getAttribute('data-monthly');
            const yearlyPrice = amountEl.getAttribute('data-yearly');
            amountEl.textContent = isYearly ? yearlyPrice : monthlyPrice;
        });

        // Update period text
        document.querySelectorAll('.period').forEach(periodEl => {
            periodEl.textContent = isYearly ? '/year' : '/month';
        });

        // Toggle visibility of yearly text and save amounts
        yearlyTexts.forEach(el => el.style.display = isYearly ? 'block' : 'none');
        saveAmounts.forEach(el => el.style.display = isYearly ? 'inline' : 'none');
        
        // Update discount badge
        if (discountBadge) {
            discountBadge.style.display = isYearly ? 'none' : 'inline-block';
        }
    }

    // Toggle change event
    toggle.addEventListener('change', (e) => {
        updatePricing(e.target.checked);
    });

    // Initial update
    updatePricing(toggle.checked);
}

function initTestimonialCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;
    
    // Remove any existing event listeners to prevent duplicates
    const newCarousel = carousel.cloneNode(true);
    carousel.parentNode.replaceChild(newCarousel, carousel);
    
    const track = newCarousel.querySelector('.testimonial-track');
    const cards = newCarousel.querySelectorAll('.testimonial-card');
    const prevBtn = newCarousel.querySelector('.carousel-arrow.prev');
    const nextBtn = newCarousel.querySelector('.carousel-arrow.next');
    const dotsContainer = newCarousel.querySelector('.testimonial-dots');
    
    if (!track || cards.length === 0) return;
    
    let currentIndex = 0;
    let cardWidth = cards[0].offsetWidth + 30; // Width + gap
    let visibleCards = 3; // Default for large screens
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    
    // Set initial styles
    track.style.transition = 'transform 0.5s ease';
    
    // Handle responsive number of visible cards
    function updateVisibleCards() {
        if (window.innerWidth < 768) {
            visibleCards = 1; // Mobile
        } else if (window.innerWidth < 1200) {
            visibleCards = 2; // Tablet
        } else {
            visibleCards = 3; // Desktop
        }
        updateCarousel();
    }
    
    // Create dots for navigation
    function createDots() {
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        const dotCount = Math.ceil(cards.length / visibleCards);
        
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update carousel position
    function updateCarousel() {
        cardWidth = cards[0].offsetWidth + 30; // Recalculate card width
        const maxIndex = Math.max(0, cards.length - visibleCards);
        currentIndex = Math.min(currentIndex, maxIndex);
        
        // Update track position
        currentTranslate = -currentIndex * cardWidth * visibleCards;
        track.style.transform = `translateX(${currentTranslate}px)`;
        
        // Update dots
        updateDots();
        
        // Update button states
        updateButtonStates();
    }
    
    // Update navigation dots
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.dot');
        const activeDotIndex = Math.floor(currentIndex / visibleCards);
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
    }
    
    // Update button states
    function updateButtonStates() {
        if (!prevBtn || !nextBtn) return;
        
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= cards.length - visibleCards;
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index * visibleCards;
        updateCarousel();
    }
    
    // Next slide
    function nextSlide() {
        const maxIndex = Math.max(0, cards.length - visibleCards);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        } else {
            // Optional: Loop back to start
            // currentIndex = 0;
            // updateCarousel();
        }
    }
    
    // Previous slide
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        } else {
            // Optional: Loop to end
            // currentIndex = Math.max(0, cards.length - visibleCards);
            // updateCarousel();
        }
    }
    
    // Touch event handlers
    function touchStart(e) {
        isDragging = true;
        startPos = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        track.style.transition = 'none';
        cancelAnimationFrame(animationID);
    }
    
    function touchMove(e) {
        if (!isDragging) return;
        
        const currentPosition = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const diff = currentPosition - startPos;
        
        // Prevent scrolling past the first/last card
        const maxTranslate = 0;
        const minTranslate = -(cards.length - visibleCards) * cardWidth;
        
        // Apply resistance at boundaries
        if ((currentTranslate >= maxTranslate && diff > 0) || 
            (currentTranslate <= minTranslate && diff < 0)) {
            diff *= 0.5; // Reduce movement at boundaries
        }
        
        track.style.transform = `translateX(${currentTranslate + diff}px)`;
    }
    
    function touchEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        
        const movedBy = e.type === 'touchend' ? 
            e.changedTouches[0].clientX - startPos : 
            e.clientX - startPos;
        
        // If drag distance is significant enough, change slide
        if (Math.abs(movedBy) > 50) {
            if (movedBy > 0 && currentIndex > 0) {
                prevSlide();
            } else if (movedBy < 0 && currentIndex < cards.length - visibleCards) {
                nextSlide();
            } else {
                updateCarousel(); // Snap back
            }
        } else {
            updateCarousel(); // Snap back if not enough drag
        }
        
        track.style.transition = 'transform 0.5s ease';
    }
    
    // Initialize carousel
    function init() {
        updateVisibleCards();
        createDots();
        updateButtonStates();
        
        // Event listeners
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // Touch events
        track.addEventListener('touchstart', touchStart, { passive: true });
        track.addEventListener('touchmove', touchMove, { passive: false });
        track.addEventListener('touchend', touchEnd);
        
        // Mouse events for desktop
        track.addEventListener('mousedown', touchStart);
        track.addEventListener('mousemove', touchMove);
        track.addEventListener('mouseup', touchEnd);
        track.addEventListener('mouseleave', touchEnd);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });
        
        // Auto-advance slides
        let autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 8000);
        
        // Pause auto-slide on hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(() => {
                nextSlide();
            }, 8000);
        });
    }
    
    // Start the carousel
    init();
}