document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.getElementById('cta-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const icon = document.getElementById('dark-mode-icon');

    // Function to handle dark mode toggle
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');

        // Toggle sections and card classes
        const sections = document.querySelectorAll('.top-section, .hero-section, .features-section, .how-it-works-section, .image-grid-section, .contact-us-section, .cta-section, .bottom-section');
        sections.forEach(section => section.classList.toggle('dark-mode'));
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => card.classList.toggle('dark-mode'));

        // Toggle the icon
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon'); // Change to moon icon for dark mode
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun'); // Change back to sun icon for light mode
        }
    });

    // CTA button click event
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

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
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
