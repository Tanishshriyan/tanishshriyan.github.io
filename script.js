// ULTIMATE PORTFOLIO EFFECTS - COMPLETE REPLACEMENT
document.addEventListener('DOMContentLoaded', function() {
    
    // === ORIGINAL FUNCTIONALITY FIRST (Keep your existing features) ===
    
    // Typing Animation
    const typingText = document.querySelector('.typing-text');
    const texts = [
        'Cybersecurity Enthusiast',
        'ML Developer',
        'Full-Stack Developer',
        'Pentester',
        'Problem Solver'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, 2000);
            return;
        }
        
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
        
        const typingSpeed = isDeleting ? 50 : 100;
        setTimeout(type, typingSpeed);
    }
    
    setTimeout(type, 1000);

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // === NEW ULTIMATE FEATURES ===

    // 1. LOADING SCREEN V2
    const loadingScreen = document.getElementById('loadingScreenV2');
    if (loadingScreen) {
        const codeLines = document.querySelectorAll('.code-line');
        codeLines.forEach((line, index) => {
            setTimeout(() => line.style.animationPlayState = 'running', index * 800);
        });
        
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => loadingScreen.remove(), 1000);
        }, 5000);
    }

    // 2. CUSTOM MOUSE CURSOR WITH TRAIL
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let trailCount = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Trail particles (every 3rd mouse move)
        if (trailCount++ % 3 === 0) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.left = (e.clientX - 3) + 'px';
            trail.style.top = (e.clientY - 3) + 'px';
            document.body.appendChild(trail);
            setTimeout(() => trail.remove(), 600);
        }
        
        // Smooth cursor movement
        cursor.style.left = (mouseX - 10) + 'px';
        cursor.style.top = (mouseY - 10) + 'px';
    });

    // Cursor hover effects
    const hoverTargets = document.querySelectorAll('a, button, .btn, .social-icon, .project-card, .skill-category, .contact-item');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        target.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // 3. MAGNETIC HOVER EFFECTS (add class="magnetic" to elements in HTML)
    const magneticElements = document.querySelectorAll('.magnetic, .project-card, .skill-category');
    document.addEventListener('mousemove', (e) => {
        magneticElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            const distance = Math.hypot(e.clientX - x, e.clientY - y);
            const power = Math.min(100 / distance, 0.12);
            
            el.style.transform = `translate(${power * (e.clientX - x)}px, ${power * (e.clientY - y)}px) scale(1.02)`;
        });
    });

    // Reset magnetic transform on mouse leave
    magneticElements.forEach(el => {
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });

    // 4. ENHANCED SCROLL ANIMATIONS (add class="scroll-reveal" to elements in HTML)
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 150);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.scroll-reveal, .about-text, .project-card, .skill-category, .contact-item').forEach(el => {
        scrollObserver.observe(el);
    });

    // 5. PARALLAX EFFECT (add class="parallax" data-speed="0.3" to elements)
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.parallax').forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });

        // Active nav link highlighting
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 6. SKILL BAR ANIMATION
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 200);
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => skillObserver.observe(bar));

    // 7. CONTACT FORM

emailjs.init("hrJVDoDspXKX-wgyR");  

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Spam protection
        if (contactForm.website.value) {
            alert('🤖 Spam detected!');
            return;
        }
        
        // Loading animation
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        emailjs.sendForm('service_rwuakgg', 'template_q9vm74s', this)
            .then(function(response) {
                alert('🎉 Message sent to tanishshriyan1@gmail.com!');
                contactForm.reset();
            }, function(error) {
                alert('❌ Failed to send. Email me directly: tanishshriyan1@gmail.com');
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
}


    // 8. PERFECT PAGE LOAD
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
});
