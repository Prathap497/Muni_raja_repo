const BODY = document.body;

function initThemeToggle() {
  const themeBtn = document.getElementById("themeBtn");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    BODY.classList.add("dark-theme");
  }

  if (!themeBtn) return;

  const updateThemeButtonLabel = () => {
    const darkModeOn = BODY.classList.contains("dark-theme");
    themeBtn.setAttribute("aria-pressed", darkModeOn ? "true" : "false");
    themeBtn.setAttribute("aria-label", darkModeOn ? "Switch to light mode" : "Switch to dark mode");
    themeBtn.setAttribute("title", darkModeOn ? "Switch to light mode" : "Switch to dark mode");
    themeBtn.dataset.theme = darkModeOn ? "dark" : "light";
  };

  themeBtn.textContent = "";
  updateThemeButtonLabel();

  themeBtn.addEventListener("click", () => {
    BODY.classList.toggle("dark-theme");
    localStorage.setItem("theme", BODY.classList.contains("dark-theme") ? "dark" : "light");
    updateThemeButtonLabel();
  });
}

function initNewsletterModal() {
  const modal = document.getElementById("newsletterModal");
  const closeBtn = document.getElementById("closeNewsletter");
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("newsletterEmail");

  if (!modal || !closeBtn || !form || localStorage.getItem("newsletter_shown")) return;

  setTimeout(() => {
    modal.classList.add("is-open");
    emailInput?.focus();
  }, 8000);

  const closeModal = () => {
    modal.classList.remove("is-open");
    localStorage.setItem("newsletter_shown", "yes");
  };

  closeBtn.addEventListener("click", closeModal);

  window.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = emailInput?.value.trim();

    if (!email) return;

    alert(`Thank you for subscribing, ${email}`);
    closeModal();
  });
}

function initShareButtons() {
  document.querySelectorAll(".share-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const shareData = { title: document.title, url: window.location.href };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (error) {
          console.error("Share failed", error);
        }
      }

      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(shareData.url);
          alert("Link copied to clipboard");
        } catch (error) {
          alert("Unable to copy link");
        }
      }
    });
  });
}

function initSmoothScrollPills() {
  const pills = Array.from(document.querySelectorAll("[data-scroll-to]"));
  if (!pills.length) return;

  const sections = pills
    .map((pill) => document.querySelector(pill.dataset.scrollTo))
    .filter(Boolean);

  pills.forEach((pill) => {
    pill.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.querySelector(pill.dataset.scrollTo);

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      pills.forEach((item) => item.classList.remove("active"));
      pill.classList.add("active");
    });
  });

  if (!("IntersectionObserver" in window) || !sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const activePill = document.querySelector(`[data-scroll-to="#${entry.target.id}"]`);
        if (!activePill) return;

        pills.forEach((item) => item.classList.remove("active"));
        activePill.classList.add("active");
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach((section) => observer.observe(section));
}

function initHeaderBehavior() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let lastScrollY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      const currentScrollY = window.scrollY;

      header.classList.toggle("shrink", currentScrollY > 50);

      if (header.classList.contains("nav-open")) {
        header.classList.remove("hidden");
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        header.classList.add("hidden");
      } else {
        header.classList.remove("hidden");
      }

      lastScrollY = currentScrollY;
    },
    { passive: true }
  );
}

function initMobileNav() {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".site-header nav");
  if (!header || !nav) return;

  header.classList.add("has-mobile-nav");

  let headerCta = header.querySelector(".header-cta");
  if (!headerCta) {
    const themeButton = header.querySelector("#themeBtn");
    headerCta = document.createElement("div");
    headerCta.className = "header-cta";
    if (themeButton) {
      themeButton.parentNode?.insertBefore(headerCta, themeButton);
      headerCta.appendChild(themeButton);
    } else {
      header.querySelector(".header-container")?.appendChild(headerCta);
    }
  }

  const toggleButton = document.createElement("button");
  toggleButton.className = "menu-toggle";
  toggleButton.type = "button";
  toggleButton.setAttribute("aria-expanded", "false");
  toggleButton.setAttribute("aria-controls", "primary-menu");
  toggleButton.setAttribute("aria-label", "Open navigation menu");
  toggleButton.innerHTML = '<span></span><span></span><span></span>';

  nav.id = "primary-menu";
  headerCta.prepend(toggleButton);

  const closeMenu = () => {
    header.classList.remove("nav-open");
    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.setAttribute("aria-label", "Open navigation menu");
  };

  toggleButton.addEventListener("click", () => {
    const opened = header.classList.toggle("nav-open");
    toggleButton.setAttribute("aria-expanded", opened ? "true" : "false");
    toggleButton.setAttribute("aria-label", opened ? "Close navigation menu" : "Open navigation menu");
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) closeMenu();
  });
}

function initContactFormState() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (event) => {
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      event.preventDefault();
      return;
    }

    const submitButton = contactForm.querySelector('input[type="submit"], button[type="submit"]');
    if (!submitButton) return;
    submitButton.disabled = true;
    if ("value" in submitButton) submitButton.value = "Sending...";
    submitButton.textContent = "Sending...";
  });
}

function initProductCarousel() {
  document.querySelectorAll(".pdp-carousel").forEach((carousel) => {
    const slides = carousel.querySelectorAll(".pdp-slide");
    let currentSlide = 0;

    if (slides.length <= 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setInterval(() => {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }, 3500);
  });
}

function initFooterLogoLink() {
  const footerLogo = document.querySelector(".site-footer .footer-logo");
  if (!footerLogo || footerLogo.closest("a")) return;

  const homeHref = window.location.pathname.includes("/products/") ? "../index.html" : "index.html";
  const logoLink = document.createElement("a");
  logoLink.href = homeHref;
  logoLink.className = "footer-logo-link";
  logoLink.setAttribute("aria-label", "Go to Astra Biocare home page");

  footerLogo.parentNode?.insertBefore(logoLink, footerLogo);
  logoLink.appendChild(footerLogo);
}

function initScrollToTopButton() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "scroll-top-btn";
  button.setAttribute("aria-label", "Scroll back to top");
  button.setAttribute("title", "Back to top");
  button.innerHTML = '<span aria-hidden="true">↑</span>';

  const toggleVisibility = () => {
    button.classList.toggle("is-visible", window.scrollY > 500);
  };

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.body.appendChild(button);
  toggleVisibility();
  window.addEventListener("scroll", toggleVisibility, { passive: true });
}

function initAOSIfAvailable() {
  if (window.AOS) {
    window.AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initNewsletterModal();
  initShareButtons();
  initSmoothScrollPills();
  initHeaderBehavior();
  initMobileNav();
  initContactFormState();
  initProductCarousel();
  initFooterLogoLink();
  initScrollToTopButton();
  initAOSIfAvailable();
});
