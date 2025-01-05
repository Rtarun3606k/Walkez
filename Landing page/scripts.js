document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.getElementById('cta-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const icon = document.getElementById('dark-mode-icon');

    // Function to handle dark mode toggle
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        
        // Toggle dark mode for all relevant elements
        const elementsToToggle = document.querySelectorAll(`
            .top-section,
            .features-section,
            .how-it-works-section,
            .image-grid-section,
            .contact-us-section,
            .card,
            .feature-card,
            .how-it-works-card,
            .team-member,
            .cta-section,
            #cta-btn,
            .bottom-section,
            .grid-image
        `);

        elementsToToggle.forEach(element => {
            element.classList.toggle('dark-mode');
        });

        // Toggle icon
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('darkMode', 'disabled');
        }
    }

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        toggleDarkMode();
    }

    // Dark mode toggle event listener
    darkModeToggle.addEventListener('click', toggleDarkMode);

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
