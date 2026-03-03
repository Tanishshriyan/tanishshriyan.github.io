/* ═══════════════════════════════════════════════════
   TANISH SHRIYAN — PORTFOLIO SCRIPT
   Performance-first: GPU-only animations, touch-aware,
   debounced scroll, passive listeners throughout.
   ═══════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ── DEVICE DETECTION ──────────────────────────────
    const isTouchDevice = () =>
        window.matchMedia('(hover: none)').matches || navigator.maxTouchPoints > 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── LOADER ────────────────────────────────────────
    const loader    = document.getElementById('loader');
    const loaderBar = document.getElementById('loaderBar');
    const loaderLabel = document.getElementById('loaderLabel');

    const loaderSteps = [
        { pct: 30,  label: 'Loading assets...' },
        { pct: 65,  label: 'Building interface...' },
        { pct: 90,  label: 'Almost ready...' },
        { pct: 100, label: 'Welcome.' },
    ];

    let stepIdx = 0;
    function runLoaderStep() {
        if (stepIdx >= loaderSteps.length) return;
        const s = loaderSteps[stepIdx++];
        loaderBar.style.width = s.pct + '%';
        loaderLabel.textContent = s.label;
        if (stepIdx < loaderSteps.length) setTimeout(runLoaderStep, 550);
    }

    // Kick off bar animation on next tick so CSS transition fires
    requestAnimationFrame(() => {
        requestAnimationFrame(runLoaderStep);
    });

    function hideLoader() {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initRevealObserver();   // Start observing reveals after load
    }

    // Hide loader: whichever comes last — page load OR minimum delay
    const minDelay = prefersReducedMotion ? 100 : 2800;
    let pageLoaded = false, delayDone = false;

    window.addEventListener('load', () => {
        pageLoaded = true;
        if (delayDone) hideLoader();
    });
    setTimeout(() => {
        delayDone = true;
        if (pageLoaded) hideLoader();
    }, minDelay);

    // Prevent scroll flash during load
    document.body.style.overflow = 'hidden';


    // ── CUSTOM CURSOR (desktop only) ──────────────────
    if (!isTouchDevice() && !prefersReducedMotion) {
        const dot  = document.getElementById('curDot');
        const ring = document.getElementById('curRing');

        let rx = 0, ry = 0;          // ring position (lerped)
        let tx = 0, ty = 0;          // target position
        let rafId = null;

        document.addEventListener('mousemove', (e) => {
            tx = e.clientX;
            ty = e.clientY;
            // Dot follows immediately
            dot.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
        }, { passive: true });

        function animateRing() {
            // Smooth lerp for ring
            rx += (tx - rx) * 0.12;
            ry += (ty - ry) * 0.12;
            ring.style.transform = `translate(calc(-50% + ${rx}px), calc(-50% + ${ry}px))`;
            rafId = requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover state
        const hoverEls = document.querySelectorAll(
            'a, button, .sk-card, .clink:not(.no-hover), .social-btn, .vis-core'
        );
        hoverEls.forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
        });

        // Hide on leave / show on enter
        document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
    }


    // ── TYPING ANIMATION ─────────────────────────────
    const typingEl = document.getElementById('typingText');
    if (typingEl) {
        const phrases = [
            'Cybersecurity Enthusiast',
            'ML Developer',
            'Full-Stack Developer',
            'Pentester',
            'Problem Solver',
        ];
        let pIdx = 0, cIdx = 0, deleting = false;
        let typingTimer = null;

        function typeNext() {
            const phrase = phrases[pIdx];

            if (!deleting) {
                cIdx++;
                typingEl.textContent = phrase.substring(0, cIdx);
                if (cIdx === phrase.length) {
                    deleting = true;
                    typingTimer = setTimeout(typeNext, 2200);
                    return;
                }
            } else {
                cIdx--;
                typingEl.textContent = phrase.substring(0, cIdx);
                if (cIdx === 0) {
                    deleting = false;
                    pIdx = (pIdx + 1) % phrases.length;
                }
            }
            typingTimer = setTimeout(typeNext, deleting ? 45 : 95);
        }

        setTimeout(typeNext, 1200);
    }


    // ── NAVIGATION ────────────────────────────────────
    const nav       = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks  = document.getElementById('navLinks');
    const allNavLinks = document.querySelectorAll('.nav-link');

    // Scroll class
    let lastScrollY = window.scrollY;
    function handleNavScroll() {
        nav.classList.toggle('scrolled', window.scrollY > 50);
        lastScrollY = window.scrollY;
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', open);
    });

    // Close menu on link click
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Smooth scroll with offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY
                        - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '70');
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
        const scrollMid = window.scrollY + window.innerHeight / 3;
        let active = '';
        sections.forEach(sec => {
            if (sec.offsetTop <= scrollMid) active = sec.id;
        });
        allNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${active}`);
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();


    // ── SCROLL REVEAL ─────────────────────────────────
    function initRevealObserver() {
        if (prefersReducedMotion) {
            document.querySelectorAll('.reveal-up, .reveal-scale').forEach(el => {
                el.classList.add('visible');
            });
            initSkillBars();
            return;
        }

        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal-up, .reveal-scale').forEach(el => {
            revealObs.observe(el);
        });

        // Skill bars via separate observer
        initSkillBars();
    }


    // ── SKILL BARS ────────────────────────────────────
    function initSkillBars() {
        const barObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.sb-fill').forEach(fill => {
                        const w = fill.getAttribute('data-w');
                        if (w) fill.style.width = w + '%';
                    });
                    barObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.sk-card').forEach(card => barObs.observe(card));
    }


    // ── CONTACT FORM ──────────────────────────────────
    const form       = document.getElementById('contactForm');
    const submitBtn  = document.getElementById('submitBtn');

    if (form && submitBtn) {
        // Init EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init('hrJVDoDspXKX-wgyR');
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Honeypot check
            if (form.website && form.website.value) {
                return; // silent fail for bots
            }

            const btnText = submitBtn.querySelector('.fs-text');
            const btnIcon = submitBtn.querySelector('.fs-icon');

            submitBtn.disabled = true;
            if (btnText) btnText.textContent = 'Sending...';
            if (btnIcon) btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            if (typeof emailjs === 'undefined') {
                showFormFeedback('EmailJS not loaded. Please email directly: tanishshriyan1@gmail.com', 'error');
                resetBtn(btnText, btnIcon);
                return;
            }

            emailjs.sendForm('service_rwuakgg', 'template_q9vm74s', form)
                .then(() => {
                    showFormFeedback('Message sent! I\'ll get back to you soon.', 'success');
                    form.reset();
                })
                .catch(() => {
                    showFormFeedback('Something went wrong. Email me directly: tanishshriyan1@gmail.com', 'error');
                })
                .finally(() => {
                    resetBtn(btnText, btnIcon);
                });
        });

        function resetBtn(btnText, btnIcon) {
            submitBtn.disabled = false;
            if (btnText) btnText.textContent = 'Send Message';
            if (btnIcon) btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
        }

        function showFormFeedback(message, type) {
            // Remove old feedback
            const old = form.querySelector('.form-feedback');
            if (old) old.remove();

            const fb = document.createElement('div');
            fb.className = 'form-feedback';
            fb.textContent = message;
            fb.style.cssText = `
                padding: 0.75rem 1rem;
                border-radius: 8px;
                font-size: 0.85rem;
                margin-top: 0.5rem;
                border: 1px solid ${type === 'success' ? 'rgba(0,210,255,0.3)' : 'rgba(255,80,80,0.3)'};
                background: ${type === 'success' ? 'rgba(0,210,255,0.08)' : 'rgba(255,80,80,0.08)'};
                color: ${type === 'success' ? '#00D2FF' : '#FF6060'};
            `;
            form.appendChild(fb);
            setTimeout(() => fb.remove(), 6000);
        }
    }


    // ── VISUAL CORE INTERACTION ───────────────────────
    // Tilt the visual rings subtly on mouse move (desktop only)
    if (!isTouchDevice() && !prefersReducedMotion) {
        const visWrap = document.querySelector('.vis-wrap');
        if (visWrap) {
            const handleTilt = (e) => {
                const rect = visWrap.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);
                visWrap.style.transform = `perspective(800px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg)`;
            };
            const handleLeave = () => {
                visWrap.style.transform = '';
            };
            visWrap.addEventListener('mousemove', handleTilt, { passive: true });
            visWrap.addEventListener('mouseleave', handleLeave);
        }
    }

})();
