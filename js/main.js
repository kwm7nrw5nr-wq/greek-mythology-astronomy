/* 星空序幕與頁面轉場：原生 JavaScript，無外部套件 */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const introKey = "mythic-cosmos-intro-seen";
  const isHome = /(?:^|\/)index\.html$/.test(location.pathname) || location.pathname.endsWith("/");
  const title = "從神話到星空";

  function addIntro() {
    const intro = document.createElement("div");
    intro.className = "mythic-intro";
    intro.setAttribute("role", "status");
    intro.setAttribute("aria-label", "正在進入從神話到星空");
    intro.innerHTML = '<div class="mythic-intro__content"><p class="mythic-intro__eyebrow">GREEK MYTHOLOGY × MODERN ASTRONOMY</p><h1 class="mythic-intro__title">' + title + '</h1><p class="mythic-intro__subtitle">循著古老神話，走進無垠星海</p><div class="mythic-intro__rule"></div></div>';
    document.body.appendChild(intro);
    const finish = () => {
      intro.classList.add("is-leaving");
      window.setTimeout(() => intro.remove(), reduceMotion ? 0 : 700);
    };
    window.setTimeout(finish, reduceMotion ? 50 : 1750);
    intro.addEventListener("click", finish, { once: true });
  }

  if (!reduceMotion && isHome && !sessionStorage.getItem(introKey)) {
    sessionStorage.setItem(introKey, "1");
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addIntro, { once: true });
    else addIntro();
  }

  function setupReveal() {
    const targets = document.querySelectorAll(".content-section, .intro-section, .primordial-section, .section, .god-card, .info-card, .planet-card, .story-panel, .fact-list > div, .timeline-item, .source-list article, .zodiac-grid > div");
    targets.forEach((el, index) => {
      el.classList.add("reveal-on-scroll");
      if (el.matches(".god-card, .info-card, .planet-card, .zodiac-grid > div")) el.style.transitionDelay = (index % 4) * 65 + "ms";
    });
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(el => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    targets.forEach(el => observer.observe(el));
  }

  function setupTransitions() {
    if (reduceMotion) return;
    const overlay = document.createElement("div");
    overlay.className = "page-transition";
    overlay.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlay);
    document.addEventListener("click", event => {
      const link = event.target.closest("a[href]");
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !/\.html?$/.test(url.pathname) || (url.pathname === location.pathname && !url.search)) return;
      event.preventDefault();
      document.body.classList.add("is-transitioning");
      overlay.classList.add("is-active");
      window.setTimeout(() => { location.href = url.href; }, 280);
    });
  }

  const ready = () => { setupReveal(); setupTransitions(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready, { once: true });
  else ready();
})();
