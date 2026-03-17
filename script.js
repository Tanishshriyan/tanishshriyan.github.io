(function () {
    "use strict";

    const root = document.documentElement;
    const isTouchDevice = () =>
        window.matchMedia("(hover: none)").matches || navigator.maxTouchPoints > 0;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function getActiveTheme() {
        return root.getAttribute("data-theme") || "light";
    }

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        const themeToggle = document.getElementById("themeToggle");
        if (themeToggle) {
            const isDark = theme === "dark";
            themeToggle.setAttribute("aria-pressed", String(isDark));
            themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
            themeToggle.setAttribute("title", isDark ? "Light mode" : "Dark mode");
        }
    }

    applyTheme(getActiveTheme());

    const loader = document.getElementById("loader");
    const loaderBar = document.getElementById("loaderBar");
    const loaderLabel = document.getElementById("loaderLabel");

    const loaderSteps = [
        { pct: 35, label: "Loading..." },
        { pct: 70, label: "Preparing page..." },
        { pct: 100, label: "Ready" }
    ];

    let stepIdx = 0;

    function runLoaderStep() {
        if (stepIdx >= loaderSteps.length) {
            return;
        }

        const step = loaderSteps[stepIdx++];
        loaderBar.style.width = step.pct + "%";
        loaderLabel.textContent = step.label;

        if (stepIdx < loaderSteps.length) {
            setTimeout(runLoaderStep, 550);
        }
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(runLoaderStep);
    });

    function hideLoader() {
        loader.classList.add("hidden");
        document.body.style.overflow = "";
        initRevealObserver();
    }

    const minDelay = prefersReducedMotion ? 100 : 2200;
    let pageLoaded = false;
    let delayDone = false;

    window.addEventListener("load", () => {
        pageLoaded = true;
        if (delayDone) {
            hideLoader();
        }
    });

    setTimeout(() => {
        delayDone = true;
        if (pageLoaded) {
            hideLoader();
        }
    }, minDelay);

    document.body.style.overflow = "hidden";

    if (!isTouchDevice() && !prefersReducedMotion) {
        const dot = document.getElementById("curDot");
        const ring = document.getElementById("curRing");

        let rx = 0;
        let ry = 0;
        let tx = 0;
        let ty = 0;

        document.addEventListener("mousemove", (event) => {
            tx = event.clientX;
            ty = event.clientY;
            dot.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
        }, { passive: true });

        function animateRing() {
            rx += (tx - rx) * 0.12;
            ry += (ty - ry) * 0.12;
            ring.style.transform = `translate(calc(-50% + ${rx}px), calc(-50% + ${ry}px))`;
            requestAnimationFrame(animateRing);
        }

        animateRing();

        const hoverEls = document.querySelectorAll(
            "a, button, .sk-card, .clink:not(.no-hover), .social-btn, .vis-core"
        );

        hoverEls.forEach((el) => {
            el.addEventListener("mouseenter", () => ring.classList.add("hovering"));
            el.addEventListener("mouseleave", () => ring.classList.remove("hovering"));
        });

        document.addEventListener("mouseleave", () => {
            dot.style.opacity = "0";
            ring.style.opacity = "0";
        });

        document.addEventListener("mouseenter", () => {
            dot.style.opacity = "1";
            ring.style.opacity = "1";
        });
    }

    const typingEl = document.getElementById("typingText");

    if (typingEl) {
        const phrases = [
            "Cybersecurity student",
            "Machine learning projects",
            "Backend development",
            "Security-focused systems"
        ];

        let pIdx = 0;
        let cIdx = 0;
        let deleting = false;

        function typeNext() {
            const phrase = phrases[pIdx];

            if (!deleting) {
                cIdx += 1;
                typingEl.textContent = phrase.substring(0, cIdx);

                if (cIdx === phrase.length) {
                    deleting = true;
                    setTimeout(typeNext, 1800);
                    return;
                }
            } else {
                cIdx -= 1;
                typingEl.textContent = phrase.substring(0, cIdx);

                if (cIdx === 0) {
                    deleting = false;
                    pIdx = (pIdx + 1) % phrases.length;
                }
            }

            setTimeout(typeNext, deleting ? 45 : 85);
        }

        setTimeout(typeNext, 900);
    }

    const nav = document.getElementById("nav");
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
    const themeToggle = document.getElementById("themeToggle");
    const allNavLinks = document.querySelectorAll(".nav-link");

    function handleNavScroll() {
        nav.classList.toggle("scrolled", window.scrollY > 32);
    }

    window.addEventListener("scroll", handleNavScroll, { passive: true });
    handleNavScroll();

    navToggle.addEventListener("click", () => {
        const open = navLinks.classList.toggle("open");
        navToggle.classList.toggle("open", open);
        navToggle.setAttribute("aria-expanded", open);
    });

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const nextTheme = getActiveTheme() === "dark" ? "light" : "dark";
            applyTheme(nextTheme);
            try {
                localStorage.setItem("theme", nextTheme);
            } catch (error) {
                // Ignore storage failures and keep the in-memory theme.
            }
        });
    }

    systemThemeQuery.addEventListener("change", (event) => {
        try {
            if (!localStorage.getItem("theme")) {
                applyTheme(event.matches ? "dark" : "light");
            }
        } catch (error) {
            applyTheme(event.matches ? "dark" : "light");
        }
    });

    allNavLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            navToggle.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (event) {
            const target = document.querySelector(this.getAttribute("href"));
            if (!target) {
                return;
            }

            event.preventDefault();
            const offset = parseInt(
                getComputedStyle(document.documentElement).getPropertyValue("--nav-h") || "72",
                10
            );
            const top = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({ top, behavior: "smooth" });
        });
    });

    const sections = document.querySelectorAll("section[id]");

    function updateActiveNav() {
        const scrollMid = window.scrollY + window.innerHeight / 3;
        let active = "";

        sections.forEach((section) => {
            if (section.offsetTop <= scrollMid) {
                active = section.id;
            }
        });

        allNavLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${active}`);
        });
    }

    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav();

    function initRevealObserver() {
        if (prefersReducedMotion) {
            document.querySelectorAll(".reveal-up, .reveal-scale").forEach((el) => {
                el.classList.add("visible");
            });
            return;
        }

        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        document.querySelectorAll(".reveal-up, .reveal-scale").forEach((el) => {
            revealObs.observe(el);
        });
    }

    const form = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");

    if (form && submitBtn) {
        if (typeof emailjs !== "undefined") {
            emailjs.init("hrJVDoDspXKX-wgyR");
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            if (form.website && form.website.value) {
                return;
            }

            const btnText = submitBtn.querySelector(".fs-text");
            const btnIcon = submitBtn.querySelector(".fs-icon");

            submitBtn.disabled = true;
            if (btnText) {
                btnText.textContent = "Sending...";
            }
            if (btnIcon) {
                btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            }

            if (typeof emailjs === "undefined") {
                showFormFeedback("EmailJS not loaded. Please email directly: tanishshriyan1@gmail.com", "error");
                resetBtn(btnText, btnIcon);
                return;
            }

            emailjs.sendForm("service_rwuakgg", "template_q9vm74s", form)
                .then(() => {
                    showFormFeedback("Message sent. I will get back to you soon.", "success");
                    form.reset();
                })
                .catch(() => {
                    showFormFeedback("Something went wrong. Email me directly: tanishshriyan1@gmail.com", "error");
                })
                .finally(() => {
                    resetBtn(btnText, btnIcon);
                });
        });

        function resetBtn(btnText, btnIcon) {
            submitBtn.disabled = false;
            if (btnText) {
                btnText.textContent = "Send Message";
            }
            if (btnIcon) {
                btnIcon.innerHTML = '<i class="fas fa-paper-plane"></i>';
            }
        }

        function showFormFeedback(message, type) {
            const old = form.querySelector(".form-feedback");
            if (old) {
                old.remove();
            }

            const feedback = document.createElement("div");
            feedback.className = "form-feedback";
            feedback.textContent = message;
            feedback.style.cssText = `
                padding: 0.8rem 1rem;
                border-radius: 16px;
                font-size: 0.85rem;
                margin-top: 0.4rem;
                border: 1px solid ${type === "success" ? "rgba(32, 73, 58, 0.18)" : "rgba(163, 59, 45, 0.2)"};
                background: ${type === "success" ? "rgba(32, 73, 58, 0.08)" : "rgba(163, 59, 45, 0.08)"};
                color: ${type === "success" ? "#20493a" : "#8a3226"};
            `;
            form.appendChild(feedback);
            setTimeout(() => feedback.remove(), 6000);
        }
    }

    if (!isTouchDevice() && !prefersReducedMotion) {
        const visWrap = document.querySelector(".vis-wrap");

        if (visWrap) {
            const handleTilt = (event) => {
                const rect = visWrap.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (event.clientX - cx) / (rect.width / 2);
                const dy = (event.clientY - cy) / (rect.height / 2);
                visWrap.style.transform = `perspective(900px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg)`;
            };

            const handleLeave = () => {
                visWrap.style.transform = "";
            };

            visWrap.addEventListener("mousemove", handleTilt, { passive: true });
            visWrap.addEventListener("mouseleave", handleLeave);
        }
    }
}());
