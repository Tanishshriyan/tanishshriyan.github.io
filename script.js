/* ═══════════════════════════════════════════════════════════════
   TANISH SHRIYAN PORTFOLIO — CINEMATIC EDITION
   Script v3.0
═══════════════════════════════════════════════════════════════ */

/* ─── 1. CINEMATIC LOADING SCREEN ───────────────────────────── */
(function initLoader() {
    const screen = document.getElementById('loadingScreen');
    if (!screen) return;

    // Canvas particle rain
    const canvas = document.getElementById('loadCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01アイウエオカキクケコサシスセソ<>{}[]|/\\;:.@#$%^&*';
    const columns = Math.floor(canvas.width / 16);
    const drops = Array(columns).fill(0).map(() => Math.random() * -50);

    function drawRain() {
        ctx.fillStyle = 'rgba(2,5,15,0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '13px JetBrains Mono, monospace';

        drops.forEach((y, i) => {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const intensity = Math.random();
            ctx.fillStyle = intensity > 0.97 ? '#ffffff' :
                            intensity > 0.85 ? `rgba(0,229,255,${intensity})` :
                            `rgba(0,180,200,${intensity * 0.4})`;
            ctx.fillText(char, i * 16, y * 16);
            if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i] += 0.5;
        });
    }

    const rainInterval = setInterval(drawRain, 40);

    // Keyboard key lighting
    const keys = document.querySelectorAll('.kb-key');
    keys.forEach(k => {
        const delay = parseInt(k.getAttribute('data-delay')) || 0;
        setTimeout(() => {
            k.classList.add('lit');
            setTimeout(() => k.classList.remove('lit'), 300);
        }, delay + 500);
    });

    // Keyboard key wave — repeat
    function keyWave() {
        keys.forEach((k, i) => {
            setTimeout(() => {
                k.classList.add('lit');
                setTimeout(() => k.classList.remove('lit'), 200);
            }, i * 80);
        });
    }
    setTimeout(() => { keyWave(); setInterval(keyWave, 3000); }, 1500);

    // Terminal lines reveal
    const lines = document.querySelectorAll('.lt-line');
    const bar = document.getElementById('ltBar');
    const pct = document.getElementById('ltPct');
    const totalLines = lines.length;

    lines.forEach((line, i) => {
        const progress = Math.round(((i + 1) / totalLines) * 100);
        setTimeout(() => {
            line.classList.add('visible');
            if (bar && pct) {
                bar.style.setProperty('--p', progress + '%');
                pct.textContent = progress + '%';
            }
        }, 600 + i * 600);
    });

    // Mouse click animation – random intervals
    function triggerMouseClick() {
        const mouseEl = document.querySelector('.mouse-click-ring');
        if (mouseEl) {
            mouseEl.style.animation = 'none';
            void mouseEl.offsetWidth;
            mouseEl.style.animation = '';
        }
        setTimeout(triggerMouseClick, 1500 + Math.random() * 2000);
    }
    setTimeout(triggerMouseClick, 2000);

    // Exit loading screen
    const exitDelay = 4500;
    setTimeout(() => {
        clearInterval(rainInterval);
        screen.classList.add('exit');
        document.body.style.overflow = '';
        setTimeout(() => screen.remove(), 1300);
    }, exitDelay);

    document.body.style.overflow = 'hidden';
})();

/* ─── 2. CUSTOM CURSOR ──────────────────────────────────────── */
(function initCursor() {
    const outer = document.getElementById('cursorOuter');
    const dot   = document.getElementById('cursorDot');
    if (!outer || !dot) return;

    let mx = 0, my = 0;
    let ox = 0, oy = 0;
    let frame;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;

        // Dot follows instantly
        dot.style.left  = mx + 'px';
        dot.style.top   = my + 'px';
    });

    // Outer ring follows smoothly
    function animateCursor() {
        ox += (mx - ox) * 0.12;
        oy += (my - oy) * 0.12;
        outer.style.left = (ox - 18) + 'px';
        outer.style.top  = (oy - 18) + 'px';
        frame = requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states
    function addHoverListeners() {
        document.querySelectorAll('a, button, .btn, .social-icon, .project-card, .skill-category, .contact-item, .tilt-card, .theme-toggle')
            .forEach(el => {
                el.addEventListener('mouseenter', () => outer.classList.add('hover'));
                el.addEventListener('mouseleave', () => outer.classList.remove('hover'));
            });
    }
    addHoverListeners();

    // Click effect
    document.addEventListener('mousedown', () => outer.classList.add('click'));
    document.addEventListener('mouseup',   () => outer.classList.remove('click'));

    // Trailing sparkles
    let sparkCount = 0;
    document.addEventListener('mousemove', e => {
        if (++sparkCount % 5 !== 0) return;
        const spark = document.createElement('div');
        spark.style.cssText = `
            position:fixed;
            left:${e.clientX - 2}px;
            top:${e.clientY - 2}px;
            width:4px;height:4px;
            border-radius:50%;
            background:var(--accent);
            box-shadow:0 0 6px var(--accent);
            pointer-events:none;
            z-index:99990;
            animation:sparkFade 0.6s ease forwards;
        `;
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 600);
    });

    // Inject sparkle keyframe
    const style = document.createElement('style');
    style.textContent = '@keyframes sparkFade{0%{transform:scale(1);opacity:0.8}100%{transform:scale(0) translate(0,-15px);opacity:0}}';
    document.head.appendChild(style);
})();

/* ─── 3. THEME TOGGLE ───────────────────────────────────────── */
(function initTheme() {
    const btn = document.getElementById('themeToggle');
    const html = document.documentElement;
    const stored = localStorage.getItem('portfolio-theme') || 'dark';
    html.setAttribute('data-theme', stored);

    btn?.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('portfolio-theme', next);

        // Quick flash effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position:fixed;inset:0;
            background:${next === 'light' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'};
            z-index:9990;pointer-events:none;
            animation:themeFlash 0.4s ease forwards;
        `;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 400);
    });

    const style = document.createElement('style');
    style.textContent = '@keyframes themeFlash{0%{opacity:1}100%{opacity:0}}';
    document.head.appendChild(style);
})();

/* ─── 4. BACKGROUND CANVAS (PARTICLE NETWORK) ──────────────── */
(function initBgCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = 60;
    const MAX_DIST = 150;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1
    }));

    function getColor(alpha) {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'light'
            ? `rgba(0,119,204,${alpha})`
            : `rgba(0,229,255,${alpha})`;
    }

    function drawBg() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = getColor(0.5);
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x, dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = getColor((1 - dist / MAX_DIST) * 0.15);
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(drawBg);
    }
    drawBg();
})();

/* ─── 5. CINEMATIC PERSPECTIVE SCROLL ───────────────────────── */
(function initPerspectiveScroll() {
    const sections = document.querySelectorAll('.perspective-section');

    // Parallax depth planes
    const DEPTH_MULTIPLIERS = [0, 0.03, 0.06, 0.09, 0.12];

    // Observer for section in-view
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Re-trigger reveal animations inside
                entry.target.querySelectorAll('.section-title, .reveal-up, .reveal-right').forEach((el, i) => {
                    setTimeout(() => el.classList.add('animate'), i * 100);
                });
            }
        });
    }, { threshold: 0.15 });

    sections.forEach(sec => observer.observe(sec));

    // Parallax on scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
                const vh = window.innerHeight;

                sections.forEach((sec, idx) => {
                    const rect = sec.getBoundingClientRect();
                    const center = rect.top + rect.height / 2 - vh / 2;
                    const depthMult = DEPTH_MULTIPLIERS[idx] || 0;

                    // 3D perspective tilt based on scroll position
                    const tilt = Math.max(-6, Math.min(6, center * depthMult * 0.8));
                    const translateZ = Math.max(-30, Math.min(30, -center * depthMult * 0.3));
                    const opacity = 1 - Math.abs(center) / (vh * 1.5);

                    sec.style.transform = `
                        perspective(1200px)
                        rotateX(${tilt}deg)
                        translateZ(${translateZ}px)
                    `;
                    sec.style.opacity = Math.max(0.3, opacity);
                });

                // Navbar active link
                const navLinks = document.querySelectorAll('.nav-link');
                let current = '';
                sections.forEach(sec => {
                    if (scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
                });
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
                });

                // Navbar scroll style
                const navbar = document.getElementById('navbar');
                if (navbar) {
                    navbar.classList.toggle('scrolled', scrollY > 50);
                }

                ticking = false;
            });
            ticking = true;
        }
    });
})();

/* ─── 6. 3D TILT CARDS ──────────────────────────────────────── */
(function initTiltCards() {
    function applyTilt(card) {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            const rotX = -y * 12;
            const rotY =  x * 12;
            card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
            card.style.boxShadow = `${-rotY * 2}px ${rotX * 2}px 40px var(--accent-glow)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            card.style.boxShadow = '';
            card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
            setTimeout(() => { card.style.transition = ''; }, 500);
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    }

    document.querySelectorAll('.tilt-card').forEach(applyTilt);
})();

/* ─── 7. SCROLL REVEAL (GENERAL) ───────────────────────────── */
(function initScrollReveal() {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('animate'), i * 120);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.scroll-reveal, .section-title').forEach(el => {
        revealObserver.observe(el);
    });
})();

/* ─── 8. SKILL BAR ANIMATION ────────────────────────────────── */
(function initSkillBars() {
    const skillObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.getAttribute('style').match(/width:\s*(\d+)%/)?.[1] || '0';
                bar.style.width = '0%';
                requestAnimationFrame(() => {
                    setTimeout(() => { bar.style.width = targetWidth + '%'; }, 200);
                });
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill-progress').forEach(bar => skillObserver.observe(bar));
})();

/* ─── 9. COUNTER ANIMATION ──────────────────────────────────── */
(function initCounters() {
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                const duration = 1500;
                const step = target / (duration / 16);
                let current = 0;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) { current = target; clearInterval(timer); }
                    el.textContent = Math.floor(current);
                }, 16);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));
})();

/* ─── 10. TYPING ANIMATION ──────────────────────────────────── */
(function initTyping() {
    const typingEl = document.querySelector('.typing-text');
    if (!typingEl) return;

    const texts = ['Cybersecurity Enthusiast', 'ML Developer', 'Full-Stack Developer', 'Pentester', 'Problem Solver'];
    let idx = 0, charIdx = 0, deleting = false;

    function type() {
        const current = texts[idx];
        if (deleting) {
            typingEl.textContent = current.substring(0, --charIdx);
        } else {
            typingEl.textContent = current.substring(0, ++charIdx);
        }

        if (!deleting && charIdx === current.length) {
            deleting = true;
            return setTimeout(type, 2200);
        }
        if (deleting && charIdx === 0) {
            deleting = false;
            idx = (idx + 1) % texts.length;
        }

        setTimeout(type, deleting ? 45 : 95);
    }

    setTimeout(type, 1200);
})();

/* ─── 11. NAVBAR — MOBILE MENU ──────────────────────────────── */
(function initNav() {
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');

    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 75, behavior: 'smooth' });
            }
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
})();

/* ─── 12. CONTACT FORM ──────────────────────────────────────── */
(function initForm() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init("hrJVDoDspXKX-wgyR");
    }

    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        if (form.website?.value) return;

        const btn = form.querySelector('.btn-submit');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        if (typeof emailjs === 'undefined') {
            setTimeout(() => {
                alert('Email service not loaded. Please email tanishshriyan1@gmail.com directly.');
                btn.innerHTML = orig;
                btn.disabled = false;
            }, 1000);
            return;
        }

        emailjs.sendForm('service_rwuakgg', 'template_q9vm74s', form)
            .then(() => {
                showToast('🎉 Message sent successfully!', 'success');
                form.reset();
            })
            .catch(() => {
                showToast('❌ Failed. Email me: tanishshriyan1@gmail.com', 'error');
            })
            .finally(() => {
                btn.innerHTML = orig;
                btn.disabled = false;
            });
    });
})();

/* ─── TOAST NOTIFICATION ────────────────────────────────────── */
function showToast(msg, type) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position:fixed;bottom:2rem;right:2rem;
        padding:1rem 1.5rem;border-radius:12px;
        background:${type === 'success' ? 'rgba(0,255,136,0.15)' : 'rgba(247,37,133,0.15)'};
        border:1.5px solid ${type === 'success' ? '#00ff88' : '#f72585'};
        color:${type === 'success' ? '#00ff88' : '#f72585'};
        font-family:'Space Grotesk',sans-serif;font-size:0.95rem;
        z-index:99999;backdrop-filter:blur(20px);
        animation:toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
        max-width:360px;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);

    const s = document.createElement('style');
    s.textContent = '@keyframes toastIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}';
    document.head.appendChild(s);

    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.4s'; setTimeout(() => toast.remove(), 400); }, 4000);
}

/* ─── 13. BODY LOADED STATE ─────────────────────────────────── */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
