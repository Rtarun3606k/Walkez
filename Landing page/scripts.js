document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.getElementById('cta-btn');
    ctaButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        alert('Thank you for your interest! The app will be available soon.');
    });

    // Function to handle animations on scroll
    function handleScrollAnimations() {
        const animatedElements = document.querySelectorAll('.card, .team-member, .grid-image');
        
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    handleScrollAnimations();
});
