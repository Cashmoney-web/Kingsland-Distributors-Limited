// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    preloader.style.display = 'none';
    
    // Animate hero content
    gsap.to('.hero-content h1', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.to('.hero-content p', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });
});

// Sticky Header
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('open'); // Changed from 'active' to 'open' for icon animation
    navLinks.classList.toggle('active');
});

// Scroll Animations
const animateOnScroll = () => {
    gsap.utils.toArray('.selection-item').forEach(item => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
    });
};

// Initialize animations
animateOnScroll();

// Back to Top Button
const backToTopBtn = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form Validation
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        let isValid = true;
        
        // Simple validation
        if (!name.value.trim()) {
            showError(name, 'Name is required');
            isValid = false;
        }
        
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email');
            isValid = false;
        }
        
        if (!message.value.trim()) {
            showError(message, 'Message is required');
            isValid = false;
        }
        
        if (isValid) {
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                contactForm.reset();
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit';
                }, 2000);
            }, 1500);
        }
    });
}

// Helper functions
function showError(input, message) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message') || document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(error);
    }
    input.classList.add('error');
    
    input.addEventListener('input', () => {
        error.remove();
        input.classList.remove('error');
    }, { once: true });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// WhatsApp Integration
function openWhatsApp(productName) {
    const message = `Hello, I'm interested in ordering ${productName}. Please provide more information.`;
    const whatsappNumber = '+256785774627'; // Replace with actual WhatsApp number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});

// New: Brands Carousel Animation
document.addEventListener('DOMContentLoaded', () => {
    const tracks = document.querySelectorAll('.brand-names-track');
    if (tracks.length > 0) {
        // Create a single timeline for the continuous scroll
        const scrollTimeline = gsap.timeline({
            repeat: -1, // Infinite loop
            defaults: { ease: "none" } // Linear animation
        });

        // Loop through each track (there should be two)
        tracks.forEach((track, index) => {
            // Calculate the total width of the track including its gap
            // This is a bit tricky to get perfectly dynamically, often estimated or set with a magic number.
            // A more robust way would be to measure the clientWidth of the track,
            // but for simplicity, we'll assume the second track starts where the first ends
            // and the animation needs to cover the full width of one track.
            const trackWidth = track.scrollWidth; // Get the total scrollable width of the content

            // Animate each track
            scrollTimeline.to(track, {
                x: -trackWidth, // Move left by its full width
                duration: trackWidth / 100, // Adjust duration based on width for consistent speed (100 is pixels per second)
            }, 0); // Start both animations at the same time
        });

        // To make it seamless, we need to ensure the tracks are positioned correctly initially.
        // The second track should start immediately after the first.
        // CSS display:inline-flex with white-space:nowrap already handles this.
        // GSAP will just handle the translation.

        // If you want more advanced control (e.g., pausing on hover), you'd add listeners here.
        // Example: Pause on hover
        const carouselContainer = document.querySelector('.brand-carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => scrollTimeline.pause());
            carouselContainer.addEventListener('mouseleave', () => scrollTimeline.resume());
        }
    }
});

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // ES6 swap
    }
    return array;
}

// Function to randomize product order
function randomizeProducts() {
    const productsGridContainer = document.querySelector('.products-grid-container');
    if (!productsGridContainer) {
        console.warn('Products grid container not found.');
        return;
    }

    // Get all product cards
    let productCards = Array.from(productsGridContainer.querySelectorAll('.product-card'));

    // Shuffle the array of product cards
    productCards = shuffleArray(productCards);

    // Clear the current grid (optional, but ensures clean re-insertion)
    // Or, simply remove the arrow and re-add it at the end if desired.
    // For simplicity, let's just clear and re-append all.
    productsGridContainer.innerHTML = '';

    // Re-append the shuffled product cards to the container
    productCards.forEach(card => {
        productsGridContainer.appendChild(card);
    });

    // Re-add the navigation arrow if it was removed
    // (assuming it's the last child in your products-grid-container)
    const navArrow = document.createElement('div');
    navArrow.className = 'products-grid-nav-arrow';
    navArrow.innerHTML = '<i class="fas fa-arrow-right"></i>';
    productsGridContainer.appendChild(navArrow);
}

// Ensure the function runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Call the randomizeProducts function when the page loads
    randomizeProducts();

    // The existing lazy loading script (if you added it based on previous suggestions)
    const lazyImages = document.querySelectorAll("img[data-src]");

    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        lazyImages.forEach(function(lazyImage) {
            lazyImage.src = lazyImage.dataset.src;
        });
    }

    // Existing openWhatsApp function (ensure your actual number is here)
    function openWhatsApp(productName) {
        const phoneNumber = "+256785774627"; // Replace with your actual WhatsApp number, including country code (e.g., +256 for Uganda)
        const message = `I would like to inquire about ordering ${productName}.`;
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    }
});

// --- Product Search Functionality ---
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('productSearch');
    const productCards = document.querySelectorAll('.product-card'); // Get all product cards

    if (searchInput) {
        searchInput.addEventListener('keyup', (event) => {
            const searchTerm = event.target.value.toLowerCase().trim(); // Get search term, convert to lowercase, remove leading/trailing spaces

            productCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();

                // Check if the search term is found in the title or description
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = ''; // Show the card (reset to default display)
                } else {
                    card.style.display = 'none'; // Hide the card
                }
            });
        });
    }

    // --- Existing randomizer function (ensure this is present from earlier steps) ---
    // Function to shuffle an array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // ES6 swap
        }
        return array;
    }

    // Function to randomize product order
    function randomizeProducts() {
        const productsGridContainer = document.querySelector('.products-grid-container');
        if (!productsGridContainer) {
            console.warn('Products grid container not found.');
            return;
        }

        // Get all product cards
        let productCardsArray = Array.from(productsGridContainer.querySelectorAll('.product-card'));

        // Shuffle the array of product cards
        productCardsArray = shuffleArray(productCardsArray);

        // Clear the current grid (optional, but ensures clean re-insertion)
        productsGridContainer.innerHTML = '';

        // Re-append the shuffled product cards to the container
        productCardsArray.forEach(card => {
            productsGridContainer.appendChild(card);
        });

        // Re-add the navigation arrow if it was removed
        const navArrow = document.createElement('div');
        navArrow.className = 'products-grid-nav-arrow';
        navArrow.innerHTML = '<i class="fas fa-arrow-right"></i>';
        productsGridContainer.appendChild(navArrow);
    }

    // Call the randomizeProducts function when the page loads
    // Make sure this is called AFTER the product cards are loaded, usually fine with DOMContentLoaded
    randomizeProducts();


    // --- Existing Lazy Loading Script (if you added it based on previous suggestions) ---
    const lazyImages = document.querySelectorAll("img[data-src]");

    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        lazyImages.forEach(function(lazyImage) {
            lazyImage.src = lazyImage.dataset.src;
        });
    }

    // --- Existing openWhatsApp function (ensure your actual number is here) ---
    // Make sure this function is globally accessible if called from onclick in HTML
    window.openWhatsApp = function(productName) {
        const phoneNumber = "+256785774627"; // Replace with your actual WhatsApp number, including country code (e.g., +256 for Uganda)
        const message = `I would like to inquire about ordering ${productName}.`;
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    }
});

// In your main.js file, inside the document.addEventListener('DOMContentLoaded', ...) block

// --- Animated Underline (Premium Spirits) ---
const premiumSpiritsPath = document.querySelector('.products-hero-left h1 .highlight .animated-underline path');

if (premiumSpiritsPath) {
    // Get the total length of the path (important for stroke-dashoffset animation)
    const pathLength = premiumSpiritsPath.getTotalLength();

    // Set initial state: line is completely hidden
    premiumSpiritsPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    premiumSpiritsPath.style.strokeDashoffset = pathLength;

    // Animate the drawing of the line
    gsap.to(premiumSpiritsPath, {
        strokeDashoffset: 0, // Animate to 0 to "draw" the line
        duration: 1.5, // How long the drawing animation takes
        delay: 0.8, // Delay after the text appears
        ease: 'power2.out', // Smooth easing for the drawing
        scrollTrigger: { // Use ScrollTrigger to play animation when section enters view
            trigger: '.products-hero-section', // When this section comes into view
            start: 'top 80%', // Start animation when top of section is 80% from viewport top
            // You can add markers: true to debug ScrollTrigger positioning
        }
    });
}