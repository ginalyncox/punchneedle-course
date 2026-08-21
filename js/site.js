// Theme toggle + mobile menu + scroll reveal + learner utilities
(function () {
  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");
  const sunIcon =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  const moonIcon =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  let theme = root.getAttribute("data-theme");
  if (theme !== "light" && theme !== "dark") {
    theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    root.setAttribute("data-theme", theme);
  }

  const syncThemeControl = () => {
    if (!toggle) return;
    toggle.innerHTML = theme === "dark" ? sunIcon : moonIcon;
    toggle.setAttribute(
      "aria-label",
      "Switch to " + (theme === "dark" ? "light" : "dark") + " mode"
    );
  };

  syncThemeControl();
  if (toggle) {
    toggle.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", theme);
      try {
        localStorage.setItem("theme", theme);
      } catch (e) {}
      syncThemeControl();
    });
  }

  // Mobile menu
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav-links]");
  const setMenuOpen = (open) => {
    if (!menuToggle || !nav) return;
    nav.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      setMenuOpen(!nav.classList.contains("is-open"));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });
  }

  // Live filters (glossary + troubleshooting)
  document.querySelectorAll("[data-filter-input]").forEach((input) => {
    const empty = input.parentElement.querySelector("[data-filter-empty]");
    const scope = input.getAttribute("data-filter-scope");
    const rootEl = scope
      ? document.querySelector(`[data-filter-group="${scope}"]`) || document.querySelector("main .prose") || document
      : document.querySelector("main .prose") || document;
    const items = () => rootEl.querySelectorAll("[data-filter-item]");

    const apply = () => {
      const q = input.value.trim().toLowerCase();
      let visible = 0;
      items().forEach((el) => {
        const match = !q || el.textContent.toLowerCase().includes(q);
        el.hidden = !match;
        if (match) visible += 1;
      });

      // Hide glossary section headings that have no visible terms beneath them
      rootEl.querySelectorAll("h2").forEach((heading) => {
        let sibling = heading.nextElementSibling;
        let any = false;
        while (sibling && sibling.tagName !== "H2") {
          if (sibling.matches("[data-filter-item]") && !sibling.hidden) any = true;
          sibling = sibling.nextElementSibling;
        }
        if (heading.closest("[data-filter-item]")) return;
        heading.hidden = q !== "" && !any;
      });

      if (empty) empty.hidden = visible !== 0 || !q;
    };

    input.addEventListener("input", apply);
  });

  // Lesson table of contents from h2s inside main prose
  const prose = document.querySelector("main .prose");
  const headings = prose
    ? Array.from(prose.querySelectorAll("h2")).filter((h) => h.id || h.textContent.trim())
    : [];
  if (prose && headings.length >= 3) {
    const navEl = document.createElement("nav");
    navEl.className = "toc";
    navEl.setAttribute("aria-label", "On this page");
    const title = document.createElement("p");
    title.className = "toc__title";
    title.textContent = "On this page";
    const list = document.createElement("ol");
    list.className = "toc__list";

    headings.forEach((heading, index) => {
      if (!heading.id) {
        const slug = heading.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        heading.id = slug || "section-" + (index + 1);
      }
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#" + heading.id;
      a.textContent = heading.textContent.replace(/\s+/g, " ").trim();
      li.appendChild(a);
      list.appendChild(li);
    });

    navEl.appendChild(title);
    navEl.appendChild(list);
    const toolbar = prose.querySelector(".ref-toolbar");
    if (toolbar) toolbar.insertAdjacentElement("afterend", navEl);
    else prose.insertBefore(navEl, prose.firstElementChild);
  }

  // Reading progress + back to top
  const progress = document.createElement("div");
  progress.className = "read-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  const toTop = document.createElement("button");
  toTop.type = "button";
  toTop.className = "to-top";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.body.appendChild(toTop);

  const onScroll = () => {
    toTop.classList.toggle("is-visible", window.scrollY > 480);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Scroll reveal
  if (!root.classList.contains("js") || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();
