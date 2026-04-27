const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = navMenu ? Array.from(navMenu.querySelectorAll("a")) : [];
const sections = Array.from(document.querySelectorAll("main section[id]"));
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const toggleMenu = (isOpen) => {
  if (!navToggle || !navMenu) return;
  const open = typeof isOpen === "boolean" ? isOpen : !navMenu.classList.contains("is-open");
  navMenu.classList.toggle("is-open", open);
  navToggle.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
};

if (navToggle) {
  navToggle.addEventListener("click", () => toggleMenu());
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => toggleMenu(false));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    toggleMenu(false);
  }
});

const updateNavState = () => {
  const offset = window.scrollY + 120;

  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 24);
  }

  let activeId = "";
  for (const section of sections) {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (offset >= top && offset < bottom) {
      activeId = section.id;
      break;
    }
  }

  navLinks.forEach((link) => {
    const target = link.getAttribute("href");
    const isActive = target === `#${activeId}`;
    link.classList.toggle("active", isActive);
  });
};

window.addEventListener("scroll", updateNavState, { passive: true });
window.addEventListener("load", updateNavState);

const revealElements = Array.from(document.querySelectorAll("[data-reveal]"));
if (revealElements.length) {
  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

if (form && formStatus) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    window.setTimeout(() => {
      form.reset();
      formStatus.textContent = "Thank you. Your message has been received.";
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    }, 700);
  });
}

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  window.setTimeout(() => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.remove();
    }
  }, 500);
});
