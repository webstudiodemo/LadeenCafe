// Ladeen Cafe — premium interaction system
window.addEventListener("DOMContentLoaded", () => {
  const intro = document.querySelector(".intro");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // The intro can never block the website indefinitely.
  const introFailsafe = window.setTimeout(() => intro?.remove(), 3500);

  function initOpening() {
    if (!intro) return;
    if (reduceMotion || !window.gsap) {
      window.clearTimeout(introFailsafe);
      intro.remove();
      return;
    }
    gsap.timeline({
      onComplete: () => {
        window.clearTimeout(introFailsafe);
        intro.remove();
      }
    })
    .from(".intro-name span", { y: 110, opacity: 0, duration: 1, ease: "power4.out" })
    .from(".intro-name i", { y: 18, opacity: 0, duration: .55 }, "-=.4")
    .to(".intro-line", { width: "84vw", duration: .65, ease: "power2.inOut" }, "-=.35")
    .to(intro, { yPercent: -100, duration: .9, delay: .1, ease: "power4.inOut" });
  }

  function initLenis() {
    if (reduceMotion || !window.Lenis || !window.ScrollTrigger) return;
    try {
      const lenis = new Lenis({ duration: .72, smoothWheel: true, wheelMultiplier: 1 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } catch (error) {
      console.warn("Smooth scroll disabled.", error);
    }
  }

  function initScrollScenes() {
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;
    gsap.to(".hero-media", {
      yPercent: 22, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(".ref-cup", {
      yPercent: -14, scale: 1.12, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(".ref-word", {
      scale: 1.08, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.from(".ref-square", {
      y: 120, ease: "none",
      scrollTrigger: { trigger: ".statement", start: "top bottom", end: "bottom top", scrub: 1 }
    });

    gsap.matchMedia().add({
      desktop: "(min-width: 761px)",
      mobile: "(max-width: 760px)"
    }, context => {
      const desktop = context.conditions.desktop;
      gsap.fromTo(".cinema-img",
        {
          scale: desktop ? .62 : .86,
          clipPath: desktop ? "inset(10% 16% 10% 16%)" : "inset(7% 5% 7% 5%)"
        },
        {
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: ".cinema",
            start: "top top",
            end: "bottom bottom",
            pin: ".cinema-frame",
            pinSpacing: false,
            scrub: .65,
            invalidateOnRefresh: true,
            anticipatePin: 1
          }
        }
      );
    });

    gsap.matchMedia().add("(min-width: 761px)", () => {
      const track = document.querySelector(".track");
      if (!track) return;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -distance(), ease: "none",
        scrollTrigger: {
          trigger: ".selection", start: "top top", end: () => "+=" + distance(),
          pin: true, scrub: .65, invalidateOnRefresh: true, anticipatePin: 1
        }
      });
    });
  }

  function initMouseLayer() {
    if (reduceMotion || !finePointer || !window.gsap) return;
    const hero = document.querySelector(".hero");
    const media = document.querySelector(".hero-media");
    if (hero && media) {
      hero.addEventListener("pointermove", event => {
        const x = (event.clientX / innerWidth - .5) * 12;
        const y = (event.clientY / innerHeight - .5) * 8;
        gsap.to(media, { x, y, duration: 1.1, ease: "power3.out", overwrite: "auto" });
      });
      hero.addEventListener("pointerleave", () => {
        gsap.to(media, { x: 0, y: 0, duration: 1, ease: "power3.out" });
      });
    }
  }

  function initNavigation() {
    const header = document.querySelector(".header");
    const menu = document.querySelector(".menu");
    const nav = document.querySelector(".mobile-nav");
    if (header) {
      addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 80), { passive: true });
    }
    if (!menu || !nav) return;
    const close = () => {
      nav.classList.remove("open");
      nav.setAttribute("aria-hidden", "true");
      menu.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };
    menu.addEventListener("click", () => {
      nav.classList.add("open");
      menu.setAttribute("aria-expanded", "true");
      nav.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
    nav.querySelector("button")?.addEventListener("click", close);
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", close));
  }

  // Opening is initialized first so optional animation libraries cannot trap the page.
  initOpening();

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    initLenis();
    initScrollScenes();
    initMouseLayer();
  }

  initNavigation();

  function initBooking() {
    const modal=document.querySelector(".booking"), panel=modal?.querySelector(".booking-panel"), form=document.querySelector("#booking-form");
    const date=document.querySelector("#booking-date"), time=document.querySelector("#booking-time"), guests=document.querySelector("#booking-guests");
    const name=document.querySelector("#booking-name"), phone=document.querySelector("#booking-phone"), note=document.querySelector("#booking-note"), summary=document.querySelector("#booking-summary-text");
    if(!modal||!panel||!form||!date)return;
    let lastFocus=null;
    const now=new Date(), local=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().split("T")[0]; date.min=local;
    const updateSummary=()=>{const p=[];if(date.value)p.push(new Intl.DateTimeFormat("tr-TR",{day:"numeric",month:"long",year:"numeric"}).format(new Date(date.value+"T12:00:00")));if(time.value)p.push(time.value);if(guests.value)p.push(guests.value+" kişi");summary.textContent=p.length?p.join(" · "):"Tarih, saat ve kişi sayısını seçtiğinizde özet burada görünecek."};
    const close=()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");lastFocus?.focus()};
    document.querySelectorAll(".reserve-open").forEach(btn=>btn.addEventListener("click",e=>{lastFocus=e.currentTarget;modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");setTimeout(()=>date.focus(),50)}));
    modal.querySelectorAll("[data-booking-close]").forEach(btn=>btn.addEventListener("click",close));
    [date,time,guests].forEach(el=>el?.addEventListener("change",updateSummary));
    modal.addEventListener("keydown",e=>{if(e.key==="Escape"){close();return}if(e.key!=="Tab")return;const fs=[...panel.querySelectorAll('button,input,select,textarea,a[href]')].filter(x=>!x.disabled);if(!fs.length)return;const first=fs[0],last=fs[fs.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
    form.addEventListener("submit",e=>{e.preventDefault();if(!form.reportValidity())return;const msg=["Merhaba Ladeen Cafe, masa rezervasyonu talebi oluşturmak istiyorum.","","Tarih: "+date.value,"Saat: "+time.value,"Kişi sayısı: "+guests.value,"Ad Soyad: "+name.value.trim(),"Telefon: "+phone.value.trim(),note.value.trim()?"Not: "+note.value.trim():""].filter(Boolean).join("\n");window.open("https://wa.me/905465481458?text="+encodeURIComponent(msg),"_blank","noopener,noreferrer")});
  }
  initBooking();

  document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;const nav=document.querySelector(".mobile-nav.open");if(nav){nav.classList.remove("open");nav.setAttribute("aria-hidden","true");document.querySelector(".menu")?.setAttribute("aria-expanded","false");document.body.style.overflow=""}});
});