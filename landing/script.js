// ===== INTRO OVERLAY LOGIC =====
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('intro-overlay');
    
    // Hide overlay after 3 seconds
    setTimeout(() => {
        overlay.classList.add('hidden');
        // Re-enable overflow after animation
        setTimeout(() => {
            document.body.style.overflow = 'auto';
        }, 1000);
    }, 2500);

    // Initial body lock
    document.body.style.overflow = 'hidden';

    // ===== VIBRANT ANIMATIONS OBSERVER =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('vibrant-in');
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('.feature-card, .download-card');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) scale(0.9)';
        el.style.transition = `all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.15}s`;
        
        // Custom animation class
        observer.observe(el);
    });
});

// Use this for the Intersection Observer effects
document.addEventListener('scroll', () => {
    const featureCards = document.querySelectorAll('.feature-card, .download-card');
    featureCards.forEach(card => {
        const top = card.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }
    });
});

// ===== Mobile Nav Toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// ===== Smooth scroll for all anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

