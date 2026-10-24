"use strict";

(() => {
  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ===== Mobile menu =====
  const menuToggle = $("menuToggle");
  const mainNav = $("mainNav");

  menuToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  mainNav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => mainNav.classList.remove("open"))
  );

  // ===== Header colour + back to top =====
  const header = $("siteHeader");
  const toTop = $("toTop");

  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 40);
    toTop.classList.toggle("show", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0 }));

  // ===== Hero slider =====
  const hero = $("hero");
  const slides = Array.from(hero.querySelectorAll(".slide"));
  const dotsEl = $("dots");
  let index = 0;
  let timer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Show slide ${i + 1}`);
    dot.addEventListener("click", () => { goTo(i); restart(); });
    dotsEl.appendChild(dot);
  });
  const dots = Array.from(dotsEl.children);

  function goTo(i) {
    slides[index].classList.remove("active");
    dots[index].classList.remove("active");
    index = (i + slides.length) % slides.length;
    slides[index].classList.add("active");
    dots[index].classList.add("active");
  }

  function start() { if (!reduceMotion) timer = setInterval(() => goTo(index + 1), 6500); }
  function stop() { clearInterval(timer); }
  function restart() { stop(); start(); }

  $("prevSlide").addEventListener("click", () => { goTo(index - 1); restart(); });
  $("nextSlide").addEventListener("click", () => { goTo(index + 1); restart(); });
  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", start);
  start();

  // ===== Stats count-up (runs once when visible) =====
  const counters = document.querySelectorAll("[data-count]");

  function animateCount(el) {
    const target = Number(el.dataset.count);
    const plus = el.dataset.plus ? "+" : "";

    if (reduceMotion) { el.textContent = target + plus; return; }

    const duration = 1200;
    const startTime = performance.now();

    function tick(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (p === 1 ? plus : "");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => io.observe(c));
  } else {
    counters.forEach(animateCount);
  }
})();