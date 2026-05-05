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

    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
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
                label: 'Formula 1',
                url: 'f1.html',
                bg: 'rgba(225, 6, 0, 0.08)',
                border: 'rgba(225, 6, 0, 0.3)',
                bgHover: 'rgba(225, 6, 0, 0.14)',
                borderHover: 'rgba(225, 6, 0, 0.5)',
                color: '#dc2626',
            },
            {
                label: 'MLB',
                url: '#features',
                bg: 'rgba(22, 163, 74, 0.08)',
                border: 'rgba(22, 163, 74, 0.3)',
                bgHover: 'rgba(22, 163, 74, 0.14)',
                borderHover: 'rgba(22, 163, 74, 0.5)',
                color: '#16a34a',
            },
            {
                label: 'Politics',
                url: '#features',
                bg: 'rgba(37, 99, 235, 0.08)',
                border: 'rgba(37, 99, 235, 0.3)',
                bgHover: 'rgba(37, 99, 235, 0.14)',
                borderHover: 'rgba(37, 99, 235, 0.5)',
                color: '#2563eb',
            },
            {
                label: 'Economics',
                url: '#features',
                bg: 'rgba(245, 158, 11, 0.08)',
                border: 'rgba(245, 158, 11, 0.3)',
                bgHover: 'rgba(245, 158, 11, 0.14)',
                borderHover: 'rgba(245, 158, 11, 0.5)',
                color: '#d97706',
            },
            {
                label: 'NHL Playoffs',
                url: '#features',
                bg: 'rgba(99, 102, 241, 0.08)',
                border: 'rgba(99, 102, 241, 0.3)',
                bgHover: 'rgba(99, 102, 241, 0.14)',
                borderHover: 'rgba(99, 102, 241, 0.5)',
                color: '#4f46e5',
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
        background: rgba(22, 163, 74, 0.15);
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
