// Initialize How It Works section animations
function initHowItWorks() {
    const steps = document.querySelectorAll('.step');
    if (!steps.length) return;
    
    // Add initial styles to steps
    steps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px)';
        step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Function to check if element is in viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight * 0.85) &&
            rect.bottom >= 0
        );
    };

    // Function to animate steps
    const animateSteps = () => {
        steps.forEach(step => {
            if (isInViewport(step) && !step.classList.contains('animate')) {
                const delay = step.getAttribute('data-delay') || 0;
                step.style.transitionDelay = `${delay}s`;
                step.classList.add('animate');
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial check
    animateSteps();

    // Throttle scroll events for better performance
    let isScrolling;
    window.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(animateSteps, 50);
    }, { passive: true });

    // Check on resize
    window.addEventListener('resize', animateSteps, { passive: true });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHowItWorks);
} else {
    initHowItWorks();
}
