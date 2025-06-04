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