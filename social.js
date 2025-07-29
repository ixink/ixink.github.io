// social.js

document.addEventListener("DOMContentLoaded", function () {
    const socialLinks = document.querySelectorAll(".social-link");

    // Error handling for missing social links
    if (!socialLinks.length) {
        console.error("No social links found");
        return;
    }

    console.log(`Found ${socialLinks.length} social links`);

    socialLinks.forEach((link, index) => {
        // Initial state
        gsap.set(link, { scale: 1, rotate: 0 });

        // Hover animation timeline
        const hoverTimeline = gsap.timeline({
            paused: true,
            defaults: { duration: 0.3, ease: "power2.out" },
        });

        // Use the link's specific hover color if defined in CSS
        hoverTimeline.to(link, {
            scale: 1.2,
            rotate: 5,
            boxShadow: "var(--social-shadow) 0px 4px 8px",
        });

        // Hover events
        link.addEventListener("mouseenter", () => {
            hoverTimeline.play();
        });

        link.addEventListener("mouseleave", () => {
            hoverTimeline.reverse();
        });
    });
});
