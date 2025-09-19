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
    const animatedElements = document.querySelectorAll('.feature-item, .stat-card, .section-title, .section-subtext');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add hover effects to glass elements
    const glassElements = document.querySelectorAll('.feature-item, .stat-card, .glass-orb');

    glassElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 50px rgba(255, 215, 0, 0.2)';
        });

        element.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-visual');

        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
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

    // Email capture form for Free AI Files (llm.txt + llms-full.txt)
    const aiFilesForm = document.getElementById('ai-files-form');
    if (aiFilesForm) {
        const emailInput = aiFilesForm.querySelector('#email');
        const submitBtn = aiFilesForm.querySelector('button[type="submit"]');
        const successMsg = document.getElementById('form-success');

        const isValidEmail = (email) => {
            // Simple RFC5322-ish email regex suitable for client-side validation
            return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
        };

        aiFilesForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = (emailInput.value || '').trim();
            if (!isValidEmail(email)) {
                emailInput.focus();
                emailInput.setAttribute('aria-invalid', 'true');
                emailInput.style.borderColor = 'rgba(255, 99, 99, 0.8)';
                return;
            } else {
                emailInput.removeAttribute('aria-invalid');
                emailInput.style.borderColor = '';
            }

            // Prevent double submissions
            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending…';

            try {
                // Placeholder for Supabase integration
                // TODO: Replace with Supabase insert, e.g.:
                // const { data, error } = await supabase.from('ai_file_requests').insert({ email });
                // if (error) throw error;

                // For now, store in localStorage as a temporary measure
                const key = 'ai_file_requests';
                const existing = JSON.parse(localStorage.getItem(key) || '[]');
                existing.push({ email, ts: new Date().toISOString() });
                localStorage.setItem(key, JSON.stringify(existing));

                // Show success UI
                if (successMsg) {
                    successMsg.hidden = false;
                }
                aiFilesForm.reset();
            } catch (err) {
                console.error('Form submission error:', err);
                alert('Sorry, something went wrong. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });

        // Improve UX: live validation on blur
        emailInput.addEventListener('blur', () => {
            if (!emailInput.value) return;
            if (isValidEmail(emailInput.value)) {
                emailInput.removeAttribute('aria-invalid');
                emailInput.style.borderColor = '';
            }
        });
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
