document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Add animation to form elements on scroll
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.form-group, .btn-submit');
            elements.forEach((element, index) => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.2;
                
                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        // Set initial styles for animation
        const formElements = document.querySelectorAll('.form-group, .btn-submit');
        formElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        });

        // Initial animation check
        animateOnScroll();
        
        // Add scroll event listener for animations
        window.addEventListener('scroll', animateOnScroll);

        // Form submission handler
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate form submission (replace with actual form submission)
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>Thank you for your message! We'll get back to you soon.</p>
                `;
                
                // Remove any existing success messages
                const existingSuccess = contactForm.querySelector('.form-success');
                if (existingSuccess) {
                    existingSuccess.remove();
                }
                
                contactForm.prepend(successMessage);
                
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    setTimeout(() => {
                        successMessage.remove();
                    }, 300);
                }, 5000);
                
            }, 1500);
        });
        
        // Add focus styles to form controls
        const formControls = contactForm.querySelectorAll('input, textarea, select');
        formControls.forEach(control => {
            // Add focus class on focus
            control.addEventListener('focus', function() {
                this.closest('.form-group').classList.add('focused');
            });
            
            // Remove focus class on blur if empty
            control.addEventListener('blur', function() {
                if (!this.value) {
                    this.closest('.form-group').classList.remove('focused');
                }
            });
            
            // Check for existing values on page load
            if (control.value) {
                control.closest('.form-group').classList.add('focused');
            }
        });
    }
});
