// Ladeen Cafe — premium interaction system
window.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const intro = document.querySelector(".intro");

  function initLenis() {
    if (reduceMotion || !window.Lenis || !window.gsap) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function initOpening() {
    if (reduceMotion || !window.gsap) { intro?.remove(); return; }
    gsap.timeline({ onComplete: () => intro?.remove() })
      .from(".intro-name span", { y: 120, opacity: 0, duration: 1.05, ease: "power4.out" })
      .from(".intro-name i", { opacity: 0, y: 20, duration: .65 }, "-=.45")
      .to(".intro-line", { width: "84vw", duration: .75, ease: "power2.inOut" }, "-=.45")
      .to(".intro", { yPercent: -100, duration: 1.05, ease: "power4.inOut", delay: .12 });
  }

  function initHeroParallax() {
    if (reduceMotion) return;
    gsap.to(".hero-media", {
      yPercent: 22, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(".hero-copy", {
      yPercent: 30, opacity: .25, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  function initEditorialIntro() {
    if (reduceMotion) return;
    gsap.from(".statement h2", {
      y: 80, opacity: 0, ease: "none",
      scrollTrigger: { trigger: ".statement", start: "top 78%", end: "center 52%", scrub: 1 }
    });
  }

  function initPinnedReveal() {
    if (reduceMotion) return;
    gsap.matchMedia().add({
      desktop: "(min-width: 761px)",
      mobile: "(max-width: 760px)"
    }, (ctx) => {
      const desktop = ctx.conditions.desktop;
      gsap.fromTo(".cinema-img",
        { scale: desktop ? .62 : .84, borderRadius: desktop ? "2px" : "0px" },
        {
          scale: 1, borderRadius: "0px", ease: "none",
          scrollTrigger: {
            trigger: ".cinema", start: "top top", end: "bottom bottom",
            scrub: 1, invalidateOnRefresh: true
          }
        }
      );
    });
  }

  function initHorizontalScroll() {
    if (reduceMotion) return;
    gsap.matchMedia().add("(min-width: 761px)", () => {
      const track = document.querySelector(".track");
      const distance = () => Math.max(0, track.scrollWidth - innerWidth);
      gsap.to(track, {
        x: () => -distance(), ease: "none",
        scrollTrigger: {
          trigger: ".selection", start: "top top", end: () => "+=" + distance(),
          pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
        }
      });
    });
  }

  function initMouseLayer() {
    if (reduceMotion || !finePointer) return;
    const hero = document.querySelector(".hero");
    const media = document.querySelector(".hero-media");
    if (hero && media) {
      hero.addEventListener("pointermove", (e) => {
        const x = (e.clientX / innerWidth - .5) * 12;
        const y = (e.clientY / innerHeight - .5) * 8;
        gsap.to(media, { x, y, duration: 1.2, ease: "power3.out", overwrite: "auto" });
      });
      hero.addEventListener("pointerleave", () => gsap.to(media, { x: 0, y: 0, duration: 1.1, ease: "power3.out" }));
    }
    document.querySelectorAll(".item-img").forEach(img => {
      img.addEventListener("pointerenter", () => gsap.to(img, { scale: 1.04, duration: .7, ease: "power3.out" }));
      img.addEventListener("pointerleave", () => gsap.to(img, { scale: 1, duration: .7, ease: "power3.out" }));
    });
  }

  function initNavigation() {
    const header = document.querySelector(".header");
    addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 80), { passive: true });
    const menu = document.querySelector(".menu");
    const nav = document.querySelector(".mobile-nav");
    const close = () => {
      nav.classList.remove("open"); nav.setAttribute("aria-hidden", "true"); document.body.style.overflow = "";
    };
    menu.addEventListener("click", () => {
      nav.classList.add("open"); nav.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
    });
    nav.querySelector("button").addEventListener("click", close);
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
  }

  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);
    initLenis();
    initOpening();
    initHeroParallax();
    initEditorialIntro();
    initPinnedReveal();
    initHorizontalScroll();
    initMouseLayer();
  } else intro?.remove();
  initNavigation();
});