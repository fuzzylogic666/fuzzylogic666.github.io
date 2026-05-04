// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', function () {
            this.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const mobileNavLinks = navLinksContainer.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function () {
                mobileMenuBtn.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!mobileMenuBtn.contains(e.target) && !navLinksContainer.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navLinksContainer.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect to navigation
    const nav = document.querySelector('.nav');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            nav.style.background = 'rgba(0, 0, 0, 0.5)';
            nav.style.backdropFilter = 'blur(40px)';
            nav.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            nav.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
        } else {
            nav.style.background = 'rgba(0, 0, 0, 0.3)';
            nav.style.backdropFilter = 'blur(30px)';
            nav.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            nav.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
        }

        lastScrollY = currentScrollY;
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.feature-card, .step-row, .section-title, .section-subtext');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add click ripple effect to buttons
    const buttons = document.querySelectorAll('.hero-cta, .nav-cta, .cta-button');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Category teaser cycling
    const teaserWord = document.querySelector('.category-teaser-word');
    if (teaserWord) {
        const categories = [
            {
                label: 'March Madness',
                url: 'ncaa.html',
                bg: 'rgba(249, 115, 22, 0.14)',
                border: 'rgba(249, 115, 22, 0.45)',
                bgHover: 'rgba(249, 115, 22, 0.22)',
                borderHover: 'rgba(249, 115, 22, 0.65)',
                color: '#fdba74',
            },
            {
                label: 'Formula 1',
                url: 'f1.html',
                bg: 'rgba(225, 6, 0, 0.14)',
                border: 'rgba(225, 6, 0, 0.45)',
                bgHover: 'rgba(225, 6, 0, 0.22)',
                borderHover: 'rgba(225, 6, 0, 0.65)',
                color: '#fca5a5',
            },
            {
                label: 'Politics',
                url: '#features',
                bg: 'rgba(108, 99, 255, 0.14)',
                border: 'rgba(108, 99, 255, 0.45)',
                bgHover: 'rgba(108, 99, 255, 0.22)',
                borderHover: 'rgba(108, 99, 255, 0.65)',
                color: '#a5b4fc',
            },
            {
                label: 'Economics',
                url: '#features',
                bg: 'rgba(34, 197, 94, 0.12)',
                border: 'rgba(34, 197, 94, 0.4)',
                bgHover: 'rgba(34, 197, 94, 0.2)',
                borderHover: 'rgba(34, 197, 94, 0.6)',
                color: '#86efac',
            },
        ];

        let currentIndex = 0;

        function cycleTeaser() {
            currentIndex = (currentIndex + 1) % categories.length;
            const cat = categories[currentIndex];

            teaserWord.style.opacity = '0';
            teaserWord.style.transform = 'translateY(6px)';

            setTimeout(() => {
                teaserWord.textContent = cat.label;
                teaserWord.href = cat.url;
                teaserWord.style.setProperty('--cat-teaser-bg', cat.bg);
                teaserWord.style.setProperty('--cat-teaser-border', cat.border);
                teaserWord.style.setProperty('--cat-teaser-bg-hover', cat.bgHover);
                teaserWord.style.setProperty('--cat-teaser-border-hover', cat.borderHover);
                teaserWord.style.color = cat.color;
                teaserWord.style.background = cat.bg;
                teaserWord.style.borderColor = cat.border;
                teaserWord.style.opacity = '1';
                teaserWord.style.transform = 'translateY(0)';
            }, 250);
        }

        // Apply initial styles inline so CSS vars take effect immediately
        const first = categories[0];
        teaserWord.style.background = first.bg;
        teaserWord.style.borderColor = first.border;
        teaserWord.style.color = first.color;
        teaserWord.style.transition = 'opacity 0.25s ease, transform 0.25s ease, background 0.2s ease, border-color 0.2s ease';

        setInterval(cycleTeaser, 3000);
    }

});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
