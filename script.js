(() => {
  const PHONE_E164 = "38766059484";
  const PHONE_DISPLAY = "+387 66 059 484";

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const year = document.querySelector("#year");
  const sheet = document.querySelector("#book-sheet");
  const sheetPanel = sheet?.querySelector(".sheet__panel");

  if (year) year.textContent = String(new Date().getFullYear());

  // Ensure scroll is never stuck from a leftover sheet state
  document.body.classList.remove("sheet-open");
  if (sheet) {
    sheet.classList.remove("is-open");
    sheet.hidden = true;
  }

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

  const scrollToTop = () => {
    closeNav();
    closeSheet(true);
    const top = document.querySelector("#top");
    if (top) {
      top.focus({ preventScroll: true });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  document.querySelectorAll("[data-scroll-top]").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      scrollToTop();
      history.replaceState(null, "", "#top");
    });
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
  let closeTimer = 0;

  const openSheet = () => {
    if (!sheet) return;
    window.clearTimeout(closeTimer);
    lastFocus = document.activeElement;
    sheet.hidden = false;
    // force reflow so the open transition runs
    void sheet.offsetWidth;
    sheet.classList.add("is-open");
    document.body.classList.add("sheet-open");
    sheetPanel?.querySelector(".sheet__cancel")?.focus();
  };

  const closeSheet = (immediate = false) => {
    if (!sheet) return;
    sheet.classList.remove("is-open");
    document.body.classList.remove("sheet-open");

    const finish = () => {
      sheet.hidden = true;
      if (lastFocus && typeof lastFocus.focus === "function") {
        try {
          lastFocus.focus({ preventScroll: true });
        } catch {
          lastFocus.focus();
        }
      }
    };

    window.clearTimeout(closeTimer);
    if (immediate) {
      finish();
      return;
    }

    closeTimer = window.setTimeout(finish, 380);
  };

  document.querySelectorAll("[data-book-open]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      openSheet();
    });
  });

  document.querySelectorAll("[data-book-close]").forEach((el) => {
    el.addEventListener("click", () => closeSheet());
  });

  sheet?.querySelectorAll(".sheet__action").forEach((action) => {
    action.addEventListener("click", () => {
      window.setTimeout(() => closeSheet(), 120);
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
