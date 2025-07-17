document.addEventListener("DOMContentLoaded", function () {
    // Get critical elements
    const overlay = document.querySelector(".book-title-overlay");
    const overlayText = document.querySelector(".book-title-text");
    const shelfContainer = document.querySelector(".shelf-container");
    const shelf = document.querySelector(".shelf");

    if (!overlay || !overlayText || !shelfContainer || !shelf) {
        console.error("Missing critical elements: overlay, overlayText, shelfContainer, or shelf");
        return;
    }

    // Track active book state
    let activeBookIndex = 4; // Default book (index 4)
    let activeBookTimeline = null;

    // Initialize books
    const books = document.querySelectorAll(".books__item");
    const bookTimelines = [];

    console.log(`Found ${books.length} regular books`);

    books.forEach((book, index) => {
        const hitbox = book.querySelector(".books__hitbox");
        const bookImage = book.querySelector(".books__image");
        const bookLink = bookImage.querySelector("a"); // Get the <a> tag
        const bookEffect = book.querySelector(".books__effect");
        const bookSpine = book.querySelector(".books__spine");
        const pages = book.querySelectorAll(".books__page");
        const bookLight = book.querySelector(".books__light");
        const bookTitle = hitbox?.getAttribute("data-book-title") || "";
        const bookIndex = hitbox?.getAttribute("data-book-index") || "";

        if (!hitbox || !bookImage || !bookEffect || !bookLight || !bookSpine) {
            console.error(`Book ${index} missing required elements`);
            return;
        }
        console.log(`Book ${index}: data-book-index=${bookIndex}, title=${bookTitle}`);

        // Get corresponding shadow
        let shadowIndex = index;
        if (index >= 2) shadowIndex += 1; // Adjust for side book
        const bookShadow = document.querySelectorAll(".book-shadow__item")[shadowIndex];

        if (!bookShadow) {
            console.error(`Book ${index}: No shadow found for shadowIndex=${shadowIndex}`);
            return;
        }

        // Set initial state with fixed positioning
        gsap.set(book, { x: 0, y: 0, zIndex: index === 4 ? 15 : 10 });
        gsap.set(bookImage, {
            boxShadow: "var(--book-shadow) 10px 5px 15px, var(--book-shadow) 20px 0px 25px",
            rotateY: 0,
            scale: 1,
            zIndex: 6, // Ensure bookImage is above hitbox
        });
        gsap.set(bookSpine, { rotateY: -90, opacity: 0 });
        gsap.set(bookLight, { opacity: 0.15 });
        gsap.set(bookEffect, { opacity: 0.3 });
        gsap.set(pages, { x: 0, rotateY: 0 });

        // Create hover animation timeline with spine reveal
        const hoverIn = gsap.timeline({
            paused: true,
            defaults: { duration: 0.4, ease: "power2.out" },
        });

        hoverIn.to(
            bookImage,
            {
                translateX: -10,
                scale: 1.05,
                boxShadow: "var(--book-shadow-strong) 15px 8px 20px, var(--book-shadow) 25px 0px 30px",
                rotateY: 8,
            },
            0
        );
        hoverIn.to(bookSpine, { rotateY: -45, opacity: 0.7 }, 0);
        hoverIn.to(bookShadow, { width: 130, opacity: 0.85 }, 0);
        hoverIn.to(bookEffect, { marginLeft: 15, opacity: 0.5 }, 0);
        hoverIn.to(bookLight, { opacity: 0.35 }, 0);
        if (pages.length >= 3) {
            hoverIn.to(pages[0], { x: "2px", rotateY: 4, ease: "power1.inOut" }, 0);
            hoverIn.to(pages[1], { x: "0px", rotateY: 2, ease: "power1.inOut" }, 0);
            hoverIn.to(pages[2], { x: "-2px", rotateY: -4, ease: "power1.inOut" }, 0);
        }

        bookTimelines[index] = hoverIn;

        // Click event for book flip and selection
        hitbox.addEventListener("click", (e) => {
            // Allow link clicks to propagate naturally
            if (e.target.closest(".books__image a")) {
                return; // Do not interfere with link clicks
            }
            e.stopPropagation(); // Prevent event bubbling to parent elements
            if (activeBookIndex !== index) {
                console.log(`Clicked book: data-book-index=${bookIndex}, title=${bookTitle}`);
                if (activeBookTimeline) activeBookTimeline.reverse();
                activeBookIndex = index;
                activeBookTimeline = hoverIn;

                // Flip animation
                gsap.to(bookImage, {
                    rotateY: 360,
                    duration: 0.7,
                    ease: "power2.inOut",
                    onComplete: () => {
                        hoverIn.play();
                        overlayText.textContent = bookTitle;
                        gsap.to(overlay, { opacity: 1, duration: 0.3 });
                        gsap.to(book, { zIndex: 15, duration: 0 });
                        books.forEach((otherBook, otherIndex) => {
                            if (otherIndex !== index) {
                                gsap.to(otherBook, { zIndex: 10, duration: 0 });
                            }
                        });
                    },
                });
            }
        });

        // Hover with 3D tilt effect
        hitbox.addEventListener("mousemove", (e) => {
            if (activeBookIndex !== index) {
                const rect = hitbox.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateY = ((x - centerX) / centerX) * 12;
                const rotateX = -((y - centerY) / centerY) * 8;
                gsap.to(bookImage, { rotateY, rotateX, duration: 0.3 });
                hoverIn.play();
            }
        });

        hitbox.addEventListener("mouseleave", () => {
            if (activeBookIndex !== index) {
                gsap.to(bookImage, { rotateY: 0, rotateX: 0, duration: 0.3 });
                hoverIn.reverse();
            }
        });
    });

    // Side book animation
    const sideBook = document.querySelector(".side-book");
    const sideBookShadow = document.querySelector(".book-shadow__item.side");
    const sideBookTitle = sideBook?.getAttribute("data-book-title") || "";
    const sideBookIndex = sideBook?.getAttribute("data-book-index") || "";

    if (sideBook && sideBookShadow) {
        console.log(`Side book: data-book-index=${sideBookIndex}, title=${sideBookTitle}`);

        const sideHoverIn = gsap.timeline({
            paused: true,
            defaults: { duration: 0.4, ease: "power2.out" },
        });

        sideHoverIn.to(
            sideBook,
            {
                y: -8,
                scale: 1.05,
                boxShadow: "var(--book-shadow) 8px -4px 15px, var(--book-shadow) 12px 0px 20px",
                rotateY: 8,
            },
            0
        );
        sideHoverIn.to(sideBookShadow, { width: 35, opacity: 0.85 }, 0);

        sideBook.addEventListener("click", () => {
            if (activeBookIndex !== "side") {
                console.log(`Clicked side book: data-book-index=${sideBookIndex}`);
                if (activeBookTimeline) activeBookTimeline.reverse();
                activeBookIndex = "side";
                activeBookTimeline = sideHoverIn;

                // Flip animation for side book
                gsap.to(sideBook, {
                    rotateY: 360,
                    duration: 0.7,
                    ease: "power2.inOut",
                    onComplete: () => {
                        sideHoverIn.play();
                        overlayText.textContent = sideBookTitle;
                        gsap.to(overlay, { opacity: 1, duration: 0.3 });
                        gsap.to(sideBook, { zIndex: 15, duration: 0 });
                        books.forEach((book) => {
                            gsap.to(book, { zIndex: 10, duration: 0 });
                        });
                    },
                });
            }
        });

        sideBook.addEventListener("mousemove", (e) => {
            if (activeBookIndex !== "side") {
                const rect = sideBook.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateY = ((x - centerX) / centerX) * 8;
                const rotateX = -((y - centerY) / centerY) * 4;
                gsap.to(sideBook, { rotateY, rotateX, duration: 0.3 });
                sideHoverIn.play();
            }
        });

        sideBook.addEventListener("mouseleave", () => {
            if (activeBookIndex !== "side") {
                gsap.to(sideBook, { rotateY: 0, rotateX: 0, duration: 0.3 });
                sideHoverIn.reverse();
            }
        });
    }

    // Set default open book (index 4)
    if (books[4]) {
        const defaultBook = books[4].querySelector(".books__hitbox");
        const defaultBookTitle = defaultBook.getAttribute("data-book-title");
        activeBookIndex = 4;
        activeBookTimeline = bookTimelines[4];
        bookTimelines[4]?.play();
        overlayText.textContent = defaultBookTitle;
        gsap.to(overlay, { opacity: 1, duration: 0.3 });
        gsap.to(books[4], { zIndex: 15, duration: 0 });
        console.log(`Default book set: data-book-index=4, title=${defaultBookTitle}`);
    }

    // Parallax effect on shelf
    shelfContainer.addEventListener("mousemove", (e) => {
        const rect = shelfContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const centerX = rect.width / 2;
        const tiltX = ((x - centerX) / centerX) * 1.5;
        gsap.to(shelf, { rotateY: tiltX, duration: 0.4, ease: "power1.out" });
    });

    shelfContainer.addEventListener("mouseleave", () => {
        gsap.to(shelf, { rotateY: 0, duration: 0.4, ease: "power1.out" });
        if (activeBookIndex !== 4 && books[4]) {
            console.log("Mouse left shelf, reverting to default book (index 4)");
            if (activeBookTimeline) activeBookTimeline.reverse();
            activeBookIndex = 4;
            activeBookTimeline = bookTimelines[4];
            bookTimelines[4]?.play();
            overlayText.textContent = books[4].querySelector(".books__hitbox").getAttribute("data-book-title");
            gsap.to(overlay, { opacity: 1, duration: 0.3 });
            gsap.to(books[4], { zIndex: 15, duration: 0 });
            books.forEach((book, index) => {
                if (index !== 4) {
                    gsap.to(book, { zIndex: 10, duration: 0 });
                }
            });
            if (sideBook) gsap.to(sideBook, { zIndex: 10, duration: 0 });
        }
    });
});