(() => {
  // Update this phone when you have the final number (digits only with country code, no +)
  const PHONE_E164 = "38765123456";
  const PHONE_DISPLAY = "+387 65 123 456";

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const year = document.querySelector("#year");
  const sheet = document.querySelector("#book-sheet");
  const sheetPanel = sheet?.querySelector(".sheet__panel");

  if (year) year.textContent = String(new Date().getFullYear());

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const closeNav = () => {
    nav?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  };

  toggle?.addEventListener("click", () => {
    const open = nav?.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav?.querySelectorAll("a, button").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  const wireContactLinks = () => {
    const call = sheet?.querySelector('[data-contact="call"]');
    const wa = sheet?.querySelector('[data-contact="whatsapp"]');
    const viber = sheet?.querySelector('[data-contact="viber"]');

    if (call) {
      call.href = `tel:+${PHONE_E164}`;
      const small = call.querySelector("small");
      if (small) small.textContent = PHONE_DISPLAY;
    }
    if (wa) {
      wa.href = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent("Zdravo! Želim da rezervišem termin u Anja Lash Studio.")}`;
    }
    if (viber) {
      viber.href = `viber://chat?number=%2B${PHONE_E164}`;
    }
  };

  wireContactLinks();

  let lastFocus = null;

  const openSheet = () => {
    if (!sheet) return;
    lastFocus = document.activeElement;
    sheet.hidden = false;
    requestAnimationFrame(() => {
      sheet.classList.add("is-open");
      document.body.classList.add("sheet-open");
      sheetPanel?.querySelector(".sheet__cancel")?.focus();
    });
  };

  const closeSheet = () => {
    if (!sheet || sheet.hidden) return;
    sheet.classList.remove("is-open");
    document.body.classList.remove("sheet-open");
    const onEnd = (event) => {
      if (event.target !== sheetPanel) return;
      sheet.hidden = true;
      sheetPanel.removeEventListener("transitionend", onEnd);
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    };
    sheetPanel?.addEventListener("transitionend", onEnd);
    window.setTimeout(() => {
      if (!sheet.hidden && !sheet.classList.contains("is-open")) {
        sheet.hidden = true;
      }
    }, 420);
  };

  document.querySelectorAll("[data-book-open]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      openSheet();
    });
  });

  document.querySelectorAll("[data-book-close]").forEach((el) => {
    el.addEventListener("click", closeSheet);
  });

  sheet?.querySelectorAll(".sheet__action").forEach((action) => {
    action.addEventListener("click", () => {
      window.setTimeout(closeSheet, 150);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
      closeSheet();
    }
  });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }
})();
