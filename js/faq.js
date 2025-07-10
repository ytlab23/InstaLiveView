document.addEventListener('DOMContentLoaded', function() {
    // Get all FAQ questions
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // Add click event to each question
    faqQuestions.forEach(question => {
        // Get the associated answer element
        const answerId = question.getAttribute('aria-controls');
        const answer = document.getElementById(answerId);
        
        // Initialize with answer hidden
        answer.style.maxHeight = '0';
        answer.style.paddingBottom = '0';
        
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle the expanded state
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle the answer visibility with smooth animation
            if (isExpanded) {
                // Collapse
                answer.style.maxHeight = '0';
                answer.style.paddingBottom = '0';
            } else {
                // Expand
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.paddingBottom = '25px';
                
                // Close other open answers
                faqQuestions.forEach(q => {
                    if (q !== question && q.getAttribute('aria-expanded') === 'true') {
                        const otherAnswer = document.getElementById(q.getAttribute('aria-controls'));
                        q.setAttribute('aria-expanded', 'false');
                        otherAnswer.style.maxHeight = '0';
                        otherAnswer.style.paddingBottom = '0';
                    }
                });
            }
        });
        
        // Add keyboard navigation
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const currentIndex = Array.from(faqQuestions).indexOf(this);
                let nextIndex;
                
                if (e.key === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % faqQuestions.length;
                } else {
                    nextIndex = (currentIndex - 1 + faqQuestions.length) % faqQuestions.length;
                }
                
                faqQuestions[nextIndex].focus();
            } else if (e.key === 'Home') {
                e.preventDefault();
                faqQuestions[0].focus();
            } else if (e.key === 'End') {
                e.preventDefault();
                faqQuestions[faqQuestions.length - 1].focus();
            } else if (e.key === 'Escape') {
                // Close all on Escape
                faqQuestions.forEach(q => {
                    if (q.getAttribute('aria-expanded') === 'true') {
                        q.click();
                    }
                });
            }
        });
        
        // Make question focusable for keyboard users
        question.setAttribute('tabindex', '0');
    });
    
    // Close all answers when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.faq-item')) {
            document.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(question => {
                const answer = document.getElementById(question.getAttribute('aria-controls'));
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0';
                answer.style.paddingBottom = '0';
            });
        }
    });
});
