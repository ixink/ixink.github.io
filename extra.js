// extra.js

document.addEventListener('DOMContentLoaded', () => {
    // Select the new navigation links
    const blogLink = document.querySelector('a[href="https://cafe.rayhan.codes"]');
    const musicLink = document.querySelector('a[href="https://music.rayhan.codes"]');

    // Function to handle click tracking
    const trackNavClick = (link, label) => {
        link.addEventListener('click', (e) => {
            // Log the click event (for analytics or debugging)
            console.log(`Clicked ${label} link`);

            // Optionally send analytics event (e.g., Google Analytics)
            if (typeof gtag === 'function') {
                gtag('event', 'click', {
                    'event_category': 'Navigation',
                    'event_label': label,
                    'value': 1
                });
            }
        });
    };

    // Apply click tracking to new links
    if (blogLink) {
        trackNavClick(blogLink, 'Read Blog');
    }
    if (musicLink) {
        trackNavClick(musicLink, 'Explore Music');
    }

    // Optional: Add active class toggle for new links (if you want to highlight them)
    const navLinks = document.querySelectorAll('.nav li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class from all links
            navLinks.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked link (only for internal links, not external)
            if (!link.getAttribute('href').startsWith('http')) {
                link.classList.add('active');
            }
        });
    });
});
