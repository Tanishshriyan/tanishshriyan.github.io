const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");

function closeMobileMenu() {
  mobileMenu.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
}

hamburger.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("click", (event) => {
  if (!mobileMenu.classList.contains("open")) return;
  if (hamburger.contains(event.target) || mobileMenu.contains(event.target)) return;
  closeMobileMenu();
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => {
    item.classList.add("visible");
  });
}

function updateActiveNav() {
  let current = "";

  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 130) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

updateActiveNav();
window.addEventListener("scroll", updateActiveNav, { passive: true });

const certTrack = document.getElementById("certTrack");
const certDotsWrap = document.getElementById("certDots");
const certPrevBtn = document.getElementById("certPrev");
const certNextBtn = document.getElementById("certNext");

if (certTrack) {
  const certCards = Array.from(certTrack.children);
  const total = certCards.length;
  let activeIndex = 0;

  certCards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "cert-dot";
    dot.setAttribute("aria-label", `Go to certificate ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    certDotsWrap.appendChild(dot);
  });
  const certDots = Array.from(certDotsWrap.children);

  function render() {
    certCards.forEach((card, i) => {
      let offset = i - activeIndex;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      let pos = "hidden";
      if (offset === 0) pos = "center";
      else if (offset === -1) pos = "left1";
      else if (offset === 1) pos = "right1";
      else if (offset === -2) pos = "left2";
      else if (offset === 2) pos = "right2";

      card.dataset.pos = pos;
    });

    certDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === activeIndex);
    });
  }

  function goTo(index) {
    activeIndex = ((index % total) + total) % total;
    render();
  }

  certPrevBtn.addEventListener("click", () => goTo(activeIndex - 1));
  certNextBtn.addEventListener("click", () => goTo(activeIndex + 1));

  certCards.forEach((card, i) => {
    card.addEventListener("click", () => goTo(i));
  });

  let touchStartX = null;
  const stage = document.getElementById("certStage");
  stage.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  });
  stage.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) {
      goTo(activeIndex + (delta < 0 ? 1 : -1));
    }
    touchStartX = null;
  });

  render();
}
